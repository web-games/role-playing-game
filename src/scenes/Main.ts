import StaggeredTiledMap from "./StaggeredTiledMap";
import Element from './Element'
import {userDataList} from './data'

export class Main extends Phaser.Scene {
    stMap: StaggeredTiledMap

    constructor() {
        super({key: "Main"});
    }

    preload() {
        this.load.image('tmw_desert_spacing', './static/assets/tmw_desert_spacing.png')
        this.load.image('bunny', './static/assets/bunny.png')
        this.load.image('eye', './static/assets/flowerTop2.png')
        this.load.image('map', './static/assets/concept1_img1.png')
        this.load.image('jqr', './static/assets/jiqirenl3_1.png')
    }

    create() {
        console.time('create start')
        // return;
        let stage1 = this.add.container(0, 0)
        stage1.name = 'stage1'

        let stMap = new StaggeredTiledMap(this)
        stage1.add(stMap)
        this.stMap = stMap

        for (var i = 0; i < userDataList.length; i++) {
            let userdata = userDataList[i]
            let {x,y} = stMap.mapData.map2screen(userdata.originY,userdata.originX)
            var ele = new Element(this, userdata)
            ele.x = x
            ele.y = y
            ele.tiledmap()
            ele.display()
            stage1.add(ele)
        }
    }
}