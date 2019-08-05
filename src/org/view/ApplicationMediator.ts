import Mediator = puremvc.Mediator;
import IMediator = puremvc.IMediator;
import INotification = puremvc.INotification;
import StartScene from "../../scenes/StartScene";
import UserProxy from "../model/UserProxy";
import ApplicationFacade from "../ApplicationFacade";
import MapScene from "../../scenes/MapScene";

/**
 * ApplicationMediator 对场景视图的操作
 * */
export default class ApplicationMediator extends Mediator implements IMediator {
  public static NAME: string = "application_mediator";

  constructor(game: any) {
    super(ApplicationMediator.NAME,game)
    this.viewComponent.scene.add('MapScene', MapScene, true)
    this.viewComponent.scene.add('StartScene', StartScene, true)
    this.startScene.events.on(StartScene.ADD_MONEY,this.addMoneyListener,this)
    this.startScene.events.on(StartScene.SUB_MONEY,this.addMoneyListener,this)
    this.onRegister()
  }
  private addMoneyListener(data) {
    this.sendNotification(ApplicationFacade.MSG_ADD,data)
  }

  public listNotificationInterests():string[]{
    return [UserProxy.CHANGE_MONEY]
  }

  public handleNotification(notification:INotification):void{
    console.log('收到通知,name:',notification.getName(),' body:',notification.getBody())
    switch (notification.getName()) {
      case UserProxy.CHANGE_MONEY:
          this.startScene.setTitleText(notification.getBody().money)
        break;
      default:

        break;
    }
  }

  get startScene():StartScene{
    return this.viewComponent.scene.keys['StartScene'] as StartScene
  }
}