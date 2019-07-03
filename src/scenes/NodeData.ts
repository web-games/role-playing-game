interface NodeData {
  originX?: number,
  originY?: number,
  row?: number,
  col?: number,
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