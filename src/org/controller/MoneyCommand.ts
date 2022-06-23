import SimpleCommand = puremvc.SimpleCommand;
import INotification = puremvc.INotification;
import UserProxy from "../model/UserProxy";

export default class MoneyCommand extends SimpleCommand {
  constructor() {
    super()
  }

  public execute(note: INotification) {
    let body = note.getBody()
    let userProxy:UserProxy=<UserProxy>(this.facade['retrieveProxy'](UserProxy.NAME));
    userProxy.setValue(body)
  }
}