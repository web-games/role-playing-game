export default class MapNodeView extends Phaser.GameObjects.Container {
  private bg
  private node

  constructor(scene: Phaser.Scene, node, color: number = 0xf0f0f0, alpha = 1) {
    super(scene, node.x, node.y)

    this.node = node
    let w = node.width
    let h = node.height
    let row = node.row
    let col = node.col

    var graphics = scene.add.graphics()
    graphics.fillStyle(color, alpha)
    graphics.lineStyle(1, 0xff0000, 0.5)
    graphics.beginPath()
    graphics.moveTo(0, 0)
    graphics.lineTo(w, 0)
    graphics.lineTo(w, h)
    graphics.lineTo(0, h)
    graphics.closePath()
    graphics.fillPath()
    graphics.strokePath()
    this.add(graphics)
    this.bg = graphics

    let txt = scene.add.text(w / 2, h / 2, (row) + "," + (col), {
      fontSize: 10,
      color: "#ff0000"
    }).setOrigin(0.5, 0.5)
    this.add(txt)
  }

  public changeState(color, alpha) {
    let {width: w, height: h} = this.node
    var graphics = this.bg
    graphics.clear()
    graphics.fillStyle(color, alpha)
    graphics.lineStyle(1, 0xff0000, 0.5)
    graphics.beginPath()
    graphics.moveTo(0, 0)
    graphics.lineTo(w, 0)
    graphics.lineTo(w, h)
    graphics.lineTo(0, h)
    graphics.closePath()
    graphics.fillPath()
    graphics.strokePath()
  }
}