import Scene from './Scene'

export default class Game extends PIXI.Application {

  constructor(config = {}) {
    super(config)
    this.init()
  }

  init() {
    document.body.prepend(this.view)

    this.stage.addChild(new Scene());
  }
}