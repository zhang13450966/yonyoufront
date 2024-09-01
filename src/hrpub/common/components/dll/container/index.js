/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import React, {Component} from 'react';
import DlContent from '../comps/drag-content'
import {DlSlider} from '../comps/slider'
import {transferWidgetsToLayout, calculationWhAndReturnType} from '../utils'
import './index.less'
import {toast} from 'nc-lightapp-front';
import {isBlackBg} from 'src/hrpub/common/utils/utils.js'
let isBlackBgFlag = isBlackBg()
/**
 * 
 * @param {*} isEdit isEdit设置是否为编辑态
 * @param {*} listArr slider数组
 * @param {*} initialWidgets 展示态使用 
 */
class DlContainer extends Component{
    constructor (props) {
        super(props)
        this.state = {
            outerIndex: 0,
            widgets: props.initialWidgets,
            layoutArr: transferWidgetsToLayout(props.initialWidgets)
        }
    }
    componentWillReceiveProps (nextProps) {
        this.setState({
            widgets: nextProps.initialWidgets,
            layoutArr: transferWidgetsToLayout(nextProps.initialWidgets)
        })
    }
    setOuterIndex = (outerIndex) => {
        this.setState({
            outerIndex
        })
    }
    // 增
    addChart = (type, config = {}) => {
        const {outerIndex, widgets} = this.state
        const {otherParam} = this.props
        let widgetsLen = widgets.length
        let typeArr = []
        for (let k = 0; k < widgetsLen; k++) {
            let widgetsItem = widgets[k]
            let innerTypeArr = []
            for (let o = 0; o < widgetsItem.length; o++) {
                let widgetsItemItem = widgetsItem[o]
                if (widgetsItemItem.type) {
                    innerTypeArr.push(widgetsItemItem.type)
                }
            }
            typeArr.push(innerTypeArr)
        }
        if (typeArr[outerIndex].indexOf(type) !== -1) {
            toast({
                color: 'warning',
                content: otherParam.str2 // 此类型已添加
            })
            return false
        }
        
        let newWidgets = [...widgets]
        let w = 3, h = 3
        switch (type) {
            case 'serviceVolumeTOP10':
                w = 6
                h = 6
                break;
            case 'businessStatusStatistics':
                w = 6
                h = 3
                break;
            default:break;
        }
        if (newWidgets[outerIndex].length === 1 && newWidgets[outerIndex][0].empty) {
            newWidgets[outerIndex].splice(0, 1)
        }
        let newWidgetsItem = newWidgets[outerIndex]
        let newWidgetsItemLen = newWidgetsItem.length
        let copyLen = newWidgetsItemLen
        for (let a = 0; a < newWidgetsItemLen; a++) {
            if (newWidgetsItem[a].type === 'serviceVolumeTOP10' || newWidgetsItem[a].type === 'businessStatusStatistics') {
                copyLen = copyLen + 1
            }
        }
        const addItem = Object.assign({
            x: (copyLen * 3) % (12),
            y: Infinity, // puts it at the bottom
            w,
            h,
            i: new Date().getTime().toString(),
        }, config);
        newWidgets[outerIndex].push({ ...addItem, type})
        this.setState({
            widgets: newWidgets
        })
        otherParam.setSaveAndDelHtmlDis(false)
    };
    // 删
    onRemoveItem = (outerIndex, innerIndex) => {
        const {widgets} = this.state
        const {otherParam} = this.props
        let copyWidgets = [...widgets]
        let outerItem = copyWidgets[outerIndex]
        outerItem.splice(innerIndex, 1)
        if (outerItem.length === 0) {
            outerItem.push({empty: true})
        }
        this.setState({
            widgets: copyWidgets
        })
        if (copyWidgets[outerIndex].length === 1 && copyWidgets[outerIndex][0].empty) {
            otherParam.setSaveAndDelHtmlDis(true)
        }
    }
    // 改
    onLayoutChange = (current, allLayouts) => {
        const {widgets, outerIndex} = this.state
        if (outerIndex < (widgets.length - 1) || outerIndex === (widgets.length - 1)) {
            widgets[outerIndex].map(w => {
                current.map(c => {
                    if (w.i === c.i) {
                        w = Object.assign(w, c)
                    }
                })
            })
            this.setState({
                widgets
            })
        }
    }
    // 览
    render () {
        const {otherParam, defaultProps, chartData = {}, tableData = [[]], isEdit = false, listArr = []} = this.props
        const {widgets, layoutArr} = this.state
        const {isShowBtnAndLeft} = otherParam
        return (
            <div className="dl">
                <div className="dl-left" style={{background: isBlackBgFlag ? '#0f1013' : '#fff', display: isShowBtnAndLeft ? '' : 'none'}}>
                    <DlSlider dataArr={listArr} addChart={this.addChart.bind(this)} isEdit={isEdit}/>
                </div>
                <div className="dl-right" style={{background: isBlackBgFlag ? '#0f1013' : '#E6E9E9'}}>
                    <DlContent 
                        otherParam={otherParam}
                        chartData={chartData}
                        tableData={tableData}
                        isEdit={isEdit}
                        widgets={widgets}
                        layoutArr={layoutArr}
                        onLayoutChange={this.onLayoutChange.bind(this)}
                        onRemoveItem={this.onRemoveItem.bind(this)}
                        defaultProps={defaultProps}
                        setOuterIndex={this.setOuterIndex.bind(this)}
                    />
                </div>
            </div>
        )
    }
}
export default DlContainer
