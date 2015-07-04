// <reference path="../../../../typings/tsd.d.ts" />
//import {bind, Inject} from 'angular2/di';
//import bind from 'angular';

import {Store} from '../Store';
import {Letter} from '../pedagogicLogic/WordsGenerator';
import {Word} from '../pedagogicLogic/WordsGenerator';
import {VocabularyGenerator} from '../pedagogicLogic/WordsGenerator';
import {LetterConstraint} from '../pedagogicLogic/WordsGenerator';
import {WordConstraint} from '../pedagogicLogic/WordsGenerator';
import {GroupConstraint} from '../pedagogicLogic/WordsGenerator';
import {PosEnum} from '../pedagogicLogic/WordsGenerator';

import IService = require('../../components/arts/interface/IService');
import angular = require('angular');


//Letter.testConstraint();
//Word.testConstraint();
//VocabularyGenerator.test();
VocabularyGenerator.createWordFromString("פַרָה", "assets/fish.png");
VocabularyGenerator.createWordFromString("דָּג", "assets/fish.png");
VocabularyGenerator.createWordFromString("סַל", "assets/basket.png");
VocabularyGenerator.createWordFromString("צָב", "assets/basket.png");

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

        board: [
            {
                word: "aba",
                imgSrc: "assets/fish.PNG",
                meta: {},
                type: CardTypeEnum.ONE,
                state: CardStateEnum.BACK
            },
            {
                word: "ima",
                imgSrc: "assets/fish.PNG",
                meta: {},
                type: CardTypeEnum.TWO,
                state: CardStateEnum.BACK
            },
            {
                word: "gamal",
                imgSrc: "assets/fish.PNG",
                meta: {},
                type: CardTypeEnum.THREE,
                state: CardStateEnum.BACK
            },
            {
                word: "zvuv",
                imgSrc: "assets/fish.PNG",
                meta: {},
                type: CardTypeEnum.FOUR,
                state: CardStateEnum.BACK
            },
            {
                word: "aba2",
                imgSrc: "assets/fish.PNG",
                meta: {},
                type: CardTypeEnum.ONE,
                state: CardStateEnum.BACK
            },
            {
                word: "ima2",
                //imgSrc : "imgSrc",
                meta: {},
                type: CardTypeEnum.TWO,
                state: CardStateEnum.BACK,
                letter: "&#1488;"
            },
            {
                word: "gamal2",
                //imgSrc : "imgSrc",
                meta: {},
                type: CardTypeEnum.THREE,
                state: CardStateEnum.BACK,
                letter: "&#1488;"
            },
            {
                word: "zvuv2",
                //imgSrc : "imgSrc",
                meta: {},
                type: CardTypeEnum.FOUR,
                state: CardStateEnum.BACK,
                letter: "&#1488;"
            }
        ],
        pendingCardIndex: -1,
        phase: GameStateEnum.RUNNING,
        lockCards: false
    }

};
// TODO this should implement an IGameService interface.
export class MemoryGameService extends Store {
    static $inject = ['$q']; // This should do it
    //ROOTSCOPE : Object;

    // we shouldn't access ._state or ._setState outside of the class
    constructor(private $q:any) {
        //this.ROOTSCOPE = $rootScope;
        // use Store class as a helper
        super(memoryGameModel);
    }

    init() {
        var gameState = this.get('gameState');
        var gameConstraints:GroupConstraint;
        var gameGroups:any[];
        var generator = new VocabularyGenerator();
        var paramsObj = {}; // get parameters from user selected properties.
        // Set up a constraints object for memory game.
        gameConstraints = generator.generateGameConstraints("MEMORY", paramsObj);
        console.log("generated constraints : ", gameConstraints);
        // Apply the constraints on the vocabulary to get a grouping for the words.

        var a = new Word("דָּג", [new Letter("ALEF", PosEnum.FIRST, "PATAH")], 1,'assets/fish.png');
        var ab = new Word("דָּג", [new Letter("ALEF", PosEnum.FIRST, "PATAH"), new Letter("BEIT", PosEnum.MIDDLE, "PATAH")], 1,'assets/fish.png');

        var b = new Word("סַל", [new Letter("BEIT", PosEnum.FIRST, "PATAH")], 1,'assets/basket.png');
        var bd = new Word("סַל", [new Letter("BEIT", PosEnum.FIRST, "PATAH"), new Letter("DALET", PosEnum.MIDDLE, "PATAH")], 1,'assets/basket.png');

        var c = new Word("צָב", [new Letter("GIMEL", PosEnum.FIRST, "PATAH")], 1,'assets/turtle.png');
        var cd = new Word("צָב", [new Letter("GIMEL", PosEnum.FIRST, "PATAH"), new Letter("DALET", PosEnum.FIRST, "PATAH")], 1,'assets/turtle.png');
/*        var systemWords = [
        VocabularyGenerator.createWordFromString("דָּג", "assets/fish.png"),
        VocabularyGenerator.createWordFromString("דָּג", "assets/fish.png"),
        VocabularyGenerator.createWordFromString("סַל", "assets/turtle.png"),
        VocabularyGenerator.createWordFromString("סַל", "assets/turtle.png"),
        VocabularyGenerator.createWordFromString("צָב", "assets/basket.png"),
        VocabularyGenerator.createWordFromString("צָב", "assets/basket.png")];*/

         var systemWords = [a, ab, b, bd, c, cd];
        gameGroups = generator.groupWords(systemWords, gameConstraints);
        console.log("gameTree", VocabularyGenerator.printTree(gameGroups));

        // convert the grouping into a game board

        gameState.board = this.convertWordGroupToGameModel(gameGroups);
        gameState.board = _.shuffle(gameState.board);
        this.set('gameState', gameState);

    }

    convertWordGroupToGameModel(gameGroups:any[]):Array<IMemoryCard> {
        console.log("Convering to game model..", gameGroups);
        var typeCount = 1;
        var result : Array<IMemoryCard> = [];
        // iterate over each pair of the array
        for (let pair of gameGroups) {
            let wordShowBy = 'img';
            for (let word of pair) {
                // TODO implement a MemoryCard class
                let card :IMemoryCard = {
                    showBy : wordShowBy,
                    word: word.str,
                    imgSrc: word.imgPath,
                    meta: {},
                    type: typeCount,
                    state: CardStateEnum.BACK,
                    letter : word.str[0]
                };
                result.push(card);
                wordShowBy = 'letter';
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
                }
                this.set('gameState', gameState);
                deferred.resolve();
            } else {
                chosenCard.state = CardStateEnum.FLIPPED;
                gameState.pendingCardIndex = -1;
                gameState.lockCards = true;
                setTimeout(function () {
                    pendingCard.state = CardStateEnum.BACK;
                    chosenCard.state = CardStateEnum.BACK;
                    deferred.resolve();
                    gameState.lockCards = false;

                }, 3000)

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
