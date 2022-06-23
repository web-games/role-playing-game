import Node from '../Node'

export default class AStar {

  public outFilter: (node: any) => boolean

  public _openList: Node[] = [] // 开启列表
  public _closeList: Node[] = [] // 已经走过的节点

  private _straightCost: number = 1.0;
  private _diagCost: number = Math.SQRT2;

  // 8方向节点信息
  // row 当前八方向节点的行
  // col 当前八方向节点的列
  // r 八方向节点与当前节点的row的差值
  // c 八方向节点与当前节点的rol的差值
  // g 八方向节点的权值
  // d 八方向节点的在当前节点的方向值
  private _cupPoints: Array<{ row: number, col: number, r: number, c: number, d: string, [propName: string]: any }> = [
    // 横向代价1.0
    {row: 0, col: 0, r: -1, c: +1, g: 1.0, d: "up"},    // 上 行-1，如果当前节点行是基数，则列+1，反之则等于当前节点列
    {row: 0, col: 0, r: +1, c: -1, g: 1.0, d: "down"},  // 下 行+1，如果当前节点行是偶数，则列-1，反之则等于当前节点列
    {row: 0, col: 0, r: -1, c: -1, g: 1.0, d: "left"},  // 左 行-1，如果当前节点行是偶数，则列-1，反之则等于当前节点列
    {row: 0, col: 0, r: +1, c: +1, g: 1.0, d: "right"}, // 右 行+1，如果当前节点行是基数，则列+1，反之则等于当前节点列

    // 斜向代价 Math.sqrt(1*1+1*1) = 1.4142135623730951
    {row: 0, col: 0, r: -2, c: +0, g: Math.SQRT2, d: "left_up"},    // 左上
    {row: 0, col: 0, r: +0, c: +1, g: Math.SQRT2, d: "right_up"},   // 右上
    {row: 0, col: 0, r: +0, c: -1, g: Math.SQRT2, d: "left_down"},  // 左下
    {row: 0, col: 0, r: +2, c: +0, g: Math.SQRT2, d: "right_down"}, // 右下
  ]

  public findPath(startRow: number, startCol: number, endRow: number, endCol: number) {
    console.log('start:', startRow, startCol, ' to:', endRow, endCol)
    const MAX_EXTENDED_NODE_NUM = 150
    let loopCounter = 0
    let endNode = null
    let node = Node.getNode(null, startRow, startCol)

    while (loopCounter++ < MAX_EXTENDED_NODE_NUM) {
      // console.log("loopCounter:", loopCounter)

      this.findAddNeighbor(node, endRow, endCol)

      // 对openList中的节点进行（和值）冒泡排序
      this._openList.sort((a, b) => {
        return a.f - b.f
      })

      // 拿出（和值）最小的节点
      node = this._openList.shift()
      if (!node) break
      // console.log(node.row, node.col)

      if (node.row === endRow && node.col === endCol) {
        endNode = node
        break
      }

      this._closeList.push(node)
    }

    let pathArr = null
    if (endNode) {
      pathArr = []
      while (endNode) {
        pathArr.push([endNode.row, endNode.col, endNode.d])
        endNode = endNode.parent
      }
    } else {
      console.log('没有找到路径！')
    }

    this._openList.forEach(ele => Node.deleteNode(ele))
    this._closeList.forEach(ele => Node.deleteNode(ele))
    this._openList.length = this._closeList.length = 0

    console.log('pathArr:', pathArr)

    return pathArr
  }

  /**
   * 找出snode节点的8方向节点，根据条件放入到openList
   * */
  private findAddNeighbor(snode, endRow, endCol) {
    this._cupPoints.forEach(ele => {
      if (ele.d === 'up' || ele.d === 'down' || ele.d === 'left' || ele.d === 'right') {
        ele.row = snode.row + ele.r

        if (((ele.d === 'up' || ele.d === 'right') && snode.row % 2 !== 0) || ((ele.d === 'down' || ele.d === 'left') && snode.row % 2 === 0)) {
          ele.col = snode.col + ele.c
        } else {
          ele.col = snode.col
        }
      } else {
        ele.row = snode.row + ele.r
        ele.col = snode.col + ele.c
      }

      if (this.filterNeighbor(ele)) {
        let node = Node.getNode(snode, ele.row, ele.col)
        node.g = snode.g + ele.g
        node.h = this.diagonal(ele.row, ele.col, endRow, endCol)
        node.f = node.g + node.h
        node.d = ele.d
        node.parent = snode;
        this._openList.push(node)
      }
    })
  }

  /**
   * 判断节点是否可以被放到入open表
   * */
  private filterNeighbor(node) {
    // console.log(node.row, node.col)
    if ((node.row < 0 || node.row > 20 - 1) || (node.col < 0 || node.col > 6 - 1)) return false

    if (this.outFilter && this.outFilter(node)) return false

    if (this.listHas(this._openList, node) || this.listHas(this._closeList, node)) return false

    return true
  }

  /**
   * 判断node是否在list中
   * */
  private listHas(list: Node[], node) {
    let res = list.find(ele => {
      return (ele.row === node.row && ele.col === node.col)
    })
    if (res) return true
    return false
  }

  /**
   * 对角启发函数
   * @param node
   * @return
   */
  private diagonal(row1, col1, row2, col2): number {
    var dx: number = Math.abs(col1 - col2);
    var dy: number = Math.abs(row1 - row2);
    var diag: number = Math.min(dx, dy);
    var straight: number = dx + dy;

    return this._diagCost * diag + this._straightCost * (straight - 2 * diag);
  }
}