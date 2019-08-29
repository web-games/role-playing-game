import MapNode from "../MapNode"

export default class TiledMap {
  public rows: number// 行 - 单元格个数
  public cols: number// 列 - 单元格个数
  // tile的坐标原点在菱形的左上角
  public tileWidth: number// 单元格宽
  public tileHeight: number// 单元格高

  public mapWidth: number
  public mapHeight: number

  public showMapWidth: number
  public showMapHeight: number

  public nodeList: any[] = []

  constructor(rows: number = 50, cols: number = 20, tw: number = 64, th: number = 32) {
    this.rows = rows
    this.cols = cols
    this.tileWidth = tw
    this.tileHeight = th
    for (var i = 0; i < rows; i++) {
      let arr: MapNode[] = []
      for (var j = 0; j < cols; j++) {
        let p = this.map2screen(i, j)
        let node = new MapNode({
          x: p.x,
          y: p.y,
          row: i,
          col: j,
          width: tw,
          height: th,
          state: 0
        })
        arr.push(node)
      }
      this.nodeList.push(arr)
    }
    this.mapWidth = this.cols * this.tileWidth
    this.mapHeight = this.rows * this.tileHeight
    this.showMapWidth = this.mapWidth - this.tileWidth
    this.showMapHeight = this.mapHeight - this.tileHeight
  }

  /**
   * 格子坐标转换到坐标点
   * @param row 行
   * @param column 列
   * */
  public map2screen(row, column) {
    // console.log('row:%d,column:%d', row, column)
    if (this.checkRowColumn(row, column)) {
      return {
        x: (column * this.tileWidth),
        y: (row * this.tileHeight)
      }
    }
  }

  /**
   * 检测行,列是否在地图范围内
   * */
  public checkRowColumn(row, column) {
    if (row < 0 || row > this.rows - 1) {
      console.info(row + "行,不在地图范围内")
      return false
    } else if (column < 0 || column > this.cols - 1) {
      console.info(column + "列,不在地图范围内")
      return false
    }
    return true
  }
}