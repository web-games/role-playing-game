import SimpleCommand = puremvc.SimpleCommand;
import ApplicationFacade from "../ApplicationFacade";
import MoneyCommand from "./MoneyCommand";

export default class ControllerPrepCommand extends SimpleCommand {
  constructor() {
    super()
  }

  public execute() {
    this.facade['registerCommand'](ApplicationFacade.MSG_ADD, MoneyCommand);
  }
}