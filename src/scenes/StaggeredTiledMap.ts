/**
 * 45度交错地图坐标
 * */
import MapNode from "./MapNode";

export default class StaggeredTiledMap {
  rows: number;// 行-单元格个数
  cols: number;// 列-单元格个数

  // Tile的坐标原点在菱形的左上角
  tileWidth: number;
  tileHeight: number;

  mapWidth: number;// 单元格宽
  mapHeight: number;// 单元格高
  nodeList: Array<any> = [];

  constructor() {
    let rows = this.rows = 50
    let cols = this.cols = 20
    let w = this.tileWidth = 100
    let h = this.tileHeight = 50
    for (var i = 0; i < rows; i++) {
      let arr: Array<MapNode> = []
      for (var j = 0; j < cols; j++) {
        let p = this.map2screen(i, j)

        let node = new MapNode({
          x: p.x,
          y: p.y,
          row: i,
          col: j,
          width: w,
          height: h,
          state: 0
        })
        arr.push(node)
      }
      this.nodeList.push(arr)
    }
    this.mapWidth = this.cols * this.tileWidth + (this.tileWidth / 2)
    this.mapHeight = this.rows * (this.tileHeight / 2) + (this.tileHeight / 2)
  }

  /**
   * 格子坐标转换到坐标点
   * */
  map2screen(row, column) {
    // console.log('row:%d,column:%d', row, column)
    return {
      x: (column * this.tileWidth) + (row & 1) * (this.tileWidth / 2),
      y: row * (this.tileHeight / 2)
    }
  }

  /**
   * 坐标点转换到格子坐标
   * @param px 相对于地图左上角(0,0)点的x坐标
   * @param py 相对于地图左上角(0,0)点的y坐标
   * */
  screen2map(px: number, py: number) {
    // console.log(px, py)

    var TileWidth: number = this.tileWidth
    var TileHeight: number = this.tileHeight

    var xtile = 0; //网格的x坐标
    var ytile = 0; //网格的y坐标

    var cx, cy, rx, ry;

    //计算出当前X所在的以tileWidth为宽的矩形的中心的X坐标
    cx = parseInt(String(px / TileWidth)) * TileWidth + TileWidth / 2;
    //计算出当前Y所在的以tileHeight为高的矩形的中心的Y坐标
    cy = parseInt(String(py / TileHeight)) * TileHeight + TileHeight / 2;

    rx = (px - cx) * TileHeight / 2;
    // console.log('纵向矩形面积 long:%f, wide:%f,rx:%f', (px - cx), TileHeight / 2, rx)
    ry = (py - cy) * TileWidth / 2;
    // console.log('横向矩形面积 long:%f, wide:%f,ry:%f', TileWidth / 2, (py - cy), ry)

    // 当前点击面积，1/4矩形面积
    if (Math.abs(rx) + Math.abs(ry) <= TileWidth * TileHeight / 4) {// 在菱形区域内
      //xtile = int(pixelPoint.x / tileWidth) * 2;
      xtile = parseInt(String(px / TileWidth));
      ytile = parseInt(String(py / TileHeight)) * 2;
    } else { // 不在菱形区域内
      px = px - TileWidth / 2;
      //xtile = int(pixelPoint.x / tileWidth) * 2 + 1;
      xtile = parseInt(String(px / TileWidth)) + 1;

      py = py - TileHeight / 2;
      ytile = parseInt(String(py / TileHeight)) * 2 + 1;
    }

    // console.log(xtile - (ytile & 1), ytile,'\n');

    return {
      row: ytile,
      column: xtile - (ytile & 1)
    }
  }

  /**
   * 设置单个网格的占位状态
   * @param row 45度地图起始行
   * @param column 45度地图起始列
   * */
  setOnceNodeState(row, column, state = 0) {
    let nodeData: MapNode = this.nodeList[row][column]
    nodeData.state = state
    return nodeData
  }

  /**
   * 设置45度地图网格 在 45度交错地图网格中的占位状态
   * @param row 45度地图起始行
   * @param column 45度地图起始列
   * @param rows 行-单元格个数
   * @param columns 列-单元格个数
   * @state state {0 设置未占位， 1设置占位}
   * */
  setMultipleNodeState(row, column, rows, columns, state = 0) {
    // console.log('setNodeState:', row, column, rows, columns, state)
    let i, j;
    for (i = 0; i < rows; i++) {
      for (j = 0; j < columns; j++) {
        let rowIndex = (row + j) + i
        let colIndex = column + Math.floor((j + (rowIndex % 2 === 0 ? 1 : 0)) / 2) - Math.floor(i / 2)
        let nodeData: MapNode = this.nodeList[rowIndex][colIndex]
        // console.log(nodeData.row, nodeData.col)
        nodeData.state = state
      }
      // console.log('\n')
    }
  }

  /**
   * 检测（45度地图网格）在（45度交错地图网格中）是否可放置
   * */
  hitTest(row, column, rows, columns) {
    // console.log('hitTest:', row, column, rows, columns)
    let bo = true
    let i, j;
    for (i = 0; i < rows; i++) {
      for (j = 0; j < columns; j++) {
        let rowIndex = (row + j) + i
        let colIndex = column + Math.floor((j + (rowIndex % 2 === 0 ? 1 : 0)) / 2) - Math.floor(i / 2)
        let nodeData: MapNode = this.nodeList[rowIndex][colIndex]
        if (nodeData.state === 1) {
          bo = false;
          break;
        }
      }
      if (!bo) break;
    }
    return bo
  }
}