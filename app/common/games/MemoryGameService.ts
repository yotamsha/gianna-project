// <reference path="../../../../typings/tsd.d.ts" />
//import {bind, Inject} from 'angular2/di';
import {Store} from '../Store';
import {Letter} from '../pedagogicLogic/WordsGenerator';
import {Word} from '../pedagogicLogic/WordsGenerator';
import {VocabularyGenerator} from '../pedagogicLogic/WordsGenerator';
import {LetterConstraint} from '../pedagogicLogic/WordsGenerator';
import {WordConstraint} from '../pedagogicLogic/WordsGenerator';
import {GroupConstraint} from '../pedagogicLogic/WordsGenerator';

//Letter.testConstraint();
//Word.testConstraint();
//VocabularyGenerator.test();
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
        imgSrc : "imgSrc",
        meta : {},
        type : CardTypeEnum.ONE,
        state: CardStateEnum.BACK
      },
      {
        word : "ima",
        imgSrc : "imgSrc",
        meta : {},
        type : CardTypeEnum.TWO,
        state:  CardStateEnum.BACK
      },
      {
        word : "gamal",
        imgSrc : "imgSrc",
        meta : {},
        type : CardTypeEnum.THREE,
        state:  CardStateEnum.BACK
      },
      {
        word : "zvuv",
        imgSrc : "imgSrc",
        meta : {},
        type : CardTypeEnum.FOUR,
        state:  CardStateEnum.BACK
      },
      {
        word : "aba2",
        imgSrc : "imgSrc",
        meta : {},
        type : CardTypeEnum.ONE,
        state: CardStateEnum.BACK
      },
      {
        word : "ima2",
        imgSrc : "imgSrc",
        meta : {},
        type : CardTypeEnum.TWO,
        state:  CardStateEnum.BACK
      },
      {
        word : "gamal2",
        imgSrc : "imgSrc",
        meta : {},
        type : CardTypeEnum.THREE,
        state:  CardStateEnum.BACK
      },
      {
        word : "zvuv2",
        imgSrc : "imgSrc",
        meta : {},
        type : CardTypeEnum.FOUR,
        state:  CardStateEnum.BACK
      }
    ],
    pendingCardIndex : -1,
    phase : GameStateEnum.RUNNING
  }

};

export class MemoryGameService extends Store {
  // we shouldn't access ._state or ._setState outside of the class
  constructor() {
    // use Store class as a helper
    super(memoryGameModel);
  }
  getState () {
    return super.getState();
  }
  init(predefinedValues) {

  }

  chooseCard(index) {
    var chosenCard,pendingCard;
    var gameState = this.getStateProp('gameState');

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
        this.setStateProp('gameState', gameState);

      } else {
        gameState.pendingCardIndex = -1;
        pendingCard.state = CardStateEnum.BACK;
        chosenCard.state = CardStateEnum.BACK;
      }
    } else {
      chosenCard.state = CardStateEnum.PENDING;
      gameState.pendingCardIndex = index;
    }
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


export var memoryGameInjectables = [
 // bind('memoryGameModel').toValue(memoryGameModel),
 // bind(MemoryGameService).toClass(MemoryGameService)
];
