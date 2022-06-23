import MapNodeView from "./MapNodeView"

export default class TiledMapLayer extends Phaser.GameObjects.Container {
  public scene: any
  public tiledMap: any

  constructor(scene: Phaser.Scene, tileMap) {
    super(scene)
    this.scene = scene
    this.tiledMap = tileMap

    this.setInteractive({
      hitArea: new Phaser.Geom.Rectangle(0, 0, this.tiledMap.mapWidth, this.tiledMap.mapHeight),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      cursor: "pointer",
      useHandCursor: false
    })

    this.on("pointerup", (pointer, dragX, dragY, event) => {
      if (pointer.upElement !== this.scene.game.canvas) return
      this.emit("pointertap", pointer, dragX, dragY, event)
    }, this)
  }

  public showGridView(color = 0xf0f0f0, alpha = 0.5) {
    let arr2 = []
    for (var i = 0; i < this.tiledMap.nodeList.length; i++) {
      let arr = this.tiledMap.nodeList[i]
      for (var j = 0; j < arr.length; j++) {
        let node = arr[j]
        let rhombusView = new MapNodeView(this.scene, node, color, alpha)
        arr2.push(rhombusView)
        node.ele = rhombusView
      }
    }

    this.add(arr2)
  }
}