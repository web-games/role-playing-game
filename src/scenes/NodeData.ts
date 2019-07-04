interface NodeData {
  originX?: number,
  originY?: number,
  rows?: number,
  cols?: number,
  anchorX?: number,
  anchorY?: number,
  img?: any,
  height?:any,
  children:{
    height?:number,
    row?:number,
    col?:number
  }
}

export {NodeData}