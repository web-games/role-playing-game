import Game from "./Game";

let kuangAlpha = 0.01
let kuangLineColor = 0xcccccc
let stageWidth = document.documentElement.clientWidth || document.body.clientWidth
let stageHeight = document.documentElement.clientHeight || document.body.clientHeight
let mapWidth = 2880
let mapHeight = 1440
let game = new Game({
  width: stageWidth,
  height: stageHeight,
  backgroundColor: 0x3433cc
})