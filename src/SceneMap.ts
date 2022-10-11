// @ts-nocheck
import {
  chunkCols,
  chunkHeight,
  chunkRows,
  chunkWidth,
  mapHeight,
  mapWidth,
  nodeHeight,
  nodeWidth,
  stageHeight,
  stageWidth
} from './config';

export default class SceneMap extends PIXI.Container {
  public mapPieceStatus: number[] = [];

  constructor() {
    super()

    let start = null;
    this.interactive = true
    this.on('pointerdown', (event) => {
      start = {x: event.data.global.x, y: event.data.global.y}
    })

    this.on('pointerup', (event) => {
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
    let smallMap = PIXI.Sprite.from('./static/assets/s2/s2_min.jpg')
    this.addChildAt(smallMap, 0)
    smallMap.scale.set(mapWidth / smallMap.texture.width, mapHeight / smallMap.texture.height)

    this.mapPieceStatus = []
    for (let i = 0; i < chunkRows; i++) {
      this.mapPieceStatus[i] = [];
      for (let j = 0; j < chunkCols; j++) {
        this.mapPieceStatus[i][j] = 0;

        let graphics = new PIXI.Graphics();
        graphics.lineStyle(1, 0xffffff, 1)
        graphics.moveTo(0, 0)
        graphics.lineTo(chunkWidth, 0)
        graphics.lineTo(chunkWidth, chunkHeight)
        graphics.lineTo(0, chunkHeight)
        graphics.closePath()
        graphics.endFill()
        this.addChild(graphics);
        graphics.position.set(j * chunkWidth, i * chunkHeight);

        let text3 = new PIXI.Text(`${i}/${j}`, {fontSize: 12, fill: 0xffffff, align: 'center'})
        this.addChild(text3)
        text3.position.set(j * chunkWidth, i * chunkHeight);
      }
    }
  }

  update() {
    let {x, y} = this.parent;
    let rows = Math.ceil(stageHeight / chunkHeight);
    let cols = Math.ceil(stageWidth / chunkWidth);
    // console.log(`rows=${rows},col=${cols}`);
    let startRow = parseInt(Math.abs(y) / chunkHeight);
    let startCol = parseInt(Math.abs(x) / chunkWidth);
    // console.log(`(${startRow},${startCol})`);

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let row = startRow + i;
        let col = startCol + j;
        // console.log(`(${row},${col})`);

        if (!this.mapPieceStatus[row][col]) {
          this.mapPieceStatus[row][col] = 1;
          this.load(row, col);
        }
      }
    }
  }

  load(row, col) {
    let url = `./static/assets/s2/240*171/s2_${row}_${col}.jpg`
    let loader = new PIXI.Loader()
    loader.add(url)
    loader.once('complete', () => {
      let x = (chunkWidth * col)
      let y = (chunkHeight * row)
      let tileMap = new PIXI.Sprite.from(url)
      this.addChildAt(tileMap, 1)
      tileMap.position.set(x, y)
    })
    loader.load()
  }

  drawNode(node) {
    let rhombusView = new MapNodeView(node)
    this.addChild(rhombusView)
    node.ele = rhombusView;
  }
}

class MapNodeView extends PIXI.Container {

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
    this.setBGColor(value === 0 ? 0x008000 : 0xFF0000, value === 0 ? 0 : 0.1)

    // const graphics2 = new PIXI.Graphics()
    // graphics2.beginFill(0xffffff, 1);
    // graphics2.drawCircle(0, 0, 2);
    // graphics2.endFill();
    // this.addChild(graphics2)

    let style = {fontSize: 12, fill: 0xffffff, align: 'center'}

    // 格子"像素"坐标
    // let text3 = new PIXI.Text(`${px}/${py}`, style)
    // this.addChild(text3)
    // text3.anchor.set(0, 1)
    // text3.x = -(w / 2) + 7
    // text3.y = 2
    // text3['angle'] = 26.56505117707799;

    // 格子"地图"坐标
    let text2 = new PIXI.Text(`${dx}/${dy}`, style)
    this.addChild(text2)
    text2.anchor.set(0.5, 0.5)
    text2.x = 0
    text2.y = 0
    text2['angle'] = 26.56505117707799;

    // 格子"A星寻路"坐标
    /*let text = new PIXI.Text(`${cx}/${cy}`, style)
    text.anchor.set(1, 0);
    this.addChild(text)
    text.x = (w / 2) - 3
    text.y = -3
    text['angle'] = 26.56505117707799;*/

    /*let htxt = new PIXI.Text(`${cx}/${cy}`, style)
    this.addChild(htxt)
    htxt.anchor.set(0, 1)
    htxt.x = -(w / 2) + 7
    htxt.y = 2
    htxt['angle'] = 26.56505117707799;
    htxt.visible = false;
    this.htxt = htxt;*/
  }

  resetText() {
    this.htxt && (this.htxt.visible = true);
    this.htxt && (this.htxt.text = `${this.node.g},${this.node.h},${this.node.f}`);
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
    this.setBGColor(value === 0 ? 0x008000 : 0xFF0000, value === 0 ? 0 : 0.3)
  }
}