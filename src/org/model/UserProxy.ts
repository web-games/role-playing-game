import Proxy = puremvc.Proxy;
import IProxy = puremvc.IProxy;
import UserData from "./common/UserData";

/**
 * UserProxy对数据模型的处理
 * */
export default class UserProxy extends Proxy implements IProxy {
  public static NAME: string = "user_proxy";
  public static CHANGE_MONEY: string = 'change_money'

  // 数据模型
  public userData = null

  constructor() {
    super(UserProxy.NAME)
    this.userData = new UserData()
    this.setData(this.userData)
  }

  setValue(val) {
    this.userData.money+=val
    this.sendNotification(UserProxy.CHANGE_MONEY, this.userData)
  }

  public get money(){
    return this.userData.money
  }
}