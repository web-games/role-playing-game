import MapNode from "./MapNode";

/**
 * 45度地图坐标
 * 参考：http://blog.sina.com.cn//s/blog_6807f539010103ce.html
 * */
export default class DiamondTiledMap {
  public rows
  public cols
  public tileWidth
  public tileHeight
  public nodeList: Array<any> = [];

  // M在像素坐标系X轴的偏移像素;（向右偏移）
  private _M_R = 0
  // M在像素坐标系Y轴的偏移像素;（向下偏移）
  private _M_D = 0

  // N在像素坐标系X轴的偏移像素;（向左偏移）
  private _N_L = 0
  // N在像素坐标系Y轴的偏移像素;（向下偏移）
  private _N_D = 0

  constructor(rows: number = 1, cols: number = 1, tileWidth: number = 100, tileHeight: number = 50) {
    this.rows = rows
    this.cols = cols
    this.tileWidth = tileWidth
    this.tileHeight = tileHeight

    this._M_R = tileWidth / 2
    this._M_D = tileHeight / 2

    this._N_L = -tileWidth / 2
    this._N_D = tileHeight / 2

    let i, j;

    for (i = 0; i < rows; i++) {
      let arr: Array<MapNode> = []
      for (j = 0; j < cols; j++) {
        var p = this.map2screen(i, j)
        var node = new MapNode({
          x: p.x,
          y: p.y,
          row: i,
          col: j,
          width: tileWidth,
          height: tileHeight
        })
        arr.push(node)
      }
      this.nodeList.push(arr)
    }
  }

  /**
   * 格子坐标转换到坐标点
   * @param row 行
   * @param column 列
   * */
  map2screen(row, column) {
    // console.log('row:%d,column:%d', row, column)
    return {
      x: column * this._M_R + row * this._N_L,
      y: column * this._M_D + row * this._N_D
    }
  }

  /**
   * 坐标点转换到格子坐标
   * @param px 相对于地图左上角(0,0)点的x坐标
   * @param py 相对于地图左上角(0,0)点的y坐标
   * */
  screen2map(px: number, py: number) {
    console.log(px, py)

    // py = py - this.tileHeight/2
    //
    // px =

    // let N = Math.floor(px / this.tileWidth - py / this.tileHeight)
    // let M = Math.floor(px / this.tileWidth + py / this.tileHeight)
    // console.log(N, M)
    console.log('\n')

    return {
      row: 0,
      column: 0
    }
  }
}