export default class MapNode{
  row
  col
  x
  y
  width
  height
  state
  constructor(data) {
    let {row,col,x,y,state = 0,width,height} = data
    this.row=row
    this.col = col
    this.x = x
    this.y = y
    this.width= width
    this.height = height
    this.state = state
  }
}