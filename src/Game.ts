import Scene from './Scene'
import mapData from './mapData.json';

let stageWidth = document.documentElement.clientWidth || document.body.clientWidth
let stageHeight = document.documentElement.clientHeight || document.body.clientHeight

export default class Game extends PIXI.Application {

  constructor(config = {}) {
    super(config)
    this.init()
  }

  init() {
    document.body.prepend(this.view)

    let scene = new Scene();
    this.stage.addChild(scene);

    let drag = new Drag({
      ele: scene,
      width: mapData.mapWidth,
      height: mapData.mapWidth
    })
  }
}

class Drag {
  config
  ele
  dragging
  offset

  constructor(config) {
    let {ele} = this.config = config

    this.ele = ele
    this.ele.interactive = true
    this.ele.on('pointerdown', this.onDragStart, this)
  }

  onDragStart(event) {
    let {x: gx, y: gy} = event.data.global

    this.dragging = true
    this.offset = {x: this.ele.x - gx, y: this.ele.y - gy}

    this.ele.on('pointerup', this.onDragEnd, this)
    this.ele.on('pointerupoutside', this.onDragEnd, this)
    this.ele.on('pointermove', this.onDragMove, this)
  }

  onDragEnd() {
    this.dragging = false
    this.offset = null
    this.ele.off('pointerup', this.onDragEnd, this)
      .off('pointerupoutside', this.onDragEnd, this)
      .off('pointermove', this.onDragMove, this)
  }

  onDragMove(event) {
    if (this.dragging) {
      let {x: gx, y: gy} = event.data.global

      let x = gx + this.offset.x
      x = (x >= 0
        ? 0
        : x <= -(mapData.mapWidth * this.ele.scale.x - stageWidth)
          ? -(mapData.mapWidth * this.ele.scale.x - stageWidth)
          : x)

      let y = gy + this.offset.y
      y = (y >= 0
        ? 0
        : y <= -(mapData.mapHeight * this.ele.scale.y - stageHeight)
          ? -(mapData.mapHeight * this.ele.scale.y - stageHeight)
          : y)

      this.ele.x = x
      this.ele.y = y
    }
  }
}