/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Game.ts":
/*!*********************!*\
  !*** ./src/Game.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Scene_1 = __importDefault(__webpack_require__(/*! ./Scene */ "./src/Scene.ts"));
var mapData_json_1 = __importDefault(__webpack_require__(/*! ./mapData.json */ "./src/mapData.json"));
var stageWidth = document.documentElement.clientWidth || document.body.clientWidth;
var stageHeight = document.documentElement.clientHeight || document.body.clientHeight;
var Game = /** @class */ (function (_super) {
    __extends(Game, _super);
    function Game(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.init();
        return _this;
    }
    Game.prototype.init = function () {
        document.body.prepend(this.view);
        var scene = new Scene_1.default();
        this.stage.addChild(scene);
        var drag = new Drag({
            ele: scene,
            width: mapData_json_1.default.mapWidth,
            height: mapData_json_1.default.mapWidth
        });
        var scroll = new Scroll({
            content: scene,
            maskWidth: stageWidth,
            maskHeight: stageHeight,
            contentWidth: mapData_json_1.default.mapWidth,
            contentHeight: mapData_json_1.default.mapWidth
        });
    };
    return Game;
}(PIXI.Application));
exports.default = Game;
var Drag = /** @class */ (function () {
    function Drag(config) {
        var ele = (this.config = config).ele;
        this.ele = ele;
        this.ele.interactive = true;
        this.ele.on('pointerdown', this.onDragStart, this);
    }
    Drag.prototype.onDragStart = function (event) {
        var _a = event.data.global, gx = _a.x, gy = _a.y;
        this.dragging = true;
        this.offset = { x: this.ele.x - gx, y: this.ele.y - gy };
        this.ele.on('pointerup', this.onDragEnd, this);
        this.ele.on('pointerupoutside', this.onDragEnd, this);
        this.ele.on('pointermove', this.onDragMove, this);
    };
    Drag.prototype.onDragEnd = function () {
        this.dragging = false;
        this.offset = null;
        this.ele.off('pointerup', this.onDragEnd, this)
            .off('pointerupoutside', this.onDragEnd, this)
            .off('pointermove', this.onDragMove, this);
    };
    Drag.prototype.onDragMove = function (event) {
        if (this.dragging) {
            var _a = event.data.global, gx = _a.x, gy = _a.y;
            var x = gx + this.offset.x;
            x = (x >= 0
                ? 0
                : x <= -(mapData_json_1.default.mapWidth * this.ele.scale.x - stageWidth)
                    ? -(mapData_json_1.default.mapWidth * this.ele.scale.x - stageWidth)
                    : x);
            var y = gy + this.offset.y;
            y = (y >= 0
                ? 0
                : y <= -(mapData_json_1.default.mapHeight * this.ele.scale.y - stageHeight)
                    ? -(mapData_json_1.default.mapHeight * this.ele.scale.y - stageHeight)
                    : y);
            this.ele.x = x;
            this.ele.y = y;
        }
    };
    return Drag;
}());
var Scroll = /** @class */ (function () {
    function Scroll(option) {
        var _a = this._options = option, content = _a.content, maskWidth = _a.maskWidth, maskHeight = _a.maskHeight, contentWidth = _a.contentWidth, contentHeight = _a.contentHeight;
        this._content = content;
        this._maskWidth = maskWidth;
        this._maskHeight = maskHeight;
        this._contentWidth = contentWidth;
        this._contentHeight = contentHeight;
        this._deceleration = 0.001; // 0.004 0.0006
        this._content.on('pointerdown', this.onPointerDownListener, this);
    }
    Scroll.prototype.onPointerDownListener = function () {
        var tw = window["TweenMax"].getTweensOf(this._content);
        tw.length && tw[0].kill();
        this._start = {
            time: new Date().getTime(),
            x: this._content.x,
            y: this._content.y
        };
        this._content.on("pointerup", this.onPointerUpListener, this);
        this._content.on("pointerout", this.onPointerOutListener, this);
    };
    Scroll.prototype.onPointerUpListener = function () {
        if (this._start) {
            var duration = new Date().getTime() - this._start.time;
            var momentumX = this.momentum(this._content.x, this._start.x, duration, this.maxScrollLeft, 0, this._deceleration);
            var momentumY = this.momentum(this._content.y, this._start.y, duration, this.maxScrollTop, 0, this._deceleration);
            var newX = momentumX.destination;
            var newY = momentumY.destination;
            var time = Math.max(momentumX.duration, momentumY.duration);
            // console.log('start xy:', this._startX, this._startY)
            // console.log('cur xy:', this.parentContainer.x, this.parentContainer.y)
            // console.log('end xy:', newX, newY)
            // console.log('time:', momentumX.duration, momentumY.duration, time)
            // console.log("newX:%d newY:%d", newX, newY)
            //
            var vars = {
                x: newX,
                y: newY,
                ease: window["Power2"].easeOut,
                onUpdate: function () {
                },
                onComplete: function () {
                }
            };
            window["TweenMax"].to(this._content, time / 1000, vars);
        }
        this._content.off("pointerup", this.onPointerUpListener, this);
        this._content.off("pointerout", this.onPointerOutListener, this);
    };
    Scroll.prototype.onPointerOutListener = function () {
        this.onPointerUpListener();
    };
    /**
     * 动量计算函数
     *
     * @param current 当前位置
     * @param start 初始位置
     * @param time 初始位置到当前位置运动时间（毫秒）
     * @param lowerMargin 最大目的地点
     * @param wrapperSize
     * @param deceleration 滚动动量，就是负的加速度（减速越大越快，建议不大）
     *
     * @return {destination:number,duration:number}
     * */
    Scroll.prototype.momentum = function (current, start, time, lowerMargin, wrapperSize, deceleration) {
        if (deceleration === void 0) { deceleration = 0.0006; }
        // console.log(current, start, time, lowerMargin, wrapperSize, deceleration)
        // 计算拖动的距离 = 当前位置 - 初始位置
        var distance = current - start;
        // 计算拖动的速度 = (移动距离/时间)
        var speed = Math.abs(distance) / time;
        // 记录终点位置
        var destination;
        // 记录到终点位置应持续时间
        var duration;
        // V1是初速度
        // V2是末速度
        // a是加速度
        // t为时间
        // x是位移距离
        var v1 = speed;
        var v2 = 0;
        var a = deceleration;
        var t;
        var x;
        // 计算在给定加速度情况下，由初速度减至0所运动的距离，即v*(0-v)/deceleration
        // v2=v1+at
        // x=v1t+(1/2)at^2
        t = (v2 - v1) / a;
        x = (v1 * t) + ((1 / 2) * a * t * t);
        destination = current + x * (distance > 0 ? -1 : 1);
        duration = speed / deceleration;
        if (destination < lowerMargin) {
            destination = wrapperSize ? lowerMargin - (wrapperSize / 2.5 * (speed / 8)) : lowerMargin;
            distance = Math.abs(destination - current);
            duration = distance / speed;
        }
        else if (destination > 0) {
            destination = wrapperSize ? wrapperSize / 2.5 * (speed / 8) : 0;
            distance = Math.abs(current) + destination;
            duration = distance / speed;
        }
        return {
            destination: Math.round(destination),
            duration: duration
        };
    };
    Object.defineProperty(Scroll.prototype, "contentWidth", {
        set: function (val) {
            this._contentWidth = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scroll.prototype, "contentHeight", {
        set: function (val) {
            this._contentHeight = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scroll.prototype, "maxScrollLeft", {
        // 最大滚动距离 横向
        get: function () {
            return this._maskWidth - this._contentWidth;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scroll.prototype, "maxScrollTop", {
        // 最大滚动距离 纵向
        get: function () {
            return this._maskHeight - this._contentHeight;
        },
        enumerable: false,
        configurable: true
    });
    return Scroll;
}());


/***/ }),

/***/ "./src/Scene.ts":
/*!**********************!*\
  !*** ./src/Scene.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mapData_json_1 = __importDefault(__webpack_require__(/*! ./mapData.json */ "./src/mapData.json"));
var MapRoadUtils_1 = __importDefault(__webpack_require__(/*! ./road/MapRoadUtils */ "./src/road/MapRoadUtils.ts"));
var AStarRoadSeeker_1 = __importDefault(__webpack_require__(/*! ./road/AStarRoadSeeker */ "./src/road/AStarRoadSeeker.ts"));
console.log(mapData_json_1.default);
var Scene = /** @class */ (function (_super) {
    __extends(Scene, _super);
    function Scene() {
        var _this = _super.call(this) || this;
        _this._roadDic = {};
        _this.init();
        return _this;
    }
    Scene.prototype.init = function () {
        var _this = this;
        var start = null;
        var tiledMapLayer = new PIXI.Container();
        this.addChild(tiledMapLayer);
        tiledMapLayer.interactive = true;
        tiledMapLayer.on('pointerdown', function (event) {
            start = { x: event.data.global.x, y: event.data.global.y };
        });
        tiledMapLayer.on("pointerup", function (event) {
            if (start) {
                var x1 = start.x, y1 = start.y;
                var _a = { x: event.data.global.x, y: event.data.global.y }, x2 = _a.x, y2 = _a.y;
                var distance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
                // console.log(x1, y1, x2, y2, 'distance:', distance)
                if (distance < 1) {
                    var _b = event.data.getLocalPosition(tiledMapLayer.parent), targetX = _b.x, targetY = _b.y;
                    // console.log(targetX, targetY);
                    var startPoint = MapRoadUtils_1.default.instance.getWorldPointByPixel(_this.player.x, _this.player.y);
                    var targetPoint = MapRoadUtils_1.default.instance.getWorldPointByPixel(targetX, targetY);
                    var startNode = _this._roadDic[startPoint.x + "_" + startPoint.y];
                    var targetNode = _this._roadDic[targetPoint.x + "_" + targetPoint.y];
                    // console.log(startNode, targetNode)
                    var roadNodeArr = _this._roadSeeker.seekPath2(startNode, targetNode);
                    console.log(roadNodeArr);
                    var tml = window["TweenMax"].getTweensOf(_this.player);
                    tml && tml.length && tml[0].kill();
                    _this.roadNodeArr = roadNodeArr;
                    _this.move();
                }
            }
            start = null;
        });
        this.player = PIXI.Sprite.from('static/assets/bunny.png');
        this.addChild(this.player);
        this.player.x = 50;
        this.player.y = 25;
        this.player.anchor.set(0.5);
        MapRoadUtils_1.default.instance.updateMapInfo(mapData_json_1.default.mapWidth, mapData_json_1.default.mapHeight, mapData_json_1.default.nodeWidth, mapData_json_1.default.nodeHeight, mapData_json_1.default.type);
        var len = mapData_json_1.default.roadDataArr.length;
        var len2 = mapData_json_1.default.roadDataArr[0].length;
        var value = 0;
        for (var i = 0; i < len; i++) {
            for (var j = 0; j < len2; j++) {
                value = mapData_json_1.default.roadDataArr[i][j];
                var node = MapRoadUtils_1.default.instance.getNodeByDerect(j, i);
                node.value = value;
                this._roadDic[node.cx + "_" + node.cy] = node;
                // let rhombusView = new MapNodeView(node)
                // this.addChild(rhombusView)
                if (i < 20 && j < 200) {
                    var rhombusView = new MapNodeView(node);
                    tiledMapLayer.addChild(rhombusView);
                }
            }
        }
        this._roadSeeker = new AStarRoadSeeker_1.default(this._roadDic);
        console.log(this.getGridByPixel(50, 25));
        console.log(this.getGridByPixel(150, 25));
        console.log(this.getGridByPixel(250, 25));
    };
    Scene.prototype.getGridByPixel = function (px, py) {
        var offsetY = 23;
        var w = 100;
        var h = 50;
        var x = Math.ceil(px / w - 0.5 + py / h);
        var y = (offsetY - Math.ceil(px / w - 0.5 - py / h));
        var cx = Math.ceil(px / w - 0.5 + py / h) - 1;
        var cy = (offsetY) - Math.ceil(px / w - 0.5 - py / h) + 1;
        return { x: x, y: y, cx: cx, cy: cy };
    };
    Scene.prototype.move = function () {
        if (this.roadNodeArr && this.roadNodeArr.length > 0) {
            var targetRoadNode = this.roadNodeArr.shift();
            console.log(targetRoadNode.toString());
            var dx = Math.abs(this.player.x - targetRoadNode.px);
            var dy = Math.abs(this.player.y - targetRoadNode.py);
            var distance = Math.sqrt(dx * dx + dy * dy);
            var duration = (distance / 100) * 1;
            window["TweenMax"].to(this.player, duration, {
                x: targetRoadNode.px,
                y: targetRoadNode.py,
                ease: window["Power0"].easeNone,
                onComplete: this.move.bind(this)
            });
        }
    };
    return Scene;
}(PIXI.Container));
exports.default = Scene;
var MapNodeView = /** @class */ (function (_super) {
    __extends(MapNodeView, _super);
    function MapNodeView(node) {
        var _this = _super.call(this) || this;
        _this.node = node;
        var cx = node.cx, cy = node.cy, dx = node.dx, dy = node.dy, px = node.px, py = node.py, value = node.value;
        _this.x = px;
        _this.y = py;
        var w = mapData_json_1.default.nodeWidth;
        var h = mapData_json_1.default.nodeHeight;
        var graphics = new PIXI.Graphics();
        graphics.beginFill(value === 0 ? 0x00000 : 0xFF0000, 1);
        graphics.lineStyle(1, 0xffffff, 0.3);
        graphics.moveTo(-w / 2, 0);
        graphics.lineTo(0, -h / 2);
        graphics.lineTo(w / 2, 0);
        graphics.lineTo(0, h / 2);
        graphics.closePath();
        graphics.endFill();
        _this.addChild(graphics);
        var graphics2 = new PIXI.Graphics();
        graphics2.beginFill(0xff0000, 1);
        graphics2.drawCircle(0, 0, 2);
        graphics2.endFill();
        _this.addChild(graphics2);
        var style = { fontSize: 12, fill: 0xffffff, align: 'center' };
        var text3 = new PIXI.Text(px + "/" + py, style);
        _this.addChild(text3);
        text3.anchor.set(0, 1);
        text3.x = -(w / 2) + 7;
        text3.y = 2;
        text3['angle'] = 31;
        var text2 = new PIXI.Text(dx + "/" + dy, style);
        _this.addChild(text2);
        text2.anchor.set(0.5, 0.5);
        text2.x = 0;
        text2.y = 0;
        text2['angle'] = 31;
        var text = new PIXI.Text(cx + "/" + cy, style);
        text.anchor.set(1, 0);
        _this.addChild(text);
        text.x = (w / 2) - 3;
        text.y = -3;
        text['angle'] = 31;
        return _this;
    }
    return MapNodeView;
}(PIXI.Container));


/***/ }),

/***/ "./src/base/MapType.ts":
/*!*****************************!*\
  !*** ./src/base/MapType.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.MapType = void 0;
var MapType;
(function (MapType) {
    MapType[MapType["angle45"] = 0] = "angle45";
    MapType[MapType["angle90"] = 1] = "angle90";
    MapType[MapType["honeycomb"] = 2] = "honeycomb";
})(MapType = exports.MapType || (exports.MapType = {}));


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Game_1 = __importDefault(__webpack_require__(/*! ./Game */ "./src/Game.ts"));
var kuangAlpha = 0.01;
var kuangLineColor = 0xcccccc;
var stageWidth = document.documentElement.clientWidth || document.body.clientWidth;
var stageHeight = document.documentElement.clientHeight || document.body.clientHeight;
var mapWidth = 2880;
var mapHeight = 1440;
var game = new Game_1.default({
    width: stageWidth,
    height: stageHeight,
    backgroundColor: 0xcccccc
});


/***/ }),

/***/ "./src/mapData.json":
/*!**************************!*\
  !*** ./src/mapData.json ***!
  \**************************/
/*! exports provided: name, bgName, type, mapWidth, mapHeight, nodeWidth, nodeHeight, roadDataArr, mapItem, default */
/***/ (function(module) {

module.exports = JSON.parse("{\"name\":\"mapData\",\"bgName\":\"37502319-9924-4436-bd93-a6cc58684486\",\"type\":0,\"mapWidth\":2450,\"mapHeight\":1775,\"nodeWidth\":100,\"nodeHeight\":50,\"roadDataArr\":[[0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,1,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,1,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],\"mapItem\":[]}");

/***/ }),

/***/ "./src/road/AStarRoadSeeker.ts":
/*!*************************************!*\
  !*** ./src/road/AStarRoadSeeker.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A*寻路算法
 * @author 落日故人 QQ 583051842
 *
 */
var AStarRoadSeeker = /** @class */ (function () {
    function AStarRoadSeeker(roadNodes) {
        /**
         * 横向移动一个格子的代价
         */
        this.COST_STRAIGHT = 10;
        /**
         * 斜向移动一个格子的代价
         */
        this.COST_DIAGONAL = 14;
        /**
         *最大搜寻步骤数，超过这个值时表示找不到目标
            */
        this.maxStep = 1000;
        /**
         *用于检索一个节点周围8个点的向量数组
            */
        this._round = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
        this.handle = -1;
        /**
         * 是否优化路径
         */
        this.optimize = true;
        this._roadNodes = roadNodes;
    }
    /**
     *寻路入口方法
        * @param startNode
        * @param targetNode
        * @return
        *
        */
    AStarRoadSeeker.prototype.seekPath = function (startNode, targetNode) {
        this._startNode = startNode;
        this._currentNode = startNode;
        this._targetNode = targetNode;
        if (!this._startNode || !this._targetNode)
            return [];
        if (this._targetNode.value == 1) {
            console.log("目标不可达到：");
            return [];
        }
        this._openlist = [];
        this._closelist = [];
        var step = 0;
        while (true) {
            if (step > this.maxStep) {
                console.log("没找到目标计算步骤为：", step);
                return [];
            }
            step++;
            this.searchRoundNodes(this._currentNode);
            if (this._openlist.length == 0) {
                console.log("没找到目标计算步骤为：", step);
                return [];
            }
            this._openlist.sort(this.sortNode);
            this._currentNode = this._openlist.shift();
            if (this._currentNode == this._targetNode) {
                console.log("找到目标计算步骤为：", step);
                return this.getPath();
            }
            else {
                this._closelist.push(this._currentNode);
            }
        }
        return [];
    };
    /**
     *寻路入口方法 如果没有寻到目标，则返回离目标最近的路径
    * @param startNode
    * @param targetNode
    * @return
    *
    */
    AStarRoadSeeker.prototype.seekPath2 = function (startNode, targetNode) {
        this._startNode = startNode;
        this._currentNode = startNode;
        this._targetNode = targetNode;
        if (!this._startNode || !this._targetNode)
            return [];
        /*if(this._targetNode.value == 1)
        {
            console.log("目标不可达到：");
            return [];
        }*/
        this._openlist = [];
        this._closelist = [];
        var step = 0;
        var closestNode = null; //距离目标最近的路点
        while (true) {
            if (step > this.maxStep) {
                console.log("没找到目标计算步骤为：", step);
                return this.seekPath(startNode, closestNode);
            }
            step++;
            this.searchRoundNodes(this._currentNode);
            if (this._openlist.length == 0) {
                console.log("没找到目标计算步骤为：", step);
                return this.seekPath(startNode, closestNode);
            }
            this._openlist.sort(this.sortNode);
            this._currentNode = this._openlist.shift();
            if (closestNode == null) {
                closestNode = this._currentNode;
            }
            else {
                if (this._currentNode.h < closestNode.h) {
                    closestNode = this._currentNode;
                }
            }
            if (this._currentNode == this._targetNode) {
                console.log("找到目标计算步骤为：", step);
                return this.getPath();
            }
            else {
                this._closelist.push(this._currentNode);
            }
        }
        return this.seekPath(startNode, closestNode);
    };
    /**
     * 对路节点进行排序
     * @param node1
     * @param node2
     */
    AStarRoadSeeker.prototype.sortNode = function (node1, node2) {
        if (node1.f < node2.f) {
            return -1;
        }
        else if (node1.f > node2.f) {
            return 1;
        }
        return 0;
    };
    /**
     *获得最终寻路到的所有路点
        * @return
        *
        */
    AStarRoadSeeker.prototype.getPath = function () {
        var nodeArr = [];
        var node = this._targetNode;
        while (node != this._startNode) {
            nodeArr.unshift(node);
            node = node.parent;
        }
        nodeArr.unshift(this._startNode);
        if (!this.optimize) {
            return nodeArr;
        }
        //第一阶段优化： 对横，竖，正斜进行优化
        //把多个节点连在一起的，横向或者斜向的一连串点，除两边的点保留
        for (var i = 1; i < nodeArr.length - 1; i++) {
            var preNode = nodeArr[i - 1];
            var midNode = nodeArr[i];
            var nextNode = nodeArr[i + 1];
            var bool1 = midNode.cx == preNode.cx && midNode.cx == nextNode.cx;
            var bool2 = midNode.cy == preNode.cy && midNode.cy == nextNode.cy;
            var bool3 = ((midNode.cx - preNode.cx) / (midNode.cy - preNode.cy)) * ((nextNode.cx - midNode.cx) / (nextNode.cy - midNode.cy)) == 1;
            if (bool1 || bool2 || bool3) {
                nodeArr.splice(i, 1);
                i--;
            }
        }
        //return nodeArr;
        //第二阶段优化：对不在横，竖，正斜的格子进行优化
        for (var i = 0; i < nodeArr.length - 2; i++) {
            var startNode = nodeArr[i];
            var optimizeNode = null;
            //优先从尾部对比，如果能直达就把中间多余的路点删掉
            for (var j = nodeArr.length - 1; j > i + 1; j--) {
                var targetNode = nodeArr[j];
                //在第一阶段优已经优化过横，竖，正斜了，所以再出现是肯定不能优化的，可以忽略
                if (startNode.cx == targetNode.cx || startNode.cy == targetNode.cy || Math.abs(targetNode.cx - startNode.cx) == Math.abs(targetNode.cy - startNode.cy)) {
                    continue;
                }
                if (this.isArriveBetweenTwoNodes(startNode, targetNode)) {
                    optimizeNode = targetNode;
                    break;
                }
            }
            if (optimizeNode) {
                var optimizeLen = j - i - 1;
                nodeArr.splice(i + 1, optimizeLen);
            }
        }
        return nodeArr;
    };
    /**
     * 两点之间是否可到达
     */
    AStarRoadSeeker.prototype.isArriveBetweenTwoNodes = function (startNode, targetNode) {
        if (startNode == targetNode) {
            return false;
        }
        var disX = Math.abs(targetNode.cx - startNode.cx);
        var disY = Math.abs(targetNode.cy - startNode.cy);
        var dirX = 0;
        if (targetNode.cx > startNode.cx) {
            dirX = 1;
        }
        else if (targetNode.cx < startNode.cx) {
            dirX = -1;
        }
        var dirY = 0;
        if (targetNode.cy > startNode.cy) {
            dirY = 1;
        }
        else if (targetNode.cy < startNode.cy) {
            dirY = -1;
        }
        var rx = 0;
        var ry = 0;
        var intNum = 0;
        var decimal = 0;
        if (disX > disY) {
            var rate = disY / disX;
            for (var i = 0; i < disX; i++) {
                ry = startNode.cy + i * dirY * rate;
                intNum = Math.floor(ry);
                decimal = ry % 1;
                var cx1 = startNode.cx + i * dirX;
                var cy1 = decimal <= 0.5 ? intNum : intNum + 1;
                ry = startNode.cy + (i + 1) * dirY * rate;
                intNum = Math.floor(ry);
                decimal = ry % 1;
                var cx2 = startNode.cx + (i + 1) * dirX;
                var cy2 = decimal <= 0.5 ? intNum : intNum + 1;
                var node1 = this._roadNodes[cx1 + "_" + cy1];
                var node2 = this._roadNodes[cx2 + "_" + cy2];
                //cc.log(i + "  :: " + node1.cy," yy ",startNode.cy + i * rate,ry % 1);
                if (!this.isCrossAtAdjacentNodes(node1, node2)) {
                    return false;
                }
            }
        }
        else {
            var rate = disX / disY;
            for (var i = 0; i < disY; i++) {
                rx = i * dirX * rate;
                intNum = dirX > 0 ? Math.floor(startNode.cx + rx) : Math.ceil(startNode.cx + rx);
                decimal = Math.abs(rx % 1);
                var cx1 = decimal <= 0.5 ? intNum : intNum + 1 * dirX;
                var cy1 = startNode.cy + i * dirY;
                rx = (i + 1) * dirX * rate;
                intNum = dirX > 0 ? Math.floor(startNode.cx + rx) : Math.ceil(startNode.cx + rx);
                decimal = Math.abs(rx % 1);
                var cx2 = decimal <= 0.5 ? intNum : intNum + 1 * dirX;
                var cy2 = startNode.cy + (i + 1) * dirY;
                var node1 = this._roadNodes[cx1 + "_" + cy1];
                var node2 = this._roadNodes[cx2 + "_" + cy2];
                if (!this.isCrossAtAdjacentNodes(node1, node2)) {
                    return false;
                }
            }
        }
        return true;
    };
    /**
     * 判断两个相邻的点是否可通过
     * @param node1
     * @param node2
     */
    AStarRoadSeeker.prototype.isCrossAtAdjacentNodes = function (node1, node2) {
        if (node1 == node2) {
            return false;
        }
        //两个点只要有一个点不能通过就不能通过
        if (!this.isPassNode(node1) || !this.isPassNode(node2)) {
            return false;
        }
        var dirX = node2.cx - node1.cx;
        var dirY = node2.cy - node1.cy;
        //如果不是相邻的两个点 则不能通过
        if (Math.abs(dirX) > 1 || Math.abs(dirY) > 1) {
            return false;
        }
        //如果相邻的点是在同一行，或者同一列，则判定为可通过
        if ((node1.cx == node2.cx) || (node1.cy == node2.cy)) {
            return true;
        }
        //只剩对角情况了
        if (this.isPassNode(this._roadNodes[node1.cx + "_" + (node1.cy + dirY)]) &&
            this.isPassNode(this._roadNodes[(node1.cx + dirX) + "_" + node1.cy])) {
            return true;
        }
        return false;
    };
    /**
     * 是否是可通过的点
     * @param node
     */
    AStarRoadSeeker.prototype.isPassNode = function (node) {
        if (!node || node.value == 1) {
            return false;
        }
        return true;
    };
    /**
     *测试寻路步骤
        * @param startNode
        * @param targetNode
        * @return
        *
        */
    AStarRoadSeeker.prototype.testSeekPathStep = function (startNode, targetNode, callback, target, time) {
        var _this = this;
        if (time === void 0) { time = 100; }
        this._startNode = startNode;
        this._currentNode = startNode;
        this._targetNode = targetNode;
        if (this._targetNode.value == 1)
            return;
        this._openlist = [];
        this._closelist = [];
        var step = 0;
        clearInterval(this.handle);
        this.handle = setInterval(function () {
            if (step > _this.maxStep) {
                console.log("没找到目标计算步骤为：", step);
                clearInterval(_this.handle);
                return;
            }
            step++;
            _this.searchRoundNodes(_this._currentNode);
            if (_this._openlist.length == 0) {
                console.log("没找到目标计算步骤为：", step);
                clearInterval(_this.handle);
                return;
            }
            _this._openlist.sort(_this.sortNode);
            _this._currentNode = _this._openlist.shift();
            if (_this._currentNode == _this._targetNode) {
                console.log("找到目标计算步骤为：", step);
                clearInterval(_this.handle);
                callback.apply(target, [_this._startNode, _this._targetNode, _this._currentNode, _this._openlist, _this._closelist, _this.getPath()]);
            }
            else {
                _this._closelist.push(_this._currentNode);
                callback.apply(target, [_this._startNode, _this._targetNode, _this._currentNode, _this._openlist, _this._closelist, null]);
            }
        }, time);
    };
    /**
     *查找一个节点周围可通过的点
        * @param node
        * @return
        *
        */
    AStarRoadSeeker.prototype.searchRoundNodes = function (node) {
        for (var i = 0; i < this._round.length; i++) {
            var cx = node.cx + this._round[i][0];
            var cy = node.cy + this._round[i][1];
            var node2 = this._roadNodes[cx + "_" + cy];
            if (node2 != null && node2 != this._startNode && node2.value != 1 && !this.isInCloseList(node2) && !this.inInCorner(node2)) {
                this.setNodeF(node2);
            }
        }
    };
    /**
     *设置节点的F值
        * @param node
        *
        */
    AStarRoadSeeker.prototype.setNodeF = function (node) {
        var g;
        if (node.cx == this._currentNode.cx || node.cy == this._currentNode.cy) {
            g = this._currentNode.g + this.COST_STRAIGHT;
        }
        else {
            g = this._currentNode.g + this.COST_DIAGONAL;
        }
        if (this.isInOpenList(node)) {
            if (g < node.g) {
                node.g = g;
            }
            else {
                return;
            }
        }
        else {
            node.g = g;
            this._openlist.push(node);
        }
        node.parent = this._currentNode;
        node.h = (Math.abs(this._targetNode.cx - node.cx) + Math.abs(this._targetNode.cy - node.cy)) * this.COST_STRAIGHT;
        node.f = node.g + node.h;
    };
    /**
     *节点是否在开启列表
        * @param node
        * @return
        *
        */
    AStarRoadSeeker.prototype.isInOpenList = function (node) {
        return this._openlist.indexOf(node) != -1 ? true : false;
    };
    /**
     *节点是否在关闭列表
        *
        */
    AStarRoadSeeker.prototype.isInCloseList = function (node) {
        return this._closelist.indexOf(node) != -1 ? true : false;
    };
    /**
     *节点是否在拐角处
        * @return
        *
        */
    AStarRoadSeeker.prototype.inInCorner = function (node) {
        if (node.cx == this._currentNode.cx || node.cy == this._currentNode.cy) {
            return false;
        }
        var node1 = this._roadNodes[this._currentNode.cx + "_" + node.cy];
        var node2 = this._roadNodes[node.cx + "_" + this._currentNode.cy];
        if (this.isPassNode(node1) && this.isPassNode(node2)) {
            return false;
        }
        return true;
    };
    AStarRoadSeeker.prototype.dispose = function () {
        this._roadNodes = null;
        this._round = null;
    };
    return AStarRoadSeeker;
}());
exports.default = AStarRoadSeeker;


/***/ }),

/***/ "./src/road/MapRoadUtils.ts":
/*!**********************************!*\
  !*** ./src/road/MapRoadUtils.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Point_1 = __importDefault(__webpack_require__(/*! ./Point */ "./src/road/Point.ts"));
var RoadNode_1 = __importDefault(__webpack_require__(/*! ./RoadNode */ "./src/road/RoadNode.ts"));
var MapType_1 = __webpack_require__(/*! ../base/MapType */ "./src/base/MapType.ts");
/**
 * 地图路点的换算
 * @author 落日故人 QQ 583051842
 *
 */
var MapRoadUtils = /** @class */ (function () {
    function MapRoadUtils() {
    }
    Object.defineProperty(MapRoadUtils, "instance", {
        get: function () {
            if (this._instance == null) {
                this._instance = new MapRoadUtils();
            }
            return this._instance;
        },
        enumerable: false,
        configurable: true
    });
    MapRoadUtils.prototype.updateMapInfo = function (mapWidth, mapHeight, nodeWidth, nodeHeight, mapType) {
        this._mapWidth = mapWidth;
        this._mapHeight = mapHeight;
        this._nodeWidth = nodeWidth;
        this._nodeHeight = nodeHeight;
        this._halfNodeWidth = Math.floor(this._nodeWidth / 2);
        this._halfNodeHeight = Math.floor(this._nodeHeight / 2);
        this._col = Math.ceil(mapWidth / this._nodeWidth);
        this._row = Math.ceil(mapHeight / this._nodeHeight);
        this._mapType = mapType;
        switch (this._mapType) {
            case MapType_1.MapType.angle45:
                this._mapRoad = new MapRoad45Angle(this._row, this._col, this._nodeWidth, this._nodeHeight, this._halfNodeWidth, this._halfNodeHeight);
                break;
        }
    };
    /**
     *根据地图平面像素坐标获得路节点
        * @param x
        * @param y
        * @return
        *
        */
    MapRoadUtils.prototype.getNodeByPixel = function (x, y) {
        if (this._mapRoad) {
            return this._mapRoad.getNodeByPixel(x, y);
        }
        return new RoadNode_1.default();
    };
    /**
     *根据路点平面坐标点获得路节点
        * @param px
        * @param py
        * @return
        *
        */
    MapRoadUtils.prototype.getNodeByDerect = function (dx, dy) {
        if (this._mapRoad) {
            return this._mapRoad.getNodeByDerect(dx, dy);
        }
        return new RoadNode_1.default();
    };
    /**
     *根据路点场景世界坐标获得路节点
        * @param wx
        * @param wy
        * @return
        *
        */
    MapRoadUtils.prototype.getNodeByWorldPoint = function (wx, wy) {
        if (this._mapRoad) {
            return this._mapRoad.getNodeByWorldPoint(wx, wy);
        }
        return new RoadNode_1.default();
    };
    /**
     *根据像素坐标得到场景世界坐标
        * @param x
        * @param y
        * @return
        *
        */
    MapRoadUtils.prototype.getWorldPointByPixel = function (x, y) {
        if (this._mapRoad) {
            return this._mapRoad.getWorldPointByPixel(x, y);
        }
        return new Point_1.default();
    };
    /**
     *根据世界坐标获得像素坐标
        * @param cx
        * @param cy
        * @return
        *
        */
    MapRoadUtils.prototype.getPixelByWorldPoint = function (cx, cy) {
        if (this._mapRoad) {
            return this._mapRoad.getPixelByWorldPoint(cx, cy);
        }
        return new Point_1.default();
    };
    /**
     *根据像素坐标获得网格平面坐标
        * @param x
        * @param y
        * @return
        *
        */
    MapRoadUtils.prototype.getDerectByPixel = function (x, y) {
        if (this._mapRoad) {
            return this._mapRoad.getDerectByPixel(x, y);
        }
        return new Point_1.default();
    };
    /**
     *根据世界坐标获得网格平面坐标
        * @param cx
        * @param cy
        * @return
        *
        */
    MapRoadUtils.prototype.getDerectByWorldPoint = function (cx, cy) {
        if (this._mapRoad) {
            return this._mapRoad.getDerectByWorldPoint(cx, cy);
        }
        return new Point_1.default();
    };
    /**
     *根据网格平面坐标获得世界坐标
        * @param dx
        * @param dy
        * @return
        *
        */
    /*	public getWorldPointByDerect(dx:number,dy:number):Point
        {
            var cx:number = (dy + dx) / 2;
            var cy:number = (dy - dx) / 2 + col - 1;
            return new Point(cx,cy);
        }*/
    MapRoadUtils.prototype.getPixelByDerect = function (dx, dy) {
        if (this._mapRoad) {
            return this._mapRoad.getPixelByDerect(dx, dy);
        }
        return new Point_1.default();
    };
    Object.defineProperty(MapRoadUtils.prototype, "mapWidth", {
        get: function () {
            return this._mapWidth;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MapRoadUtils.prototype, "mapHeight", {
        get: function () {
            return this._mapHeight;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MapRoadUtils.prototype, "nodeWidth", {
        get: function () {
            return this._nodeWidth;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MapRoadUtils.prototype, "nodeHeight", {
        get: function () {
            return this._nodeHeight;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MapRoadUtils.prototype, "row", {
        get: function () {
            return this._row;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MapRoadUtils.prototype, "col", {
        get: function () {
            return this._col;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MapRoadUtils.prototype, "halfNodeWidth", {
        get: function () {
            return this._halfNodeWidth;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MapRoadUtils.prototype, "halfNodeHeight", {
        get: function () {
            return this._halfNodeHeight;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MapRoadUtils.prototype, "mapType", {
        /**
         *地图类型 0:斜45度等视角地图, 1:90度角平面地图
            */
        get: function () {
            return this._mapType;
        },
        enumerable: false,
        configurable: true
    });
    return MapRoadUtils;
}());
exports.default = MapRoadUtils;
/**
 *45度等视角地图路点处理接口实现
 * @author Administrator
 *
 */
var MapRoad45Angle = /** @class */ (function () {
    function MapRoad45Angle(row, col, nodeWidth, nodeHeight, halfNodeWidth, halfNodeHeight) {
        this._row = row;
        this._col = col;
        this._nodeWidth = nodeWidth;
        this._nodeHeight = nodeHeight;
        this._halfNodeWidth = halfNodeWidth;
        this._halfNodeHeight = halfNodeHeight;
    }
    /**
     * 根据地图平面像素坐标获得路节点
     * @param x
     * @param y
     * @return
     *
     */
    MapRoad45Angle.prototype.getNodeByPixel = function (x, y) {
        var wPoint = this.getWorldPointByPixel(x, y);
        var fPoint = this.getPixelByWorldPoint(wPoint.x, wPoint.y);
        var dPoint = this.getDerectByPixel(x, y);
        var node = new RoadNode_1.default();
        node.cx = wPoint.x;
        node.cy = wPoint.y;
        node.px = fPoint.x;
        node.py = fPoint.y;
        node.dx = dPoint.x;
        node.dy = dPoint.y;
        return node;
    };
    /**
     * 根据路点平面坐标点获得路节点
     * @param dx
     * @param dy
     * @return
     *
     */
    MapRoad45Angle.prototype.getNodeByDerect = function (dx, dy) {
        var fPoint = this.getPixelByDerect(dx, dy);
        var wPoint = this.getWorldPointByPixel(fPoint.x, fPoint.y);
        var node = new RoadNode_1.default();
        node.cx = wPoint.x;
        node.cy = wPoint.y;
        node.px = fPoint.x;
        node.py = fPoint.y;
        node.dx = dx;
        node.dy = dy;
        return node;
    };
    /**
     * 根据路点场景世界坐标获得路节点
     * @param wx
     * @param wy
     * @return
     *
     */
    MapRoad45Angle.prototype.getNodeByWorldPoint = function (wx, wy) {
        var point = this.getPixelByWorldPoint(wx, wy);
        return this.getNodeByPixel(point.x, point.y);
    };
    /**
     * 根据像素坐标得到场景世界坐标
     * @param x
     * @param y
     * @return
     *
     */
    MapRoad45Angle.prototype.getWorldPointByPixel = function (x, y) {
        var cx = Math.ceil(x / this._nodeWidth - 0.5 + y / this._nodeHeight) - 1;
        var cy = (this._col - 1) - Math.ceil(x / this._nodeWidth - 0.5 - y / this._nodeHeight);
        return new Point_1.default(cx, cy);
    };
    /**
     * 根据世界坐标获得像素坐标
     * @param cx
     * @param cy
     * @return
     *
     */
    MapRoad45Angle.prototype.getPixelByWorldPoint = function (cx, cy) {
        var x = Math.floor((cx + 1 - (cy - (this._col - 1))) * this._halfNodeWidth);
        var y = Math.floor((cx + 1 + (cy - (this._col - 1))) * this._halfNodeHeight);
        return new Point_1.default(x, y);
    };
    /**
     *根据像素坐标获得网格平面坐标
     * @param x
     * @param y
     * @return
     *
     */
    MapRoad45Angle.prototype.getDerectByPixel = function (x, y) {
        var worldPoint = this.getWorldPointByPixel(x, y);
        var pixelPoint = this.getPixelByWorldPoint(worldPoint.x, worldPoint.y);
        var dx = Math.floor(pixelPoint.x / this._nodeWidth) - (pixelPoint.x % this._nodeWidth == 0 ? 1 : 0);
        var dy = Math.floor(pixelPoint.y / this._halfNodeHeight) - 1;
        return new Point_1.default(dx, dy);
    };
    /**
     *根据世界坐标获得网格平面坐标
     * @param cx
     * @param cy
     * @return
     *
     */
    MapRoad45Angle.prototype.getDerectByWorldPoint = function (cx, cy) {
        var dx = Math.floor((cx - (cy - (this._col - 1))) / 2);
        var dy = cx + (cy - (this._col - 1));
        return new Point_1.default(dx, dy);
    };
    /**
     *根据网格平面坐标获得像素坐标
     * @param dx
     * @param dy
     * @return
     *
     */
    MapRoad45Angle.prototype.getPixelByDerect = function (dx, dy) {
        var x = Math.floor((dx + dy % 2) * this._nodeWidth + (1 - dy % 2) * this._halfNodeWidth);
        var y = Math.floor((dy + 1) * this._halfNodeHeight);
        return new Point_1.default(x, y);
    };
    return MapRoad45Angle;
}());


/***/ }),

/***/ "./src/road/Point.ts":
/*!***************************!*\
  !*** ./src/road/Point.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Point = /** @class */ (function () {
    function Point(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = 0;
        this.y = 0;
        this.x = x;
        this.y = y;
    }
    return Point;
}());
exports.default = Point;


/***/ }),

/***/ "./src/road/RoadNode.ts":
/*!******************************!*\
  !*** ./src/road/RoadNode.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 地图路节点
 * @author 落日故人 QQ 583051842
 *
 */
var RoadNode = /** @class */ (function () {
    function RoadNode() {
        this._value = 0; //节点的值
        this._f = 0; //路点的f值
        this._g = 0; //路点的g值	
        this._h = 0; //路点的h值
        this._parent = null; //路点的父节点
    }
    RoadNode.prototype.toString = function () {
        return "路点像素坐标：（" + this._px + "," + this._py + "),  " +
            "路点世界坐标：（" + this._cx + "," + this._cy + "),  " +
            "路点平面直角坐标：（" + this._dx + "," + this._dy + ")";
    };
    Object.defineProperty(RoadNode.prototype, "px", {
        get: function () {
            return this._px;
        },
        set: function (value) {
            this._px = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RoadNode.prototype, "py", {
        get: function () {
            return this._py;
        },
        set: function (value) {
            this._py = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RoadNode.prototype, "cx", {
        get: function () {
            return this._cx;
        },
        set: function (value) {
            this._cx = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RoadNode.prototype, "cy", {
        get: function () {
            return this._cy;
        },
        set: function (value) {
            this._cy = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RoadNode.prototype, "dx", {
        get: function () {
            return this._dx;
        },
        set: function (value) {
            this._dx = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RoadNode.prototype, "dy", {
        get: function () {
            return this._dy;
        },
        set: function (value) {
            this._dy = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RoadNode.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (val) {
            this._value = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RoadNode.prototype, "f", {
        get: function () {
            return this._f;
        },
        set: function (value) {
            this._f = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RoadNode.prototype, "g", {
        get: function () {
            return this._g;
        },
        set: function (value) {
            this._g = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RoadNode.prototype, "h", {
        get: function () {
            return this._h;
        },
        set: function (value) {
            this._h = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RoadNode.prototype, "parent", {
        get: function () {
            return this._parent;
        },
        set: function (value) {
            this._parent = value;
        },
        enumerable: false,
        configurable: true
    });
    return RoadNode;
}());
exports.default = RoadNode;


/***/ })

/******/ });
//# sourceMappingURL=app.cb3fdba.js.map