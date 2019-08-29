import AStar from "../../map/tiled/TiledAStar"
import TiledMap from "../../map/tiled/TiledMap"
import TiledMapLayer from "./TiledMapLayer"

export default class TiledMapScene extends Phaser.Scene {
  public static NAME: string = "tiled_map_scene"

  public player = null

  public tiledMap: TiledMap = null
  public tiledMapLayer: TiledMapLayer = null
  public aStar = null
  public pathArr = null
  public curNode = null

  constructor() {
    super({key: TiledMapScene.NAME})
  }

  preload() {
    this.load.image("bunny.png", "./static/assets/bunny.png")
  }

  public create() {
    this.initMap()
    this.initPlayer()
  }

  public initMap() {
    this.tiledMap = new TiledMap(10, 10, 50, 50)
    this.tiledMapLayer = new TiledMapLayer(this, this.tiledMap)
    this.add.existing(this.tiledMapLayer)
    this.tiledMapLayer.on("pointertap", (pointer, dragX, dragY, event) => {
      // console.log(pointer, dragX, dragY, event)
      let col = Math.floor(dragX / this.tiledMap.tileWidth)
      let row = Math.floor(dragY / this.tiledMap.tileHeight)
      // console.log(row, col)

      this.pathArr = this.aStar.findPath(this.curNode.row, this.curNode.col, row, col)
      this.move()
    })
    this.tiledMapLayer.showGridView()

    let map = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
      [0, 0, 0, 0, 1, 0, 1, 0, 1, 0],
      [0, 0, 0, 0, 1, 0, 1, 0, 1, 0],
      [0, 0, 0, 0, 1, 0, 1, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
      [0, 0, 0, 0, 1, 1, 1, 0, 0, 0]
    ]
    map.forEach((ele, idx) => {
      ele.forEach((ele2, idx2) => {
        this.tiledMap.nodeList[idx][idx2].state = ele2
      })
    })

    this.aStar = new AStar()
    this.aStar.outFilter = (node) => {
      return this.tiledMap.nodeList[node.row][node.col].state === 1
    }
  }

  public initPlayer() {
    let start = {row: 2, col: 2}
    let end = {row: 2, col: 5}
    let pnode = this.tiledMap.nodeList[start.row][start.col]
    this.player = this.add.image(pnode.x + pnode.width / 2, pnode.y + pnode.height / 2, "bunny.png")

    this.pathArr = this.aStar.findPath(start.row, start.col, end.row, end.col)
    this.move()
  }

  public move() {
    if (this.pathArr && this.pathArr.length > 0) {
      let node = this.pathArr.pop()
      this.curNode = node
      let pnode = this.tiledMap.nodeList[node.row][node.col]
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