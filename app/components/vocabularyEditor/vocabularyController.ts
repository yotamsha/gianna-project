///<amd-dependency path="angular-material" />

import Arts = require('./../arts/Arts');
import Component = require("./../setup/Component");
import {VocabularyEditorService} from "./VocabularyEditorService";

interface IScope extends Arts.IScope<IController> {

}

interface IController extends Arts.IController<IScope> {

}



class VocabularyController extends Arts.BaseController<IScope> implements IController {

    static $inject:string[] = ['$scope','$http'];

    private baseURL:string;

    words : Object[];

    private dao : VocabularyEditorService;


    constructor(public $scope:IScope, private $http) {
        super($scope);

        var component:Arts.IApplication = <Arts.IApplication>Arts.Arts.getModule(Component.NAME);
        this.baseURL = component.getBaseURL();
        this.words = [];
/*        for (let word of wordsImagesArr ){
            this.words.push({imagePath : "/assets/" +word});
        }*/
        this.dao = new VocabularyEditorService($http);
        this.words  = this.dao.getWords();
    }

    saveWord(word):void {
        console.log("saving word: ", word);
        if (word.symbols){
            this.dao.setWord(word)
        }
    }

}

export = VocabularyController;
