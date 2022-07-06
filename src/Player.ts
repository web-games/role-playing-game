export default class Player extends PIXI.Container {
  public player: any;
  public startFrame: number;
  public endFrame: number;

  constructor() {
    super()
    // @ts-ignore
    var loader = new PIXI.Loader()
    loader.add('spritesheet', './static/assets/mc.json')
    loader.once('complete', this.onLoadComplete.bind(this))
    loader.load()

    /*let arr = [180, 225, 270, 315, 0, 45, 90, 135]
    arr.forEach((val => {
      console.log(val + (45 / 2), val - (45 / 2));
    }))*/
  }

  onLoadComplete() {
    let explosionTextures = []
    for (let i = 1; i <= 64; i++) {
      const texture = PIXI.Texture.from(`Explosion_Sequence_A ${i}.png`)
      explosionTextures.push(texture)
    }

    // @ts-ignore
    let player = this.player = new PIXI.AnimatedSprite(explosionTextures)
    player.onFrameChange = () => {
      let currentFrame = player.currentFrame
      // 注意：currentFrame 从0开始的
      // console.log("当前帧:", player.currentFrame)
      if (currentFrame > this.endFrame || (this.startFrame === 56 && currentFrame === 0)) {
        player.gotoAndPlay(this.startFrame)
      }
    }
    player.x = 0
    player.y = 0
    player.anchor.set(0.5, 0.65625)
    player.gotoAndStop(49)
    player.animationSpeed = 0.2
    // player.animationSpeed = 0.01
    this.addChild(player)

    this.x = 350;
    this.y = 125;

    const graphics = new PIXI.Graphics()
    graphics.beginFill(0xDE3249)
    graphics.drawRect(0, 0, 5, 5)
    graphics.endFill()
    this.addChild(graphics)
  }

  play(angle) {
    // console.log('angle:', angle)
    angle = (angle + 360) % 360
    // console.log('angle:', angle)
    if (angle <= 202.5 && angle > 157.5) {
      this.startFrame = 0
      this.endFrame = 7
    } else if (angle <= 247.5 && angle > 202.5) {
      this.startFrame = 8
      this.endFrame = 15
    } else if (angle <= 292.5 && angle > 247.5) {
      this.startFrame = 16
      this.endFrame = 23
    } else if (angle <= 337.5 && angle > 292.5) {
      this.startFrame = 24
      this.endFrame = 31
    } else if (angle <= 22.5 || angle > 337.5) {
      this.startFrame = 32
      this.endFrame = 39
    } else if (angle <= 67.5 && angle > 22.5) {
      this.startFrame = 40
      this.endFrame = 47
    } else if (angle <= 112.5 && angle > 67.5) {
      this.startFrame = 48
      this.endFrame = 55
    } else if (angle <= 157.5 && angle > 112.5) {
      this.startFrame = 56
      this.endFrame = 63
    }
    // console.log(this.startFrame, this.endFrame)

    this.player.gotoAndPlay(this.startFrame)
  }

  stop() {
    this.player.gotoAndStop(this.startFrame)
  }
}