namespace game {
  export class ApplicationFacade extends puremvc.Facade implements puremvc.IFacade {
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
    }

    public initializeModel(): void {
      super.initializeModel();
    }

    public startup() {
      let Phaser = window['Phaser']
      console.log('Phaser:',Phaser)
    }
  }
}