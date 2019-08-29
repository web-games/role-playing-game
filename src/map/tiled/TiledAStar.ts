import Node from "../Node"

export default class AStar {

  public outFilter: (node: any) => boolean
  public openList: Node[] = [] // 开启列表
  public closeList: Node[] = [] // 已经走过的节点

  // 8方向节点信息
  private cupPoints: Array<{ row: number, col: number, r: number, c: number, g: number, d: string }> = [
    {row: 0, col: 0, r: -1, c: 0, g: 10, d: "up"}, // 上
    {row: 0, col: 0, r: 1, c: 0, g: 10, d: "down"}, // 下
    {row: 0, col: 0, r: 0, c: -1, g: 10, d: "left"}, // 左
    {row: 0, col: 0, r: 0, c: 1, g: 10, d: "right"}, // 右
    {row: 0, col: 0, r: -1, c: -1, g: 14, d: "left_up"}, // 左上
    {row: 0, col: 0, r: -1, c: 1, g: 14, d: "right_up"}, // 右上
    {row: 0, col: 0, r: 1, c: 1, g: 14, d: "right_down"}, // 右下
    {row: 0, col: 0, r: 1, c: -1, g: 14, d: "right_down"}, // 左下
  ]

  constructor() {
  }

  public findPath(startRow: number, startCol: number, endRow: number, endCol: number) {
    let endNode = null
    let startNode = new Node(null, startRow, startCol, 0)
    this.closeList.push(startNode)

    let pathArr = null
    const MAX_EXTENDED_NODE_NUM = 150
    let loopCounter = 0
    while (loopCounter++ < MAX_EXTENDED_NODE_NUM) {
      // console.log("loopCounter:", loopCounter)

      let snode = this.closeList[this.closeList.length - 1]

      this.findAddNeighbor(snode, endRow, endCol)

      // 对openList中的节点进行（和值）冒泡排序
      this.openList.sort((a, b) => {
        return a.f - b.f
      })

      // 拿出（和值）最小的节点
      let node = this.openList.shift()
      if (!node) break
      console.log(node.row, node.col)

      // 找到了 目标点
      if (node.row === endRow && node.col === endCol) {
        endNode = node
        break
      }

      // 从open表中删除加入close表
      this.closeList.push(node)
    }

    if (endNode) {
      pathArr = []
      while (endNode) {
        pathArr.push({row: endNode.row, col: endNode.col})
        endNode = endNode.parent
      }
    } else {
      console.log('没有找到路径！')
    }

    this.openList.forEach(ele => Node.deleteNode(ele))
    this.closeList.forEach(ele => Node.deleteNode(ele))
    this.openList.length = this.closeList.length = 0

    return pathArr
  }

  /**
   * 找出snode节点的8方向节点，并放入到openList
   * */
  private findAddNeighbor(snode, endRow, endCol) {
    this.cupPoints.forEach(ele => {
      ele.row = snode.row + ele.r
      ele.col = snode.col + ele.c

      if (this.filterNeighbor(ele)) {
        let node = Node.getNode(snode, ele.row, ele.col)
        node.g = ele.g + snode.g
        node.h = this.diagonal(ele.row, ele.col, endRow, endCol)
        node.f = node.g + node.h
        node.parent = snode
        this.openList.push(node)
      }
    })
  }

  /**
   * 判断节点是否可以被放到入open表
   * */
  private filterNeighbor(node) {
    // console.log(node.row, node.col)
    if ((node.row < 0 || node.row > 10 - 1) || (node.col < 0 || node.col > 10 - 1)) return false

    if (this.outFilter && this.outFilter(node)) return false

    if (this.listHas(this.openList, node) || this.listHas(this.closeList, node)) return false

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

  private diagonal(row1, col1, row2, col2): number {
    return (Math.abs(row1 - row2) + Math.abs(col1 - col2)) * 10
  }
}
