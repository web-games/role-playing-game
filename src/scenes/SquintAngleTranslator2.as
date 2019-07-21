public class SquintAngleTranslator
{
  private var m_mapWid:int = 0;
  private var m_mapHei:int = 0;

  private var m_orgX:Number = 0;
  private var m_orgY:Number = 0;

  private var m_xincX:Number = 0;
  private var m_xincY:Number = 0;
  private var m_yincX:Number = 0;
  private var m_yincY:Number = 0;


  //初始化，设置地图网格横向纵向的数量及显示时大地图的范围
  public function InitlalRhombusMap( mapWid:int, mapHei:int, mapRange:Rectangle ):void
  {
    m_mapWid = mapWid;
    m_mapHei = mapHei;

    var count:Number = mapWid + mapHei;

    m_orgX = mapRange.left + mapRange.width / count;
    m_orgY = mapRange.top + mapWid * mapRange.height / count;

    // n_d
    m_xincX = mapRange.width / count;
    // n_l
    m_xincY = - mapRange.height / count;

    // m_r
    m_yincX = mapRange.width / count;
    // m_d
    m_yincY = mapRange.height / count;

  }

  //重设地图原点位置的偏移（用于地图滑动）
  public function SetOrgin( xpos:Number, ypos:Number ):void
  {
    m_orgX = xpos;
    m_orgY = ypos;
  }

  //地图网格坐标转换到屏幕显示坐标（用于提供给描画用）
  public function GridToView( xpos:int, ypos:int ):Point
  {
    var pos:Point = new Point();

    pos.x = m_orgX + m_xincX * xpos + m_yincX * ypos;
    pos.y = m_orgY + m_xincY * xpos + m_yincY * ypos;

    return pos;
  }

  //屏幕坐标转换到地图网格坐标（比如在即时战略中用于确定鼠标点击的是哪一块）
  public function ViewToGrid( xpos:Number, ypos:Number ):Point
  {
    var pos:Point = new Point();

    var coordX:Number = xpos - m_orgX;
    var coordY:Number = ypos - m_orgY;

    pos.x = ( coordX * m_yincY - coordY * m_yincX ) / ( m_xincX * m_yincY - m_xincY * m_yincX );
    pos.y = ( coordX - m_xincX * pos.x ) / m_yincX;

    pos.x = Math.round( pos.x );
    pos.y = Math.round( pos.y );

    return pos;
  }

  //判断网格坐标是否在地图范围内
  public function LegalGridCoord( xpos:int, ypos:int ):Boolean
  {
    if ( xpos < 0 || ypos < 0 || xpos >= m_mapWid || ypos >= m_mapHei )
    {
      return false;
    }

    return true;
  }

  //判断屏幕坐标是否在地图范围内
  public function LegalViewCoord( xpos:Number, ypos:Number ):Boolean
  {
    var pos:Point = ViewToGrid( xpos, ypos );

    return LegalGridCoord( pos.x, pos.y );
  }

  //格式化屏幕坐标，即返回最接近该坐标的一个格子的标准屏幕坐标（通常用于在地图中拖动建筑物对齐网格用）
  public function FormatViewPos( xpos:Number, ypos:Number ):Point
  {
    var pos:Point = ViewToGrid( xpos, ypos );

    if ( LegalGridCoord( pos.x, pos.y ) )
    {
      pos = GridToView( pos.x, pos.y );
    }else
    {
      pos.x = xpos;
      pos.y = ypos;
    }

    return pos;
  }

}