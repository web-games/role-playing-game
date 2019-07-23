import DiamondTiledMap from "../map/DiamondTiledMap";
import {NodeData} from "./NodeData";
import {Main} from "./Main";
import DiamondTiledMapView from "../map/DiamondTiledMapView";

export default class Element extends Phaser.GameObjects.Container {
  scene: Main
  skin: Phaser.GameObjects.Image
  mdata: NodeData
  startX
  startY
  currentRow
  currentCol

  diamondTileMap: DiamondTiledMap
  parentGoods = null

  childrenContainer = null

  constructor(scene, data) {
    super(scene)
    this.mdata = data

    let {row, col} = data
    this.currentRow = row
    this.currentCol = col
  }

  tiledmap() {
    var sdtMap = new DiamondTiledMapView(this.scene, this.diamondTileMap)
    this.add(sdtMap)
    sdtMap.fill(0xf2dda3)
    let y = -this.mdata.height * this.diamondTileMap.tileHeight
    sdtMap.y = y

    this.childrenContainer = this.scene.add.container(0, y)
    this.add(this.childrenContainer)
  }

  display(evt: boolean = true) {
    let {anchorX, anchorY, rows, cols, img, children} = this.mdata
    this.diamondTileMap = new DiamondTiledMap(rows, cols)
    var fdtMap = new DiamondTiledMapView(this.scene, this.diamondTileMap)
    this.add(fdtMap)
    fdtMap.fill(0x52DDA3, 0.2)

    this.skin = this.scene.add.image(0, 0, img)
    // this.skin.alpha = 0.5;

    let {width, height} = this.skin
    let ax = anchorX / width
    let ay = anchorY / height
    // console.log(width, height, anchorX, anchorY, ax, ay)
    this.add(this.skin)
    // 显示到占格的中心
    this.skin.y = this.mdata.rows * this.scene.stMap.mapData.tileHeight / 2

    this.skin.x -= (ax * width - width / 2)
    this.skin.y -= (ay * height - height / 2)

    this.skin.x += this.scene.stMap.mapData.tileWidth / 2

    if (evt) {
      this.addEvent()
    }
  }

  addEvent() {
    this.skin.setInteractive({
      pixelPerfect: true,
      draggable: true
    })
    this.skin.on('pointerdown', (pointer: any, gameObject: any) => {
      this.over()
      // console.log('originX:%d, originY:%d, row:%d, col:%d', originX, originY, row, col)
    })

    this.skin.on('pointerout', (pointer: any, gameObject: any) => {
      this.out()
    })

    this.skin.on('pointerup', (pointer: any, gameObject: any) => {
      this.out()
    })

    this.skin.on('dragstart', (pointer: any, gameObject: any, dragX: any, dragY: any) => {
      if (!this.parentGoods) {
        this.scene.stMap.mapData.setMultipleNodeState(this.currentRow, this.currentCol, this.mdata.rows, this.mdata.cols, 0)
      }

      this.startX = this.x - this.skin.x
      this.startY = this.y - this.skin.y

      this.parentContainer.moveTo(this, this.parentContainer.list.length - 1)
    })

    this.skin.on('drag', (pointer, dragX, dragY) => {
      this.x = this.startX + dragX;
      this.y = this.startY + dragY;
    });

    this.skin.on('dragend', (pointer: any, gameObject: any, dragX: any, dragY: any) => {
      let end_x = this.x + this.scene.stMap.mapData.tileWidth / 2
      let end_y = this.y + this.scene.stMap.mapData.tileHeight / 2
      let x
      let y

      if (!this.parentGoods) {
        let {row, column} = this.getGrid(end_x, end_y)
        if (this.scene.stMap.mapData.hitTest(row, column, this.mdata.rows, this.mdata.cols)) {
          this.scene.stMap.mapData.setMultipleNodeState(this.currentRow, this.currentCol, this.mdata.rows, this.mdata.cols, 0)
          this.currentRow = row
          this.currentCol = column
          let nodeData = this.scene.stMap.mapData.nodeList[row][column]
          x = nodeData.x
          y = nodeData.y

          this.setIndex()
        } else {
          let nodeData = this.scene.stMap.mapData.nodeList[this.currentRow][this.currentCol]
          x = nodeData.x
          y = nodeData.y
        }
      } else {
        let {row, column} = this.parentGoods.diamondTileMap.screen2map(end_x, end_y)
        // console.log(row,column)
        let nodeData = this.parentGoods.diamondTileMap.nodeList[this.currentRow][this.currentCol]
        x = nodeData.x
        y = nodeData.y
      }


      this.scene.stMap.mapData.setMultipleNodeState(this.currentRow, this.currentCol, this.mdata.rows, this.mdata.cols, 1)
      // this.x = x
      // this.y = y
      window['TweenMax'].to(this, 0.3, {x, y, ease: window['Power2'].easeOut})
    })
  }

  setIndex() {
    console.log(this.parentContainer.list.length)
  }

  getMapXY(row, col) {
    return this.scene.stMap.mapData.map2screen(row, col)
  }

  getGrid(x, y) {
    return this.scene.stMap.mapData.screen2map(x, y)
  }

  over() {
    this.skin.setTint(Math.random() * 16000000)
  }

  out() {
    this.skin.clearTint()
  }
}
