import mapData from './mapData.json';
import MapRoadUtils from "./road/MapRoadUtils";
import AStarRoadSeeker from "./road/AStarRoadSeeker";
import RoadNode from "./road/RoadNode";
import Point from "./road/Point";

export default class Scene extends PIXI.Container {
  private _roadDic: { [key: string]: RoadNode } = {};
  private _roadSeeker

  roadNodeArr: any;
  player: any;

  constructor() {
    super()
    this.init()
  }

  init() {
    console.log(mapData)

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

        let rhombusView = new MapNodeView(node)
        this.addChild(rhombusView)
        // if (i < 20 && j < 20) {
        //   let rhombusView = new MapNodeView(node)
        //   this.addChild(rhombusView)
        // }
      }
    }

    this._roadSeeker = new AStarRoadSeeker(this._roadDic);

    var startNode1: RoadNode = MapRoadUtils.instance.getNodeByWorldPoint(5, 25);
    var targetNode1: RoadNode = MapRoadUtils.instance.getNodeByWorldPoint(6, 22);

    var startNode: RoadNode = this._roadDic[startNode1.cx + "_" + startNode1.cy];
    var targetNode: RoadNode = this._roadDic[targetNode1.cx + "_" + targetNode1.cy];
    console.log(startNode, targetNode)

    var roadNodeArr: RoadNode[] = this._roadSeeker.seekPath(startNode, targetNode); //点击到障碍点不会行走

    console.log(roadNodeArr)

    this.player = PIXI.Sprite.from('static/assets/bunny.png');
    this.addChild(this.player)
    this.player.x = startNode.px;
    this.player.y = startNode.py;
    this.player.anchor.set(0.5);

    this.roadNodeArr = roadNodeArr

    this.move()
  }

  move() {
    if (this.roadNodeArr && this.roadNodeArr.length > 0) {
      let node = this.roadNodeArr.shift()
      let duration = 1;

      window["TweenMax"].to(this.player, duration, {
        x: node.px,
        y: node.py,
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
    // graphics2.lineStyle(1, 0x000000, 1);
    graphics2.beginFill(0xffffff, 1);
    graphics2.drawCircle(0, 0, 1);
    graphics2.endFill();
    this.addChild(graphics2)

    let style = {fontSize: 12, fill: 0xffffff, align: 'center'}

    // let text3 = new PIXI.Text(`${px}/${py}`, style)
    // this.addChild(text3)
    // text3.anchor.set(0, 1)
    // text3.x = -(w / 2) + 5
    // text3.y = 0
    // text3['angle'] = 31;

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