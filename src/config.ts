import mapData from './mapData.json';

let stageWidth = document.documentElement.clientWidth || document.body.clientWidth
let stageHeight = document.documentElement.clientHeight || document.body.clientHeight
// let mapWidth = mapData.mapWidth;
// let mapHeight = mapData.mapHeight;
let mapWidth = 2880;
let mapHeight = 1440;
let nodeWidth = mapData.nodeWidth;
let nodeHeight = mapData.nodeHeight;

let chunkWidth = 180;
let chunkHeight = 120;
let chunkRows = 12;
let chunkCols = 16;

export {
  stageWidth,
  stageHeight,
  mapWidth,
  mapHeight,
  nodeWidth,
  nodeHeight,
  chunkWidth,
  chunkHeight,
  chunkRows,
  chunkCols,
}