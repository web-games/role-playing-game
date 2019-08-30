import Mediator = puremvc.Mediator;
import IMediator = puremvc.IMediator;
import INotification = puremvc.INotification;
import UserProxy from "../model/UserProxy";
import ApplicationFacade from "../ApplicationFacade";
import HomeScene from "../../scenes/home/HomeScene";
import TiledMapScene from "../../scenes/tiledMap/TiledMapScene";
import StaggeredMapScene from "../../scenes/staggeredMap/StaggeredMapScene";

/**
 * ApplicationMediator 对场景视图的操作
 * */
export default class ApplicationMediator extends Mediator implements IMediator {
  public static NAME: string = "application_mediator";

  constructor(game: any) {
    super(ApplicationMediator.NAME, game)
    this.viewComponent.scene.add(HomeScene.NAME, HomeScene, true)
    this.viewComponent.scene.add(TiledMapScene.NAME, TiledMapScene, false)
    this.viewComponent.scene.add(StaggeredMapScene.NAME, StaggeredMapScene, false)
  }

  private addMoneyListener(data) {
    this.sendNotification(ApplicationFacade.MSG_ADD, data)
  }

  public listNotificationInterests(): string[] {
    return [UserProxy.CHANGE_MONEY]
  }

  public handleNotification(notification: INotification): void {
    console.log('handle notification, name:', notification.getName(), ' body:', notification.getBody())
    switch (notification.getName()) {
      case UserProxy.CHANGE_MONEY:

        break;
      default:

        break;
    }
  }
}