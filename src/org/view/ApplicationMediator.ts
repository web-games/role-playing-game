import Mediator = puremvc.Mediator;
import IMediator = puremvc.IMediator;
import INotification = puremvc.INotification;
import HomeScene from "../../scenes/start/HomeScene";
import UserProxy from "../model/UserProxy";
import ApplicationFacade from "../ApplicationFacade";
import TiledMapScene from "../../scenes/tiledMap/TiledMapScene";
import StaggeredMapScene from "../../scenes/staggeredMap/StaggeredMapScene";

/**
 * ApplicationMediator 对场景视图的操作
 * */
export default class ApplicationMediator extends Mediator implements IMediator {
  public static NAME: string = "application_mediator";

  constructor(game: any) {
    super(ApplicationMediator.NAME, game)
    this.viewComponent.scene.add(TiledMapScene.NAME, TiledMapScene, false)
    this.viewComponent.scene.add(StaggeredMapScene.NAME, StaggeredMapScene, true)
    // this.viewComponent.scene.add('HomeScene', HomeScene, true)
    // this.homeScene.events.on(HomeScene.ADD_MONEY, this.addMoneyListener, this)
    // this.homeScene.events.on(HomeScene.SUB_MONEY, this.addMoneyListener, this)
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
        this.homeScene.setTitleText(notification.getBody().money)
        break;
      default:

        break;
    }
  }

  get homeScene(): HomeScene {
    return this.viewComponent.scene.keys['HomeScene'] as HomeScene
  }
}