import StaggeredTiledMapView from "../../map/StaggeredTiledMapView";
import Element from './Element'
import {userDataList} from './data'
import {NodeData} from "./NodeData";
import {ScrollView} from "./ScrollView";

export default class MapScene extends Phaser.Scene {
  stMap: StaggeredTiledMapView

  layer

  constructor() {
    super({key: "Main"});
  }

  preload() {
    this.load.image('floor', './static/assets/floor.png')
    this.load.image('jiqiren', './static/assets/jiqiren.png')
    this.load.image('chugui', './static/assets/chugui.png')
    this.load.image('chugui', './static/assets/chugui.png')
    this.load.image('tile', './static/assets/tile.png')
    this.load.image('dangao', './static/assets/dangaoL2_0_2x2.png')
    this.load.image('xiaoaigui', './static/assets/xiaoaiguiL2_1_2x2.png')
    this.load.image('knighthawks', './static/assets/knight3.png')

    this.load.image('shuzi_0.png', './static/assets/home/shuzi_0.png')
    this.load.image('shuzi_1.png', './static/assets/home/shuzi_1.png')
    this.load.image('shuzi_2.png', './static/assets/home/shuzi_2.png')
    this.load.image('shuzi_3.png', './static/assets/home/shuzi_3.png')
    this.load.image('shuzi_4.png', './static/assets/home/shuzi_4.png')
    this.load.image('shuzi_5.png', './static/assets/home/shuzi_5.png')
    this.load.image('shuzi_6.png', './static/assets/home/shuzi_6.png')
    this.load.image('shuzi_7.png', './static/assets/home/shuzi_7.png')
    this.load.image('shuzi_8.png', './static/assets/home/shuzi_8.png')
    this.load.image('shuzi_9.png', './static/assets/home/shuzi_9.png')
    this.load.image('shuzi_x.png', './static/assets/home/shuzi_x.png')
    this.load.image('sp_01.png', './static/assets/home/sp_01.png')
    this.load.image('sp_02.png', './static/assets/home/sp_02.png')
    // this.load.image('sp_03.png', './static/assets/home/sp_03.png')
    this.load.image('sp_04.png', './static/assets/home/sp_04.png')
    this.load.image('sp_number.png', './static/assets/home/sp_number.png')
  }

  create() {
    // this.playGetAnimate()
    // return
    var map = this.make.tilemap({width: 4, height: 2, tileWidth: 200, tileHeight: 200});
    var tiles = map.addTilesetImage('floor');
    var layer = map.createBlankDynamicLayer('layer1', tiles, 0, 0);
    layer.randomize(0, 0, map.width, map.height, [0]);
    // layer.alpha = 0
    this.layer = layer

    // return;
    let stage1 = this.add.container(0, 0)
    stage1.name = 'stage1'

    let stMap = new StaggeredTiledMapView(this)
    stage1.add(stMap)
    this.stMap = stMap
    console.log(this.stMap.mapData.mapWidth, this.stMap.mapData.mapHeight)

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

      if (data['children']) {
        ele.tiledmap()

        var childrenEle = new Element(this, data['children'])
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

  playGetAnimate() {
    let stage2 = this.add.container(0, 0)
    let blackBg = this.add.graphics()
      .fillStyle(0x000000, 0.7)
      .fillRect(0, 0, 1024, 768)
      .setInteractive(new Phaser.Geom.Rectangle(0, 0, 1024, 768), Phaser.Geom.Rectangle.Contains)
    stage2.add(blackBg)

    let TimelineMax = window['TimelineMax']
    let TweenMax = window['TweenMax']
    let Elastic = window['Elastic']
    let Power0 = window['Power0']
    let Power2 = window['Power2']
    let amContainer = this.add.container(1024 / 2, 768 / 2)
    stage2.add(amContainer)
    let sp01 = this.add.image(0, 0, 'sp_01.png')
    TweenMax.to(sp01, 3, {rotation: Math.PI / 180 * 360, ease: Power0.easeNone, repeat: 1})
    let sp02 = this.add.image(0, 0, 'sp_02.png')
    amContainer.add([sp01, sp02])
    var config = {
      image: 'sp_number.png',
      'offset.x': 0,
      'offset.y': 0,
      width: 32,
      height: 48,
      chars: '0123456789x',
      charsPerRow: 11,
      "spacing.x": 0,
      "spacing.y": 0,
      lineSpacing: 0
    };
    this.cache.bitmapFont.add('knighthawks', Phaser.GameObjects.RetroFont.Parse(this, config));
    let bmt = this.add.bitmapText(0, -115, 'knighthawks', 'x20').setOrigin(0.5);
    amContainer.add(bmt)

    let coords = [
      {x: 0, y: 0, s: 1, r: 8},
      {x: 35, y: 45, s: 0.8, r: 25},
      {x: -50, y: 0, s: 0.8, r: 14},
      {x: 50, y: 15, s: 0.8, r: 15},
      {x: -40, y: 40, s: 0.8, r: 2},
    ]
    let i = 0, len = coords.length;
    let juanArr = []
    for (i; i < len; i++) {
      let c = coords[i]
      let sp04 = this.add.image(c.x, c.y, 'sp_04.png').setRotation(Math.PI / 180 * c.r)
      amContainer.addAt(sp04, 2)
      TweenMax.fromTo(sp04, 1.2, {scaleX: 0, scaleY: 0, alpha: 0}, {
        scaleX: c.s,
        scaleY: c.s,
        alpha: 1,
        delay: Math.random() * 0.3 + .3,
        ease: Elastic.easeOut
      })
      juanArr.push(sp04)
    }

    let t1 = new TimelineMax({
      onComplete: () => {
        console.log('onComplete')
        TweenMax.to(juanArr, 1, {
          x: 880 - (1024 / 2),
          y: 20 - (768 / 2),
          scaleX: 0,
          scaleY: 0,
          alpha: 0,
          delay: Math.random() * 0.3,
          ease: Power2.easeOut
        })
        TweenMax.to(stage2, 1, {alpha: 0, ease: Power2.easeOut, delay: 0.5})
      }
    })
    t1.fromTo(sp01, 1.2, {scaleX: 0, scaleY: 0, alpha: 0}, {scaleX: 1, scaleY: 1, alpha: 1, ease: Elastic.easeOut})
    t1.fromTo(sp02, 1, {scaleX: 0, scaleY: 0, alpha: 0}, {scaleX: 1, scaleY: 1, alpha: 1, ease: Elastic.easeOut}, '-=1')
    t1.fromTo(bmt, 1, {scaleX: 0, scaleY: 0, alpha: 0}, {scaleX: 1, scaleY: 1, alpha: 1, ease: Elastic.easeOut}, '-=.2')
  }
}