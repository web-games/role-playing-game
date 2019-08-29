export default class Node {
  private static nodelist: Node[] = []

  public parent: Node;
  public row;
  public col;

  public f; // 和值（走到终点消耗的代价值）
  public g; // 移动到 上、下、左、右、左上、右上、右下、左下、各点所需的权重值
  public h; // 上、下、左、右、左上、右上、右下、左下、各点到终点的预计权重值

  constructor(p = null, r = 0, c = 0, f = 0, g = 0, h = 0) {
    this.parent = p
    this.row = r
    this.col = c
    this.f = f
    this.g = g
    this.h = h
  }

  public static getNode(p = null, row = 0, col = 0, f = 0, g = 0, h = 0) {
    let n = this.nodelist.pop()
    if (n) {
      n.parent = p
      n.row = row
      n.col = col
      n.f = f
      n.g = g
      n.h = h
    } else {
      n = new Node(p, row, col, f, g, h)
    }
    return n
  }

  public static deleteNode(n: Node) {
    if (!n) return
    n.parent = null
    n.row = n.col = n.g = n.h = n.f = null
    this.nodelist.push(n)
  }
}