import StaggeredTiledMapView from "./StaggeredTiledMapView";
import Element from './Element'
import {userDataList} from './data'
import {NodeData} from "./NodeData";

export class Main extends Phaser.Scene {
  stMap: StaggeredTiledMapView

  constructor() {
    super({key: "Main"});
  }

  preload() {
    this.load.image('jiqiren', './static/assets/jiqiren.png')
    this.load.image('chugui', './static/assets/chugui.png')
  }

  create() {
    console.time('create start')
    // return;
    let stage1 = this.add.container(0, 0)
    stage1.name = 'stage1'

    let stMap = new StaggeredTiledMapView(this)
    stage1.add(stMap)
    this.stMap = stMap

    for (var i = 0; i < userDataList.length; i++) {
      let data = userDataList[i]
      var ele = new Element(this, data as NodeData)
      ele.tiledmap()
      ele.display()
      stage1.add(ele)
      stMap.mapData.setMultipleNodeState(data.originY,data.originX,data.rows,data.cols,1)
    }
  }
}