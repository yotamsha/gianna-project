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
        //var gameState = this.get('gameState');
        console.log("init game..");
        // Apply the constraints on the vocabulary to get a grouping for the words.

        var paramsObj : {} = {
            pairsNum : 4,
            position : PosEnum.FIRST,
            sounds : ["KAMATZ","PATAH"],
            lettersToSearch: ['ALEF','VEIT','GIMEL','NUN','SHIN','PE'],
            type1 : 'img',
            type2 : 'img'
        };
        var gameGroups:any[] = this.generateGame("KAMATZ");

        if (!gameGroups){
            console.log("couldn't find words for game.");
            return;
        }
        gameState = {

            pendingCardIndex: -1,
                phase: GameStateEnum.RUNNING,
                lockCards: false
        };
        // convert the grouping into a game board
        gameState.board = this.convertWordGroupToGameModel(gameGroups,paramsObj);
        gameState.board = _.shuffle(gameState.board);
        this.set('gameState', gameState);

    }

    generateGame(sound) {
        var gameState = this.get('gameState');
        var gameConstraints:GroupConstraint;
        var gameGroups:any[];
        var gameGroupsArr:any[] = [];
        var generator = new VocabularyGenerator();
        // Set up a constraints object for memory game.
        console.log("generated constraints : ", gameConstraints);
        var games = {
            "KAMATZ": [
                [
                    [
                        {
                            "str": "נַעֲלַיִם",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "נַ"
                                },
                                {
                                    "name": "AIN",
                                    "pos": 1,
                                    "symbol": "ע"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "לַ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "HIRIK",
                                    "symbol": "יִ"
                                },
                                {
                                    "name": "MEM_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ם"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/shoes.png"
                        },
                        {
                            "str": "נַדְנֵדָה",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "נַ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "דְ"
                                },
                                {
                                    "name": "NUN",
                                    "pos": 1,
                                    "sound": "TZERE",
                                    "symbol": "נֵ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "דָ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/nadneda.png"
                        }
                    ],
                    [
                        {
                            "str": "גַּמָּד",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "מָ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ד"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/dwarf.png"
                        },
                        {
                            "str": "גַּל",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ל"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/wave.png"
                        }
                    ],
                    [
                        {
                            "str": "אַרְמוֹן",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "HOLAM",
                                    "symbol": "מֹ"
                                },
                                {
                                    "name": "NUN_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ן"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/palace.png"
                        },
                        {
                            "str": "אַרְנָב",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "NUN",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "VEIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ב"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/rabbit.png"
                        }
                    ],
                    [
                        {
                            "str": "בַּלוֹן",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "בַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "HOLAM",
                                    "symbol": "לֹ"
                                },
                                {
                                    "name": "NUN_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ן"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/baloon.png"
                        },
                        {
                            "str": "בַּמָּה",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "בַ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "מָ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/stage.png"
                        }
                    ]
                ],
                [
                    [
                        {
                            "str": "נָחָשׁ",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "HET",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "חָ"
                                },
                                {
                                    "name": "SHIN_SOFIT",
                                    "pos": 1,
                                    "symbol": "ש"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/snake.png"
                        },
                        {
                            "str": "נָהַג",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "הַ"
                                },
                                {
                                    "name": "GIMEL",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ג"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/driver.png"
                        }
                    ],
                    [
                        {
                            "str": "אַרְנָב",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "NUN",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "VEIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ב"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/rabbit.png"
                        },
                        {
                            "str": "אַרְמוֹן",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "HOLAM",
                                    "symbol": "מֹ"
                                },
                                {
                                    "name": "NUN_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ן"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/palace.png"
                        }
                    ],
                    [
                        {
                            "str": "גַּלְגַּל",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "לְ"
                                },
                                {
                                    "name": "GIMEL",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ל"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/whell.png"
                        },
                        {
                            "str": "גַּמָּד",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "מָ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ד"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/dwarf.png"
                        }
                    ],
                    [
                        {
                            "str": "בָּיִת",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "בָ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "HIRIK",
                                    "symbol": "יִ"
                                },
                                {
                                    "name": "TAF",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ת"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/house.png"
                        },
                        {
                            "str": "בָּלַשׁ",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "בָ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "לַ"
                                },
                                {
                                    "name": "SHIN_SOFIT",
                                    "pos": 1,
                                    "symbol": "ש"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/detective.png"
                        }
                    ]
                ],
                [
                    [
                        {
                            "str": "בָּלַשׁ",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "בָ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "לַ"
                                },
                                {
                                    "name": "SHIN_SOFIT",
                                    "pos": 1,
                                    "symbol": "ש"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/detective.png"
                        },
                        {
                            "str": "בָּיִת",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "בָ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "HIRIK",
                                    "symbol": "יִ"
                                },
                                {
                                    "name": "TAF",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ת"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/house.png"
                        }
                    ],
                    [
                        {
                            "str": "נָחָשׁ",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "HET",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "חָ"
                                },
                                {
                                    "name": "SHIN_SOFIT",
                                    "pos": 1,
                                    "symbol": "ש"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/snake.png"
                        },
                        {
                            "str": "נָהַג",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "הַ"
                                },
                                {
                                    "name": "GIMEL",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ג"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/driver.png"
                        }
                    ],
                    [
                        {
                            "str": "גַּלְגַּל",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "לְ"
                                },
                                {
                                    "name": "GIMEL",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ל"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/whell.png"
                        },
                        {
                            "str": "גַּמָּד",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "מָ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ד"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/dwarf.png"
                        }
                    ],
                    [
                        {
                            "str": "אַרְמוֹן",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "HOLAM",
                                    "symbol": "מֹ"
                                },
                                {
                                    "name": "NUN_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ן"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/palace.png"
                        },
                        {
                            "str": "אַרְנָב",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "NUN",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "VEIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ב"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/rabbit.png"
                        }
                    ]
                ],
                [
                    [
                        {
                            "str": "נָחָשׁ",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "HET",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "חָ"
                                },
                                {
                                    "name": "SHIN_SOFIT",
                                    "pos": 1,
                                    "symbol": "ש"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/snake.png"
                        },
                        {
                            "str": "נָהַג",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "הַ"
                                },
                                {
                                    "name": "GIMEL",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ג"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/driver.png"
                        }
                    ],
                    [
                        {
                            "str": "אַרְיֵה",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "TZERE",
                                    "symbol": "יֵ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/lion-small.png"
                        },
                        {
                            "str": "אַרְמוֹן",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "HOLAM",
                                    "symbol": "מֹ"
                                },
                                {
                                    "name": "NUN_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ן"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/palace.png"
                        }
                    ],
                    [
                        {
                            "str": "גַּלְגַּל",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "לְ"
                                },
                                {
                                    "name": "GIMEL",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ל"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/whell.png"
                        },
                        {
                            "str": "גַּמָּד",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "מָ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ד"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/dwarf.png"
                        }
                    ],
                    [
                        {
                            "str": "בָּלַשׁ",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "בָ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "לַ"
                                },
                                {
                                    "name": "SHIN_SOFIT",
                                    "pos": 1,
                                    "symbol": "ש"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/detective.png"
                        },
                        {
                            "str": "בָּיִת",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "בָ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "HIRIK",
                                    "symbol": "יִ"
                                },
                                {
                                    "name": "TAF",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ת"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/house.png"
                        }
                    ]
                ],
                [
                    [
                        {
                            "str": "גַּל",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ל"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/wave.png"
                        },
                        {
                            "str": "גַּלְגַּל",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "לְ"
                                },
                                {
                                    "name": "GIMEL",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ל"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/whell.png"
                        }
                    ],
                    [
                        {
                            "str": "אַרְנָב",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "NUN",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "VEIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ב"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/rabbit.png"
                        },
                        {
                            "str": "אַרְמוֹן",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "HOLAM",
                                    "symbol": "מֹ"
                                },
                                {
                                    "name": "NUN_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ן"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/palace.png"
                        }
                    ],
                    [
                        {
                            "str": "בָּיִת",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "בָ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "HIRIK",
                                    "symbol": "יִ"
                                },
                                {
                                    "name": "TAF",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ת"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/house.png"
                        },
                        {
                            "str": "בָּלַשׁ",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "בָ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "לַ"
                                },
                                {
                                    "name": "SHIN_SOFIT",
                                    "pos": 1,
                                    "symbol": "ש"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/detective.png"
                        }
                    ],
                    [
                        {
                            "str": "נָהַג",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "הַ"
                                },
                                {
                                    "name": "GIMEL",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ג"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/driver.png"
                        },
                        {
                            "str": "נָחָשׁ",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "HET",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "חָ"
                                },
                                {
                                    "name": "SHIN_SOFIT",
                                    "pos": 1,
                                    "symbol": "ש"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/snake.png"
                        }
                    ]
                ],
                [
                    [
                        {
                            "str": "בַּמָּה",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "בַ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "מָ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/stage.png"
                        },
                        {
                            "str": "בַּלוֹן",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "בַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "HOLAM",
                                    "symbol": "לֹ"
                                },
                                {
                                    "name": "NUN_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ן"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/baloon.png"
                        }
                    ],
                    [
                        {
                            "str": "גַּמָּד",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "מָ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ד"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/dwarf.png"
                        },
                        {
                            "str": "גַּל",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ל"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/wave.png"
                        }
                    ],
                    [
                        {
                            "str": "נַדְנֵדָה",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "נַ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "דְ"
                                },
                                {
                                    "name": "NUN",
                                    "pos": 1,
                                    "sound": "TZERE",
                                    "symbol": "נֵ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "דָ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/nadneda.png"
                        },
                        {
                            "str": "נַעֲלַיִם",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "נַ"
                                },
                                {
                                    "name": "AIN",
                                    "pos": 1,
                                    "symbol": "ע"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "לַ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "HIRIK",
                                    "symbol": "יִ"
                                },
                                {
                                    "name": "MEM_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ם"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/shoes.png"
                        }
                    ],
                    [
                        {
                            "str": "אַרְנָב",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "NUN",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "VEIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ב"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/rabbit.png"
                        },
                        {
                            "str": "אַרְיֵה",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "TZERE",
                                    "symbol": "יֵ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/lion-small.png"
                        }
                    ]
                ],
                [
                    [
                        {
                            "str": "בַּמָּה",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "בַ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "מָ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/stage.png"
                        },
                        {
                            "str": "בַּקְבּוּק",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "בַ"
                                },
                                {
                                    "name": "KOF",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "קְ"
                                },
                                {
                                    "name": "VEIT",
                                    "pos": 1,
                                    "sound": "KUBUZ",
                                    "symbol": "בּ"
                                },
                                {
                                    "name": "KOF",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ק"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/bottle.png"
                        }
                    ],
                    [
                        {
                            "str": "אַרְמוֹן",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "HOLAM",
                                    "symbol": "מֹ"
                                },
                                {
                                    "name": "NUN_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ן"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/palace.png"
                        },
                        {
                            "str": "אַרְיֵה",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "TZERE",
                                    "symbol": "יֵ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/lion-small.png"
                        }
                    ],
                    [
                        {
                            "str": "גַּל",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ל"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/wave.png"
                        },
                        {
                            "str": "גַּמָּד",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "מָ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ד"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/dwarf.png"
                        }
                    ],
                    [
                        {
                            "str": "נַעֲלַיִם",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "נַ"
                                },
                                {
                                    "name": "AIN",
                                    "pos": 1,
                                    "symbol": "ע"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "לַ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "HIRIK",
                                    "symbol": "יִ"
                                },
                                {
                                    "name": "MEM_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ם"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/shoes.png"
                        },
                        {
                            "str": "נַדְנֵדָה",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "נַ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "דְ"
                                },
                                {
                                    "name": "NUN",
                                    "pos": 1,
                                    "sound": "TZERE",
                                    "symbol": "נֵ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "דָ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/nadneda.png"
                        }
                    ]
                ],
                [
                    [
                        {
                            "str": "בָּיִת",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "בָ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "HIRIK",
                                    "symbol": "יִ"
                                },
                                {
                                    "name": "TAF",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ת"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/house.png"
                        },
                        {
                            "str": "בָּלַשׁ",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "בָ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "לַ"
                                },
                                {
                                    "name": "SHIN_SOFIT",
                                    "pos": 1,
                                    "symbol": "ש"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/detective.png"
                        }
                    ],
                    [
                        {
                            "str": "גַּג",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "GIMEL",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ג"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/roof.png"
                        },
                        {
                            "str": "גַּמָּד",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "מָ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ד"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/dwarf.png"
                        }
                    ],
                    [
                        {
                            "str": "נַדְנֵדָה",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "נַ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "דְ"
                                },
                                {
                                    "name": "NUN",
                                    "pos": 1,
                                    "sound": "TZERE",
                                    "symbol": "נֵ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "דָ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/nadneda.png"
                        },
                        {
                            "str": "נַעֲלַיִם",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "נַ"
                                },
                                {
                                    "name": "AIN",
                                    "pos": 1,
                                    "symbol": "ע"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "לַ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "HIRIK",
                                    "symbol": "יִ"
                                },
                                {
                                    "name": "MEM_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ם"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/shoes.png"
                        }
                    ],
                    [
                        {
                            "str": "אַרְנָב",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "NUN",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "VEIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ב"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/rabbit.png"
                        },
                        {
                            "str": "אַרְמוֹן",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "HOLAM",
                                    "symbol": "מֹ"
                                },
                                {
                                    "name": "NUN_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ן"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/palace.png"
                        }
                    ]
                ],
                [
                    [
                        {
                            "str": "גַּג",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "GIMEL",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ג"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/roof.png"
                        },
                        {
                            "str": "גַּל",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ל"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/wave.png"
                        }
                    ],
                    [
                        {
                            "str": "בַּמָּה",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "בַ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "מָ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/stage.png"
                        },
                        {
                            "str": "בַּלוֹן",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "בַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "HOLAM",
                                    "symbol": "לֹ"
                                },
                                {
                                    "name": "NUN_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ן"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/baloon.png"
                        }
                    ],
                    [
                        {
                            "str": "נַדְנֵדָה",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "נַ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "דְ"
                                },
                                {
                                    "name": "NUN",
                                    "pos": 1,
                                    "sound": "TZERE",
                                    "symbol": "נֵ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "דָ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/nadneda.png"
                        },
                        {
                            "str": "נַעֲלַיִם",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "נַ"
                                },
                                {
                                    "name": "AIN",
                                    "pos": 1,
                                    "symbol": "ע"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "לַ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "HIRIK",
                                    "symbol": "יִ"
                                },
                                {
                                    "name": "MEM_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ם"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/shoes.png"
                        }
                    ],
                    [
                        {
                            "str": "אַרְיֵה",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "TZERE",
                                    "symbol": "יֵ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/lion-small.png"
                        },
                        {
                            "str": "אַרְמוֹן",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "HOLAM",
                                    "symbol": "מֹ"
                                },
                                {
                                    "name": "NUN_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ן"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/palace.png"
                        }
                    ]
                ],
                [
                    [
                        {
                            "str": "נַעֲלַיִם",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "נַ"
                                },
                                {
                                    "name": "AIN",
                                    "pos": 1,
                                    "symbol": "ע"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "לַ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "HIRIK",
                                    "symbol": "יִ"
                                },
                                {
                                    "name": "MEM_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ם"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/shoes.png"
                        },
                        {
                            "str": "נַדְנֵדָה",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "נַ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "דְ"
                                },
                                {
                                    "name": "NUN",
                                    "pos": 1,
                                    "sound": "TZERE",
                                    "symbol": "נֵ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "דָ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/nadneda.png"
                        }
                    ],
                    [
                        {
                            "str": "גַּלְגַּל",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "לְ"
                                },
                                {
                                    "name": "GIMEL",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ל"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/whell.png"
                        },
                        {
                            "str": "גַּמָּד",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "מָ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ד"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/dwarf.png"
                        }
                    ],
                    [
                        {
                            "str": "אַרְנָב",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "NUN",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "VEIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ב"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/rabbit.png"
                        },
                        {
                            "str": "אַרְיֵה",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "TZERE",
                                    "symbol": "יֵ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/lion-small.png"
                        }
                    ],
                    [
                        {
                            "str": "בַּלוֹן",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "בַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "HOLAM",
                                    "symbol": "לֹ"
                                },
                                {
                                    "name": "NUN_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ן"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/baloon.png"
                        },
                        {
                            "str": "בַּקְבּוּק",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "בַ"
                                },
                                {
                                    "name": "KOF",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "קְ"
                                },
                                {
                                    "name": "VEIT",
                                    "pos": 1,
                                    "sound": "KUBUZ",
                                    "symbol": "בּ"
                                },
                                {
                                    "name": "KOF",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ק"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/bottle.png"
                        }
                    ]
                ],
                [
                    [
                        {
                            "str": "גַּל",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ל"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/wave.png"
                        },
                        {
                            "str": "גַּג",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "GIMEL",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ג"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/roof.png"
                        }
                    ],
                    [
                        {
                            "str": "אַרְנָב",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "NUN",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "VEIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ב"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/rabbit.png"
                        },
                        {
                            "str": "אַרְיֵה",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "TZERE",
                                    "symbol": "יֵ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/lion-small.png"
                        }
                    ],
                    [
                        {
                            "str": "נָהַג",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "הַ"
                                },
                                {
                                    "name": "GIMEL",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ג"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/driver.png"
                        },
                        {
                            "str": "נָחָשׁ",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "HET",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "חָ"
                                },
                                {
                                    "name": "SHIN_SOFIT",
                                    "pos": 1,
                                    "symbol": "ש"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/snake.png"
                        }
                    ],
                    [
                        {
                            "str": "בַּלוֹן",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "בַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "HOLAM",
                                    "symbol": "לֹ"
                                },
                                {
                                    "name": "NUN_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ן"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/baloon.png"
                        },
                        {
                            "str": "בַּמָּה",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "בַ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "מָ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/stage.png"
                        }
                    ]
                ],
                [
                    [
                        {
                            "str": "נָחָשׁ",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "HET",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "חָ"
                                },
                                {
                                    "name": "SHIN_SOFIT",
                                    "pos": 1,
                                    "symbol": "ש"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/snake.png"
                        },
                        {
                            "str": "נָהַג",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "הַ"
                                },
                                {
                                    "name": "GIMEL",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ג"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/driver.png"
                        }
                    ],
                    [
                        {
                            "str": "בַּמָּה",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "בַ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "מָ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/stage.png"
                        },
                        {
                            "str": "בַּלוֹן",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "בַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "HOLAM",
                                    "symbol": "לֹ"
                                },
                                {
                                    "name": "NUN_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ן"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/baloon.png"
                        }
                    ],
                    [
                        {
                            "str": "אַרְיֵה",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "TZERE",
                                    "symbol": "יֵ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/lion-small.png"
                        },
                        {
                            "str": "אַרְנָב",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "NUN",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "VEIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ב"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/rabbit.png"
                        }
                    ],
                    [
                        {
                            "str": "גַּלְגַּל",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "לְ"
                                },
                                {
                                    "name": "GIMEL",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ל"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/whell.png"
                        },
                        {
                            "str": "גַּג",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "GIMEL",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ג"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/roof.png"
                        }
                    ]
                ],
                [
                    [
                        {
                            "str": "אַרְנָב",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "NUN",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "VEIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ב"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/rabbit.png"
                        },
                        {
                            "str": "אַרְמוֹן",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "HOLAM",
                                    "symbol": "מֹ"
                                },
                                {
                                    "name": "NUN_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ן"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/palace.png"
                        }
                    ],
                    [
                        {
                            "str": "בָּלַשׁ",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "בָ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "לַ"
                                },
                                {
                                    "name": "SHIN_SOFIT",
                                    "pos": 1,
                                    "symbol": "ש"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/detective.png"
                        },
                        {
                            "str": "בָּיִת",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "בָ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "HIRIK",
                                    "symbol": "יִ"
                                },
                                {
                                    "name": "TAF",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ת"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/house.png"
                        }
                    ],
                    [
                        {
                            "str": "גַּלְגַּל",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "לְ"
                                },
                                {
                                    "name": "GIMEL",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ל"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/whell.png"
                        },
                        {
                            "str": "גַּל",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ל"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/wave.png"
                        }
                    ],
                    [
                        {
                            "str": "נַעֲלַיִם",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "נַ"
                                },
                                {
                                    "name": "AIN",
                                    "pos": 1,
                                    "symbol": "ע"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "לַ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "HIRIK",
                                    "symbol": "יִ"
                                },
                                {
                                    "name": "MEM_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ם"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/shoes.png"
                        },
                        {
                            "str": "נַדְנֵדָה",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "נַ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "דְ"
                                },
                                {
                                    "name": "NUN",
                                    "pos": 1,
                                    "sound": "TZERE",
                                    "symbol": "נֵ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "דָ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/nadneda.png"
                        }
                    ]
                ],
                [
                    [
                        {
                            "str": "נַעֲלַיִם",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "נַ"
                                },
                                {
                                    "name": "AIN",
                                    "pos": 1,
                                    "symbol": "ע"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "לַ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "HIRIK",
                                    "symbol": "יִ"
                                },
                                {
                                    "name": "MEM_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ם"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/shoes.png"
                        },
                        {
                            "str": "נַדְנֵדָה",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "נַ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "דְ"
                                },
                                {
                                    "name": "NUN",
                                    "pos": 1,
                                    "sound": "TZERE",
                                    "symbol": "נֵ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "דָ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/nadneda.png"
                        }
                    ],
                    [
                        {
                            "str": "גַּמָּד",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "מָ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ד"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/dwarf.png"
                        },
                        {
                            "str": "גַּלְגַּל",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "לְ"
                                },
                                {
                                    "name": "GIMEL",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ל"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/whell.png"
                        }
                    ],
                    [
                        {
                            "str": "בָּיִת",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "בָ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "HIRIK",
                                    "symbol": "יִ"
                                },
                                {
                                    "name": "TAF",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ת"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/house.png"
                        },
                        {
                            "str": "בָּלַשׁ",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "בָ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "לַ"
                                },
                                {
                                    "name": "SHIN_SOFIT",
                                    "pos": 1,
                                    "symbol": "ש"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/detective.png"
                        }
                    ],
                    [
                        {
                            "str": "אַרְמוֹן",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "HOLAM",
                                    "symbol": "מֹ"
                                },
                                {
                                    "name": "NUN_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ן"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/palace.png"
                        },
                        {
                            "str": "אַרְיֵה",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "TZERE",
                                    "symbol": "יֵ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/lion-small.png"
                        }
                    ]
                ],
                [
                    [
                        {
                            "str": "גַּג",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "GIMEL",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ג"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/roof.png"
                        },
                        {
                            "str": "גַּמָּד",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "מָ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ד"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/dwarf.png"
                        }
                    ],
                    [
                        {
                            "str": "אַרְיֵה",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "TZERE",
                                    "symbol": "יֵ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/lion-small.png"
                        },
                        {
                            "str": "אַרְנָב",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "NUN",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "VEIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ב"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/rabbit.png"
                        }
                    ],
                    [
                        {
                            "str": "בַּלוֹן",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "בַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "HOLAM",
                                    "symbol": "לֹ"
                                },
                                {
                                    "name": "NUN_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ן"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/baloon.png"
                        },
                        {
                            "str": "בַּקְבּוּק",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "בַ"
                                },
                                {
                                    "name": "KOF",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "קְ"
                                },
                                {
                                    "name": "VEIT",
                                    "pos": 1,
                                    "sound": "KUBUZ",
                                    "symbol": "בּ"
                                },
                                {
                                    "name": "KOF",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ק"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/bottle.png"
                        }
                    ],
                    [
                        {
                            "str": "נַדְנֵדָה",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "נַ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "דְ"
                                },
                                {
                                    "name": "NUN",
                                    "pos": 1,
                                    "sound": "TZERE",
                                    "symbol": "נֵ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "דָ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/nadneda.png"
                        },
                        {
                            "str": "נַעֲלַיִם",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "נַ"
                                },
                                {
                                    "name": "AIN",
                                    "pos": 1,
                                    "symbol": "ע"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "לַ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "HIRIK",
                                    "symbol": "יִ"
                                },
                                {
                                    "name": "MEM_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ם"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/shoes.png"
                        }
                    ]
                ],
                [
                    [
                        {
                            "str": "נַדְנֵדָה",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "נַ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "דְ"
                                },
                                {
                                    "name": "NUN",
                                    "pos": 1,
                                    "sound": "TZERE",
                                    "symbol": "נֵ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "דָ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/nadneda.png"
                        },
                        {
                            "str": "נַעֲלַיִם",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "נַ"
                                },
                                {
                                    "name": "AIN",
                                    "pos": 1,
                                    "symbol": "ע"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "לַ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "HIRIK",
                                    "symbol": "יִ"
                                },
                                {
                                    "name": "MEM_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ם"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/shoes.png"
                        }
                    ],
                    [
                        {
                            "str": "גַּל",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ל"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/wave.png"
                        },
                        {
                            "str": "גַּג",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "GIMEL",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ג"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/roof.png"
                        }
                    ],
                    [
                        {
                            "str": "אַרְנָב",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "NUN",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "VEIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ב"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/rabbit.png"
                        },
                        {
                            "str": "אַרְמוֹן",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "HOLAM",
                                    "symbol": "מֹ"
                                },
                                {
                                    "name": "NUN_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ן"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/palace.png"
                        }
                    ],
                    [
                        {
                            "str": "בַּלוֹן",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "בַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "HOLAM",
                                    "symbol": "לֹ"
                                },
                                {
                                    "name": "NUN_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ן"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/baloon.png"
                        },
                        {
                            "str": "בַּמָּה",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "בַ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "מָ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/stage.png"
                        }
                    ]
                ],
                [
                    [
                        {
                            "str": "בָּיִת",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "בָ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "HIRIK",
                                    "symbol": "יִ"
                                },
                                {
                                    "name": "TAF",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ת"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/house.png"
                        },
                        {
                            "str": "בָּלַשׁ",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "בָ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "לַ"
                                },
                                {
                                    "name": "SHIN_SOFIT",
                                    "pos": 1,
                                    "symbol": "ש"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/detective.png"
                        }
                    ],
                    [
                        {
                            "str": "נַדְנֵדָה",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "נַ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "דְ"
                                },
                                {
                                    "name": "NUN",
                                    "pos": 1,
                                    "sound": "TZERE",
                                    "symbol": "נֵ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "דָ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/nadneda.png"
                        },
                        {
                            "str": "נַעֲלַיִם",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "נַ"
                                },
                                {
                                    "name": "AIN",
                                    "pos": 1,
                                    "symbol": "ע"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "לַ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "HIRIK",
                                    "symbol": "יִ"
                                },
                                {
                                    "name": "MEM_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ם"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/shoes.png"
                        }
                    ],
                    [
                        {
                            "str": "גַּלְגַּל",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "לְ"
                                },
                                {
                                    "name": "GIMEL",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ל"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/whell.png"
                        },
                        {
                            "str": "גַּל",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ל"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/wave.png"
                        }
                    ],
                    [
                        {
                            "str": "אַרְיֵה",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "TZERE",
                                    "symbol": "יֵ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/lion-small.png"
                        },
                        {
                            "str": "אַרְנָב",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "NUN",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "VEIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ב"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/rabbit.png"
                        }
                    ]
                ],
                [
                    [
                        {
                            "str": "בָּלַשׁ",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "בָ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "לַ"
                                },
                                {
                                    "name": "SHIN_SOFIT",
                                    "pos": 1,
                                    "symbol": "ש"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/detective.png"
                        },
                        {
                            "str": "בָּיִת",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "בָ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "HIRIK",
                                    "symbol": "יִ"
                                },
                                {
                                    "name": "TAF",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ת"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/house.png"
                        }
                    ],
                    [
                        {
                            "str": "אַרְנָב",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "NUN",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "VEIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ב"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/rabbit.png"
                        },
                        {
                            "str": "אַרְיֵה",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "TZERE",
                                    "symbol": "יֵ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/lion-small.png"
                        }
                    ],
                    [
                        {
                            "str": "נָחָשׁ",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "HET",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "חָ"
                                },
                                {
                                    "name": "SHIN_SOFIT",
                                    "pos": 1,
                                    "symbol": "ש"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/snake.png"
                        },
                        {
                            "str": "נָהַג",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "הַ"
                                },
                                {
                                    "name": "GIMEL",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ג"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/driver.png"
                        }
                    ],
                    [
                        {
                            "str": "גַּג",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "GIMEL",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ג"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/roof.png"
                        },
                        {
                            "str": "גַּמָּד",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "מָ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ד"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/dwarf.png"
                        }
                    ]
                ],
                [
                    [
                        {
                            "str": "אַרְנָב",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "NUN",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "VEIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ב"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/rabbit.png"
                        },
                        {
                            "str": "אַרְמוֹן",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "HOLAM",
                                    "symbol": "מֹ"
                                },
                                {
                                    "name": "NUN_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ן"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/palace.png"
                        }
                    ],
                    [
                        {
                            "str": "גַּמָּד",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "מָ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ד"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/dwarf.png"
                        },
                        {
                            "str": "גַּל",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ל"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/wave.png"
                        }
                    ],
                    [
                        {
                            "str": "נָהַג",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "הַ"
                                },
                                {
                                    "name": "GIMEL",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ג"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/driver.png"
                        },
                        {
                            "str": "נָחָשׁ",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "HET",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "חָ"
                                },
                                {
                                    "name": "SHIN_SOFIT",
                                    "pos": 1,
                                    "symbol": "ש"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/snake.png"
                        }
                    ],
                    [
                        {
                            "str": "בָּיִת",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "בָ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "HIRIK",
                                    "symbol": "יִ"
                                },
                                {
                                    "name": "TAF",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ת"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/house.png"
                        },
                        {
                            "str": "בָּלַשׁ",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "בָ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "לַ"
                                },
                                {
                                    "name": "SHIN_SOFIT",
                                    "pos": 1,
                                    "symbol": "ש"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/detective.png"
                        }
                    ]
                ],
                [
                    [
                        {
                            "str": "גַּמָּד",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "מָ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ד"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/dwarf.png"
                        },
                        {
                            "str": "גַּל",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ל"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/wave.png"
                        }
                    ],
                    [
                        {
                            "str": "בַּלוֹן",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "בַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "HOLAM",
                                    "symbol": "לֹ"
                                },
                                {
                                    "name": "NUN_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ן"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/baloon.png"
                        },
                        {
                            "str": "בַּמָּה",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "בַ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "מָ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/stage.png"
                        }
                    ],
                    [
                        {
                            "str": "אַרְמוֹן",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "HOLAM",
                                    "symbol": "מֹ"
                                },
                                {
                                    "name": "NUN_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ן"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/palace.png"
                        },
                        {
                            "str": "אַרְיֵה",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "TZERE",
                                    "symbol": "יֵ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/lion-small.png"
                        }
                    ],
                    [
                        {
                            "str": "נָחָשׁ",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "HET",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "חָ"
                                },
                                {
                                    "name": "SHIN_SOFIT",
                                    "pos": 1,
                                    "symbol": "ש"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/snake.png"
                        },
                        {
                            "str": "נָהַג",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "הַ"
                                },
                                {
                                    "name": "GIMEL",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ג"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/driver.png"
                        }
                    ]
                ],
                [
                    [
                        {
                            "str": "אַרְיֵה",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "TZERE",
                                    "symbol": "יֵ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/lion-small.png"
                        },
                        {
                            "str": "אַרְמוֹן",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "HOLAM",
                                    "symbol": "מֹ"
                                },
                                {
                                    "name": "NUN_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ן"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/palace.png"
                        }
                    ],
                    [
                        {
                            "str": "נַדְנֵדָה",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "נַ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "דְ"
                                },
                                {
                                    "name": "NUN",
                                    "pos": 1,
                                    "sound": "TZERE",
                                    "symbol": "נֵ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "דָ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/nadneda.png"
                        },
                        {
                            "str": "נַעֲלַיִם",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "נַ"
                                },
                                {
                                    "name": "AIN",
                                    "pos": 1,
                                    "symbol": "ע"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "לַ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "HIRIK",
                                    "symbol": "יִ"
                                },
                                {
                                    "name": "MEM_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ם"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/shoes.png"
                        }
                    ],
                    [
                        {
                            "str": "בַּלוֹן",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "בַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "HOLAM",
                                    "symbol": "לֹ"
                                },
                                {
                                    "name": "NUN_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ן"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/baloon.png"
                        },
                        {
                            "str": "בַּקְבּוּק",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "בַ"
                                },
                                {
                                    "name": "KOF",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "קְ"
                                },
                                {
                                    "name": "VEIT",
                                    "pos": 1,
                                    "sound": "KUBUZ",
                                    "symbol": "בּ"
                                },
                                {
                                    "name": "KOF",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ק"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/bottle.png"
                        }
                    ],
                    [
                        {
                            "str": "גַּל",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ל"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/wave.png"
                        },
                        {
                            "str": "גַּמָּד",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "מָ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ד"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/dwarf.png"
                        }
                    ]
                ],
                [
                    [
                        {
                            "str": "אַרְמוֹן",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "HOLAM",
                                    "symbol": "מֹ"
                                },
                                {
                                    "name": "NUN_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ן"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/palace.png"
                        },
                        {
                            "str": "אַרְיֵה",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "TZERE",
                                    "symbol": "יֵ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/lion-small.png"
                        }
                    ],
                    [
                        {
                            "str": "גַּמָּד",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "מָ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ד"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/dwarf.png"
                        },
                        {
                            "str": "גַּלְגַּל",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "לְ"
                                },
                                {
                                    "name": "GIMEL",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ל"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/whell.png"
                        }
                    ],
                    [
                        {
                            "str": "בַּמָּה",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "בַ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "מָ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/stage.png"
                        },
                        {
                            "str": "בַּקְבּוּק",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "בַ"
                                },
                                {
                                    "name": "KOF",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "קְ"
                                },
                                {
                                    "name": "VEIT",
                                    "pos": 1,
                                    "sound": "KUBUZ",
                                    "symbol": "בּ"
                                },
                                {
                                    "name": "KOF",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ק"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/bottle.png"
                        }
                    ],
                    [
                        {
                            "str": "נַדְנֵדָה",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "נַ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "דְ"
                                },
                                {
                                    "name": "NUN",
                                    "pos": 1,
                                    "sound": "TZERE",
                                    "symbol": "נֵ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "דָ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/nadneda.png"
                        },
                        {
                            "str": "נַעֲלַיִם",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "נַ"
                                },
                                {
                                    "name": "AIN",
                                    "pos": 1,
                                    "symbol": "ע"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "לַ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "HIRIK",
                                    "symbol": "יִ"
                                },
                                {
                                    "name": "MEM_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ם"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/shoes.png"
                        }
                    ]
                ],
                [
                    [
                        {
                            "str": "בַּלוֹן",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "בַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "HOLAM",
                                    "symbol": "לֹ"
                                },
                                {
                                    "name": "NUN_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ן"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/baloon.png"
                        },
                        {
                            "str": "בַּקְבּוּק",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "בַ"
                                },
                                {
                                    "name": "KOF",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "קְ"
                                },
                                {
                                    "name": "VEIT",
                                    "pos": 1,
                                    "sound": "KUBUZ",
                                    "symbol": "בּ"
                                },
                                {
                                    "name": "KOF",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ק"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/bottle.png"
                        }
                    ],
                    [
                        {
                            "str": "גַּמָּד",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "מָ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ד"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/dwarf.png"
                        },
                        {
                            "str": "גַּג",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "GIMEL",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ג"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/roof.png"
                        }
                    ],
                    [
                        {
                            "str": "נָחָשׁ",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "HET",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "חָ"
                                },
                                {
                                    "name": "SHIN_SOFIT",
                                    "pos": 1,
                                    "symbol": "ש"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/snake.png"
                        },
                        {
                            "str": "נָהַג",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "הַ"
                                },
                                {
                                    "name": "GIMEL",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ג"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/driver.png"
                        }
                    ],
                    [
                        {
                            "str": "אַרְיֵה",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "TZERE",
                                    "symbol": "יֵ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/lion-small.png"
                        },
                        {
                            "str": "אַרְנָב",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "NUN",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "VEIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ב"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/rabbit.png"
                        }
                    ]
                ],
                [
                    [
                        {
                            "str": "נָהַג",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "הַ"
                                },
                                {
                                    "name": "GIMEL",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ג"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/driver.png"
                        },
                        {
                            "str": "נָחָשׁ",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "HET",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "חָ"
                                },
                                {
                                    "name": "SHIN_SOFIT",
                                    "pos": 1,
                                    "symbol": "ש"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/snake.png"
                        }
                    ],
                    [
                        {
                            "str": "בָּלַשׁ",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "בָ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "לַ"
                                },
                                {
                                    "name": "SHIN_SOFIT",
                                    "pos": 1,
                                    "symbol": "ש"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/detective.png"
                        },
                        {
                            "str": "בָּיִת",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "בָ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "HIRIK",
                                    "symbol": "יִ"
                                },
                                {
                                    "name": "TAF",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ת"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/house.png"
                        }
                    ],
                    [
                        {
                            "str": "גַּג",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "GIMEL",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ג"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/roof.png"
                        },
                        {
                            "str": "גַּמָּד",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "מָ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ד"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/dwarf.png"
                        }
                    ],
                    [
                        {
                            "str": "אַרְנָב",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "NUN",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "VEIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ב"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/rabbit.png"
                        },
                        {
                            "str": "אַרְמוֹן",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "HOLAM",
                                    "symbol": "מֹ"
                                },
                                {
                                    "name": "NUN_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ן"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/palace.png"
                        }
                    ]
                ],
                [
                    [
                        {
                            "str": "נָהַג",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "הַ"
                                },
                                {
                                    "name": "GIMEL",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ג"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/driver.png"
                        },
                        {
                            "str": "נָחָשׁ",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "HET",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "חָ"
                                },
                                {
                                    "name": "SHIN_SOFIT",
                                    "pos": 1,
                                    "symbol": "ש"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/snake.png"
                        }
                    ],
                    [
                        {
                            "str": "בָּיִת",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "בָ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "HIRIK",
                                    "symbol": "יִ"
                                },
                                {
                                    "name": "TAF",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ת"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/house.png"
                        },
                        {
                            "str": "בָּלַשׁ",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "בָ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "לַ"
                                },
                                {
                                    "name": "SHIN_SOFIT",
                                    "pos": 1,
                                    "symbol": "ש"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/detective.png"
                        }
                    ],
                    [
                        {
                            "str": "גַּלְגַּל",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "לְ"
                                },
                                {
                                    "name": "GIMEL",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ל"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/whell.png"
                        },
                        {
                            "str": "גַּג",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "GIMEL",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ג"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/roof.png"
                        }
                    ],
                    [
                        {
                            "str": "אַרְיֵה",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "TZERE",
                                    "symbol": "יֵ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/lion-small.png"
                        },
                        {
                            "str": "אַרְמוֹן",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "HOLAM",
                                    "symbol": "מֹ"
                                },
                                {
                                    "name": "NUN_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ן"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/palace.png"
                        }
                    ]
                ],
                [
                    [
                        {
                            "str": "נָחָשׁ",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "HET",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "חָ"
                                },
                                {
                                    "name": "SHIN_SOFIT",
                                    "pos": 1,
                                    "symbol": "ש"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/snake.png"
                        },
                        {
                            "str": "נָהַג",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "הַ"
                                },
                                {
                                    "name": "GIMEL",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ג"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/driver.png"
                        }
                    ],
                    [
                        {
                            "str": "אַרְנָב",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "NUN",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "VEIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ב"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/rabbit.png"
                        },
                        {
                            "str": "אַרְיֵה",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "TZERE",
                                    "symbol": "יֵ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/lion-small.png"
                        }
                    ],
                    [
                        {
                            "str": "גַּמָּד",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "מָ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ד"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/dwarf.png"
                        },
                        {
                            "str": "גַּג",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "GIMEL",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ג"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/roof.png"
                        }
                    ],
                    [
                        {
                            "str": "בָּלַשׁ",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "בָ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "לַ"
                                },
                                {
                                    "name": "SHIN_SOFIT",
                                    "pos": 1,
                                    "symbol": "ש"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/detective.png"
                        },
                        {
                            "str": "בָּיִת",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "KAMATZ",
                                    "symbol": "בָ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "HIRIK",
                                    "symbol": "יִ"
                                },
                                {
                                    "name": "TAF",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ת"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/house.png"
                        }
                    ]
                ],
                [
                    [
                        {
                            "str": "נַדְנֵדָה",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "נַ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "דְ"
                                },
                                {
                                    "name": "NUN",
                                    "pos": 1,
                                    "sound": "TZERE",
                                    "symbol": "נֵ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "דָ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/nadneda.png"
                        },
                        {
                            "str": "נַעֲלַיִם",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "נַ"
                                },
                                {
                                    "name": "AIN",
                                    "pos": 1,
                                    "symbol": "ע"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "לַ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "HIRIK",
                                    "symbol": "יִ"
                                },
                                {
                                    "name": "MEM_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ם"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/shoes.png"
                        }
                    ],
                    [
                        {
                            "str": "אַרְמוֹן",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "HOLAM",
                                    "symbol": "מֹ"
                                },
                                {
                                    "name": "NUN_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ן"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/palace.png"
                        },
                        {
                            "str": "אַרְיֵה",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "TZERE",
                                    "symbol": "יֵ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/lion-small.png"
                        }
                    ],
                    [
                        {
                            "str": "בַּקְבּוּק",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "בַ"
                                },
                                {
                                    "name": "KOF",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "קְ"
                                },
                                {
                                    "name": "VEIT",
                                    "pos": 1,
                                    "sound": "KUBUZ",
                                    "symbol": "בּ"
                                },
                                {
                                    "name": "KOF",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ק"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/bottle.png"
                        },
                        {
                            "str": "בַּמָּה",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "בַ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "מָ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/stage.png"
                        }
                    ],
                    [
                        {
                            "str": "גַּלְגַּל",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "לְ"
                                },
                                {
                                    "name": "GIMEL",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ל"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/whell.png"
                        },
                        {
                            "str": "גַּל",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ל"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/wave.png"
                        }
                    ]
                ],
                [
                    [
                        {
                            "str": "בַּלוֹן",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "בַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "HOLAM",
                                    "symbol": "לֹ"
                                },
                                {
                                    "name": "NUN_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ן"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/baloon.png"
                        },
                        {
                            "str": "בַּקְבּוּק",
                            "letters": [
                                {
                                    "name": "VEIT",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "בַ"
                                },
                                {
                                    "name": "KOF",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "קְ"
                                },
                                {
                                    "name": "VEIT",
                                    "pos": 1,
                                    "sound": "KUBUZ",
                                    "symbol": "בּ"
                                },
                                {
                                    "name": "KOF",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ק"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/bottle.png"
                        }
                    ],
                    [
                        {
                            "str": "גַּמָּד",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "MEM",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "מָ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ד"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/dwarf.png"
                        },
                        {
                            "str": "גַּל",
                            "letters": [
                                {
                                    "name": "GIMEL",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "גַ"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ל"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/wave.png"
                        }
                    ],
                    [
                        {
                            "str": "נַדְנֵדָה",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "נַ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "דְ"
                                },
                                {
                                    "name": "NUN",
                                    "pos": 1,
                                    "sound": "TZERE",
                                    "symbol": "נֵ"
                                },
                                {
                                    "name": "DALET",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "דָ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/nadneda.png"
                        },
                        {
                            "str": "נַעֲלַיִם",
                            "letters": [
                                {
                                    "name": "NUN",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "נַ"
                                },
                                {
                                    "name": "AIN",
                                    "pos": 1,
                                    "symbol": "ע"
                                },
                                {
                                    "name": "LAMED",
                                    "pos": 1,
                                    "sound": "PATAH",
                                    "symbol": "לַ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "HIRIK",
                                    "symbol": "יִ"
                                },
                                {
                                    "name": "MEM_SOFIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ם"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/shoes.png"
                        }
                    ],
                    [
                        {
                            "str": "אַרְנָב",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "NUN",
                                    "pos": 1,
                                    "sound": "KAMATZ",
                                    "symbol": "נָ"
                                },
                                {
                                    "name": "VEIT",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ב"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/rabbit.png"
                        },
                        {
                            "str": "אַרְיֵה",
                            "letters": [
                                {
                                    "name": "ALEF",
                                    "pos": 0,
                                    "sound": "PATAH",
                                    "symbol": "אַ"
                                },
                                {
                                    "name": "RESH",
                                    "pos": 1,
                                    "sound": "SHVA",
                                    "symbol": "רְ"
                                },
                                {
                                    "name": "YUD",
                                    "pos": 1,
                                    "sound": "TZERE",
                                    "symbol": "יֵ"
                                },
                                {
                                    "name": "HE",
                                    "pos": 2,
                                    "sound": null,
                                    "symbol": "ה"
                                }
                            ],
                            "level": 1,
                            "imgPath": "/assets/lion-small.png"
                        }
                    ]
                ]
            ]
        };
        return games[sound][Math.floor(Math.random() * games[sound].length) ]
        // Apply the constraints on the vocabulary to get a grouping for the words.
/*        var j = 0;
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
        return gameGroupsArr;*/
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
