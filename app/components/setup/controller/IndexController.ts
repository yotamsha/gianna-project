///<amd-dependency path="angular-material" />

import Arts = require('../../arts/Arts');
import Component = require("../Component");
import {MemoryGameService} from '../../../common/games/MemoryGameService';
//import {TestService} from '../../../common/games/TestService';
//import TestService = require('../../../common/games/TestService');

/*
import {Letter} from '../../../common/pedagogicLogic/WordsGenerator';
import {Word} from '../../../common/pedagogicLogic/WordsGenerator';
import {VocabularyGenerator} from '../../../common/pedagogicLogic/WordsGenerator';
import {LetterConstraint} from '../../../common/pedagogicLogic/WordsGenerator';
import {WordConstraint} from '../../../common/pedagogicLogic/WordsGenerator';
import {GroupConstraint} from '../../../common/pedagogicLogic/WordsGenerator';

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

*/

interface IScope extends Arts.IScope<IController> {

}

interface IController extends Arts.IController<IScope> {
    selectedTabIndex: number;

    switchToTab(tab:number): void;
    switchToTabFromBottomSheet(tab:number): void;

    toggleSideBar(id:string): void;

    refresh(): void;

    success(): void;
    error(): void;

    bottomSheet(): void;
}



class IndexController extends Arts.BaseController<IScope> implements IController {

    static $inject:string[] = ['$scope', '$mdSidenav', '$mdToast', '$mdBottomSheet','$q','$http','$timeout'];

    selectedTabIndex:number = 0;

    tiles : any[];

    bottomSheetPromise:ng.IPromise<void>;

    private baseURL:string;




    constructor(public $scope:IScope, private $mdSidenav:ng.material.MDSidenavService,
                private $mdToast:ng.material.MDToastService,
                private $mdBottomSheet:ng.material.MDBottomSheetService,private $q :any, private $http, private $timeout,
                public game: MemoryGameService, private srv : Arts.TestService) {
        super($scope);
        var self = this;
        var component:Arts.IApplication = <Arts.IApplication>Arts.Arts.getModule(Component.NAME);

        this.baseURL = component.getBaseURL();
        //this.tiles = _tiles;
        console.log("tiles",this.tiles);
        this.game = new MemoryGameService($q,$http);
        $timeout(function(){
            self.game.init();
        },1000);

        console.log("game : ",this.game);
       // console.log("test service : ",this.srv.func);

    }

    cardClicked(index):void {
        if (this.game.state.gameState.lockCards){
            return;
        }
        this.game.chooseCard(index).then(function(){
            console.log("flip cards back.");
        });
    }
    resetGame () : void {
        console.log("refreshing game..");
        //this.game.init();
    }
    bottomSheet():void {
        this.bottomSheetPromise = this.$mdBottomSheet.show({
            templateUrl: this.baseURL + 'view/main-bottom-sheet.html',
            scope: this.$scope,
            preserveScope: true,
            parent: <any>angular.element(document.getElementById('content'))
        })
    }


    switchToTab(tab:number):void {
        this.selectedTabIndex = tab;
        this.$mdSidenav('left').close();
    }

    switchToTabFromBottomSheet(tab:number):void {
        if (this.bottomSheetPromise) {
            this.$mdBottomSheet.hide(this.bottomSheetPromise);
            this.bottomSheetPromise = null;
        }
        this.selectedTabIndex = tab;
    }


    toggleSideBar(id:string):void {
        this.$mdSidenav(id).toggle();
    }

    refresh():void {
        this.$mdToast.show({
            hideDelay: 3000,
            template: '<md-toast><span translate="load.partial.arts.generic.refresh"></span></md-toast>',
            position: 'top right'
        });
    }

    success():void {
        this.$mdToast.show({
            hideDelay: 3000,
            template: '<md-toast class="success"><span translate="load.partial.arts.generic.success"></span></md-toast>',
            position: 'top right'
        });

    }

    error():void {
        this.$mdToast.show({
            hideDelay: 3000,
            template: '<md-toast class="error"><span translate="load.partial.arts.generic.error"></span></md-toast>',
            position: 'top right'
        });
    }
}

export = IndexController;
