import mapData from './mapData.json';

export default class SceneMap extends PIXI.Container {
  constructor() {
    super()
    this.init()
  }

  init() {
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
    let w = mapData.nodeWidth
    let h = mapData.nodeHeight

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
    let w = mapData.nodeWidth
    let h = mapData.nodeHeight
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