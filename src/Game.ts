import {mapHeight, mapWidth, stageHeight, stageWidth} from "./config";
import Scene from './Scene'

export default class Game extends PIXI.Application {

  constructor(config = {}) {
    super(config)
    this.init()
  }

  init() {
    document.body["prepend"](this.view)

    let scene = new Scene();
    this.stage.addChild(scene);

    // let drag = new Drag({
    //   ele: scene,
    //   width: mapWidth,
    //   height: mapHeight
    // })
    //
    // let scroll = new Scroll({
    //   content: scene,
    //   maskWidth: stageWidth,
    //   maskHeight: stageHeight,
    //   contentWidth: mapWidth,
    //   contentHeight: mapHeight
    // })
  }
}

class Drag {
  config
  ele
  dragging
  offset

  constructor(config) {
    let {ele} = this.config = config

    this.ele = ele
    this.ele.interactive = true
    this.ele.on('pointerdown', this.onDragStart, this)
  }

  onDragStart(event) {
    let {x: gx, y: gy} = event.data.global

    this.dragging = true
    this.offset = {x: this.ele.x - gx, y: this.ele.y - gy}

    this.ele.on('pointerup', this.onDragEnd, this)
    this.ele.on('pointerupoutside', this.onDragEnd, this)
    this.ele.on('pointermove', this.onDragMove, this)
  }

  onDragEnd() {
    this.dragging = false
    this.offset = null
    this.ele.off('pointerup', this.onDragEnd, this)
      .off('pointerupoutside', this.onDragEnd, this)
      .off('pointermove', this.onDragMove, this)
  }

  onDragMove(event) {
    if (this.dragging) {
      let {x: gx, y: gy} = event.data.global

      let x = gx + this.offset.x
      x = (x >= 0
        ? 0
        : x <= -(mapWidth * this.ele.scale.x - stageWidth)
          ? -(mapWidth * this.ele.scale.x - stageWidth)
          : x)

      let y = gy + this.offset.y
      y = (y >= 0
        ? 0
        : y <= -(mapHeight * this.ele.scale.y - stageHeight)
          ? -(mapHeight * this.ele.scale.y - stageHeight)
          : y)

      this.ele.x = x
      this.ele.y = y
    }
  }
}

class Scroll {
  _options
  _content
  _maskWidth
  _maskHeight
  _contentWidth
  _contentHeight
  _deceleration
  _start

  constructor(option) {
    let {content, maskWidth, maskHeight, contentWidth, contentHeight} = this._options = option

    this._content = content
    this._maskWidth = maskWidth
    this._maskHeight = maskHeight
    this._contentWidth = contentWidth
    this._contentHeight = contentHeight
    this._deceleration = 0.001 // 0.004 0.0006

    this._content.on('pointerdown', this.onPointerDownListener, this)
  }

  onPointerDownListener() {
    let tw = window["TweenMax"].getTweensOf(this._content)
    tw.length && tw[0].kill()

    this._start = {
      time: new Date().getTime(),
      x: this._content.x,
      y: this._content.y
    }

    this._content.on("pointerup", this.onPointerUpListener, this)
    this._content.on("pointerout", this.onPointerOutListener, this)
  }

  onPointerUpListener() {
    if (this._start) {
      let duration = new Date().getTime() - this._start.time
      let momentumX = this.momentum(this._content.x, this._start.x, duration, this.maxScrollLeft, 0, this._deceleration)
      let momentumY = this.momentum(this._content.y, this._start.y, duration, this.maxScrollTop, 0, this._deceleration)
      let newX = momentumX.destination
      let newY = momentumY.destination
      let time = Math.max(momentumX.duration, momentumY.duration)
      // console.log('start xy:', this._startX, this._startY)
      // console.log('cur xy:', this.parentContainer.x, this.parentContainer.y)
      // console.log('end xy:', newX, newY)
      // console.log('time:', momentumX.duration, momentumY.duration, time)
      // console.log("newX:%d newY:%d", newX, newY)
      //
      let vars = {
        x: newX,
        y: newY,
        ease: window["Power2"].easeOut,
        onUpdate: () => {
        },
        onComplete: () => {
        }
      }
      window["TweenMax"].to(this._content, time / 1000, vars)
    }

    this._content.off("pointerup", this.onPointerUpListener, this)
    this._content.off("pointerout", this.onPointerOutListener, this)
  }

  onPointerOutListener() {
    this.onPointerUpListener()
  }

  /**
   * 动量计算函数
   *
   * @param current 当前位置
   * @param start 初始位置
   * @param time 初始位置到当前位置运动时间（毫秒）
   * @param lowerMargin 最大目的地点
   * @param wrapperSize
   * @param deceleration 滚动动量，就是负的加速度（减速越大越快，建议不大）
   *
   * @return {destination:number,duration:number}
   * */
  momentum(current, start, time, lowerMargin, wrapperSize, deceleration = 0.0006) {
    // console.log(current, start, time, lowerMargin, wrapperSize, deceleration)
    // 计算拖动的距离 = 当前位置 - 初始位置
    let distance = current - start
    // 计算拖动的速度 = (移动距离/时间)
    let speed = Math.abs(distance) / time
    // 记录终点位置
    let destination
    // 记录到终点位置应持续时间
    let duration
    // V1是初速度
    // V2是末速度
    // a是加速度
    // t为时间
    // x是位移距离
    let v1 = speed
    let v2 = 0
    let a = deceleration
    let t
    let x

    // 计算在给定加速度情况下，由初速度减至0所运动的距离，即v*(0-v)/deceleration
    // v2=v1+at
    // x=v1t+(1/2)at^2
    t = (v2 - v1) / a
    x = (v1 * t) + ((1 / 2) * a * t * t)

    destination = current + x * (distance > 0 ? -1 : 1)
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

  set contentWidth(val) {
    this._contentWidth = val
  }

  set contentHeight(val) {
    this._contentHeight = val
  }

  // 最大滚动距离 横向
  get maxScrollLeft() {
    return this._maskWidth - this._contentWidth
  }

  // 最大滚动距离 纵向
  get maxScrollTop() {
    return this._maskHeight - this._contentHeight
  }
}