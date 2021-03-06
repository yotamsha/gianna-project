/// <reference path="./library.d.ts" />

import Arts = require("./components/arts/Arts");

import SetupComponent = require('./components/setup/Setup');

class ApplicationConfiguration extends Arts.BaseApplicationConfiguration {

  static NAME:string = 'com.github.gregoranders.arts.configuration'

  constructor(protected $routeProvider:angular.route.IRouteProvider,
              protected $controllerProvider:angular.IControllerProvider,
              protected $provideService:ng.auto.IProvideService,
              protected $compileProvider:ng.ICompileProvider,
              protected $translateProvider:ng.translate.ITranslateProvider,
              protected $translatePartialLoaderProvider:ng.translate.ITranslatePartialLoaderService,
              protected $mdThemingProvider:ng.material.MDThemingProvider,
              protected localStorageServiceProvider:angular.local.storage.ILocalStorageServiceProvider) {

    super(Application.NAME, 'he_HE', 'amber', $routeProvider, $controllerProvider, $provideService,
        $compileProvider, $translateProvider, $translatePartialLoaderProvider, $mdThemingProvider,
        localStorageServiceProvider);

    var component:Arts.IApplication = <Arts.IApplication>Arts.Arts.getApplication(Application.NAME)
            .initModule($routeProvider, $controllerProvider, $provideService, $compileProvider),
        language = localStorage.getItem(Application.NAME + '.language'),
        theme = localStorage.getItem(Application.NAME + '.theme'),
        basePath = component.getBaseURL();

    super.initTranslations(basePath);

    component.directive(Arts.ToolbarDirective);
    component.service(Arts.TestService);

  }
}

class Application extends Arts.BaseApplication {

  static NAME:string = 'com.github.gregoranders.arts';

  static DEPENDENCIES:Array<string> = [
    SetupComponent.NAME
  ];

  constructor(baseURL:string) {
    super(Application.NAME, baseURL, Application.DEPENDENCIES, ApplicationConfiguration);
    Arts.Arts.registerApplication(Application.NAME, this);
  }

  static initializeComponents(basePath:string):Arts.IModule[] {

    var components:Arts.IModule[] = [];

    components.push(SetupComponent.initializeComponents(basePath + 'components/setup/'));

    return components;
  }
}

export = Application;