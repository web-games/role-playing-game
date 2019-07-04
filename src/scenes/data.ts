import MapNode from "./MapNode";

let userDataList = [
  {rows: 5, cols: 5, originY: 15, originX: 5, anchorX: 77, anchorY: 190, img: 'jiqiren'},
  // {row: 1, col: 1, originX: 10, originY: 10, anchorX: 77, anchorY: 190, img: 'jiqiren'},
  {rows: 2, cols: 2, originY: 14, originX: 4, anchorX: 100, anchorY: 219, img: 'jiqiren'},
  // {row: 3, col: 3, originX: 8, originY: 14, anchorX: 77, anchorY: 190, img: 'jiqiren'},
  // {row: 4, col: 4, originX: 4, originY: 4, anchorX: 84, anchorY: 177, img: 'jiqiren'},
  // {
  //   row: 5, col: 5, originX: 8, originY: 8, anchorX: 190, anchorY: 186, img: 'chugui',
  //   children: {
  //     height:4,
  //     row:5,
  //     col:5
  //   }
  // },
]

export {userDataList}

/**
 * 设置45度地图 在 45度交错地图中的占位状态
 * @param row 45度地图起始行
 * @param column 45度地图起始列
 * @param rows 行-单元格个数
 * @param columns 列-单元格个数
 * */
// setNodeState(row, column, rows, columns, state = 0) {
//   // console.log('setNodeState:', row, column, rows, columns, state)
//   let i, j;
//   for (i = 0; i < rows; i++) {
//     for (j = 0; j < columns; j++) {
//       let rowIndex = (row + j) + i
//       let colIndex = Math.floor(rowIndex / 2) - i
//
//       let nodeData:MapNode = this.nodeList[rowIndex][colIndex]
//       nodeData.state = state
//       console.log(nodeData.row, nodeData.col)
//     }
//     console.log('\n')
//   }
// }