import Proxy = puremvc.Proxy;
import IProxy = puremvc.IProxy;

export default class GameProxy extends Proxy implements IProxy {
  public static NAME: string = "game_proxy";
  // 数据模型
  public gameData = null

  constructor() {
    super(GameProxy.NAME)
    this.gameData = {}
  }
}