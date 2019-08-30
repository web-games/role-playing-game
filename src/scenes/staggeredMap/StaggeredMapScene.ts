import AStar from "../../map/staggered/StaggeredAStar";
import StaggeredMap from "../../map/staggered/StaggeredMap";
import TiledMapLayer from "./TiledMapLayer";

export default class StaggeredMapScene extends Phaser.Scene {
  public static NAME: string = "staggered_map_scene"

  tiledMap
  tiledMapLayer
  player
  pathArr
  aStar
  curNode

  constructor() {
    super({key: StaggeredMapScene.NAME});
  }

  preload() {
    this.load.image("bunny.png", "./static/assets/bunny.png")
    this.load.image('floor', './static/assets/floor.png')
    this.load.image('jiqiren', './static/assets/jiqiren.png')
    this.load.image('chugui', './static/assets/chugui.png')
    this.load.image('chugui', './static/assets/chugui.png')
    this.load.image('tile', './static/assets/tile.png')
    this.load.image('dangao', './static/assets/dangaoL2_0_2x2.png')
    this.load.image('xiaoaigui', './static/assets/xiaoaiguiL2_1_2x2.png')
    this.load.image('knighthawks', './static/assets/knight3.png')

    this.load.image('shuzi_x.png', './static/assets/home/shuzi_x.png')
    this.load.image('sp_01.png', './static/assets/home/sp_01.png')
    this.load.image('sp_02.png', './static/assets/home/sp_02.png')
    // this.load.image('sp_03.png', './static/assets/home/sp_03.png')
    this.load.image('sp_04.png', './static/assets/home/sp_04.png')
    this.load.image('sp_number.png', './static/assets/home/sp_number.png')
  }

  create() {
    this.initMap()
    this.initPlayer()
  }

  public initMap() {
    this.tiledMap = new StaggeredMap(20, 6, 100, 50)
    console.log(this.tiledMap.mapWidth, this.tiledMap.mapHeight)
    this.tiledMapLayer = new TiledMapLayer(this, this.tiledMap)
    this.tiledMapLayer.on("pointertap", (pointer, dragX, dragY, event) => {
      // console.log(pointer, dragX, dragY, event)
      let {row, column} = this.tiledMap.screen2map(dragX, dragY)
      this.pathArr = this.aStar.findPath(this.curNode[0], this.curNode[1], row, column)
      this.move()
    })
    this.tiledMapLayer.showGridView()

    let layer1 = this.add.container(0, 0, this.tiledMapLayer)

    let map = [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1],
    ]
    map.forEach((ele, idx) => {
      ele.forEach((ele2, idx2) => {
        let node = this.tiledMap.nodeList[idx][idx2]
        if (node) node.state = ele2
      })
    })

    let astar = new AStar()
    astar.outFilter = (node) => {
      return this.tiledMap.nodeList[node.row][node.col].state === 1
    }
    this.aStar = astar
  }

  public initPlayer() {
    let start = {row: 3, col: 3}
    let end = {row: 3, col: 5}
    let pnode = this.tiledMap.nodeList[start.row][start.col]
    this.player = this.add.image(pnode.x + pnode.width / 2, pnode.y + pnode.height / 2, "bunny.png")

    this.pathArr = this.aStar.findPath(start.row, start.col, end.row, end.col)
    console.log(JSON.stringify(this.pathArr))
    this.move()
  }

  public move() {
    if (this.pathArr && this.pathArr.length > 0) {
      let node = this.pathArr.pop()
      this.curNode = node
      let pnode = this.tiledMap.nodeList[node[0]][node[1]]
      // console.log(pnode)
      window["TweenMax"].to(this.player, 0.3, {
        x: pnode.x + pnode.width / 2,
        y: pnode.y + pnode.height / 2,
        ease: window["Power0"].easeNone,
        onComplete: () => {
          this.move()
        }
      })
    }
  }
}