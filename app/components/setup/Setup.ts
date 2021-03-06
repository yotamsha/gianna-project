import Arts = require("../arts/Arts");

import IndexController = require("./controller/IndexController");
import VocabularyController = require("./../vocabularyEditor/VocabularyController");
import Component = require("./Component");

class ModuleConfiguration extends Arts.BaseConfiguration {

  static NAME:string = 'com.github.gregoranders.arts.configuration';

  constructor(protected $routeProvider:angular.route.IRouteProvider,
              protected $controllerProvider:angular.IControllerProvider,
              protected $provideService:ng.auto.IProvideService,
              protected $compileProvider:ng.ICompileProvider,
              protected $translateProvider:ng.translate.ITranslateProvider) {

    super($routeProvider, $controllerProvider, $provideService, $compileProvider, $translateProvider);

    var component:Arts.IApplication = <Arts.IApplication>Arts.Arts.getModule(SetupComponent.NAME)
            .initModule($routeProvider, $controllerProvider, $provideService, $compileProvider),
        basePath = component.getBaseURL();

    // routing
    super.when('/', {
      name: 'index',
      templateUrl: basePath + 'view/main.html',
      controller: IndexController
    });
    super.when('/editor', {
      name: 'vocabulary',
      templateUrl: basePath + '../vocabularyEditor/list.html',
      controller: VocabularyController
    });
  }
}

class SetupComponent extends Arts.BaseModule {

  static NAME:string = Component.NAME;

  static DEPENDENCIES:Array<string> = [];

  constructor(baseURL:string) {
    super(SetupComponent.NAME, baseURL, SetupComponent.DEPENDENCIES, ModuleConfiguration);
    Arts.Arts.registerModule(SetupComponent.NAME, this);
  }

  static initializeComponents(basePath:string):SetupComponent {
    return new SetupComponent(basePath);
  }
}

export = SetupComponent;
