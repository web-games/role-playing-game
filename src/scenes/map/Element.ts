import DiamondTiledMap from "../../map/DiamondTiledMap";
import {NodeData} from "./NodeData";
import MapScene from "./MapScene";
import DiamondTiledMapView from "../../map/DiamondTiledMapView";

export default class Element extends Phaser.GameObjects.Container {
  scene: MapScene
  skin: Phaser.GameObjects.Image
  mdata: NodeData
  startX
  startY
  currentRow
  currentCol

  diamondTileMap: DiamondTiledMap
  parentGoods = null

  childrenContainer = null

  private placeholderShape = null
  private frameCount = 0
  private onState = null

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

  hidePlaceholder(): void {
    if (this.placeholderShape) this.placeholderShape.visible = false;
  }

  showPlaceholder() {
    if (this.placeholderShape) this.placeholderShape.visible = true
  }

  drawPlaceholder(color = 0x52DDA3, alpha = 1) {
    if (!this.diamondTileMap) {
      return
    }

    let {rows, cols, tileWidth, tileHeight} = this.diamondTileMap
    let p1 = this.diamondTileMap.nodeList[0][0]
    let p2 = this.diamondTileMap.nodeList[0][cols - 1]
    let p3 = this.diamondTileMap.nodeList[rows - 1][cols - 1]
    let p4 = this.diamondTileMap.nodeList[rows - 1][0]
    // console.log(p1, p2, p3, p4)

    if (this.placeholderShape) this.placeholderShape.clear()

    var graphics
    if (!this.placeholderShape) {
      graphics = this.placeholderShape = this.scene.add.graphics();
      this.addAt(graphics, 0)
    } else {
      graphics = this.placeholderShape
    }

    graphics.clear()
    graphics.fillStyle(color, alpha);
    graphics.beginPath();
    graphics.moveTo(p1.x + this.diamondTileMap.tileWidth / 2, p1.y);
    graphics.lineTo(p2.x + this.diamondTileMap.tileWidth, p2.y + this.diamondTileMap.tileHeight / 2);
    graphics.lineTo(p3.x + this.diamondTileMap.tileWidth / 2, p3.y + this.diamondTileMap.tileHeight);
    graphics.lineTo(p4.x, p4.y + this.diamondTileMap.tileHeight / 2);
    graphics.fillPath();
    graphics.closePath();

    if (rows !== 1 && cols !== 1) {
      graphics.lineStyle(1, 0xffffff, 1);
      for (var i = 0; i < this.diamondTileMap.nodeList.length - 1; i++) {
        let rowsArr = this.diamondTileMap.nodeList[i]
        let p1 = rowsArr[0]
        let p2 = rowsArr[rowsArr.length - 1]
        graphics.beginPath();
        graphics.moveTo(p1.x, p1.y + tileHeight / 2);
        graphics.lineTo(p2.x + tileWidth / 2, p2.y + tileHeight);
        graphics.closePath();
        graphics.strokePath();
      }

      for (var i = 0; i < this.diamondTileMap.nodeList[0].length - 1; i++) {
        let p1 = this.diamondTileMap.nodeList[0][i]
        let p2 = this.diamondTileMap.nodeList[rows - 1][i]
        graphics.beginPath();
        graphics.moveTo(p1.x + tileWidth, p1.y + tileHeight / 2);
        graphics.lineTo(p2.x + tileWidth / 2, p2.y + tileHeight);
        graphics.closePath();
        graphics.strokePath();
      }
    }
  }

  display(evt: boolean = true) {
    let {anchorX, anchorY, rows, cols, img, children} = this.mdata
    this.diamondTileMap = new DiamondTiledMap(rows, cols)
    var fdtMap = new DiamondTiledMapView(this.scene, this.diamondTileMap)
    this.add(fdtMap)
    fdtMap.fill(0x52DDA3, 0.2)

    this.skin = this.scene.add.image(0, 0, img)
    // this.skin.alpha = 0.001;

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

    this.drawPlaceholder()
    this.hidePlaceholder()
  }

  addEvent() {
    this.skin.setInteractive({
      pixelPerfect: true,
      draggable: true
    })
    // this.skin.on('pointerdown', (pointer: any, gameObject: any) => {
    //   this.over()
    //   // console.log('originX:%d, originY:%d, row:%d, col:%d', originX, originY, row, col)
    // })
    //
    // this.skin.on('pointerout', (pointer: any, gameObject: any) => {
    //   this.out()
    // })
    //
    // this.skin.on('pointerup', (pointer: any, gameObject: any) => {
    //   this.out()
    // })

    this.skin.on('dragstart', this.onDragStartListener, this)
    this.skin.on('drag', this.onDragListener, this);
    this.skin.on('dragend', this.onDragEndListener, this)
  }

  setIndex() {
    // console.log(this.parentContainer.list.length)
    this.parentContainer.moveTo(this, this.parentContainer.list.length - 1)
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

  private onDragStartListener(pointer: any, gameObject: any, dragX: any, dragY: any) {
    if (!this.parentGoods) {
      this.scene.stMap.mapData.setMultipleNodeState(this.currentRow, this.currentCol, this.mdata.rows, this.mdata.cols, 0)
    }

    this.startX = this.x - this.skin.x
    this.startY = this.y - this.skin.y

    this.setIndex()

    this.frameCount = 0
    this.onState = 'dragstart'
    this.scene.events.on('update', this.onUpdate, this)
    // console.log(this.scene.time.delayedCall(300, () => {
    //   console.log('delayed call')
    // }, null, this))
  }

  private onUpdate() {
    console.log('update')
    this.frameCount++

    if (this.frameCount > 10) {
      this.onDragFirstFrame()
    }
  }

  protected onDragListener(pointer, dragX, dragY): void {
    let distance = Phaser.Math.Distance.Between(this.skin.x, this.skin.y, dragX, dragY)
    // console.log('distance:', distance)
    if (distance >= 2) {
      if (this.onState !== 'drag') {
        this.onDragFirstFrame()
      }

      this.x = this.startX + dragX;
      this.y = this.startY + dragY;
    }
  }

  private onDragFirstFrame() {
    this.onState = 'drag'
    this.showPlaceholder()
    this.scene.events.off('update', this.onUpdate, this)
  }

  protected onDragEndListener(pointer: any, gameObject: any, dragX: any, dragY: any): void {
    let distance = Phaser.Math.Distance.Between(this.startX + this.skin.x, this.startY + this.skin.y, this.x, this.y)
    console.log(distance, this.onState)
    if (distance >= 2 && this.onState === 'drag') {
      console.log('drag end')
      let end_x = this.x + this.scene.stMap.mapData.tileWidth / 2
      let end_y = this.y + this.scene.stMap.mapData.tileHeight / 2
      let x
      let y

      if (this.parentGoods) {
        let nodeData = this.parentGoods.diamondTileMap.nodeList[this.currentRow][this.currentCol]
        x = nodeData.x
        y = nodeData.y
      } else {
        let {row, column} = this.getGrid(end_x, end_y)
        if (this.scene.stMap.mapData.hitTest(row, column, this.mdata.rows, this.mdata.cols)) {
          this.scene.stMap.mapData.setMultipleNodeState(this.currentRow, this.currentCol, this.mdata.rows, this.mdata.cols, 0)
          this.currentRow = row
          this.currentCol = column
          let nodeData = this.scene.stMap.mapData.nodeList[row][column]
          x = nodeData.x
          y = nodeData.y
        } else {
          let nodeData = this.scene.stMap.mapData.nodeList[this.currentRow][this.currentCol]
          x = nodeData.x
          y = nodeData.y
        }
      }
      window['TweenMax'].to(this, 0.3, {x, y, ease: window['Power2'].easeOut})
    } else if (this.onState === 'dragstart') {
      console.log('click')
      let {x, y} = this.scene.stMap.mapData.nodeList[this.currentRow][this.currentCol]
      this.x = x
      this.y = y
    }

    if (!this.parentGoods)
      this.scene.stMap.mapData.setMultipleNodeState(this.currentRow, this.currentCol, this.mdata.rows, this.mdata.cols, 1)

    this.scene.events.off('update', this.onUpdate, this)
    this.hidePlaceholder()
    this.onState = null
  }
}
