#ifndef __ASTARPATHFINDER_H__
#define __ASTARPATHFINDER_H__

#include "cocos2d.h"

USING_NS_CC;

/**
 * 横向移动一格的路径评分
 */
static const int COST_HORIZONTAL = 20;

/**
 * 竖向移动一格的路径评分
 */
static const int COST_VERTICAL = 5;

/**
 * 斜向移动一格的路径评分
 */
static const int COST_DIAGONAL = 12;

class PathInfo;

/**
 * A星寻路类
 * @author hpking
 *
 */
class AStarPathFinder
{
	// 未探索的节点列表
    cocos2d::CCArray* _openSteps;
	// 已探索的,不需要再寻路的节点列表
    cocos2d::CCArray* _closedSteps;

	// 地图相关数据
	PathInfo* _pathInfo;

public:
	AStarPathFinder(PathInfo* info);
	virtual ~AStarPathFinder();

    /**
     * public 寻路
     *
     * @param CCPoint startPoint tile开始坐标点
     * @param CCPoint endPoint tile结束坐标点
     * @return CCArray* 读取方法:CCPointFromString ( string->getCString() )
     */
    CCArray* find( CCPoint startTilePt, CCPoint endTilePt );

private:
	// 最短路径步数
	class ShortestPathStep : public cocos2d::CCObject
	{
	public:
		bool initWithPosition( cocos2d::CCPoint pos )
		{
			bool bRet = false;

			do
			{
				position = pos;
				gScore = 0;
				hScore = 0;
				parent = NULL;
				inOpen = false;
				inClose = false;

				bRet = true;
			}
			while ( 0 );

			return bRet;
		}

		int fScore()
		{
			return this->getGScore() + this->getHScore();
		}

		inline bool operator==( const ShortestPathStep* other )
		{
			return isEqual( other );
		}

		bool isEqual( const ShortestPathStep* other )
		{
			return this->getPosition().equals ( other->getPosition() );
		}

		static ShortestPathStep* inst( cocos2d::CCPoint pos )
		{
			AStarPathFinder::ShortestPathStep* sps = new AStarPathFinder::ShortestPathStep;

			if ( sps && sps->initWithPosition ( pos ) )
			{
				sps->autorelease();
				return sps;
			}

			CC_SAFE_DELETE ( sps );
			return NULL;
		}

		CC_SYNTHESIZE( cocos2d::CCPoint, position, Position );
		CC_SYNTHESIZE( int, gScore, GScore );
		CC_SYNTHESIZE( int, hScore, HScore );
		CC_SYNTHESIZE( ShortestPathStep*, parent, Parent );
		CC_SYNTHESIZE( bool, inOpen, InOpen );
		CC_SYNTHESIZE( bool, inClose, InClose );

	private:
		cocos2d::CCString* description()
		{
			return CCString::createWithFormat ( "pos = [%f, %f], g=%d, h=%d, f=%d", this->getPosition().x, this->getPosition().y, this->getGScore(), this->getHScore(), this->fScore() );
		}
	};

private:
    void destroyLists();

    CCArray* createPath( ShortestPathStep* step );//int xStart, int yStart
    
	void findAndSort( ShortestPathStep* step );

	void insertAndSort( ShortestPathStep* step );

    /**
     * private  判断是否超出边界或路点是否可走
     *
     * @param CCPoint tpt 
     * @return bool 
     */
    bool isWalkable( CCPoint tpt );

    /**
     * private  计算G值
     *
     * @param Node * curNode
     * @param Node * node
     * @return int
     */
    int getGValue( ShortestPathStep* curStep, ShortestPathStep* step );

    /**
     * private  计算H值
     *
     * @param Node * curNode
     * @param Node * endNode
     * @param Node * node
     * @return int
     */
    int getHValue( ShortestPathStep* curStep, ShortestPathStep* endStep, ShortestPathStep* step );

    cocos2d::CCArray* getAroundsNode( CCPoint tPt );

	bool isInClosed(CCPoint tPt);

    void setOpenSteps ( cocos2d::CCArray* var );
    void setClosedSteps ( cocos2d::CCArray* var );
    void setShortestPath ( cocos2d::CCArray* var );
};

#endif

#include "AStarPathFinder.h"
#include "map/PathInfo.h"

AStarPathFinder::AStarPathFinder( PathInfo* info )
{
    _pathInfo = info;
    _openSteps = NULL;
    _closedSteps = NULL;
}

AStarPathFinder::~AStarPathFinder()
{
    destroyLists();
}

// 获取毫秒时间
long msNow()
{
	struct cc_timeval now;
	CCTime::gettimeofdayCocos2d( &now, NULL );
	return ( now.tv_sec * 1000 + now.tv_usec / 1000 );
}

CCArray* AStarPathFinder::find( CCPoint startTilePt, CCPoint endTilePt )
{
    bool isFinded = false; //能否找到路径，true-已找到

    // 到达终点
    if ( startTilePt.equals ( endTilePt ) )
    {
        CCLog ( "You're already there! :P" );
        return NULL;
    }

    // 终点不可走,直接退出(可优化为最近的可走地点停止)
    if ( !isWalkable( endTilePt ) )
    {
        CCLog ( "blocked! :P" );
        return NULL;
    }

    // 设置打开和封闭步数
    setOpenSteps ( CCArray::create() );
    setClosedSteps ( CCArray::create() );

    //CCLog ( "From:(%f, %f) To(%f, %f)", startTilePt.x, startTilePt.y, endTilePt.x, endTilePt.y );

    // 结束坐标
    ShortestPathStep* endStep = ShortestPathStep::inst ( endTilePt );

    // 插入开始点
    insertAndSort ( ShortestPathStep::inst ( startTilePt ) );

    ShortestPathStep* curStep;
    long time1 = msNow();

    do
    {
        // 取出并删除开放列表第一个元素
        curStep = ( ShortestPathStep* ) _openSteps->objectAtIndex ( 0 );
        curStep->setInClose( true );
        curStep->setInOpen( false );
        _closedSteps->addObject ( curStep );
        _openSteps->removeObjectAtIndex ( 0 );

        // 当前节点==目标节点
        if ( curStep->getPosition().equals( endTilePt ) )
        {
            isFinded = true; //能达到终点，找到路径
            break;
        }

        // 取相邻八个方向的节点，去除不可通过和已在关闭列表中的节点
        CCArray* aroundNodes  = getAroundsNode ( curStep->getPosition() );
        //CCLog("8 dirc %d",aroundNodes->count());
        CCObject* obj;
        CCARRAY_FOREACH ( aroundNodes, obj )
        {
            // 计算 G， H 值
            CCString* string = ( CCString* ) obj;
            ShortestPathStep* nextStep = new ShortestPathStep;
            nextStep->initWithPosition ( CCPointFromString ( string->getCString() ) );

            int g = getGValue ( curStep , nextStep );
            int h = getHValue ( curStep , endStep , nextStep );

            if ( nextStep->getInOpen() ) // 如果节点已在播放列表中
            {
                // 如果该节点新的G值比原来的G值小,修改F,G值，设置该节点的父节点为当前节点
                if ( g < nextStep->getGScore() )
                {
                    nextStep->setGScore( g );
                    nextStep->setHScore( h );
                    nextStep->setParent( curStep );
                    findAndSort ( nextStep );
                    nextStep->release();
                }
            }
            else // 如果节点不在开放列表中
            {
                // 插入开放列表中，并按照估价值排序
                nextStep->setGScore( g );
                nextStep->setHScore( h );
                nextStep->setParent( curStep );

                insertAndSort ( nextStep );
                nextStep->release();
            }

            //CCLog("open num:%d",_openSteps->count());
        }
    }
    while ( _openSteps->count() > 0 );

    CCLog( "a* time:%d", msNow() - time1 );

    /*if( _openSteps )
    CCLog( "finded:%d, openlen %d, closelen %d", isFinded ? 1 : 0, _openSteps->count(), _closedSteps->count() );*/

    // 找到路径
    if ( isFinded )
    {
        CCArray* path = createPath ( curStep );

        destroyLists ();

        return path;
    }
    else // 没有找到路径
    {
        destroyLists ();

        return NULL;
    }
}

void AStarPathFinder::destroyLists()
{
    CC_SAFE_RELEASE_NULL ( _openSteps );
    CC_SAFE_RELEASE_NULL ( _closedSteps );
}

CCArray* AStarPathFinder::createPath( ShortestPathStep* step )//int xStart, int yStart
{
    CCArray* path = CCArray::create();

    CCString* str;

    do
    {
        if ( step->getParent() != NULL )
        {
            str = CCString::createWithFormat ( "{%f, %f}", step->getPosition().x, step->getPosition().y );
            path->insertObject ( str, 0 );
        }

        step = step->getParent();
    }
    while ( step != NULL );

    return path;
}

void AStarPathFinder::findAndSort( ShortestPathStep* step )
{
    unsigned int count = _openSteps->count();

    if ( count < 1 )
        return;

    int stepFScore = step->fScore();

    for ( unsigned int i = 0; i < count; i++ )
    {
        ShortestPathStep* sps = ( ShortestPathStep* ) _openSteps->objectAtIndex ( i );

        if ( stepFScore <= sps->fScore() )
            _openSteps->insertObject ( step, i );

        if ( step->getPosition().equals( sps->getPosition() ) )
            _openSteps->removeObjectAtIndex( i );
    }
}

void AStarPathFinder::insertAndSort( ShortestPathStep* step )
{
    step->setInOpen( true );

    int stepFScore = step->fScore();
    unsigned int count = _openSteps->count();

    if( count == 0 )
        _openSteps->addObject( step );
    else
    {
        for ( unsigned int i = 0; i < count; i++ )
        {
            ShortestPathStep* sps = ( ShortestPathStep* ) _openSteps->objectAtIndex ( i );

            if ( stepFScore <= sps->fScore() )
            {
                _openSteps->insertObject ( step, i );
                return;
            }
        }
    }
}

bool AStarPathFinder::isWalkable( CCPoint tPt )
{
    // 1. 是否是有效的地图上点（数组边界检查）
    if ( tPt.x < _pathInfo->startPt.x || tPt.x >= _pathInfo->iCol )
        return false;

    if ( tPt.y < _pathInfo->startPt.y || tPt.y >= _pathInfo->iRow )
        return false;

    // 2. 是否是walkable
    return _pathInfo->isWalkable( tPt );
}


/**
 * private  计算G值
 *
 * @param ShortestPathStep * curStep
 * @param ShortestPathStep * step
 * @return int
 */
int AStarPathFinder::getGValue( ShortestPathStep* curStep, ShortestPathStep* step )
{
    int g  = 0;

    if ( curStep->getPosition().y == step->getPosition().y ) // 横向  左右
    {
        g = curStep->getGScore() + COST_HORIZONTAL;
    }
    else if ( curStep->getPosition().y + 2 == step->getPosition().y || curStep->getPosition().y - 2 == step->getPosition().y ) // 竖向  上下
    {
        g = curStep->getGScore() + COST_VERTICAL * 2;
    }
    else // 斜向  左上 左下 右上 右下
    {
        g = curStep->getGScore() + COST_DIAGONAL;
    }

    return g;
}

/**
 * private  计算H值
 *
 * @param ShortestPathStep * curStep
 * @param ShortestPathStep * endStep
 * @param ShortestPathStep * step
 * @return int
 */
int AStarPathFinder::getHValue( ShortestPathStep* curStep, ShortestPathStep* endStep, ShortestPathStep* step )
{
    if ( curStep == NULL || endStep == NULL || step == NULL )
        return 0;

    // 节点到0，0点的x轴距离
    int to0  = step->getPosition().x * COST_HORIZONTAL + ( ( int )step->getPosition().y & 1 ) * COST_HORIZONTAL / 2;

    // 终止节点到0，0点的x轴距离
    int endTo0  = endStep->getPosition().x * COST_HORIZONTAL + ( ( int )endStep->getPosition().y & 1 ) * COST_HORIZONTAL / 2;

    return abs ( ( float )endTo0 - ( float )to0 ) + abs ( ( float )endStep->getPosition().y - ( float )step->getPosition().y ) * COST_VERTICAL;
}

cocos2d::CCArray* AStarPathFinder::getAroundsNode( CCPoint tPt )
{
    CCArray* aroundNodes = CCArray::create();

    /// 菱形组合的地图八方向与正常不同

    // 左
    CCPoint p = CCPointMake ( tPt.x - 1, tPt.y );
    CCString* str;

    if ( isWalkable ( p ) && !isInClosed( p ) ) // 可走并且不在关闭列表
    {
        str = CCString::createWithFormat ( "{%f, %f}", p.x, p.y );
        //CCLOG( "left=%s", str->getCString() );
        aroundNodes->addObject ( str );
    }

    // 右
    p = CCPointMake ( tPt.x + 1, tPt.y );

    if ( isWalkable ( p ) && !isInClosed( p ) )
    {
        str = CCString::createWithFormat ( "{%f, %f}", p.x, p.y );
        // CCLOG( "right=%s", str->getCString() );
        aroundNodes->addObject ( str );
    }

    // 上
    p = CCPointMake ( tPt.x, tPt.y - 2 );  // -2

    if ( isWalkable ( p ) && !isInClosed( p ) )
    {
        str = CCString::createWithFormat ( "{%f, %f}", p.x, p.y );
        //CCLOG( "up=%s", str->getCString() );
        aroundNodes->addObject ( str );
    }

    // 下
    p = CCPointMake ( tPt.x, tPt.y + 2 );// + 2

    if ( isWalkable ( p ) && !isInClosed( p ) )
    {
        str = CCString::createWithFormat ( "{%f, %f}", p.x, p.y );
        //CCLOG( "down=%s", str->getCString() );
        aroundNodes->addObject ( str );
    }

    // 左上
    p = CCPointMake ( tPt.x - 1 + ( ( int )tPt.y & 1 ), tPt.y - 1 );

    if ( isWalkable ( p ) && !isInClosed( p ) )
    {
        str = CCString::createWithFormat ( "{%f, %f}", p.x, p.y );
        //CCLOG( "leftUp=%s", str->getCString() );
        aroundNodes->addObject ( str );
    }

    // 左下
    p = CCPointMake ( tPt.x - 1 + ( ( int )tPt.y & 1 ), tPt.y + 1 );

    if ( isWalkable ( p ) && !isInClosed( p ) )
    {
        str = CCString::createWithFormat ( "{%f, %f}", p.x, p.y );
        //CCLOG( "leftDown=%s", str->getCString() );
        aroundNodes->addObject ( str );
    }

    //右上
    p = CCPointMake ( tPt.x + ( ( int )tPt.y & 1 ), tPt.y - 1 );

    if ( isWalkable ( p ) && !isInClosed( p ) )
    {
        str = CCString::createWithFormat ( "{%f, %f}", p.x, p.y );
        //CCLOG( "rightUp=%s", str->getCString() );
        aroundNodes->addObject ( str );
    }

    //右下
    p = CCPointMake ( tPt.x + ( ( int )tPt.y & 1 ), tPt.y + 1 );

    if ( isWalkable ( p ) && !isInClosed( p ) )
    {
        str = CCString::createWithFormat ( "{%f, %f}", p.x, p.y );
        //CCLOG( "rightDown=%s", str->getCString() );
        aroundNodes->addObject ( str );
    }

    return aroundNodes;
}

bool AStarPathFinder::isInClosed( CCPoint pt )
{
    CCObject* temp;
    CCARRAY_FOREACH ( _closedSteps, temp )
    {
        ShortestPathStep* sps = ( ShortestPathStep* ) temp;

        if( sps->getPosition().equals( pt ) )
        {
            return true;
        }
    }

    return false;
}

void AStarPathFinder::setOpenSteps ( cocos2d::CCArray* var )
{
    if ( _openSteps != var )
    {
        CC_SAFE_RELEASE_NULL ( _openSteps );
        CC_SAFE_RETAIN ( var );
        _openSteps = var;
    }
}

void AStarPathFinder::setClosedSteps ( cocos2d::CCArray* var )
{
    if ( _closedSteps != var )
    {
        CC_SAFE_RELEASE_NULL ( _closedSteps );
        CC_SAFE_RETAIN ( var );
        _closedSteps = var;
    }
}

void AStarPathFinder::setShortestPath ( cocos2d::CCArray* var )
{
    /*if ( shortestPath != var )
    {
    CC_SAFE_RELEASE_NULL ( shortestPath );
    CC_SAFE_RETAIN ( var );
    shortestPath = var;
    }*/
}