export class ScrollView {

  _content: any
  _layer: any
  wrapperWidth: any
  wrapperHeight: any
  scrollerWidth: any
  scrollerHeight: any
  maxScrollX: any
  maxScrollY: any
  startTime: any = 0
  start = {x: 0, y: 0, x1: 0, y1: 0}
  deceleration = 0.001 // 0.004 0.0006

  constructor(obj: any) {
    let {layer, content, wrapperWidth, wrapperHeight, scrollerWidth, scrollerHeight} = obj

    this._layer = layer
    this.wrapperWidth = wrapperWidth
    this.wrapperHeight = wrapperHeight
    this.scrollerWidth = scrollerWidth
    this.scrollerHeight = scrollerHeight
    this.maxScrollX = this.wrapperWidth - this.scrollerWidth
    this.maxScrollY = this.wrapperHeight - this.scrollerHeight

    this.setContent(content)
  }

  public setContent(content): void {
    if (this._content === content) return

    if (content) {
      this._content = content
      this._addEvents()
    }
  }

  private _addEvents(): void {
    this._content.setInteractive({
      hitArea: new Phaser.Geom.Rectangle(0, 0, this.scrollerWidth, this.scrollerHeight),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      draggable: true
    })
    this._content.on('pointerdown', this._onPointerDown, this)
    this._content.on('dragstart', this._onDragStart, this)
    this._content.on('dragend', this._onDragEnd, this)
    this._content.on('drag', this._onDrag, this)
  }

  private _onPointerDown() {
    // console.log('pointerdown:', pointer, dragX, dragY)
    // this.scene.stMap.mapData.screen2map(dragX, dragY)
  }

  /**
   * @param dragX 鼠标拖动点相对于拖动对象(0,0)点的X坐标
   * @param dragY 鼠标拖动点相对于拖动对象(0,0)点的Y坐标
   * */
  private _onDragStart(pointer: any, dragX: any, dragY: any): void {
    // console.log('onDragStart:', dragX, dragY)
    let tm: any = window['TweenMax']
    let tw: any = tm.getTweensOf(this._content.parentContainer)
    if (tw.length > 0) {
      tw[0].kill()
    }
    this.startTime = new Date().getTime()
    this.start.x = this.start.x1 = this._content.parentContainer.x
    this.start.y = this.start.y1 = this._content.parentContainer.y
  }

  private _onDragEnd(): void {
    let duration = new Date().getTime() - this.startTime
    let momentumX = momentum(this._content.parentContainer.x, this.start.x1, duration, this.maxScrollX, 0, this.deceleration)
    let momentumY = momentum(this._content.parentContainer.y, this.start.y1, duration, this.maxScrollY, 0, this.deceleration)
    let newX = momentumX.destination
    let newY = momentumY.destination
    let time = Math.max(momentumX.duration, momentumY.duration)
    // console.log('start xy:', this.startX, this.startY)
    // console.log('cur xy:', this.parentContainer.x, this.parentContainer.y)
    // console.log('end xy:', newX, newY)
    // console.log('time:', momentumX.duration, momentumY.duration, time)

    window['TweenMax'].to([this._content.parentContainer, this._layer], time / 1000, {
      x: newX,
      y: newY,
      ease: window['Power2'].easeOut
    })

    this.start.x = this.start.y = 0
    this.start.x1 = this.start.y1 = 0
  }

  /**
   * @param dragX 指针当前拖动游戏对象的x坐标
   * @param dragY 指针当前拖动游戏对象的y坐标
   * */
  private _onDrag(pointer, dragX, dragY): void {
    // 开始x坐标 + 拖动点x轴偏移量
    let x = this.start.x + (dragX + Math.abs(this._content.x))
    let y = this.start.y + (dragY + Math.abs(this._content.y))
    x = x >= 0 ? 0 : x <= this.maxScrollX ? this.maxScrollX : x
    y = y >= 0 ? 0 : y <= this.maxScrollY ? this.maxScrollY : y
    // console.log(x, y)
    this._content.parentContainer.x = x;
    this._content.parentContainer.y = y;

    this._layer.x = x;
    this._layer.y = y;

    let timestamp = new Date().getTime()
    if (timestamp - this.startTime > 300) {
      this.startTime = timestamp;
      this.start.x1 = x;
      this.start.y1 = y;
    }
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