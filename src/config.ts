import mapData from './mapData.json';

let stageWidth = document.documentElement.clientWidth || document.body.clientWidth
let stageHeight = document.documentElement.clientHeight || document.body.clientHeight
// let mapWidth = mapData.mapWidth;
// let mapHeight = mapData.mapHeight;
let mapWidth = 2880;
let mapHeight = 1440;
let nodeWidth = mapData.nodeWidth;
let nodeHeight = mapData.nodeHeight;


export {
  stageWidth,
  stageHeight,
  mapWidth,
  mapHeight,
  nodeWidth,
  nodeHeight
}