package SG.Isometric.staggered
{
	import SG.Isometric.IsoGrid;
	import SG.Isometric.IsoNode;
	import SG.Isometric.PathUtil;
	import SG.data.HashMap;

	import flash.geom.Point;
	import flash.utils.getTimer;

	public class StaggeredAstar
	{
		private var _grid:IsoGrid;
		private var _startNode:IsoNode;
		private var _endNode:IsoNode;
		//
		private var _openList:Array;
		private var _closedList:Array;
		//
		private var _path:Array;
		private var _nodeMap:HashMap;
		//代价
		/**计算代价函数**/
		private var _heuristic : Function = diagonal;
		private var _straightCost:Number = 1.0;   //横向代价
		private var _diagCost:Number = Math.SQRT2;//斜向代价
		//路径优化
		private var _floydPath:Array;
		public function StaggeredAstar(grid:IsoGrid=null)
		{
			if(grid){
				createMap(grid);
			}
		}
		public function findPath(grid:IsoGrid,startNode:IsoNode,endNode:IsoNode):Boolean
		{
			trace(startNode.x,startNode.y,"|",endNode.x,endNode.y);
			//初始化
			createMap(grid);
			//
			_startNode = startNode;
			_endNode = endNode;
			_openList = new Array();  //待检查
			_closedList = new Array();//已经检查
			//开始点代价计算
			_startNode.g = 0;
			_startNode.h = _heuristic(_startNode);
			_startNode.f = _startNode.g+_startNode.h;
			//
			return search();
		}

		private function createMap(grid:IsoGrid):void
		{
			_grid = grid;
			_nodeMap = new HashMap();
			//寻路隐射
			var l:int = _grid.numCols;
			var l2:int = _grid.numRows;
			var node:IsoNode;
			var pt:Point;
			for(var i:int = 0; i < l2; i++)
			{
				for(var j:int = 0; j < l; j++)
				{
					node = _grid.getNode(j,i);
					pt = StaggeredUtil.getAstarPoint(i,j,l);
					node.tx = pt.x;
					node.ty = pt.y;
					_nodeMap.put(node.tx+"_"+node.ty,node);
				}
			}
		}


		private function search():Boolean
		{
			var startTime:int = getTimer();
			//
			var node:IsoNode = _startNode;
			var g:Number;
			var h:Number;
			var f:Number;
			var tmpNode:IsoNode;
			var cost:Number;
			var nodes:Array;
			var tNode2:IsoNode;
			var tNode3:IsoNode;
			while(node != _endNode)
			{
				// nodes 8方向节点数组
				nodes = getAroundNodes(node.x,node.y);
				// 遍历8方向节点
				for each(tmpNode in nodes){

					// tx 列
					// ty 行
					tNode2 = _nodeMap.get(node.tx+"_"+tmpNode.ty);
					tNode3 = _nodeMap.get(tmpNode.tx+"_"+node.ty);

					// 以下几种情况直接跳出循环体
					// 1.tmpNode节点是开始节点
					// 2.tmpNode节点不可以行走
					// 3.tNode2节点不可以行走
					// 3.tNode3节点不可以行走
					if(tmpNode == node
						|| !tmpNode.walkable
						|| !tNode2 || !tNode2.walkable
						|| !tNode3 || !tNode3.walkable
					){ continue;}

					// cost 8方向移动一格的代价 = 横向代价 = 1
					cost = _straightCost;

					// 不是（开始节点列 == tmpNode节点列，或者 开始节点行 == tmpNode节点行），移动一格代价 = 斜向代价 = 1.4
					if(!((node.tx == tmpNode.tx) || (node.ty == tmpNode.ty)))
					{
						cost = _diagCost;
					}

					// 计算g值 = 开始节点g值 + ( 移动一格的代价 * costMultiplier)
					// costMultiplier(猜测应该是移动一格的系数10）
					g = node.g + cost*node.costMultiplier;

					// 计算h值
					h=  _heuristic(tmpNode);

					// 计算f值
					f = g+h;

					// tmpNode在openList中，或者tmpNode在closeList中
					if(_openList.indexOf(tmpNode)!=-1 || _closedList.indexOf(tmpNode)!=-1)
					{
						// 已经计算过的tmpNode的f值大于f值，重新赋值tmpNode f g h parent属性值
						if(tmpNode.f > f)
						{
							tmpNode.f = f;
							tmpNode.g = g;
							tmpNode.h = h;
							tmpNode.parent = node;
						}
					}
					else
					{
						// 反之设置tmpNode的 f g h parent属性值
						tmpNode.f = f;
						tmpNode.g = g;
						tmpNode.h = h;
						tmpNode.parent = node;
						_openList.push(tmpNode);
					}
				}

				// 把node节点放到closeList
				_closedList.push(node);

				//openList 根据f值冒泡排序
				_openList.sortOn("f", Array.NUMERIC);

				if(_openList.length == 0){
					trace("没有找到路径");
					return false;
				}

				// node = 删除openList中f值最小的节点
				node = _openList.shift() as IsoNode;
			}
			trace( "time cost: " + (getTimer() - startTime) + "ms");

			// 根据node.parent 找出路径节点
			buildPath();
			return true;
		}
		/**
		 * @param x 列
		 * @param y 行
		 * */
		private function getAroundNodes(x:int,y:int):Array
		{
			var arr:Array=[];
			var checkX:int;
			var checkY:int;
			//左
			checkX = x-1;
			checkY = y;
			//右
			checkX = x+1;
			checkY = y;
			checkNode(checkX,checkY,arr);
			//上
			checkX = x;
			checkY = y-2;
			checkNode(checkX,checkY,arr);
			//下
			checkX = x;
			checkY = y+2;
			checkNode(checkX,checkY,arr);
			//左上
			checkX = x-1+(y&1); //y&1 y是偶数是0，不属于红色方块某个，x左边-1.奇数是1 意思是，这个节点属于红色方块，说明x坐标不变
			checkY = y-1;
			checkNode(checkX,checkY,arr);
			//左下
			checkX = x-1+(y&1);
			checkY = y+1;
			checkNode(checkX,checkY,arr);
			//右上
			checkX = x+(y&1);
			checkY = y-1;
			checkNode(checkX,checkY,arr);
			//右下
			checkX = x+(y&1);
			checkY = y+1;
			checkNode(checkX,checkY,arr);
			return arr;
		}
		private function checkNode(tx:int,ty:int,arr:Array):void
		{
			if(tx<0||tx>=_grid.numCols||ty<0||ty>=_grid.numRows){
				return;
			}else{
				arr.push(_grid.getNode(tx,ty));
			}
		}
		private function buildPath():Array
		{
			_path = new Array();
			var node:IsoNode = _endNode;
			_path.push(node);
			while(node != _startNode){
				node = node.parent;
				_path.unshift(node);
			}
			return _path;
		}
		//*************************************************
		//               启发函数
		//*************************************************
		/**
		 * 对角启发函数
		 * @param node
		 * @return
		 *
		 */
		private function diagonal(node:IsoNode):Number
		{
			var dx:Number = Math.abs(node.tx - _endNode.tx);
			var dy:Number = Math.abs(node.ty - _endNode.ty);
			var diag:Number = Math.min(dx, dy);
			var straight:Number = dx + dy;
			return _diagCost * diag + _straightCost * (straight - 2 * diag);
		}
		/**
		 * 曼哈顿启发函数
		 * @param node
		 * @return
		 *
		 */
		private function manhattan(node:IsoNode):Number
		{
			return Math.abs(node.tx - _endNode.tx) * _straightCost + Math.abs(node.ty + _endNode.ty) * _straightCost;
		}

		/**
		 * 欧几里得启发函数
		 * @param node
		 * @return
		 *
		 */
		private function euclidian(node:IsoNode):Number
		{
			var dx:Number = node.tx - _endNode.tx;
			var dy:Number = node.ty - _endNode.ty;
			return Math.sqrt(dx * dx + dy * dy) * _straightCost;
		}
		public function get path():Array
		{
			return _path;
		}
		public function get visited():Array
		{
			return _closedList.concat(_openList);
		}
		public function get floydPath():Array
		{
			return _floydPath;
		}
		//*************************************************
		//               路径优化
		//*************************************************
		/**
		 * 寻找替代节点
		 * @param fromNode
		 * @param toNode
		 * @return
		 */
		public function findReplacer(fromNode:IsoNode,toNode:IsoNode):IsoNode
		{
			var reNode:IsoNode = toNode;
			//去直线经过的节点取得到结束点最近的可通过点
			var arr:Vector.<Point> = PathUtil.determineTouchedTiles(new Point(fromNode.tx,fromNode.ty),new Point(toNode.tx,toNode.ty));
			var l:int = arr.length;
			var pt3:Point;
			var node:IsoNode;
			var arr2:Array=[];
			var dx:Number;
			var dy:Number;
			while(l--){
				pt3 = arr[l];
				node = _nodeMap.get(pt3.x+"_"+pt3.y);
				if(node && node.walkable == true){
					dx = toNode.tx-node.tx;
					dy = toNode.ty-node.ty;
					arr2.push({"node":node,"distance":dx*dx+dy*dy});
//					trace("添加",node.x,node.y,node.walkable);
				}
			}
			if(arr2.length>0){
				arr2 = arr2.sortOn("distance",Array.NUMERIC);
				reNode = arr2[0]["node"];
			}
			return reNode;
		}
		/**
		 * 弗洛伊德路径平滑处理
		 */
		public function floyd():void
		{
			if (path == null)
				return;
			_floydPath = path.concat();
			if(path.length<2){
				return;
			}
			var len:int = _floydPath.length;
			if (len > 2)
			{
				var vector:IsoNode = new IsoNode(0, 0);
				var tempVector:IsoNode = new IsoNode(0, 0);
				//遍历路径数组中全部路径节点，合并在同一直线上的路径节点
				//假设有1,2,3,三点，若2与1的横、纵坐标差值分别与3与2的横、纵坐标差值相等则
				//判断此三点共线，此时可以删除中间点2
				floydVector(vector, _floydPath[len - 1], _floydPath[len - 2]);
				for (var i:int = _floydPath.length - 3; i >= 0; i--)
				{
					floydVector(tempVector, _floydPath[i + 1], _floydPath[i]);
					if (vector.tx == tempVector.tx && vector.ty == tempVector.ty)
					{
						_floydPath.splice(i + 1, 1);
					}
					else
					{
						vector.tx = tempVector.tx;
						vector.ty = tempVector.ty;
					}
				}
			}
			//合并共线节点后进行第二步，消除拐点操作。算法流程如下：
			//如果一个路径由1-10十个节点组成，那么由节点10从1开始检查
			//节点间是否存在障碍物，若它们之间不存在障碍物，则直接合并
			//此两路径节点间所有节点。
			len = _floydPath.length;
			for (i = len - 1; i >= 0; i--)
			{
				for (var j:int = 0; j <= i - 2; j++)
				{
					if (hasBarrier(_floydPath[i].tx, _floydPath[i].ty, _floydPath[j].tx, _floydPath[j].ty) == false )
					{
						for (var k:int = i - 1; k > j; k--)
						{
							_floydPath.splice(k, 1);
						}
						i = j;
						len = _floydPath.length;
						break;
					}
				}
			}
		}
		private function floydVector(target:IsoNode, n1:IsoNode, n2:IsoNode):void
		{
			target.tx = n1.tx - n2.tx;
			target.ty = n1.ty - n2.ty;
		}
		/**
		 * 检测两点之间是否有障碍
		 * @param startX
		 * @param startY
		 * @param endX
		 * @param endY
		 * @return
		 */
		private function hasBarrier(startX:int, startY:int, endX:int, endY:int):Boolean
		{
			var ptArr:Vector.<Point> = PathUtil.determineTouchedTiles(new Point(startX,startY),new Point(endX,endY));
			var l:int = ptArr.length;
			var bl:Boolean=false;
			var pt:Point;
			var node:IsoNode;
			while(l--){
				pt = ptArr[l];
				node = _nodeMap.get(pt.x+"_"+pt.y);
				if(node && node.walkable==false){
					bl = true;
					break;
				}
			}
			return bl;
		}
	}
}