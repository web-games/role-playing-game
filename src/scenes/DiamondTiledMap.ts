import MapNodeView from './MapNodeView'
import {NodeData} from './NodeData'
import MapNode from "./MapNode";

/**
 * 45度地图坐标
 * */
export default class DiamondTiledMap extends Phaser.GameObjects.Container {
  scene
  mdata: NodeData
  row
  col

  constructor(scene: Phaser.Scene, data: NodeData) {
    super(scene)
    this.scene = scene
    this.mdata = data

    let {row, col, height} = this.mdata
    this.row = row
    this.col = col

    let tileWidth = 100;
    let tileHeight = 50;

    let m_r = tileWidth / 2
    let m_d = tileHeight / 2

    let n_l = -tileWidth / 2
    let n_d = tileHeight / 2

    let i, j;
    let x, y;
    for (i = 0; i < col; i++) {
      for (j = 0; j < row; j++) {
        x = i * m_r + j * n_l
        y = i * m_d + j * n_d

        var node = new MapNode({
          x: x,
          y: y,
          col:i,
          row:j,
          width: tileWidth,
          height: tileHeight
        })

        let rhombus = new MapNodeView(scene, node, 0x52DDA3, 0.5)
        this.add(rhombus)
      }
    }

    height = height || 0
    this.y = -height * tileHeight
  }
}