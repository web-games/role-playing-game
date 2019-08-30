import PhaserButton from "../../component/UI/PhaserButton";
import TiledMapScene from "../tiledMap/TiledMapScene";
import StaggeredMapScene from "../staggeredMap/StaggeredMapScene";

export default class HomeScene extends Phaser.Scene {
  public static NAME: string = "home_scene"

  btn1
  btn2
  btn3

  constructor() {
    super({key: HomeScene.NAME})
  }

  create() {
    let btn1 = new PhaserButton({
      scene: this,
      x: 100,
      y: 100,
      w:180,
      hotArea: true,
      text: {t: '普通直角地图', s: {fontSize: '24px'}}
    })
    this.add.existing(btn1)
    this.btn1 = btn1

    let btn2 = new PhaserButton({
      scene: this,
      x: 100,
      y: 200,
      w:180,
      hotArea: true,
      text: {t: '45度地图', s: {fontSize: '24px'}}
    })
    this.add.existing(btn2)
    this.btn2 = btn2

    let btn3 = new PhaserButton({
      scene: this,
      x: 100,
      y: 300,
      w:180,
      hotArea: true,
      text: {t: '45度交错地图', s: {fontSize: '24px'}}
    })
    this.add.existing(btn3)
    this.btn3 = btn3

    this.btn1.on('pointertap', () => {
      this.scene.start(TiledMapScene.NAME)
    })
    this.btn2.on('pointertap', () => {
      alert('待添加.')
    })
    this.btn3.on('pointertap', () => {
      this.scene.start(StaggeredMapScene.NAME)
    })
  }
}