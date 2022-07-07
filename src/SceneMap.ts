// @ts-nocheck
import {mapHeight, mapWidth, nodeHeight, nodeWidth} from "./config";

export default class SceneMap extends PIXI.Container {
  constructor() {
    super()

    let start = null;
    this.interactive = true
    this.on('pointerdown', (event) => {
      start = {x: event.data.global.x, y: event.data.global.y}
    })

    this.on("pointerup", (event) => {
      if (start) {
        let {x: x1, y: y1} = start
        let {x: x2, y: y2} = {x: event.data.global.x, y: event.data.global.y}
        let distance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))
        // console.log(x1, y1, x2, y2, 'distance:', distance)
        if (distance < 1) {
          this.emit('click_map', event.data.getLocalPosition(this.parent))
        }
      }
      start = null
    })

    // 显示模糊小地图
    let smallMap = new PIXI.Sprite.from('./static/assets/s1/s1_min.jpg')
    this.addChild(smallMap)
    smallMap.scale.set(mapWidth / smallMap.texture.width, mapHeight / smallMap.texture.height)

    // 显示清晰大地图
    this._waitLoadZone = []
    this._sliceRows = 6
    this._sliceCols = 8
    this._sliceWidth = 360
    this._sliceHeight = 240

    for (let r = 0; r < this._sliceRows; r++) {
      for (let c = 0; c < this._sliceCols; c++) {
        let key = "s1_" + r + "_" + (c + 1) + ".png"
        this._waitLoadZone.push([key, r, c])
      }
    }

    this.load();
  }

  load() {
    // console.log("this._waitLoadZone.length: ", this._waitLoadZone.length)
    if (this._waitLoadZone.length) {
      let obj = this._waitLoadZone.shift()
      let key = obj[0]
      let row = obj[1]
      let col = obj[2]
      let url = "./static/assets/s1/360*240/" + key

      var loader = new PIXI.Loader()
      loader.add(url)

      loader.once('complete', () => {
        this.drawBGMap(url, row, col)
        this.load()
      })
      loader.load()
    }
  }

  drawBGMap(key, row, col) {
    let x = (this._sliceWidth * col)
    let y = (this._sliceHeight * row)

    let tileMap = new PIXI.Sprite.from(key)
    this.addChildAt(tileMap, 1)
    tileMap.position.set(x, y)
  }

  drawNode(node) {
    let rhombusView = new MapNodeView(node)
    this.addChild(rhombusView)
    node.ele = rhombusView;
  }
}

class MapNodeView extends PIXI.Container {
  node: any;
  htxt: any;
  bg: any;

  constructor(node) {
    super()

    this.node = node
    let {cx, cy, dx, dy, px, py, value} = node;
    this.x = px
    this.y = py
    let w = nodeWidth
    let h = nodeHeight

    this.bg = new PIXI.Graphics();
    this.addChild(this.bg)
    this.setBGColor(value === 0 ? 0x008000 : 0xFF0000, value === 0 ? 0.5 : 1)

    const graphics2 = new PIXI.Graphics()
    graphics2.beginFill(0xffffff, 1);
    graphics2.drawCircle(0, 0, 2);
    graphics2.endFill();
    this.addChild(graphics2)

    let style = {fontSize: 12, fill: 0xffffff, align: 'center'}

    // let text3 = new PIXI.Text(`${px}/${py}`, style)
    // this.addChild(text3)
    // text3.anchor.set(0, 1)
    // text3.x = -(w / 2) + 7
    // text3.y = 2
    // text3['angle'] = 26.56505117707799;

    let text2 = new PIXI.Text(`${dx}/${dy}`, style)
    this.addChild(text2)
    text2.anchor.set(0.5, 0.5)
    text2.x = 0
    text2.y = 0
    text2['angle'] = 26.56505117707799;

    let text = new PIXI.Text(`${cx}/${cy}`, style)
    text.anchor.set(1, 0);
    this.addChild(text)
    text.x = (w / 2) - 3
    text.y = -3
    text['angle'] = 26.56505117707799;

    let htxt = new PIXI.Text(`${cx}/${cy}`, style)
    this.addChild(htxt)
    htxt.anchor.set(0, 1)
    htxt.x = -(w / 2) + 7
    htxt.y = 2
    htxt['angle'] = 26.56505117707799;
    htxt.visible = false;
    this.htxt = htxt;
  }

  resetText() {
    this.htxt.visible = true;
    this.htxt.text = `${this.node.g},${this.node.h},${this.node.f}`;
  }

  setBGColor(color, alpha) {
    let w = nodeWidth
    let h = nodeHeight
    let graphics = this.bg;
    graphics.clear();
    graphics.beginFill(color, alpha)
    graphics.lineStyle(1, 0xffffff, 0.3)
    graphics.moveTo(-w / 2, 0)
    graphics.lineTo(0, -h / 2)
    graphics.lineTo(w / 2, 0)
    graphics.lineTo(0, h / 2)
    graphics.closePath()
    graphics.endFill()
    return this;
  }

  resetBg() {
    let {value} = this.node;
    this.setBGColor(value === 0 ? 0x008000 : 0xFF0000, value === 0 ? 0.5 : 1)
  }
}