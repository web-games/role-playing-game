import MapConfig from './config.json';

let stageWidth = document.documentElement.clientWidth || document.body.clientWidth
let stageHeight = document.documentElement.clientHeight || document.body.clientHeight
let mapWidth = 2400;
let mapHeight = 1710;
let nodeWidth = MapConfig.nodeWidth;
let nodeHeight = MapConfig.nodeHeight;

let chunkWidth = 240;
let chunkHeight = 171;
let chunkRows = 10;
let chunkCols = 10;

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