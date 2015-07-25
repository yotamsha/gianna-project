import BaseDirective = require("../../BaseDirective");
import ToolbarController = require('./controller/ToolbarController');

class ToolbarDirective extends BaseDirective {
  static NAME:string = 'artsToolbar';

  restrict:string = 'E';
  templateUrl:string = './components/arts/base/directive/toolbar.tpl.html';
  scope:{

  };
  controller:any = ToolbarController;
  controllerAs:string = 'vm';
  transclude:boolean = false;
}

export = ToolbarDirective;