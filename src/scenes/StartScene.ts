import PhaserButton from "../component/UI/PhaserButton";

export default class StartScene extends Phaser.Scene {
  public static ADD_MONEY: string = 'add_money'
  public static SUB_MONEY: string = 'sub_money'
  public titleText
  public addBtn
  public subBtn

  public addNum = 1
  public subNum = -1

  constructor() {
    super({key: 'StartScene'})
  }

  preload() {

  }

  create() {

    let titleText = new PhaserButton({
      scene: this,
      x: 200,
      y: 0,
      hotArea: true,
      text: {t: '0', s: {fontSize: '24px'}}
    })
    this.add.existing(titleText)
    this.titleText = titleText

    let addBtn = new PhaserButton({
      scene: this,
      x: 100,
      y: 100,
      hotArea: true,
      text: {t: 'add', s: {fontSize: '24px'}}
    })
    this.add.existing(addBtn)
    this.addBtn = addBtn

    let subBtn = new PhaserButton({
      scene: this,
      x: 300,
      y: 100,
      hotArea: true,
      text: {t: 'sub', s: {fontSize: '24px'}}
    })
    this.add.existing(subBtn)
    this.subBtn = subBtn

    this.addBtn.on('pointertap', () => {
      this.events.emit(StartScene.ADD_MONEY, this.addNum)
    })
    this.subBtn.on('pointertap', () => {
      this.events.emit(StartScene.SUB_MONEY, this.subNum)
    })
  }

  setTitleText(txt) {
    this.titleText.text.text = txt
  }
}