/// <reference path="./library.d.ts" />

import Arts = require("./components/arts/Arts");

interface IScope extends Arts.IScope<IController> {

}

interface IController extends Arts.IController<IScope> {
  selectedTabIndex: number;

  switchToTab(tab: number): void;
  toggleSideBar(id: string): void;
}

class IndexController extends Arts.BaseController<IScope> implements IController {

  static $inject:string[] = ['$scope', '$mdSidenav'];

  selectedTabIndex: number = 0;

  constructor(public $scope:IScope, private $mdSidenav:ng.material.MDSidenavService) {
    super($scope);
  }

  switchToTab(tab: number): void {
    this.selectedTabIndex = tab;
  }

  toggleSideBar(id: string): void {
    this.$mdSidenav(id).toggle();
  }
}

class ApplicationConfiguration extends Arts.BaseConfiguration {

  static NAME:string = 'com.github.gregoranders.arts.configuration';

  static $inject:Array<string> = [
    '$routeProvider',
    '$controllerProvider',
    '$provide',
    '$compileProvider',
    '$translateProvider',
    '$translatePartialLoaderProvider',
    '$mdThemingProvider',
    'localStorageServiceProvider'
  ];

  constructor(private $routeProvider:angular.route.IRouteProvider,
              private $controllerProvider:angular.IControllerProvider,
              private $provideService:ng.auto.IProvideService,
              private $compileProvider:ng.ICompileProvider,
              private $translateProvider:ng.translate.ITranslateProvider,
              private $translatePartialLoaderProvider:ng.translate.ITranslatePartialLoaderService,
              private $mdThemingProvider:ng.material.MDThemingProvider,
              private localStorageServiceProvider:angular.local.storage.ILocalStorageServiceProvider) {

    super($routeProvider, $controllerProvider, $provideService, $compileProvider);

    var component:Arts.IApplication = <Arts.IApplication>Arts.Arts.getApplication(Application.NAME)
        .initModule($routeProvider, $controllerProvider, $provideService, $compileProvider),
      language = localStorage.getItem(Application.NAME + '.language'),
      theme = localStorage.getItem(Application.NAME + '.theme'),
      basePath = component.getBaseURL();

    // routing
    super.when('/', {
      name: 'index',
      templateUrl: basePath + 'view/main.html',
      controller: IndexController
    });

    super.otherwise({
      redirectTo: '/'
    });

    // theming
    this.$mdThemingProvider.theme('blue')
        .primaryPalette('blue')
        .accentPalette('light-blue');

    this.$mdThemingProvider.theme('indigo')
        .primaryPalette('indigo')
        .accentPalette('blue');

    this.$mdThemingProvider.theme('green')
        .primaryPalette('green')
        .accentPalette('light-green');

    this.$mdThemingProvider.alwaysWatchTheme(true);


    // translations
    this.$translateProvider.useLoader('$translatePartialLoader', {
      urlTemplate: basePath + '/components/{part}/l10n/{lang}.json'
    });
    this.$translatePartialLoaderProvider.addPart('arts');


    // defaults
    localStorageServiceProvider
      .setPrefix(Application.NAME)
      .setNotify(true, true);

    if (!language) {
      language = 'en_US';
    }

    if (!theme) {
      theme = 'green';
    }

    $translateProvider.preferredLanguage(language);
    $mdThemingProvider.setDefaultTheme(theme);

    component.directive(Arts.ToolbarDirective);
  }
}

class Application extends Arts.BaseApplication {

  static NAME:string = 'com.github.gregoranders.arts';

  static DEPENDENCIES:Array<string> = [];

  constructor(baseURL:string) {
    super(Application.NAME, baseURL, Application.DEPENDENCIES, ApplicationConfiguration);
    Arts.Arts.registerApplication(Application.NAME, this);
  }

  static initializeComponents():void {
  }
}

export = Application;