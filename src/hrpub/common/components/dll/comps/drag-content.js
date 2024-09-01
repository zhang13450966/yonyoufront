/* eslint-disable array-callback-return */
import React, {Component} from 'react';
import { WidthProvider, Responsive } from "react-grid-layout";
const ResponsiveReactGridLayout = WidthProvider(Responsive);
import ReactEcharts from 'echarts-for-react';
import {returnOption} from './create-option'
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legendScroll'
import Carousel from 'bee-carousel';
import HryouImageBlack from '../images/hryou2.png'
import HrzuoImageBlack from '../images/hrzuo2.png'
import emptyImg1 from '../images/empty.png'
import emptyImg2 from '../images/empty2.png'
class DlContent extends Component{
    constructor (props) {
        super(props) 
        this.state = {

        }
    }
    componentDidMount () {
        const {otherParam} = this.props
        const {isBlackBg} = otherParam
        if (isBlackBg) {
            let btnNext = document.querySelectorAll('.swiper-button-next')[0]
            let btnPrev = document.querySelectorAll('.swiper-button-prev')[0]
            btnNext.style.backgroundImage = `url(${HryouImageBlack})`
            btnPrev.style.backgroundImage = `url(${HrzuoImageBlack})`
            btnNext.className += ' sbtNext'
            btnPrev.className += ' sbtPrev'
        }
    }
    componentDidUpdate () {
        const {otherParam, widgets} = this.props
        const {isAddOrDel} = otherParam
        if (isAddOrDel) {
            let slideIndex = widgets.length - 1
            setTimeout(() => {
                window.carousel.swiper.slideTo(slideIndex)
                if (widgets[slideIndex].length === 1 && widgets[slideIndex][0].empty) {
                    otherParam.setSaveAndDelHtmlDis(true)
                } else {
                    otherParam.setSaveAndDelHtmlDis(false)
                }
            }, 200)
            otherParam.setIsAddOrDel(false)
        }
    }
    componentWillReceiveProps (nextProps) {
        let delayTime1 = this.props.otherParam.delayTime
        let delayTime2 = nextProps.otherParam.delayTime
        if (delayTime1 !== delayTime2) {
            window.carousel.swiper.params.autoplay.delay = delayTime2
        }
    }
    // 计算表格
    dealTable = (data) => {
        if (data.length > 0) {
            let dataLen = data[0].length
            return data.map((item) => {
                let tdArr = item.map((itemItem) => {
                    return <td style={{width: `${100 / dataLen}%`}}>{itemItem}</td>
                })
                return <tr>{tdArr}</tr>
            })
        }
    }
    generateDOM = () => {
        const {widgets, otherParam, isEdit, defaultProps = {
            cols: { lg: 12 },
            breakpoints: { lg: 900 },
            rowHeight: 120
        }, layoutArr, onLayoutChange, onRemoveItem, chartData, tableData} = this.props
        let generateDOM = widgets.map((outetItem, outerIndex) => {
            if (outetItem.length === 1 && outetItem[0].empty) {
                return <div className={`blankDiv ${isEdit ? 'gridClass' : ''}`}><span style={{display: isEdit ? 'none' : 'table-cell'}} className="blankSpan">{otherParam.str1}</span></div>
            } else {
                let innerHtml = outetItem.map((innerItem, innerIndex) => {
                    let option = returnOption(innerItem.type, chartData, otherParam.isBlackBg)
                    let seriesDataLen = option.series[0].data.length
                    let title = option.title.text
                    let component = seriesDataLen === 0 ? <div className="emptyDiv" style={{background: otherParam.isBlackBg ? '#1F2A40' : '#fff'}}>
                        <div className="emptyFirst">{title}</div>
                        <div className="emptyCon">
                            <img className="emptyImg" src={otherParam.isBlackBg ? emptyImg2 : emptyImg1} alt=""/>
                            <span className="emptyText">{otherParam.str1}</span>
                        </div>
                    </div> : (
                        <ReactEcharts
                            echarts={echarts}
                            option={option}
                            notMerge={true}
                            lazyUpdate={true}
                            style={{ width: '100%', height: '100%' }}
                        />
                    )
                    return (
                        <div className="chartCon" style={{background: otherParam.isBlackBg ? '#1F2A40' : '#fff'}} key={innerItem.i} data-grid={innerItem}>
                            <span className={`removeChart ${isEdit ? 'editremove' : ''}`} onClick={() => onRemoveItem(outerIndex, innerIndex)}>x</span>
                            {component}
                            {innerItem.type === 'serviceVolumeTOP10' ? <div className="tabCon">
                                                                            <table className="sntTable" border="0" cellpadding="0" cellspacing="0">
                                                                                {this.dealTable(tableData)}
                                                                            </table>
                                                                        </div> : ''}
                            <div className="chartBorder" style={{borderBottom: otherParam.isBlackBg ? '1px solid #fff' : '1px solid #EEEEEE'}}></div>
                        </div>
                    );
                })
                return <ResponsiveReactGridLayout
                        className={`layout ${isEdit ? 'gridClass' : ''}`}
                        {...defaultProps}
                        layouts={layoutArr[outerIndex]}
                        style={{width: '100%'}}
                        onLayoutChange={(layout, layouts) =>
                            onLayoutChange(layout, layouts)
                        }
                        onWidthChange={
                            (containerWidth, margin, cols, containerPadding) => {
                                
                            }
                        }
                    >
                        {innerHtml}
                    </ResponsiveReactGridLayout>   
            }
        });
        return generateDOM
    }
    render () {
        const {setOuterIndex, otherParam, isEdit, widgets} = this.props
        // let widgetsLen = widgets.length  ${isEdit || widgetsLen === 1 ? '.hideNavigation' : ''}
        const params = {
            noSwiping: true,
            pagination: {   //配置页码参数 其中 renderBullet 是自定义页码
                paginationHide: true
            },
            navigation: {   //配置上一页下一页按钮
                nextEl: `.swiper-button-next`,
                prevEl: `.swiper-button-prev`
            },
            on: {
                slideChange: () => {
                    setOuterIndex(window.carousel.swiper.activeIndex)
                }
            },
            autoplay: {delay: otherParam.delayTime, disableOnInteraction: false},
            observer: true,
            observeParents: true
        }
        return (
            <div id="customized-pagination">
                <Carousel {...params} ref={node => {
                    window.carousel = node
                }}>
                    {this.generateDOM()}
                </Carousel>
            </div>
        )
    }
}
export default DlContent