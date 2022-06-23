import SimpleCommand = puremvc.SimpleCommand;
import UserProxy from "../model/UserProxy";
import GameProxy from "../model/GameProxy";

export default class ModelPrepCommand extends SimpleCommand {
  constructor() {
    super()
  }

  public execute() {
    this.facade['registerProxy'](new UserProxy())
    this.facade['registerProxy'](new GameProxy())
  }
}