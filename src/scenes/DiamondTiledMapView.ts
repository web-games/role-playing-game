import MapNodeView from './MapNodeView'
import DiamondTiledMap from './DiamondTiledMap'

export default class DiamondTiledMapView extends Phaser.GameObjects.Container {
  scene
  dtMap: DiamondTiledMap

  constructor(scene: Phaser.Scene, dtMap: DiamondTiledMap) {
    super(scene)
    this.scene = scene
    this.dtMap = dtMap
  }

  fill(color = 0x52DDA3, alpha = 1) {
    for (var i = 0; i < this.dtMap.nodeList.length; i++) {
      let arr = this.dtMap.nodeList[i];
      for (var j = 0; j < arr.length; j++) {
        let node = arr[j]
        let rhombusView = new MapNodeView(this.scene, node, color, alpha)
        this.add(rhombusView)
        node.ele = rhombusView
      }
    }
  }
}