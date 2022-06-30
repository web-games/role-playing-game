import mapData from './mapData.json';

let stageWidth = document.documentElement.clientWidth || document.body.clientWidth
let stageHeight = document.documentElement.clientHeight || document.body.clientHeight
let mapWidth = mapData.mapWidth;
let mapHeight = mapData.mapHeight;

export {
  stageWidth,
  stageHeight,
  mapWidth,
  mapHeight
}