import SimpleCommand = puremvc.SimpleCommand;
import INotification = puremvc.INotification;
import Game from "../../Game";
import ApplicationMediator from "../view/ApplicationMediator";

export default class ViewPrepCommand extends SimpleCommand {
  constructor() {
    super()
  }

  public execute(note: INotification) {
    // 创建 Mediator，并把它们注册到 View.
    var game: Game = note.getBody() as Game;
    this.facade['registerMediator'](new ApplicationMediator(game))
  }
}