import mapData from './mapData.json';
import MapRoadUtils from "./road/MapRoadUtils";
import AStarRoadSeeker from "./road/AStarRoadSeeker";
import RoadNode from "./road/RoadNode";
import Point from "./road/Point";

export default class Scene extends PIXI.Container {
  private _roadDic: { [key: string]: RoadNode } = {};
  private _roadSeeker

  constructor() {
    super()
    this.init()
  }

  init() {
    console.log(mapData)

    MapRoadUtils.instance.updateMapInfo(mapData.mapWidth, mapData.mapHeight, mapData.nodeWidth, mapData.nodeHeight, mapData.type);

    const graphics = new PIXI.Graphics()
    graphics.beginFill(0xDE3249)
    graphics.drawRect(0, 0, 10, 10)
    graphics.endFill()
    this.addChild(graphics)

    var len: number = mapData.roadDataArr.length;
    var len2: number = mapData.roadDataArr[0].length;

    var value: number = 0;
    var dx: number = 0;
    var dy: number = 0;

    for (var i: number = 0; i < len; i++) {
      for (var j: number = 0; j < len2; j++) {
        value = mapData.roadDataArr[i][j];
        dx = j;
        dy = i;

        var node: RoadNode = MapRoadUtils.instance.getNodeByDerect(dx, dy);
        node.value = value;

        this._roadDic[node.cx + "_" + node.cy] = node;
      }
    }

    this._roadSeeker = new AStarRoadSeeker(this._roadDic);


    var startPoint: Point = MapRoadUtils.instance.getWorldPointByPixel(570, 195);
    var targetPoint: Point = MapRoadUtils.instance.getWorldPointByPixel(570, 225);

    var startNode: RoadNode = this._roadDic[startPoint.x + "_" + startPoint.y];
    var targetNode: RoadNode = this._roadDic[targetPoint.x + "_" + targetPoint.y];

    var roadNodeArr: RoadNode[] = this._roadSeeker.seekPath(startNode, targetNode); //点击到障碍点不会行走
    //var roadNodeArr:RoadNode[] = this._roadSeeker.seekPath2(startNode,targetNode);  //点击到障碍点会行走到离障碍点最近的可走路点

    console.log(roadNodeArr)
  }
}