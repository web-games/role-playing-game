import Facade = puremvc.Facade;
import IFacade = puremvc.IFacade;
import StartupCommand from "./controller/StartupCommand";
import Game from "../Game";

export default class ApplicationFacade extends Facade implements IFacade {
  public static STARTUP = 'startup'
  public static MSG_ADD: string = 'msg_add'
  public static instance = null
  public static game = null

  constructor(key) {
    super(key)
  }

  public static getInstance(key): ApplicationFacade {
    if (this.instance == null) this.instance = new ApplicationFacade(key);
    return <ApplicationFacade><any>(this.instance);
  }

  public initializeController(): void {
    super.initializeController();
    this.registerCommand(ApplicationFacade.STARTUP, StartupCommand);
  }

  public initializeModel(): void {
    super.initializeModel();
  }

  public startup() {
    let Phaser = window['Phaser']
    let game = new Game({
      type: Phaser.AUTO,
      transparent: true,
      autoFocus: true,
      scale: {
        mode: Phaser.Scale.FIT,
        parent: 'Box',
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    })
    game.events.on(Game.GAME_START, () => {
      this.sendNotification(ApplicationFacade.STARTUP, game)
    }, this)
    ApplicationFacade.game = game
  }
}