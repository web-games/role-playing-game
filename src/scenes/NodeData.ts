interface NodeData {
  row?: number,
  col?: number,
  rows?: number,
  cols?: number,
  anchorX?: number,
  anchorY?: number,
  img?: any,
  height?: any,
  children: {
    height?: number,
    row?: number,
    col?: number,
    img?: any
  }
}

export {NodeData}

