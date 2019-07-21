import StaggeredTiledMapView from "./StaggeredTiledMapView";
import Element from './Element'
import {userDataList} from './data'
import {NodeData} from "./NodeData";
import {ScrollView} from "./ScrollView";

export class Main extends Phaser.Scene {
  stMap: StaggeredTiledMapView

  layer
  constructor() {
    super({key: "Main"});
  }

  preload() {
    this.load.image('jiqiren', './static/assets/jiqiren.png')
    this.load.image('chugui', './static/assets/chugui.png')
    this.load.image('chugui', './static/assets/chugui.png')
    this.load.image('tile', './static/assets/tile.png')
  }

  create() {
    // return;
    let stage1 = this.add.container(0, 0)
    stage1.name = 'stage1'

    let stMap = new StaggeredTiledMapView(this)
    stage1.add(stMap)
    this.stMap = stMap
    console.log(this.stMap.mapData.mapWidth, this.stMap.mapData.mapHeight)


    var map = this.make.tilemap({width: 2, height: 2, tileWidth: 200, tileHeight: 200});
    var tiles = map.addTilesetImage('tile');
    var layer = map.createBlankDynamicLayer('layer1', tiles, 0, 0);
    layer.randomize(0, 0, map.width, map.height, [0]);
    layer.alpha = 0
    this.layer = layer

    let scrollView = new ScrollView({
      content: stMap,
      layer,
      wrapperWidth: this.game.config.width,
      wrapperHeight: this.game.config.height,
      scrollerWidth: this.stMap.mapData.mapWidth - this.stMap.mapData.tileWidth / 2,
      scrollerHeight: this.stMap.mapData.mapHeight - this.stMap.mapData.tileHeight / 2
    })

    let eleContainer = this.add.container(0, 0)
    stage1.add(eleContainer)

    for (var i = 0; i < userDataList.length; i++) {
      let data = userDataList[i]
      var ele = new Element(this, data as NodeData)
      ele.display()
      eleContainer.add(ele)

      let p = ele.getMapXY(ele.currentRow, ele.currentCol)
      ele.x = p.x
      ele.y = p.y
      stMap.mapData.setMultipleNodeState(data.row, data.col, data.rows, data.cols, 1)

      if (data.children) {
        ele.tiledmap()

        var childrenEle = new Element(this, data.children as NodeData)
        childrenEle.display()
        ele.childrenContainer.add(childrenEle)
        let p = ele.diamondTileMap.map2screen(childrenEle.currentRow, childrenEle.currentCol)
        childrenEle.x = p.x
        childrenEle.y = p.y
        childrenEle.parentGoods = ele
      }
    }

    eleContainer.x = stMap.x = -stMap.mapData.tileWidth / 2
    eleContainer.y = stMap.y = -stMap.mapData.tileHeight / 2
  }
}