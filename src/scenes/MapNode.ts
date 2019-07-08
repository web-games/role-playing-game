import MapNodeView from "./MapNodeView";

export default class MapNode {
  public row
  public col
  public x
  public y
  public width
  public height

  private _ele: MapNodeView = null
  // 未占位0，已占位0
  private _state = 0

  constructor(data) {
    let {row, col, x, y, state = 0, width, height} = data
    this.row = row
    this.col = col
    this.x = x
    this.y = y
    this.width = width
    this.height = height

    this.state = state
  }

  set ele(val: MapNodeView) {
    this._ele = val
  }

  set state(val) {
    if (this._ele) {
      if (val === 0) {
        this._ele.changeState(0xfafafa, 1)
      } else if (val === 1) {
        this._ele.changeState(0xeff4f8, 1)
      }
    }
    this._state = val
  }

  get state() {
    return this._state
  }
}