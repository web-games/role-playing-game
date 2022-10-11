import mapData from './config.json';
import MapRoadUtils from './road/MapRoadUtils';
import AStarRoadSeeker from './road/AStarRoadSeeker';
import RoadNode from './road/RoadNode';
import Point from './road/Point';
import Player from './Player';
import SceneMap from './SceneMap';

export default class Scene extends PIXI.Container {
  private _roadDic: any = {};
  private _roadSeeker: any;

  public roadNodeArr: Array<RoadNode> = [];
  public sceneMap: SceneMap;
  public player: Player;

  public startNode: any;
  public targetNode: any;

  constructor() {
    super()
    this.sceneMap = new SceneMap();
    this.addChild(this.sceneMap);
    this.sceneMap.on('click_map', (data) => {
      this.startNode && this.startNode.resetBg();
      this.targetNode && this.targetNode.resetBg();

      console.log('click map', data);
      let {x: targetX, y: targetY} = data
      // console.log(targetX, targetY);

      var startPoint: Point = MapRoadUtils.instance.getWorldPointByPixel(this.player.x, this.player.y);
      var targetPoint: Point = MapRoadUtils.instance.getWorldPointByPixel(targetX, targetY);

      var startNode: RoadNode = this._roadDic[startPoint.x + '_' + startPoint.y];
      var targetNode: RoadNode = this._roadDic[targetPoint.x + '_' + targetPoint.y];
      console.log(startNode, targetNode)

      var roadNodeArr: RoadNode[] = this._roadSeeker.seekPath2(startNode, targetNode);
      console.log(roadNodeArr)
      if (roadNodeArr.length >= 2) {
        this.startNode = roadNodeArr[0].ele.setBGColor(0x000000, 0.5)
        this.targetNode = roadNodeArr[roadNodeArr.length - 1].ele.setBGColor(0xffffff, 0.5)
      }

      let tml = window['TweenMax'].getTweensOf(this.player)
      tml && tml.length && tml[0].kill()

      this.roadNodeArr = roadNodeArr

      this.move()
    })

    this.player = new Player();
    this.addChild(this.player);

    MapRoadUtils.instance.updateMapInfo(mapData.mapWidth, mapData.mapHeight, mapData.nodeWidth, mapData.nodeHeight, mapData.type);

    for (var i = 0; i < mapData.roadDataArr.length; i++) {
      for (var j = 0; j < mapData.roadDataArr[0].length; j++) {

        var node: RoadNode = MapRoadUtils.instance.getNodeByDerect(j, i);
        node.value = mapData.roadDataArr[i][j];

        this._roadDic[node.cx + '_' + node.cy] = node;

        if (i < 200 && j < 200) {
          this.sceneMap.drawNode(node);
        }
      }
    }

    this._roadSeeker = new AStarRoadSeeker(this._roadDic);

    var node = MapRoadUtils.instance.getNodeByDerect(4, 9);
    this.player.setPosition(node.px, node.py)
  }

  move() {
    if (this.roadNodeArr && this.roadNodeArr.length > 0) {
      let targetRoadNode = this.roadNodeArr.shift()
      console.log(targetRoadNode.toString())

      let dx = targetRoadNode.px - this.player.x
      let dy = targetRoadNode.py - this.player.y

      let angle = 180 / Math.PI * Math.atan2(dy, dx);
      this.player.play(angle);

      let distance = Math.sqrt(dx * dx + dy * dy);
      let duration = (Math.abs(distance) / 100) * 1;

      window['TweenMax'].to(this.player, duration, {
        x: targetRoadNode.px,
        y: targetRoadNode.py,
        ease: window['Power0'].easeNone,
        onComplete: this.move.bind(this)
      })
    } else {
      this.player.stop();
    }
  }
}