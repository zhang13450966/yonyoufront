/**
 * @file 电子表格 sheet 页签，React包装版本
 * @author 预算报表产品部
 */

import React, { Component } from 'react';
import { base, getMultiLang } from 'nc-lightapp-front';
import { rendererSheet } from './sheet/index';
import './index.less';
 
const { NCDiv } = base;
export default class Sheet extends Component {
    static defaultProps = {
        id: 'ys',
        getSheet: (s, d) => {

        }
    }
    constructor(props) {
        super(props);
        this.state = {
        };
        this.pk_sheet = '';
    }
    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    componentDidMount() {
        this.props.getSheet(this.renderSheet, this.cleanSheet, `${this.props.id}-sheet`);
    }

    // 初始化sheet标签实例
    renderSheet = (flag) => {
        let sheetObj = document.getElementById(`${this.props.id}-sheet`);
        if(sheetObj){
            sheetObj.innerHTML = '';
        }
        this.sheet = rendererSheet({
            selector: `#${this.props.id}-sheet`
        });
        return this.sheet;
    }

    //清空sheet内容 
    cleanSheet = () => {
        let sheetObj = document.getElementById(`${this.props.id}-sheet`);
        if(sheetObj){
            sheetObj.innerHTML = '';
        }
    }

    // 初始化组件Dom
    render() {
        return (
            <NCDiv areaCode={NCDiv.config.TABS}>
                <div id={`${this.props.id}-sheet`} ref={ref => this.sheetRef = ref} className="r-sheet"></div>
            </NCDiv>
        );
    }
}
