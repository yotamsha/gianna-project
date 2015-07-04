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
var alefCT = new WordConstraint(1, [new LetterConstraint("ALEF")]);
var beitCT = new WordConstraint(1, [new LetterConstraint("BEIT")]);
var gimelCT = new WordConstraint(1, [new LetterConstraint("GIMEL")]);

var f_a_patah_ct = new WordConstraint(1, [alefCT]);
var f_b_patah_ct = new WordConstraint(1, [beitCT]);
var f_c_patah_ct = new WordConstraint(1, [gimelCT]);

var f_a_patah_2g:GroupConstraint = new GroupConstraint(2,f_a_patah_ct);
var f__b_patah_2g:GroupConstraint = new GroupConstraint(2,f_b_patah_ct);
var f_c_patah_2g:GroupConstraint = new GroupConstraint(2,f_c_patah_ct);

var nested_f_patah_2g:GroupConstraint = new GroupConstraint(null,null,
  [{copies : 1,group : f_a_patah_2g},{copies : 1,group : f__b_patah_2g},{copies : 1,group : f_c_patah_2g}]);
*/

var CardStateEnum = {
  BACK : "BACK",
  PENDING : "PENDING",
  FLIPPED : "FLIPPED"
};

var CardTypeEnum = {
  ONE : "ONE",
  TWO : "TWO",
  THREE : "THREE",
  FOUR : "FOUR"
};

var GameStateEnum = {
  RUNNING : "RUNNING",
  ENDED : "ENDED"
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
  gameState : {

    board: [
      {
        word : "aba",
        imgSrc : "assets/fish.PNG",
        meta : {},
        type : CardTypeEnum.ONE,
        state: CardStateEnum.BACK
      },
      {
        word : "ima",
        imgSrc : "assets/fish.PNG",
        meta : {},
        type : CardTypeEnum.TWO,
        state:  CardStateEnum.BACK
      },
      {
        word : "gamal",
        imgSrc : "assets/fish.PNG",
        meta : {},
        type : CardTypeEnum.THREE,
        state:  CardStateEnum.BACK
      },
      {
        word : "zvuv",
        imgSrc : "assets/fish.PNG",
        meta : {},
        type : CardTypeEnum.FOUR,
        state:  CardStateEnum.BACK
      },
      {
        word : "aba2",
        imgSrc : "assets/fish.PNG",
        meta : {},
        type : CardTypeEnum.ONE,
        state: CardStateEnum.BACK
      },
      {
        word : "ima2",
        //imgSrc : "imgSrc",
        meta : {},
        type : CardTypeEnum.TWO,
        state:  CardStateEnum.BACK,
        letter :"&#1488;"
      },
      {
        word : "gamal2",
        //imgSrc : "imgSrc",
        meta : {},
        type : CardTypeEnum.THREE,
        state:  CardStateEnum.BACK,
        letter :"&#1488;"
      },
      {
        word : "zvuv2",
        //imgSrc : "imgSrc",
        meta : {},
        type : CardTypeEnum.FOUR,
        state:  CardStateEnum.BACK,
        letter :"&#1488;"
      }
    ],
    pendingCardIndex : -1,
    phase : GameStateEnum.RUNNING,
    lockCards : false
  }

};

export class MemoryGameService extends Store {
  static $inject = ['$q']; // This should do it
  //ROOTSCOPE : Object;

  // we shouldn't access ._state or ._setState outside of the class
  constructor( private $q: any) {
    //this.ROOTSCOPE = $rootScope;
    // use Store class as a helper
    super(memoryGameModel);
  }

  init() {
    var gameState = this.get('gameState');
    gameState.board = _.shuffle(gameState.board);
    this.set('gameState', gameState);

  }

  chooseCard(index) {
    var deferred = this.$q.defer();
    var chosenCard,pendingCard;
    var gameState = this.get('gameState');

    console.log("board: ",gameState.board);
    console.log("phase: ",gameState.phase);
    console.log("pendingCardIndex: ",gameState.pendingCardIndex);
    console.log("chosen card: ",gameState.board[index]);

    // change card state
    chosenCard = gameState.board[index];

    // check if there are pending cards
    if (gameState.pendingCardIndex > -1){
      pendingCard = gameState.board[gameState.pendingCardIndex];
      // check if paired
      if (this.isPaired(pendingCard, chosenCard)){
        pendingCard.state = CardStateEnum.FLIPPED;
        chosenCard.state = CardStateEnum.FLIPPED;
        gameState.pendingCardIndex = -1;
        if ( this.isDone(gameState.board) ){
          gameState.phase = GameStateEnum.ENDED;
        }
        this.set('gameState', gameState);
        deferred.resolve();
      } else {
        chosenCard.state = CardStateEnum.FLIPPED;
        gameState.pendingCardIndex = -1;
        gameState.lockCards = true;
        setTimeout(function(){
          pendingCard.state = CardStateEnum.BACK;
          chosenCard.state = CardStateEnum.BACK;
          deferred.resolve();
          gameState.lockCards = false;

        },3000)

      }
    } else {
      chosenCard.state = CardStateEnum.PENDING;
      gameState.pendingCardIndex = index;
      deferred.resolve();
    }
    return deferred.promise;
  }

  isPaired(card1: IMemoryCard,card2: IMemoryCard) {
    return (card1.type === card2.type);
  }

  isDone(board : Array<IMemoryCard>) {
    for (var i = 0; i < board.length; i++){
      if (board[i].state !== CardStateEnum.FLIPPED){
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
