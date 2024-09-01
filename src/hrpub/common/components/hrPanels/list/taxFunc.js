import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {base, ajax, toast} from 'nc-lightapp-front';

let {NCDatePicker, NCTable, NCButton, NCModal, NCStep, NCSelect, NCRow, NCCol} = base;
import './index.less'
import BasePanelChild from 'src/hrpub/common/components/hrPanels/container/panelChild'

const QueryItemAction = '/nccloud/hrwa/classitem/QueryItemAction.do'
export default class TaxFunc extends BasePanelChild {
    constructor(props) {
        super(props)
        this.state = {
            opts: [],
            modalValue: null, // 整体modal value
            initialVal: '0',  // 初始
            childList: null,   // 子节点select区
            returnObj: {
                val01: null,
                val11: null,
                val12: null,
                val13: null,
                val14: null,
                val15: null,
                val16: null
            },

        }
        this.QueryItemAction = '/nccloud/hrwa/classitem/QueryItemAction.do'
        // let json = this.context.ctx.props.hrpubJson
        this.initialData = []
        //     ,{
        //     key: "按年累计税表计税",
        //     value: "2"
        // }
        this.getOption = this.getOption.bind(this)
        this.formatOption = this.formatOption.bind(this)
    }

    componentDidMount() {
        let json = this.context.ctx.props.hrpubJson
        let pageConfig = this.context.ctx.props.pageConfig
        if (pageConfig.appcode === '60130411' || pageConfig.appcode === '60130410') {
            this.QueryItemAction = '/nccloud/hrwa/classitem/QueryItemAction.do'
        } else {
            this.QueryItemAction = '/nccloud/hrwa/item/QueryItemAction.do'
        }
        this.initialData = [{
            key: "0",
            value: json['hrpub-000064']
        },
        // {
        //     key: json['hrpub-000065'],
        //     value: "1"
        // },
        {
            key: "2",
            value: json['hrpub-000066']
        }]
        this.getOption()
    }

    setModalValue() {
        // this.context.ctx.setState({
        //     childValue: {val00: this.state.initialVal, ...this.state.returnObj}
        // })
        this.context.ctx.childValue = {val00: this.state.initialVal, ...this.state.returnObj}
    }
    // 获取下拉options
    getOption() {
        /*******************searchParam调用方式*******************/
        let searchParam = this.context.ctx.props.searchParam || {}
        ajax({
            url: this.QueryItemAction,
            data: searchParam,
            success: res => {
                if (res.success) {
                    let data = res.data
                    this.setState({
                        opts: this.formatOption(data)
                    }, () => {
                        let returnObj = {
                            val01: this.state.opts[1].value,
                            val11: this.state.opts[1].value,
                            val12: this.state.opts[1].value,
                            val14: this.state.opts[1].value,
                            val15: this.state.opts[1].value,
                            val16: this.state.opts[1].value
                        }
                        this.setState({
                            returnObj: returnObj
                        })
                        this.selectChange('initial', '0')
                    })
                }
            }
        })
    }
    // 格式化原始数据
    formatOption(data) {
        let result = [{
            key: null,
            value: null
        }]
        data.map(obj => {
            result.push({
                key: `[${obj.showname}]`,
                value: obj.name
            })
        })
        return result
    }
    selectChange(type, val, flag,value) {
        // debugger
        let returnObj = this.state.returnObj
        switch (type) {
            case 'initial':
                
                this.setState({
                    initialVal: value?value.key:val
                })
                break;
            case 'salary-proj':
                returnObj = {
                    val01: value?value.key:val,
                    val11: this.state.returnObj.val11,
                    val12: this.state.returnObj.val12,
                    val13: this.state.returnObj.val13,
                    val14: this.state.returnObj.val14,
                    val15: this.state.returnObj.val15,
                    val16: this.state.returnObj.val16
                }
                this.setState({
                    returnObj: returnObj
                })
                break;
            case 'salary-year':
                returnObj = {
                    val01: null,
                    val11: value?value.key:val,
                    val12: this.state.returnObj.val12,
                    val13: this.state.returnObj.val13,
                    val14: this.state.returnObj.val14,
                    val15: this.state.returnObj.val15,
                    val16: this.state.returnObj.val16
                }
                this.setState({
                    returnObj: returnObj
                })
                break;
            case 'salary-month':
                returnObj = {
                    val01: null,
                    val11: this.state.returnObj.val11,
                    val12: value?value.key:val,
                    val13: this.state.returnObj.val13,
                    val14: this.state.returnObj.val14,
                    val15: this.state.returnObj.val15,
                    val16: this.state.returnObj.val16
                }
                this.setState({
                    returnObj: returnObj
                })
                break;
            case 'priod-count':
                returnObj = {
                    val01: null,
                    val11: this.state.returnObj.val11,
                    val12: this.state.returnObj.val12,
                    val13: value?value.key:val,
                    val14: this.state.returnObj.val14,
                    val15: this.state.returnObj.val15,
                    val16: this.state.returnObj.val16
                }
                this.setState({
                    returnObj: returnObj
                })
                break;
            case 'new1':
                returnObj = {
                    val01: null,
                    val11: this.state.returnObj.val11,
                    val12: this.state.returnObj.val12,
                    val13: this.state.returnObj.val13,
                    val14: value?value.key:val,
                    val15: this.state.returnObj.val15,
                    val16: this.state.returnObj.val16
                }
                this.setState({
                    returnObj: returnObj
                })
                break;
            case 'new2':
                returnObj = {
                    val01: null,
                    val11: this.state.returnObj.val11,
                    val12: this.state.returnObj.val12,
                    val13: this.state.returnObj.val13,
                    val14: this.state.returnObj.val14,
                    val16: this.state.returnObj.val16,
                    val15: value?value.key:val
                }
                this.setState({
                    returnObj: returnObj
                })
                break;
            case 'new3':
                returnObj = {
                    val01: null,
                    val11: this.state.returnObj.val11,
                    val12: this.state.returnObj.val12,
                    val13: this.state.returnObj.val13,
                    val14: this.state.returnObj.val14,
                    val16: value?value.key:val,
                    val15: this.state.returnObj.val15
                }
                this.setState({
                    returnObj: returnObj
                })
                // debugger
                break;
        }
        setTimeout(()=>{
            this.setModalValue()
        },100)
    }

    getChildComponent() {

        let json = this.context.ctx.props.hrpubJson
        const child = () => {
            let current = null
            if (this.state.initialVal === '0') {
                current = (
                    <NCRow className="hr-panel-date-div">
                        <NCCol md={8} xs={8} sm={8}>{json['hrpub-000059']}：</NCCol>
                        <NCCol md={16} xs={16} sm={16}>
                            <NCSelect
                                data = {this.state.opts}
                                onChange = {this.selectChange.bind(this, 'salary-proj')}
                                value = {this.state.returnObj.val01}
                            />
                        </NCCol>
                    </NCRow>
                )
            } else if (this.state.initialVal === '1') {
                current = (
                    <React.Fragment>
                        <NCRow className="hr-panel-date-div">
                            <NCCol md={8} xs={8} sm={8}>{json['hrpub-000060']}：</NCCol>
                            <NCCol md={16} xs={16} sm={16}>
                                <NCSelect
                                    data = {this.state.opts}
                                    onChange = {this.selectChange.bind(this, 'salary-year')}
                                    value = {this.state.returnObj.val11}
                                />
                            </NCCol>
                        </NCRow>
                        <NCRow className="hr-panel-date-div">
                            <NCCol md={8} xs={8} sm={8}>{json['hrpub-000061']}：</NCCol>
                            <NCCol md={16} xs={16} sm={16}>
                                <NCSelect
                                    data = {this.state.opts}
                                    onChange = {this.selectChange.bind(this, 'salary-month')}
                                    value = {this.state.returnObj.val12}
                                />
                            </NCCol>
                        </NCRow>
                        <NCRow className="hr-panel-date-div">
                            <NCCol md={8} xs={8} sm={8}>{json['hrpub-000062']}：</NCCol>
                            <NCCol md={16} xs={16} sm={16}>
                                <NCSelect
                                    data = {this.state.opts}
                                    onChange = {this.selectChange.bind(this, 'priod-count')}
                                    value = {this.state.returnObj.val13}
                                />
                            </NCCol>
                        </NCRow>
                    </React.Fragment>
                )
            } else {
                current = (
                    <React.Fragment>
                        <NCRow className="hr-panel-date-div">
                            <NCCol md={8} xs={8} sm={8}>{json['hrpub-000069']}：</NCCol>
                            <NCCol md={16} xs={16} sm={16}>
                                <NCSelect
                                    data = {this.state.opts}
                                    onChange = {this.selectChange.bind(this, 'new2')}
                                    value = {this.state.returnObj.val15}
                                />
                            </NCCol>
                        </NCRow>
                        <NCRow className="hr-panel-date-div">
                            <NCCol md={8} xs={8} sm={8}>{json['hrpub-000068']}：</NCCol>
                            <NCCol md={16} xs={16} sm={16}>
                                <NCSelect
                                    data = {this.state.opts}
                                    onChange = {this.selectChange.bind(this, 'new1')}
                                    value = {this.state.returnObj.val14}
                                />
                            </NCCol>
                        </NCRow>
                        <NCRow className="hr-panel-date-div">
                            <NCCol md={8} xs={8} sm={8}>{json['hrpub-000073']}：</NCCol>
                            <NCCol md={16} xs={16} sm={16}>
                                <NCSelect
                                    data = {this.state.opts}
                                    onChange = {this.selectChange.bind(this, 'new3')}
                                    value = {this.state.returnObj.val16}
                                />
                            </NCCol>
                        </NCRow>
                    </React.Fragment>
                )
            }
            return current
        }
        return (
            <div className="hr-panel-tax-func">
                <NCRow className="hr-panel-date-div">
                    <NCCol md={4} xs={4} sm={4}>{json['hrpub-000063']}：</NCCol>
                    <NCCol md={8} xs={8} sm={8}>
                        <NCSelect
                            data = {this.initialData}
                            value = {
                                ()=>{
                                    for(let i = 0;i<this.initialData.length;i++) {
                                        if(this.state.initialVal === this.initialData[i].key) {
                                            return this.initialData[i].value
                                        }
                                    }
                                }
}
                            onChange = {this.selectChange.bind(this, 'initial')}
                        />
                    </NCCol>
                </NCRow>
                {
                    child()
                }
            </div>
        )
    }
}