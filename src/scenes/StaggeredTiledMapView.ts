import MapNodeView from './MapNodeView'
import StaggeredTiledMap from "./StaggeredTiledMap";

export default class StaggeredTiledMapView extends Phaser.GameObjects.Container {
  scene

  mapData: StaggeredTiledMap

  wrapperWidth: any
  wrapperHeight: any
  scrollerWidth: any
  scrollerHeight: any
  maxScrollX: any
  maxScrollY: any
  startTime: any
  startX: any
  startY: any
  absDistance: any
  deceleration = 0.001 // 0.004 0.0006

  constructor(scene: Phaser.Scene) {
    super(scene)

    this.scene = scene

    this.mapData = new StaggeredTiledMap()

    for (var i = 0; i < this.mapData.nodeList.length; i++) {
      let arr = this.mapData.nodeList[i];
      for (var j = 0; j < arr.length; j++) {
        let node = arr[j]
        let rhombus = new MapNodeView(scene, node)
        this.add(rhombus)
      }
    }

    // this.x = -this.mapData.tileWidth / 2
    // this.y = -this.mapData.tileHeight / 2
    this.wrapperWidth = this.scene.game.config.width
    this.wrapperHeight = this.scene.game.config.height
    this.scrollerWidth = this.mapData.mapWidth
    this.scrollerHeight = this.mapData.mapHeight
    console.log(this.mapData.mapWidth, this.mapData.mapHeight)
    this.maxScrollX = this.wrapperWidth - this.scrollerWidth
    this.maxScrollY = this.wrapperHeight - this.scrollerHeight
    this.startTime = null
    this.startX = 0
    this.startY = 0
    this.absDistance = {x: 0, y: 0}
    this.setInteractive({
      hitArea: new Phaser.Geom.Rectangle(0, 0, this.scrollerWidth, this.scrollerHeight),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      draggable: true
    })
    this.on('pointerdown', (pointer: any, dragX: any, dragY: any) => {
      // console.log('pointerdown:', pointer, dragX, dragY)
      // this.scene.stMap.mapData.screen2map(dragX, dragY)
    })
    this.on('dragstart', (pointer: any, gameObject: any, dragX: any, dragY: any) => {
      let tm: any = window['TweenMax']
      let tw: any = tm.getTweensOf(this.parentContainer)
      if (tw.length > 0) {
        tw[0].kill()
      }
      this.startTime = new Date().getTime()
      this.startX = this.parentContainer.x
      this.startY = this.parentContainer.y
      // console.log('dragestart xy:', this.startX, this.startY)
    })
    this.on('dragend', (pointer: any, gameObject: any, dragX: any, dragY: any) => {
      let duration = new Date().getTime() - this.startTime
      let momentumX = momentum(this.parentContainer.x, this.startX, duration, this.maxScrollX, 0, this.deceleration)
      let momentumY = momentum(this.parentContainer.y, this.startY, duration, this.maxScrollY, 0, this.deceleration)
      let newX = momentumX.destination
      let newY = momentumY.destination
      let time = Math.max(momentumX.duration, momentumY.duration)
      // console.log('start xy:', this.startX, this.startY)
      // console.log('cur xy:', this.parentContainer.x, this.parentContainer.y)
      // console.log('end xy:', newX, newY)
      // console.log('time:', momentumX.duration, momentumY.duration, time)

      window['TweenMax'].to(this.parentContainer, time / 1000, {x: newX, y: newY, ease: window['Power2'].easeOut})
    })
    this.on('drag', (pointer, dragX, dragY) => {
      let x = this.startX + dragX
      let y = this.startY + dragY
      x = x >= 0 ? 0 : x <= this.maxScrollX ? this.maxScrollX : x
      y = y >= 0 ? 0 : y <= this.maxScrollY ? this.maxScrollY : y
      // x = x >= -this.mapData.mapWidth / 2 ? -this.mapData.mapWidth / 2 : x <= this.maxScrollX ? this.maxScrollX : x
      // y = y >= -this.mapData.mapHeight / 2 ? -this.mapData.mapHeight / 2 : y <= this.maxScrollY ? this.maxScrollY : y

      this.parentContainer.x = x;
      this.parentContainer.y = y;

      // 效果待优化！
      let timestamp = new Date().getTime()
      if (timestamp - this.startTime > 300) {
        // this.startTime = timestamp;
        // this.startX = x;
        // this.startY = y;
      }
    });
  }
}

var momentum = function (current: any, start: any, time: any, lowerMargin: any, wrapperSize: any, deceleration: any) {
  var distance = current - start // 距离
  var speed = Math.abs(distance) / time // 速度 = (距离/时间)
  var destination;// 终点
  var duration// 持续时间

  deceleration = deceleration === undefined ? 0.0006 : deceleration

  destination = current + (speed * speed) / (2 * deceleration) * (distance < 0 ? -1 : 1)
  duration = speed / deceleration

  if (destination < lowerMargin) {
    destination = wrapperSize ? lowerMargin - (wrapperSize / 2.5 * (speed / 8)) : lowerMargin
    distance = Math.abs(destination - current)
    duration = distance / speed
  } else if (destination > 0) {
    destination = wrapperSize ? wrapperSize / 2.5 * (speed / 8) : 0
    distance = Math.abs(current) + destination
    duration = distance / speed
  }

  return {
    destination: Math.round(destination),
    duration: duration
  }
}