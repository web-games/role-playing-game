import StaggeredTiledMapView from "./StaggeredTiledMapView";
import Element from './Element'
import {userDataList} from './data'
import {NodeData} from "./NodeData";
import {ScrollView} from "./ScrollView";

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
    // return;
    let stage1 = this.add.container(0, 0)
    stage1.name = 'stage1'

    let stMap = new StaggeredTiledMapView(this)
    stage1.add(stMap)
    this.stMap = stMap
    console.log(this.stMap.mapData.mapWidth, this.stMap.mapData.mapHeight)

    let scrollView = new ScrollView({
      content:stMap,
      wrapperWidth:this.game.config.width,
      wrapperHeight:this.game.config.height,
      scrollerWidth:this.stMap.mapData.mapWidth - this.stMap.mapData.tileWidth / 2,
      scrollerHeight:this.stMap.mapData.mapHeight - this.stMap.mapData.tileHeight / 2
    })

    let eleContainer = this.add.container(0, 0)
    stage1.add(eleContainer)

    for (var i = 0; i < userDataList.length; i++) {
      let data = userDataList[i]
      var ele = new Element(this, data as NodeData)
      ele.tiledmap()
      ele.display()
      eleContainer.add(ele)
      stMap.mapData.setMultipleNodeState(data.originY, data.originX, data.rows, data.cols, 1)
    }

    eleContainer.x = stMap.x = -stMap.mapData.tileWidth / 2
    eleContainer.y = stMap.y = -stMap.mapData.tileHeight / 2
  }
}