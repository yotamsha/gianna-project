// <reference path="../../../../typings/tsd.d.ts" />
//import {bind, Inject} from 'angular2/di';
//import bind from 'angular';

import {Store} from '../Store';
import {VocabularyEditorService} from '../../components/vocabularyEditor/VocabularyEditorService';

import {Letter} from '../pedagogicLogic/WordsGenerator';
import {Word} from '../pedagogicLogic/WordsGenerator';
import {VocabularyGenerator} from '../pedagogicLogic/WordsGenerator';
import {LetterConstraint} from '../pedagogicLogic/WordsGenerator';
import {WordConstraint} from '../pedagogicLogic/WordsGenerator';
import {GroupConstraint} from '../pedagogicLogic/WordsGenerator';
import {PosEnum} from '../pedagogicLogic/WordsGenerator';
import {SoundEnum} from '../pedagogicLogic/WordsGenerator';

import IService = require('../../components/arts/interface/IService');
import angular = require('angular');


//Letter.testConstraint();
//Word.testConstraint();
//VocabularyGenerator.test();
/*VocabularyGenerator.createWordFromString("פַרָה", "assets/fish.png");
VocabularyGenerator.createWordFromString("דָּג", "assets/fish.png");
VocabularyGenerator.createWordFromString("סַל", "assets/basket.png");
VocabularyGenerator.createWordFromString("צָב", "assets/basket.png");*/

/*
 VocabularyGenerator.testGrouping();
 */

var CardStateEnum = {
    BACK: "BACK",
    PENDING: "PENDING",
    FLIPPED: "FLIPPED"
};

var CardTypeEnum = {
    ONE: "ONE",
    TWO: "TWO",
    THREE: "THREE",
    FOUR: "FOUR"
};

var GameStateEnum = {
    RUNNING: "RUNNING",
    AFTER_SUCCESS: "AFTER_SUCCESS",
    AFTER_FAILURE: "AFTER_FAILURE",
    ENDED: "ENDED"
};

interface IGameModel {
    gameState : {board : Array<IMemoryCard>,pendingCardIndex: number, phase: string}
}

interface IMemoryCard {
    word: string,
    imgSrc : string,
    meta: Object,
    state : string,
    type : string
}


/**
 * Random Game generator will receive the game constraints, and the pedagogic parameters,
 * and will randomly generate the IMemoryCard objects for the game.
 *
 * Pedagogic Type is a combination of {letter, letter location, sound, sound location, word level }
 *
 * Game constraints:
 * - number of cards.
 * - type constraints - for example, in memory there must be pairs of the same type.
 * -
 */
/**
 *
 * @type {{gameState: {board: Array<IMemoryCard>, pendingCardIndex: number, phase: GameStateEnum}}}
 */
let memoryGameModel:IGameModel = {
    gameState: {

        pendingCardIndex: -1,
        phase: GameStateEnum.RUNNING,
        lockCards: false
    }

};
// TODO this should implement an IGameService interface.
export class MemoryGameService extends Store {
    static $inject = ['$q']; // This should do it
    //ROOTSCOPE : Object;
    private vocabularyEditorService : VocabularyEditorService;
    // we shouldn't access ._state or ._setState outside of the class
    constructor(private $q:any,$http : any) {
        //this.ROOTSCOPE = $rootScope;
        // use Store class as a helper
        super(memoryGameModel);
        this.vocabularyEditorService = new VocabularyEditorService($http);


    }

    init() {
        var gameState = this.get('gameState');
        var gameConstraints:GroupConstraint;
        //var generator = new VocabularyGenerator();
        // Set up a constraints object for memory game.
        console.log("generated constraints : ", gameConstraints);
        // Apply the constraints on the vocabulary to get a grouping for the words.

        var paramsObj : {} = {
            pairsNum : 4,
            position : PosEnum.FIRST,
            sounds : ["KAMATZ","PATAH"],
            lettersToSearch: ['ALEF','VEIT','GIMEL','NUN','SHIN','PE'],
            type1 : 'img',
            type2 : 'img'
        };
        var gameGroups:any[] = this.generateGames(paramsObj)[0];

        if (!gameGroups){
            console.log("couldn't find words for game.");
            return;
        }
        // convert the grouping into a game board
        gameState.board = this.convertWordGroupToGameModel(gameGroups,paramsObj);
        gameState.board = _.shuffle(gameState.board);
        this.set('gameState', gameState);

    }
    generateGames(paramsObj) {
        var gameState = this.get('gameState');
        var gameConstraints:GroupConstraint;
        var gameGroups:any[];
        var gameGroupsArr:any[] = [];
        var generator = new VocabularyGenerator();
        // Set up a constraints object for memory game.
        console.log("generated constraints : ", gameConstraints);
        // Apply the constraints on the vocabulary to get a grouping for the words.
        var j = 0;
        while (j < 50){
            gameGroups = null;
            var systemWords =  _.shuffle(this.vocabularyEditorService.getWordsObjects());
            console.log("systemWords",systemWords);
            // TODO - Idea is to pre-generate a set of available constraints groups for a game, offline.
            // TODO - Then, use the user's set of instructions, and base the result on the pre-configured existing groups.
            // For example: if Vav does not have a pair, it shouldn't be part of the lettersToSearch at all.
            // We could propagate back the fact that a certain letter is not doable and then remove it from the task.
            var i = 0;
            while (i < 50 && !gameGroups){
                console.log("iteration "+i + ", getting words..");
                try {
                    gameConstraints = generator.generateGameConstraints("MEMORY", paramsObj);
                    gameGroups = generator.groupWords(systemWords, gameConstraints);

                }catch(e){
                    i++;
                }
            }
            if (gameGroups){
                gameGroupsArr.push(gameGroups);
            }
            j++;
        }

        console.log("gameGroupsArr: ",gameGroupsArr)
        return gameGroupsArr;
    }

    convertWordGroupToGameModel(gameGroups:any[], paramsObj : any):Array<IMemoryCard> {
        console.log("Convering to game model..", gameGroups);
        var typeCount = 1;
        var result : Array<IMemoryCard> = [];
        // iterate over each pair of the array
        for (let pair of gameGroups) {
            let wordShowBy = paramsObj.type1;
            for (let word of pair) {
                // TODO implement a MemoryCard class
                let card :IMemoryCard = {
                    showBy : wordShowBy,
                    word: word.str,
                    imgSrc: word.imgPath,
                    meta: {},
                    type: typeCount,
                    state: CardStateEnum.BACK,
                    letter : (paramsObj.position === PosEnum.FIRST) ? word.str[0] : word.str[word.str.length -1]
                };
                result.push(card);
                wordShowBy = paramsObj.type2;
            }
            typeCount++;
        } // end of pairs loop
        return result;
    }

    chooseCard(index) {
        var deferred = this.$q.defer();
        var chosenCard, pendingCard;
        var gameState = this.get('gameState');

        console.log("board: ", gameState.board);
        console.log("phase: ", gameState.phase);
        console.log("pendingCardIndex: ", gameState.pendingCardIndex);
        console.log("chosen card: ", gameState.board[index]);

        // change card state
        chosenCard = gameState.board[index];

        // check if there are pending cards
        if (gameState.pendingCardIndex > -1) {
            pendingCard = gameState.board[gameState.pendingCardIndex];
            // check if paired
            if (this.isPaired(pendingCard, chosenCard)) {
                pendingCard.state = CardStateEnum.FLIPPED;
                chosenCard.state = CardStateEnum.FLIPPED;
                gameState.pendingCardIndex = -1;
                if (this.isDone(gameState.board)) {
                    gameState.phase = GameStateEnum.ENDED;
                } else {
                    gameState.phase = GameStateEnum.AFTER_SUCCESS;
                    gameState.lockCards = true;
                    setTimeout(function () {
                        gameState.lockCards = false;
                        gameState.phase = GameStateEnum.RUNNING;
                        deferred.resolve();

                    }, 2000);
                }
                this.set('gameState', gameState);
            } else {
                chosenCard.state = CardStateEnum.FLIPPED;
                gameState.pendingCardIndex = -1;
                gameState.lockCards = true;
                gameState.phase = GameStateEnum.AFTER_FAILURE;

                setTimeout(function () {
                    pendingCard.state = CardStateEnum.BACK;
                    chosenCard.state = CardStateEnum.BACK;
                    deferred.resolve();
                    gameState.lockCards = false;
                    gameState.phase = GameStateEnum.RUNNING;

                }, 2000);

            }
        } else {
            chosenCard.state = CardStateEnum.PENDING;
            gameState.pendingCardIndex = index;
            deferred.resolve();
        }
        return deferred.promise;
    }

    isPaired(card1:IMemoryCard, card2:IMemoryCard) {
        return (card1.type === card2.type);
    }

    isDone(board:Array<IMemoryCard>) {
        for (var i = 0; i < board.length; i++) {
            if (board[i].state !== CardStateEnum.FLIPPED) {
                return false;
            }
        }
        return true;
    }


}


/*export var memoryGameInjectables = [
 // bind('memoryGameModel').toValue(memoryGameModel),
 bind(MemoryGameService).toClass(MemoryGameService)
 ];*/
