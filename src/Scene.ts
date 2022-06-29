import mapData from './mapData.json';
import MapRoadUtils from "./road/MapRoadUtils";
import AStarRoadSeeker from "./road/AStarRoadSeeker";
import RoadNode from "./road/RoadNode";
import Point from "./road/Point";

console.log(mapData)

export default class Scene extends PIXI.Container {
  private _roadDic: { [key: string]: RoadNode } = {};
  private _roadSeeker

  public roadNodeArr: any;
  public player: any;
  public currentRoadNode: any;

  constructor() {
    super()
    this.init()
  }

  init() {
    let start = null;
    let tiledMapLayer = new PIXI.Container()
    this.addChild(tiledMapLayer);
    tiledMapLayer.interactive = true
    tiledMapLayer.on('pointerdown', (event) => {
      start = {x: event.data.global.x, y: event.data.global.y}
    })

    tiledMapLayer.on("pointerup", (event) => {
      if (start) {
        let {x: x1, y: y1} = start
        let {x: x2, y: y2} = {x: event.data.global.x, y: event.data.global.y}
        let distance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))
        // console.log(x1, y1, x2, y2, 'distance:', distance)
        if (distance < 1) {
          let {x: targetX, y: targetY} = event.data.getLocalPosition(tiledMapLayer.parent)
          // console.log(targetX, targetY);

          var startPoint: Point = MapRoadUtils.instance.getWorldPointByPixel(this.player.x, this.player.y);
          var targetPoint: Point = MapRoadUtils.instance.getWorldPointByPixel(targetX, targetY);

          var startNode: RoadNode = this._roadDic[startPoint.x + "_" + startPoint.y];
          var targetNode: RoadNode = this._roadDic[targetPoint.x + "_" + targetPoint.y];
          // console.log(startNode, targetNode)

          var roadNodeArr: RoadNode[] = this._roadSeeker.seekPath2(startNode, targetNode);

          console.log(roadNodeArr)

          let tml = window["TweenMax"].getTweensOf(this.player)
          tml && tml.length && tml[0].kill()

          this.roadNodeArr = roadNodeArr

          this.move()
        }
      }
      start = null
    })

    this.player = PIXI.Sprite.from('static/assets/bunny.png');
    this.addChild(this.player)
    this.player.x = 50;
    this.player.y = 25;
    this.player.anchor.set(0.5);

    MapRoadUtils.instance.updateMapInfo(mapData.mapWidth, mapData.mapHeight, mapData.nodeWidth, mapData.nodeHeight, mapData.type);

    var len: number = mapData.roadDataArr.length;
    var len2: number = mapData.roadDataArr[0].length;

    var value: number = 0;

    for (var i: number = 0; i < len; i++) {
      for (var j: number = 0; j < len2; j++) {
        value = mapData.roadDataArr[i][j];

        var node: RoadNode = MapRoadUtils.instance.getNodeByDerect(j, i);
        node.value = value;

        this._roadDic[node.cx + "_" + node.cy] = node;

        // let rhombusView = new MapNodeView(node)
        // this.addChild(rhombusView)
        if (i < 20 && j < 200) {
          let rhombusView = new MapNodeView(node)
          tiledMapLayer.addChild(rhombusView)
        }
      }
    }

    this._roadSeeker = new AStarRoadSeeker(this._roadDic);

    console.log(this.getGridByPixel(50, 25))
    console.log(this.getGridByPixel(150, 25))
    console.log(this.getGridByPixel(250, 25))
  }

  getGridByPixel(px, py) {
    let offsetY = mapData.roadDataArr[0].length - 1;
    let w = 100;
    let h = 50;
    let x = Math.ceil(px / w - 0.5 + py / h) - 1;
    let y = (offsetY - Math.ceil(px / w - 0.5 - py / h));

    return {x, y}
  }

  move() {
    if (this.roadNodeArr && this.roadNodeArr.length > 0) {
      let targetRoadNode = this.roadNodeArr.shift()
      console.log(targetRoadNode.toString())

      let dx = Math.abs(this.player.x - targetRoadNode.px)
      let dy = Math.abs(this.player.y - targetRoadNode.py)

      let distance = Math.sqrt(dx * dx + dy * dy);
      let duration = (distance / 100) * 1;

      window["TweenMax"].to(this.player, duration, {
        x: targetRoadNode.px,
        y: targetRoadNode.py,
        ease: window["Power0"].easeNone,
        onComplete: this.move.bind(this)
      })
    }
  }
}

class MapNodeView extends PIXI.Container {
  node: any;

  constructor(node) {
    super()

    this.node = node
    let {cx, cy, dx, dy, px, py, value} = node;
    this.x = px
    this.y = py
    let w = mapData.nodeWidth
    let h = mapData.nodeHeight

    var graphics = new PIXI.Graphics()
    graphics.beginFill(value === 0 ? 0x00000 : 0xFF0000, 1)
    graphics.lineStyle(1, 0xffffff, 0.3)
    graphics.moveTo(-w / 2, 0)
    graphics.lineTo(0, -h / 2)
    graphics.lineTo(w / 2, 0)
    graphics.lineTo(0, h / 2)
    graphics.closePath()
    graphics.endFill()
    this.addChild(graphics)

    const graphics2 = new PIXI.Graphics()
    graphics2.beginFill(0xff0000, 1);
    graphics2.drawCircle(0, 0, 2);
    graphics2.endFill();
    this.addChild(graphics2)

    let style = {fontSize: 12, fill: 0xffffff, align: 'center'}

    let text3 = new PIXI.Text(`${px}/${py}`, style)
    this.addChild(text3)
    text3.anchor.set(0, 1)
    text3.x = -(w / 2) + 7
    text3.y = 2
    text3['angle'] = 31;

    let text2 = new PIXI.Text(`${dx}/${dy}`, style)
    this.addChild(text2)
    text2.anchor.set(0.5, 0.5)
    text2.x = 0
    text2.y = 0
    text2['angle'] = 31;

    let text = new PIXI.Text(`${cx}/${cy}`, style)
    text.anchor.set(1, 0);
    this.addChild(text)
    text.x = (w / 2) - 3
    text.y = -3
    text['angle'] = 31;
  }
}