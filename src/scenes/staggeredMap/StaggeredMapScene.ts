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
      this.pathArr && this.pathArr.length && this.pathArr.pop()
      this.move()
    })
    this.tiledMapLayer.showGridView()

    this.add.container(0, 0, this.tiledMapLayer)

    let map = [
      //0 1  2  3  4  5
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 1, 1],
      [0, 0, 0, 1, 0, 1],
      [0, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 1, 0],// 5
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0], // 10
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
      if (!this.canWalk(node.row, node.col))
        return true

      if (node.d === 'left_up' || node.d === 'right_up' || node.d === 'left_down' || node.d === 'right_down') {
        let h_row1
        let h_col1
        let v_row2
        let v_col2

        //  检测两点之间是否有障碍,如果有则不能斜着走,反正则可以斜着走
        switch (node.d) {
          case "left_up":
            h_row1 = node.row + 1
            h_col1 = (node.row % 2 === 0 ? node.col : node.col + 1)

            v_row2 = node.row + 1
            v_col2 = (node.row % 2 === 0 ? node.col - 1 : node.col)
            break;
          case "right_up":
            h_row1 = node.row - 1
            h_col1 = node.col - 1
            v_row2 = node.row + 1
            v_col2 = (node.row % 2 === 0 ? node.col - 1 : node.col)
            break;
          case "left_down":
            h_row1 = node.row + 1
            h_col1 = (node.row % 2 === 0 ? node.col : node.col + 1)

            v_row2 = node.row - 1
            v_col2 = (node.row % 2 === 0 ? node.col : node.col + 1)
            break;
          case "right_down":
            h_row1 = node.row - 1
            h_col1 = (node.row % 2 === 0 ? node.col - 1 : node.col)

            v_row2 = node.row - 1
            v_col2 = (node.row % 2 === 0 ? node.col : node.col + 1)
            break;
        }

        if (!this.canWalk(h_row1, h_col1) || !this.canWalk(v_row2, v_col2))
          return true
      }

      return false
    }
    this.aStar = astar
  }

  public canWalk(row, col) {
    if ((row < 0 || row > 20 - 1) || (col < 0 || col > 6 - 1)) return false

    return this.tiledMap.nodeList[row][col].state === 0
  }

  public initPlayer() {
    let start = {row: 7, col: 1}
    this.curNode = [7, 1]
    let pnode = this.tiledMap.nodeList[start.row][start.col]
    this.player = this.add.image(pnode.x + pnode.width / 2, pnode.y + pnode.height / 2, "bunny.png")

    // this.pathArr = this.aStar.findPath(start.row, start.col, end.row, end.col)
    // console.log(JSON.stringify(this.pathArr))
    // this.move()
  }

  public move() {
    if (this.pathArr && this.pathArr.length > 0) {
      let current = this.curNode;
      let next = this.pathArr.pop()
      let node = this.tiledMap.nodeList[next[0]][next[1]]
      let d = next[2]
      let duration = (d === 'up' || d === 'down' || d === 'left' || d === 'right'
        ? 0.3
        : d === 'left_down' || d === 'right_up'
          ? 0.5366726296958855
          : 0.26833631484794274)
      // console.log("currentNode:", currentNode)
      // console.log("nextNode:", nextNode)
      // console.log("\n")
      // Math.sqrt((50-0)*(50-0)+(25-0)*(25-0)) = 55.9 0.3s
      //                                          100  0.5366726296958855s
      //                                          50   0.26833631484794274s

      window["TweenMax"].to(this.player, duration, {
        x: node.x + node.width / 2,
        y: node.y + node.height / 2,
        ease: window["Power0"].easeNone,
        onComplete: () => (this.move())
      })

      this.curNode = next
    }
  }
}