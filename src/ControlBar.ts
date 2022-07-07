// @ts-nocheck
export default class ControlBar extends PIXI.Container {
  constructor(config) {
    super()
    this.$config = Object.assign({}, config)

    let minusButton = new PIXI.Sprite.from('./static/assets/minus.png')
    this.addChild(minusButton)
    minusButton.scale.set(0.5)
    minusButton.buttonMode = true
    minusButton.interactive = true
    minusButton.on('pointerdown', (event) => {
      this.ratio -= 0.1
      this.$config.update && this.$config.update(this._ratio)
      event.stopPropagation()
    })

    let text = new PIXI.Text('', {fontFamily: 'Arial', fontSize: 16, fill: 0xffffff, align: 'center'})
    text.anchor.set(0.5)
    this.addChild(text)
    text.x = 105 / 2
    text.y = 25 / 2
    this.text = text

    let plusButton = new PIXI.Sprite.from('./static/assets/plus.png')
    this.addChild(plusButton)
    plusButton.scale.set(0.5)
    plusButton.buttonMode = true
    plusButton.x = 80
    plusButton.interactive = true
    plusButton.on('pointerdown', (event) => {
      this.ratio += 0.1
      this.$config.update && this.$config.update(this._ratio)
      event.stopPropagation()
    })

    this.ratio = this.$config.ratio || 1
  }

  set ratio(ratio) {
    if (ratio <= this.$config.minScale) {
      ratio = this.$config.minScale
    } else if (ratio >= this.$config.maxScale) {
      ratio = this.$config.maxScale
    }

    this._ratio = ratio

    this.text.text = parseInt(this._ratio * 100) + '%'
  }

  get ratio() {
    return this._ratio
  }
}