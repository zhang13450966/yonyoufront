import React, { Component } from 'react';

import './index.less';
import {base} from 'nc-lightapp-front'

const {
    NCCheckbox,
    NCTooltip,
    NCFormControl 
} = base;
import {getColor} from '../../utils/utils';

const {color, bgColor} = getColor();

/**
 * 
 * leftData : {
 *      key: 11,
 *      display: <div>ddd</div>,
 *      data: {
 *          name: ''
 *      }
 * }
 * 
 * rightData: => 格式与leftData相同 leftData
 * onChange    function (leftData, rightData)
 * 
 * leftTitle : 
 * rightTitle : 
 */

const allCheckTable = {
    all: {
        checked: true
    },
    none: {
        checked: false
    },
    part: {
        checked: false,
        indeterminate: true
    }
};

class Transfer extends Component {
    constructor (props) {
        super(props);
        this.state = {
            leftAllChecked: '', // 左侧全选按钮状态，all, none，part
            rightAllChecked: '', // 右侧全选按钮状态，all, none，part
            leftChecked: {},
            rightChecked: {},
            leftCheckedCount: 0,
            rightCheckedCount: 0,
            leftData: props.leftData,
            rightData: props.rightData,
            leftArrowDisabled: true, // 向左的箭头禁用
            rightArrowDisabled: true, // 向右的箭头禁用
            language: {}, // 多语言
            checkDisabled: false,// 默认显示多选框
            single:props.single?true:false,//是否启用单选模式 默认值为false
            singleLeft:props.leftData && props.leftData.length?props.leftData.map((item,index)=>{
                return false
            }):[],
            searchValue: '',
            from: props.from || '' // 花名册得排序不按之前得逻辑，而是直接在最后添加， 为了不影响别的节点
        };

        this.changeCheckBox = this.changeCheckBox.bind(this);
        this.changeAllCheckbox = this.changeAllCheckbox.bind(this);
        this.toChange = this.toChange.bind(this);
        this.getLanguage = this.getLanguage.bind(this);
        this.searchOnChange = this.searchOnChange.bind(this)
        this.changeSingleStatus = this.changeSingleStatus.bind(this)
    }

    componentDidMount() {
        this.getLanguage();
    }

    getLanguage() {
        this.props.MultiInit.getMultiLang({
            domainName: 'hrpub',
            moduleId: 'hrpub',
            callback: (json, status, init) => {
                this.setState({
                    language: json
                });
            }
        });
    }

    toChange(direction) {
        return async () => {
            let {
                leftData,
                rightData,
                leftChecked,
                rightChecked,
                single
            } = this.state;

            if ('leftData' in this.props) {
                leftData = this.props.leftData
            }
            if ('rightData' in this.props) {
                rightData = this.props.rightData
            }
            if (
                (direction === 'toRight' && Object.keys(leftChecked).length <= 0)
                || (direction === 'toLeft' && Object.keys(rightChecked).length <= 0)
            ) {
                return;
            }
            let source = direction === 'toRight' ? [...leftData] : [...rightData];
            let target = direction === 'toRight' ? [...rightData] : [...leftData];
            let checked = direction === 'toRight' ? leftChecked : rightChecked;

            let nSource = [];
            let singleResult = []
            source.forEach((item, index) => {
                if (checked[item.key] && checked[item.key].status) {
                    if (target.length > index && this.state.from !== 'rosterSetting') {
                        target.splice(index, 0, item);
                    }
                    else {
                        target.push(item);
                    }
                }
                else {
                    nSource.push(item);
                }
            });

            if (direction === 'toLeft') {
                let tmp = nSource;
                nSource = target;
                target = tmp;
                if(single){
                    singleResult = nSource.map((item,index)=>{
                        return false
                    }) 
                }
            }
            if(direction === 'toRight' && single && nSource.length != 0){
                singleResult = nSource.map((item,index)=>{
                    return true
                })
            }else if(direction === 'toRight' && !single){
                singleResult = nSource.map((item,index)=>{
                    return false
                })
            }
           await this.setState({
                leftData: nSource,
                rightData: target,
                singleLeft:singleResult,
                leftChecked: {},
                rightChecked: {},
                leftCheckedCount: 0,
                rightCheckedCount: 0,
                leftAllChecked: 'none',
                rightAllChecked: 'none',
            });
            if (this.props.onChange) {
                this.props.onChange(nSource, target,direction);
            }
        }
    }

    changeSingleStatus(leftData) {
        let singleResult = []
        let {
            rightData,
            single
        } = this.state;
        if(single && leftData.length != 0 && rightData.length !== 0) {
            singleResult = leftData.map((item,index)=>{
                return true
            })
        }
        this.setState({
            singleLeft: singleResult
        })
    }
    changeAllCheckbox(type) {
        return (status) => {
            let {
                leftData,
                rightData,
            } = this.state;
            if ('leftData' in this.props) {
                leftData = this.props.leftData
            }
            if ('rightData' in this.props) {
                rightData = this.props.rightData
            }

            let nChecked = {};

            let data = type === 'left' ? leftData : rightData

            data.map((item) => {
                nChecked[item.key] = {
                    status: status,
                    data: item
                };
            });

            let checkedName = `${type}Checked`;
            let checkedAllName = `${type}AllChecked`;

            let typeCount = `${type}CheckedCount`;

            this.setState({
                [checkedName]: nChecked,
                [checkedAllName]: status ? 'all' : 'none',
                [typeCount]: status ? data.length : 0
            });
        }
    }

    changeCheckBox(item, type, index) {
        return (status) => {
            let {
                leftChecked,
                leftCheckedCount,
                rightChecked,
                rightCheckedCount,
                leftData,
                rightData,
                single,
                singleLeft
            } = this.state;
            if ('leftData' in this.props) {
                leftData = this.props.leftData
            }
            if ('rightData' in this.props) {
                rightData = this.props.rightData
            }
            let allChecked = '';
            let nCount = 0;

            if (type === 'left') {
                nCount = status ? leftCheckedCount + 1 : leftCheckedCount - 1;
            }
            else {
                nCount = status ? rightCheckedCount + 1 : rightCheckedCount - 1;
            }

            if (nCount === 0) {
                allChecked = 'none';
            }
            else if (
                (type === 'left' && nCount === leftData.length)
                || (type === 'right' && nCount === rightData.length)
            ) {
                allChecked = 'all';
            }
            else {
                allChecked = 'part';
            }

            if (type === 'left') {
                if(single && typeof index === 'number'){
                    let resultLeftData = [];
                    if(status === false){
                        resultLeftData = singleLeft.map((it,i)=>{
                                it = false
                            return it
                        })
                    }else{
                        resultLeftData = singleLeft.map((it,i)=>{
                            if(index !== i){
                                it = true
                            }
                            return it
                        })
                    }
                    this.setState({
                        singleLeft:resultLeftData
                    })
                }
                this.setState({
                    leftChecked: {
                        ...leftChecked,
                        [item.key]: {
                            status: status,
                            data: item
                        }
                    },
                    leftCheckedCount: nCount,
                    leftAllChecked: allChecked
                }, () => {
                    if (this.props.onChecked) {
                        this.props.onChecked && this.props.onChecked(type, this.state.leftChecked);
                    }
                });
            }
            else {
                this.setState({
                    rightChecked: {
                        ...rightChecked,
                        [item.key]: {
                            status: status,
                            data: item
                        }
                    },
                    rightCheckedCount: nCount,
                    rightAllChecked: allChecked
                }, () => {
                    this.props.onChecked && this.props.onChecked(type, this.state.rightChecked);
                });
            }
        }
    }

    componentWillReceiveProps(props) {
        if (this.props.leftData !== props.leftData) {
            this.state.leftAllChecked = 'none'
        }
        if (this.props.checkDisabled !== undefined) {
            this.state.checkDisabled = props.checkDisabled

            this.state.leftChecked = {}
            this.state.rightChecked = {}
            this.state.leftCheckedCount = 0
            this.state.rightCheckedCount = 0
            this.state.leftAllChecked = 'none'
            this.state.rightAllChecked = 'none'

        }
        this.setState(this.state);
    }
    searchOnChange(val) {
        this.setState({
            searchValue: val
        }, () => {
            this.props.searchOnChange && this.props.searchOnChange(val, this.changeSingleStatus)
        })
    }   
    render() {
        const {
            leftTitle,
            rightTitle,
            leftData: propsLeftData,
            rightData: propsRightData,
            leftCheckTitle, //左多选框标题
            rightCheckTitle, //右多选框标题
            className,
            style = {},
            search= false
        } = this.props;

        let {
            leftAllChecked,
            leftChecked,
            rightAllChecked,
            rightChecked,
            leftData = [],
            rightData = [],
            leftCheckedCount,
            rightCheckedCount,
            language,
            checkDisabled,
            single,
            singleLeft,
            searchValue
        } = this.state;
        
        propsLeftData && (leftData = propsLeftData)
        propsRightData && (rightData = propsRightData);

        let rightArrowDisabled = leftCheckedCount <= 0;
        let leftArrowDisabled = rightCheckedCount <= 0;

        return (
            <div
                className={`transfer-wrapper ${className || ''}`}
                style={style}
            >
                <div>
                {search && <NCFormControl 
                    value={searchValue}
                    onChange={this.searchOnChange}
                    type={"search"}>
                    </NCFormControl>}
                </div>
                
                <div className="transfer-box">
                    {
                        !leftTitle && !rightTitle ? null :
                            <div className="transfer-list-title">
                                {leftTitle ? leftTitle : ''}
                            </div>
                    }
                    <div className="transfer-left-wrapper">
                        <div className="transfer-title-wrapper">
                            <If condition = {!single}>
                                <NCCheckbox
                                    disabled={checkDisabled}
                                    {...allCheckTable[leftAllChecked]}
                                    onChange={this.changeAllCheckbox('left')}
                                >
                                    {leftCheckTitle || language['hrpub-000071']/** 全选 */}
                                </NCCheckbox>
                            </If>
                        </div>
                        {leftData.map((item, index) => {
                            return (
                                <div className="transfer-item-wrapper">
                                    {item.prefix || null}
                                    <NCCheckbox
                                        disabled={!single?checkDisabled:this.state.singleLeft[index]}
                                        checked={leftChecked[item.key] && leftChecked[item.key].status}
                                        onChange={this.changeCheckBox(item, 'left',index)}
                                    >
                                        {item.display}
                                    </NCCheckbox>
                                    {item.suffix || null}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="transfer-operation-wrapper">
                    <div className="transfer-operation-button-list">
                        <div
                            className={`transfer-operation-button-wrapper ${rightArrowDisabled && 'disabled'}`}
                            onClick={this.toChange('toRight')}
                            style={{
                                // color: color,
                                // backgroundColor: bgColor
                            }}
                        >
                            {'>'}
                        </div>
                        <div
                            className={`transfer-operation-button-wrapper ${leftArrowDisabled && 'disabled'}`}
                            onClick={this.toChange('toLeft')}
                            style={{
                                // color: color,
                                // backgroundColor: bgColor
                            }}
                        >
                            {'<'}
                        </div> 
                    </div>
                </div>
                <div className="transfer-box">
                    {
                        !leftTitle && !rightTitle ? null :
                            <div className="transfer-list-title">
                                {rightTitle ? rightTitle : ''}
                            </div>
                    }
                    <div className="transfer-right-wrapper">
                        <div className="transfer-title-wrapper">
                            <If condition = {!single}>
                                <NCCheckbox
                                    disabled={checkDisabled}
                                    {...allCheckTable[rightAllChecked]}
                                    onChange={this.changeAllCheckbox('right')}
                                >
                                    {rightCheckTitle || language['hrpub-000071']/** 全选 */}
                                </NCCheckbox>
                            </If>
                        </div>
                        {rightData.map((item, index) => {
                            return (
                                <div className="transfer-item-wrapper">
                                    {item.prefix || null}
                                    <NCTooltip placement="top" inverse overlay={item.display}>
                                    <NCCheckbox
                                        disabled={checkDisabled}
                                        checked={rightChecked[item.key] && rightChecked[item.key].status}
                                        onChange={this.changeCheckBox(item, 'right')}
                                    >
                                        {item.display}
                                       
                                        
                                    </NCCheckbox>
                                    </NCTooltip>
                                    {item.suffix || null}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

export default Transfer;