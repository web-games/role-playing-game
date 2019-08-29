import Node from '../Node'

export default class AStar {

  public outFilter: (node: any) => boolean

  public _openList: Node[] = [] // 开启列表
  public _closeList: Node[] = [] // 已经走过的节点

  private _straightCost: number = 1.0;   //横向代价
  private _diagCost: number = Math.SQRT2;//斜向代价

  constructor() {
  }

  public findPath(startRow: number, startCol: number, endRow: number, endCol: number) {
    console.log(startRow, startCol, ' --- ', endRow, endCol)

    let endNode = null
    let node = Node.getNode(null, startRow, startCol)

    let pathArr = null
    const MAX_EXTENDED_NODE_NUM = 150
    let loopCounter = 0
    while (loopCounter++ < MAX_EXTENDED_NODE_NUM) {
      // console.log("loopCounter:", loopCounter)

      this.findAddNeighbor(node, endRow, endCol)

      this._closeList.push(node)

      this._openList.sort((a, b) => {
        return a.f - b.f
      })

      node = this._openList.shift()
      if (!node) break
      console.log(node.row, node.col)

      if (node.row === endRow && node.col === endCol) {
        endNode = node
        break
      }
    }

    if (endNode) {
      pathArr = []
      while (endNode) {
        pathArr.push([endNode.row, endNode.col])
        endNode = endNode.parent
      }
    } else {
      console.log('没有找到路径！')
    }

    this._openList.forEach(ele => Node.deleteNode(ele))
    this._closeList.forEach(ele => Node.deleteNode(ele))
    this._openList.length = this._closeList.length = 0

    return pathArr
  }

  // 8方向节点信息
  private _cupPoints: Array<{ row: number, col: number, r: number, c: number, d: string, [propName: string]: any }> = [
    {row: 0, col: 0, r: -2, c: 0, d: "up"}, // 上
    {row: 0, col: 0, r: 2, c: 0, d: "down"}, // 下
    {row: 0, col: 0, r: 0, c: -1, d: "left"}, // 左
    {row: 0, col: 0, r: 0, c: 1, d: "right"}, // 右
    {row: 0, col: 0, r: -1, c: -1, d: "left_up"}, // 左上
    {row: 0, col: 0, r: -1, c: 0, d: "right_up"}, // 右上
    {row: 0, col: 0, r: 1, c: 0, d: "right_down"}, // 右下
    {row: 0, col: 0, r: 1, c: -1, d: "left_down"}, // 左下
  ]

  /**
   * 找出snode节点的8方向节点，根据条件放入到openList
   * */
  private findAddNeighbor(snode, endRow, endCol) {

    let f: number
    let g: number
    let h: number
    let cost: number

    this._cupPoints.forEach(ele => {
      ele.row = snode.row + ele.r
      ele.col = snode.col + ele.c

      if (ele.d === "left_up" || ele.d === "right_up" || ele.d === "right_down" || ele.d === "left_down") {
        ele.col += (snode.row & 1)
      }

      if (this.filterNeighbor(ele)) {

        // 设置移动一格代价值
        cost = this._straightCost
        /*if (!(snode.row === ele.row || snode.col === ele.col)) {
          cost = this._diagCost
        }*/
        if ((ele.d === 'up' || ele.d === 'down' || ele.d === 'left' || ele.d === 'right')) {
          cost = this._diagCost
        }

        g = snode.g + cost

        h = this.diagonal(ele.row, ele.col, endRow, endCol)

        f = g + h

        let node = this.listHas(this._openList, ele) || this.listHas(this._closeList, ele)
        if (node) {
          if (node.f > f) {
            node.f = f
            node.g = g
            node.h = h
            node.parent = snode
          }
        } else {
          node = Node.getNode(snode, ele.row, ele.col, f, g, h)
          this._openList.push(node)
        }
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

    return true
  }

  /**
   * 判断node是否在list中
   * */
  private listHas(list: Node[], node) {
    let res = list.find(ele => {
      return (ele.row === node.row && ele.col === node.col)
    })
    return res
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
