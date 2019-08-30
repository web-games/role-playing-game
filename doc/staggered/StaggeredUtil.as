package SG.Isometric.staggered
{
	import SG.utils.MathUtil;
	
	import flash.geom.Point;

	/**
	 * 45度菱形地图屏幕坐标转换
	 * @author Vibo
	 * @usage
	 *  x→→→
	 * y <><><><><><><><>
	 * ↓ <><><><><><><><>
	 * ↓ <><><><><><><><>
	 */
	public class StaggeredUtil
	{
		/**数据速度返回优化**/
		static private var rePoint:Point = new Point();
		/**
		 * 根据像素坐标获取网格坐标 
		 * @param tileWidth
		 * @param tileHeight
		 * @param px
		 * @param py
		 * @return 
		 * 
		 */
		static public function getTilePoint(tileWidth:int, tileHeight:int,px:int, py:int):Point
		{
			var xtile:int = 0;        //网格的x坐标
			var ytile:int = 0;        //网格的y坐标
			var cx:int, cy:int, rx:int, ry:int;
			px += tileWidth/2;
			py += tileHeight/2;
			cx = int(px / tileWidth) * tileWidth + tileWidth/2;        //计算出当前X所在的以tileWidth为宽的矩形的中心的X坐标
			cy = int(py / tileHeight) * tileHeight + tileHeight/2;     //计算出当前Y所在的以tileHeight为高的矩形的中心的Y坐标
			
			rx = (px - cx) * tileHeight/2;
			ry = (py - cy) * tileWidth/2;
			if (MathUtil.abs(rx)+MathUtil.abs(ry) <= tileWidth * tileHeight/4)
			{
				xtile = int(px / tileWidth);
				ytile = int(py / tileHeight) * 2;
			}else{
				px = px - tileWidth/2;
				py = py - tileHeight/2;
				xtile = int(px / tileWidth) + 1;
				ytile = int(py / tileHeight) * 2 + 1;
			}
			return new Point(xtile - (ytile&1), ytile);
		}
		/**
		 * 根据网格坐标获取像素坐标
		 * @param tileWidth     地块宽度
		 * @param tileHeight    地块高度
		 * @param tileY         网格坐标x
		 * @param tileY         网格坐标y
		 * @return 
		 * 
		 */
		static public function getPixelPoint(tileWidth:int,tileHeight:int,tileX:int,tileY:int):Point
		{
//			var rePoint:Point = new Point();
			rePoint.x = tileX * tileWidth + ( tileY & 1) * ( tileWidth / 2 ); 
			rePoint.y = tileY * tileHeight / 2; 
			return rePoint;
		}
		/**
		 * 获取深度  
		 * @param tileX       网格坐标x
		 * @param tileY       网格坐标y
		 * @param maxNumTile  最大宽度地块数
		 * @param tileWidth       网格坐标宽度
		 * @param tileHeight       网格坐标高度
		 * @return 
		 * 
		 */
		static public function getDepth(tileX:int,tileY:int,maxNumTile:int,tileWidth:int = 1,tileHeight:int = 1):int
		{
			
			return  tileY*maxNumTile+(tileX+tileHeight-1);
		}
		
		/**
		 * 转换为矩形坐标 
		 * @param row   行号
		 * @param col   列号
		 * @param w     列数
		 * @return 
		 * 
		 */
		static public function getAstarPoint(row:int ,col:int,w:int):Point
		{
			var rePoint:Point = new Point();
			if(row%2==1){
				//奇数行(R行C列W列数)
				//	R1=int(R0/2)+WO-C0;
				//	C1=int(Ro/2)+C0;
				//	参考算法：http://bbs.gameres.com/showthread.asp?threadid=159854
				//因为坐标处理方式是奇数行偏右处理方式，所以这里做了坐标修正
				rePoint.x = int(row/2)+w-col-1;
				rePoint.y = int(row/2)+col+1;
			}else{
				//偶数行
				//	R1=W-1+int(R0/2)-C0;
				//	C1=int(R0/2)+C0;
				rePoint.x = w-1+int(row/2)-col;
				rePoint.y = int(row/2)+col;
			}
			return rePoint;
		}
	}
}