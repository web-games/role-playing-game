import MapNode from "./MapNode";

let userDataList = [
  {rows: 1, cols: 1, originY: 6, originX: 2, anchorX: 77, anchorY: 190, img: 'jiqiren'},
  {rows: 2, cols: 2, originY: 8, originX: 3, anchorX: 77, anchorY: 190, img: 'jiqiren'},
  {rows: 3, cols: 3, originY: 12, originX: 5, anchorX: 77, anchorY: 190, img: 'jiqiren'},
  // {rows: 5, cols: 5, originY: 13, originX: 3, anchorX: 77, anchorY: 190, img: 'jiqiren'},
  // {row: 3, col: 3, originX: 8, originY: 14, anchorX: 77, anchorY: 190, img: 'jiqiren'},
  // {row: 4, col: 4, originX: 4, originY: 4, anchorX: 84, anchorY: 177, img: 'jiqiren'},
  {
    rows: 5, cols: 5, originY: 17, originX: 7, anchorX: 190, anchorY: 282, img: 'chugui',
    children: {
      height:4,
      rows:5,
      cols:5
    }
  },
]

export {userDataList}