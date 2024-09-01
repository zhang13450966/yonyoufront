/**
 * Created by wanghongxiang on 2018/10/19.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {base, ajax, toast} from 'nc-lightapp-front';
import reactComposition from './util'

const {NCTextArea} = base
let isOnComposition = true
const isChrome = !!window.chrome && !!window.chrome.webstore
let isInnerChangeFromOnChange = false

class FormulaArea extends Component {
    static contextTypes = {
        ctx: PropTypes.object
    }

    constructor(props) {
        super(props)
        this.state = {
            inputSig: '',
            areaValTotal: '',
            isOnComposition: true,
            currentPosition: null
        }
        this.origin = true
        this.originData = ''
        this.onChange = this.onChange.bind(this)
        this.setCursorPosition = this.setCursorPosition.bind(this)
        this.setCurrentFormula = this.setCurrentFormula.bind(this)
    }

    componentDidMount() {

    }

    insertStr(soure, start, newStr) {
        console.log(soure, start, newStr)
        // if(start === 0){
        //     return newStr
        // }else{
        //     return soure.slice(0, start) + newStr + soure.slice(start)
        // }
        if(soure){
            return soure.slice(0, start) + newStr + soure.slice(start)
           
        }else{
           
            return newStr
        }
        
    }

    componentWillReceiveProps(newProps) {
        let currentArea = this.refs['hr-formula-editor-area']
        let currentPos = currentArea.selectionStart
        // debugger
        if (newProps.val) {
            console.log(this.state.areaValTotal,'this.state.areaValTotal')
            // let pos = this.state.currentPosition ? this.state.currentPosition : this.state.areaValTotal?this.state.areaValTotal.length :0
            let pos = this.state.currentPosition ? this.state.currentPosition : 0
            let str = this.insertStr(this.state.areaValTotal, pos, newProps.val)
            this.setState({
                inputSig: newProps.val,
                areaValTotal: str
            }, () => {
                this.setCursorPosition(currentArea, currentPos + newProps.val.length)
                this.context.ctx.handleState({
                    defined: true,
                    inputSig: '',
                    switchDefined: 0
                })
            })
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if ((nextState.areaValTotal && nextState.areaValTotal.slice(-9) === 'undefined') || this.state.areaValTotal === nextState.areaValTotal) {
            return false
        }
        return true
    }

    getCurrentFormula() {
        return this.state.areaValTotal
    }

    setCurrentFormula(val) {
        this.setState({
            areaValTotal: val
        })
    }

    /**
     *  设置输入域(input/textarea)光标的位置
     * @param elem
     * @param index
     */
    setCursorPosition = (elem, index) => {
        var val = elem.value;
        var len = val.length;
        // 超过文本长度直接返回
        if (len < index) return;
        setTimeout(function () {
            elem.focus();
            if (elem.setSelectionRange) {
                // 标准浏览器
                elem.setSelectionRange(index, index);
            } else {
                // IE9- 这个里面有问题在看
                var range = elem.createTextRange();
                range.moveStart('character', -len);
                range.moveEnd('character', -len);
                range.moveStart('character', index);
                range.moveEnd('character', 0);
                range.select();
            }
        }, 0);
    };

    onChange() {
        let currentArea = this.refs['hr-formula-editor-area']
        let textArea = currentArea.value;
        let flag = false
        if ((textArea && textArea.replace(/[\s\r\t]*/g, '')) !== (this.originData && this.originData.replace(/[\s\r\t]*/g, ''))) {
            flag = true
        }
        this.context.ctx.handleState({
            defined: flag,
            inputSig: '',
            switchDefined: 0
        })
    }

    onBlur() {
        let currentArea = this.refs['hr-formula-editor-area']
        let currentPos = currentArea.selectionStart
        this.setState({
            currentPosition: currentPos
        })
    }

    render() {
        return (
            <textarea
                ref="hr-formula-editor-area"
                className="hr-formula-area"
                value={this.state.areaValTotal}
                onBlur={this.onBlur.bind(this)}
                {
                    ...reactComposition({
                        onChange: (event) => {
                            var value = event.target.value
                            if (event.reactComposition.composition === false) {
                                this.setState({
                                    finalValue: value
                                })
                            }
                            this.setState({
                                areaValTotal: value
                            }, () => {
                                this.onChange()
                            })
                        }
                    })
                }
            ></textarea>
        )
    }
}

export default FormulaArea;
