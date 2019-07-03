export default class StaggeredTiledMap {
  row: number;
  col: number;

  // Tile的坐标原点在菱形的左上角
  tileWidth: number;
  tileHeight: number;

  mapWidth: number;
  mapHeight: number;
  nodeList: Array<any> = [];

  constructor() {
    let row = this.row = 50 // 宽-单元格个数
    let col = this.col = 20 // 高-单元格个数
    let w = this.tileWidth = 100 // 单元格宽
    let h = this.tileHeight = 50 // 单元格高
    for (var i = 0; i < row; i++) {
      let arr = []
      for (var j = 0; j < col; j++) {
        let p = this.map2screen(i,j)
        arr.push(p)
      }
      this.nodeList.push(arr)
    }
    this.mapWidth = this.col * this.tileWidth + (this.tileWidth / 2)
    this.mapHeight = this.row * (this.tileHeight / 2) + (this.tileHeight / 2)
  }

  /**
   * 格子坐标转换到坐标点
   * */
  map2screen(rowNum, columnNum) {
    // console.log('rowNum:%d,columnNum:%d', rowNum, columnNum)
    return {
      x: (columnNum * this.tileWidth) + (rowNum & 1) * (this.tileWidth / 2),
      y: rowNum * (this.tileHeight / 2)
    }
  }

  /**
   * 坐标点转换到格子坐标
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
      rowNum: ytile,
      columnNum: xtile - (ytile & 1)
    }
  }
}