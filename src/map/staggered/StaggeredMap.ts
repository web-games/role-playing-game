/**
 * 45度交错地图
 * */
import MapNode from "../MapNode"

export default class StaggeredTiledMap {
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
    this.mapHeight = this.rows * (this.tileHeight / 2)
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
        x: (column * this.tileWidth) + (row & 1) * (this.tileWidth / 2),
        y: row * (this.tileHeight / 2)
      }
    }
  }

  /**
   * 坐标点转换到格子坐标
   * @param px 相对于地图左上角(0,0)点的x坐标
   * @param py 相对于地图左上角(0,0)点的y坐标
   * */
  public screen2map(px: number, py: number) {
    // console.log(px, py)

    var TileWidth: number = this.tileWidth
    var TileHeight: number = this.tileHeight

    var xtile = 0 // 网格的x坐标
    var ytile = 0 // 网格的y坐标

    var cx, cy, rx, ry

    // 计算出当前X所在的以tileWidth为宽的矩形的中心的X坐标
    cx = parseInt(String(px / TileWidth)) * TileWidth + TileWidth / 2
    // 计算出当前Y所在的以tileHeight为高的矩形的中心的Y坐标
    cy = parseInt(String(py / TileHeight)) * TileHeight + TileHeight / 2

    rx = (px - cx) * TileHeight / 2
    // console.log('纵向矩形面积 long:%f, wide:%f,rx:%f', (px - cx), TileHeight / 2, rx)
    ry = (py - cy) * TileWidth / 2
    // console.log('横向矩形面积 long:%f, wide:%f,ry:%f', TileWidth / 2, (py - cy), ry)

    // 当前点击面积，1/4矩形面积
    if (Math.abs(rx) + Math.abs(ry) <= TileWidth * TileHeight / 4) {// 在菱形区域内
      // xtile = int(pixelPoint.x / tileWidth) * 2;
      xtile = parseInt(String(px / TileWidth))
      ytile = parseInt(String(py / TileHeight)) * 2
    } else { // 不在菱形区域内
      px = px - TileWidth / 2
      // xtile = int(pixelPoint.x / tileWidth) * 2 + 1;
      xtile = parseInt(String(px / TileWidth)) + 1

      py = py - TileHeight / 2
      ytile = parseInt(String(py / TileHeight)) * 2 + 1
    }
    return {
      row: ytile,
      column: xtile - (ytile & 1)
    }
  }

  /**
   * 获取物品占位某一个点转换到地图上的点
   *
   * @param row 45度地图起始行
   * @param column 45度地图起始列
   * @param dRow 45度地图中的某一个点row
   * @param dRolumn 45度地图中的某一个点column
   * */
  public getDiamondTiledPoint(row, column, dRow, dColumn) {
    let rowIndex = (row + dColumn) + dRow
    let colIndex = Math.floor(((column * 2) + (row & 1) + dColumn - dRow) / 2)
    return {row: rowIndex, col: colIndex}
    console.log("getDiamondTiledPoint:", row, column, dRow, dColumn, " result:", rowIndex, colIndex)
  }

  /**
   * 设置单个网格的占位状态
   *
   * @param row 45度地图起始行
   * @param column 45度地图起始列
   * @retrun 设置节点MapNode
   * */
  public setOnceNodeState(row, column, state = 0) {
    if (!this.checkRowColumn(row, column)) return false
    let nodeData: MapNode = this.nodeList[row][column]
    nodeData.state = state
    return nodeData
  }

  /**
   * 设置45度地图网格 在 45度交错地图网格中的占位状态
   *
   * @param row 45度地图起始行
   * @param column 45度地图起始列
   * @param rows 行-单元格个数
   * @param columns 列-单元格个数
   * @state state {0 设置未占位， 1设置占位}
   * */
  public setMultipleNodeState(row, column, rows, columns, state = 0) {
    // console.log('setNodeState:', row, column, rows, columns, state)
    let i, j
    for (i = 0; i < rows; i++) {
      for (j = 0; j < columns; j++) {
        // 分别计算在M，N方向 行的偏移值
        let rowIndex = (row + j) + i
        if (rowIndex < 0 || rowIndex > this.rows - 1) {
          continue
        }
        // 1：（初始列*2 + j）/ 2 ,计算出当前对应的列
        // 2：+（row&1）, 当初始行是奇数行，初始列应该+1
        // 3：-i , 每增加一行,减去一列
        let colIndex = Math.floor(((column * 2) + (row & 1) + j - i) / 2)
        if (colIndex < 0 || colIndex > this.cols - 1) {
          continue
        }
        // console.log(colIndex, rowIndex)
        let nodeData: MapNode = this.nodeList[rowIndex][colIndex]
        if (nodeData) {
          // console.log(nodeData.row, nodeData.col)
          nodeData.state = state
        }
      }
      // console.log('\n')
    }
  }

  /**
   * 检测（45度地图网格）在（45度交错地图网格中）是否可放置
   *
   * @param row 45度地图起始行
   * @param column 45度地图起始列
   * @param rows 行-单元格个数
   * @param columns 列-单元格个数
   * @return {true | false}
   * */
  public hitTest(row, column, rows, columns) {
    if (!this.checkRowColumn(row, column)) return false
    // console.log('hitTest:', row, column, rows, columns)
    let i, j, bo = true
    for (i = 0; i < rows; i++) {
      for (j = 0; j < columns; j++) {
        let rowIndex = (row + j) + i
        let colIndex = Math.floor(((column * 2) + (row & 1) + j - i) / 2)
        if (!this.checkRowColumn(rowIndex, colIndex)) {
          bo = false
          break
        }

        let nodeData: MapNode = this.nodeList[rowIndex][colIndex]
        if (nodeData.state === 1) {
          bo = false
          break
        }
      }
      if (!bo) break
    }
    // console.log('bo:', bo)
    return bo
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