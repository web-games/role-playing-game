/**
 * button
 * @example new PhaserButton({
 *    scene:this,
 *    x:0,
 *    y:1,
 *    w:100,
 *    h:40,
 *    hotArea:false,
 *    interactive:true,
 *    buttonMode:true,
 *    bgColor:{c:0xff0000,a:0.5,r:25}
 *    bgImage:{x,y,t,f}
 *    text:{x,y,t,s}
 * })
 * */

export default class PhaserButton extends Phaser.GameObjects.Container {
  config
  hotArea
  bgColor
  bgImage
  text
  
  constructor(config) {
    config = Object.assign({x: 0, y: 0, w: 100, h: 40, hotArea: false, interactive: true, buttonMode: true}, config)
    let {scene, hotArea, bgColor, bgImage, text, x, y, w, h, interactive, buttonMode} = config
    
    super(scene, x, y)
    this.scene = scene
    this.config = config
    
    if (hotArea) this.hotArea = this.addRect({c: 0xff0000, a: 0.3})
    
    if (bgColor) this.bgColor = this.addRect(bgColor)
    
    if (bgImage) this.bgImage = this.addImage(bgImage)
    
    if (text) this.text = this.addText(text)
    
    if (interactive) {
      let param = Object.assign({
        hitArea: new Phaser.Geom.Rectangle(0, 0, w, h),
        hitAreaCallback: Phaser.Geom.Rectangle.Contains
      }, buttonMode ? {
        cursor: 'pointer',
        useHandCursor: false
      } : null)
      this.setInteractive(param)
      
      this.on('pointerup', (pointer) => {
        if (pointer.upElement !== this.scene.game.canvas) return
        this.emit('pointertap',pointer)
      }, this)
    }
  }
  
  addRect(config, index = this.list.length) {
    index = index || this.list.length
    let {c: color = 0xffffff, a: alpha = 1, r: rounded, w = this.config.w, h = this.config.h, x = 0, y = 0} = config
    let graphics = this.scene.add.graphics().fillStyle(color, alpha)
    if (rounded) {
      graphics.fillRoundedRect(0, 0, w, h, rounded)
    } else {
      graphics.fillRect(0, 0, w, h)
    }
    graphics.setPosition(x, y)
    this.addAt(graphics, index)
    return graphics
  }
  
  addCircle(config, index = this.list.length) {
    let {c: color = 0xffffff, a: alpha = 1, x = 0, y = 0, r = 0} = config
    let graphics = this.scene.add.graphics().fillStyle(color, alpha)
    graphics.fillCircle(0, 0, r)
    this.addAt(graphics, index)
    graphics.setPosition(x, y)
    return graphics
  }
  
  addImage(config, index = this.list.length) {
    index = index || this.list.length
    let {x = this.config.w / 2, y = this.config.h / 2, t: texture, f: frame} = config
    let img = this.scene.add.image(x, y, texture, frame)
    this.addAt(img, index)
    return img
  }
  
  addText(config) {
    let {x, y, t: text = '', s: style} = config
    style = Object.assign({fontFamily: 'Arial', fontSize: 14, color: '#ffffff'}, style)
    let txt = this.scene.add.text(x, y, text, style)
    txt.setPosition(x || (this.config.w - txt.width) / 2, y || (this.config.h - txt.height) / 2)
    this.add(txt)
    return txt
  }
}
