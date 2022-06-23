export default class MapNode {
  public row
  public col
  public x: number
  public y: number
  public width
  public height

  private _ele: any
  // 未占位0，已占位1
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

  set ele(val) {
    this._ele = val
  }

  set state(val) {
    if (this._ele) {
      if (val === 0) {
        this._ele.changeState(0xfafafa, 0.01)
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