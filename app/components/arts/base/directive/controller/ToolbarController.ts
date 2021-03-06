import ArtsVersion = require("../../../ArtsVersion");

import IScope = require("../../../interface/IScope");
import IController = require("../../../interface/IController");
import BaseController = require("../../../BaseController");

/**
 * Interface representing a theme used in arts.
 */
interface ITheme {

    /**
     * Theme id. Example: 'red', 'blue'
     */
    id: string;
}

/**
 * Interface representing a language used in arts.
 */
interface ILanguage {

    /**
     * Language id. Example: 'en_US', 'de_DE'
     */
    id: string;
}

/**
 * Interface representing a application used in arts.
 */
interface IApplication {

    /**
     * Application id. Example: 'arts'
     */
    id: string;

    /**
     * Application name. Example: 'Arts'
     */
    name: string;
}

/**
 * Interface representing the scope of the controller.
 */
interface IToolbarControllerScope extends IScope<IToolbarController> {
}

/**
 * Interface representing the ToolbarController public properties and methods that can be used in the view.
 */
interface IToolbarController extends IController<IToolbarControllerScope> {


    /**
     * Application url.
     */
    url: string;

    /**
     * Application version.
     */
    version: string;

}

/**
 * Default IToolbarController implementation.
 */
class ToolbarController extends BaseController<IToolbarControllerScope> implements IToolbarController {

    /**
     * Name of the controller.
     */
    static NAME:string = 'com.github.gregoranders.arts.base.controller.toolbar';

    /**
     * Available languages.
     */
    static LANGUAGES:ILanguage[] = [
        {id: 'en_US'},
        {id: 'de_DE'},
        {id: 'pl_PL'},
        {id: 'ru_RU'},
        {id: 'he_HE'}
    ];

    /**
     * Default language.
     */
    static LANGUAGE:string = 'he_HE';

    /**
     * Available themes.
     */
    static THEMES:ILanguage[] = [
        {id: 'blue'},
        {id: 'green'},
        {id: 'indigo'}
    ];

    /**
     * Default theme.
     */
    static THEME:string = 'green';

    /**
     * Available applications.
     */
    static APPLICATIONS:IApplication[] = [
        {id: 'arts', name: 'Arts'}
    ];

    /**
     * Default application.
     */
    static APPLICATION:string = 'arts';

    /**
     * AngularJS DI.
     */
    static $inject:string[] = ['$scope',
        '$translate',
        '$window',
        '$location',
        'localStorageService',
        '$rootScope'
    ];

    languages:ILanguage[] = [];
    language:string = undefined;

    themes:ILanguage[] = [];
    theme:string = undefined;

    applications:IApplication[];
    application:string = undefined;

    url:string = ArtsVersion.URL;
    version:string = ArtsVersion.VERSION;

    constructor(public $scope:IToolbarControllerScope, private $translate:ng.translate.ITranslateService,
                private $window:Window, private $location:ng.ILocationProvider,
                private localStorageService:angular.local.storage.ILocalStorageService<string>, private $rootScope:ng.IRootScopeService) {
        super($scope);
/*        $mdIconProvider
            .iconSet('social', 'img/icons/sets/social-icons.svg', 24)
            .defaultIconSet('img/icons/sets/core-icons.svg', 24);*/
        // language
        /*    this.languages = ToolbarController.LANGUAGES;
         var lang = localStorageService.get('language');

         if (!lang) {
         lang = ToolbarController.LANGUAGE;
         }

         $translate.use(lang).then(() => {
         this.setLanguage(lang);
         this.$scope.$watch(() => {
         return this.language;
         }, (language:string, old:string) => {
         if (language && old !== language) {
         this.setLanguage(language);
         }
         });
         });*/

        // theme
        /*    this.themes = ToolbarController.THEMES;
         this.theme = localStorageService.get('theme');

         if (!this.theme) {
         this.theme = ToolbarController.THEME;
         }

         this.$scope.$watch(() => {
         return this.theme;
         }, (theme:string, old:string) => {
         if (old !== theme) {
         this.setTheme(theme);
         }
         });*/

        // application
        /*
         this.applications = ToolbarController.APPLICATIONS;
         this.application = localStorageService.get('application');

         if (!this.application) {
         this.application = ToolbarController.APPLICATION;
         }

         this.$scope.$watch(() => {
         return this.application;
         }, (application:string) => {
         this.setApplication(application);
         });
         }
         */

        /*  setLanguage(language:string):void {
         this.$translate.use(language).then(() => {
         this.language = language;
         this.localStorageService.set('language', this.language);
         });*/
    }

    resetGame():void {
        console.log("refreshing game..");
        //this.$location.path("/editor");
        this.$rootScope.$broadcast("REFRESH_GAME");
        /// this.game.init();
    }

    setTheme(theme:string):void {
        this.theme = theme;

        this.localStorageService.set('theme', this.theme);

        // It seems there is something broken with angular material forcing a hard reload here to apply new color palettes
        this.$window.location.reload();
    }

    setApplication(application:string):void {
        this.application = application;
        this.localStorageService.set('application', this.application);
    }
}

export = ToolbarController;
