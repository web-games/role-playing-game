import MapNodeView from './MapNodeView'
import StaggeredTiledMap from "./StaggeredTiledMap";

export default class StaggeredTiledMapView extends Phaser.GameObjects.Container {
  scene

  mapData: StaggeredTiledMap

  constructor(scene: Phaser.Scene) {
    super(scene)

    this.scene = scene

    this.mapData = new StaggeredTiledMap()

    for (var i = 0; i < this.mapData.nodeList.length; i++) {
      let arr = this.mapData.nodeList[i];
      for (var j = 0; j < arr.length; j++) {
        let node = arr[j]
        let rhombusView = new MapNodeView(scene, node,0xfafafa,0.01)
        this.add(rhombusView)
        node.ele = rhombusView
      }
    }
  }
}
