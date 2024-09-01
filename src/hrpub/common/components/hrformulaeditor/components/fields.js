/**
 * Created by wanghongxiang on 2018/10/19.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {base, ajax, toast} from 'nc-lightapp-front';
const { NCInput } = base;

const Mock = require('./mock.js')
import ModalUtil from '../utils'

class FormulaField extends Component {
    static contextTypes = {
        ctx: PropTypes.object,
        hrReferChange: PropTypes.func
    }
    constructor(props) {
        super(props)
        this.state = {
            tables: [],
            fields: [],
            inputFields:[],
            current: null,
            inputValue:'',
            currentField: null
        }
        this.getTables = this.getTables.bind(this)
        this.getFields = this.getFields.bind(this)
        this.getFieldsById = this.getFieldsById.bind(this)
        this.setFormulaValByDouble = this.setFormulaValByDouble.bind(this)
    }

    componentWillReceiveProps(newProps) {
        if (newProps.childrenList) {
            this.setState({
                tables: newProps.childrenList,
            })
        }
    }

    getTables() {
        const data = Mock.data.right
        this.setState({
            tables: data
        })
        ajax({
            url: '/nccloud/hrwa/formula/FormulaTableAction.do',
            data: {},
            success: res => {
                this.setState({
                    tables: JSON.parse(res.data)
                })
            }
        })
    }

    getFieldsById(id) {
        return this.state.tables.filter(res => {
            return res.typeId === id
        })
    }

    getFields(code, inputSig, hintMsg) {
        this.setState({
            fields :[],
            inputFields:[],
            inputValue:''
        })
        let fieldArr = this.getFieldsById(code)[0].itemList
        setTimeout(()=>{

            this.setState({
                current: code,
                fields: fieldArr,
                inputFields:[...fieldArr]
            }, ()=> {
                this.context.ctx.handleState({
                    // formulaText: '说明：' + hintMsg
                    formulaText: this.context.ctx.state.json['hrpub-000039']+': ' + hintMsg
                })
            })
        },0)

    }
    inputChange = (value) => {
        let arr = []
        arr = this.state.fields.filter((item)=>{
            console.log(item,'item')
            return item.displayName.includes(value)
        })
        this.setState({
            inputFields:arr,
            inputValue:value
        })
    }
    setFormulaVal(code, inputSig, hintMsg) {
        this.setState({
            currentField: code
        })
        this.context.ctx.handleState({
            inputSig: '',
            // formulaText: '说明：' + hintMsg
            formulaText: this.context.ctx.state.json['hrpub-000039']+': ' + hintMsg
        })
    }
    setFormulaValByDouble(fields,b) {
        let refcode = fields.refModelPath
        this.context.ctx.handleState({
            fieldData: fields
        }, ()=> {
           let flag = ModalUtil.handleDataByType(fields.iDataType, this.context.ctx,fields, refcode,this.context.ctx.state.json);
           if (flag) {
               this.context.ctx.handleState({
                   inputSig: fields.inputSig,
                   // formulaText: '说明：' + fields.hintMsg
                   formulaText: this.context.ctx.state.json['hrpub-000039']+': ' + fields.hintMsg,
                   switchDefined: fields.inputSig
               })
           }
        })
        //     "dataTypeid":"BS000010000100001001",
        //     "iDataType":"1",
        //     "para2":"",
        //     "para3":"",
        //     "returnType":"-1",
        //     "strArguments":null,
        //     "strCode":"bd_psndoc.shortname",
        //     "strInputSigRes":null,
        //     "strPattern":null,
        //     "strRefModelName":null,
        //     "strPageCode":"",
        //     "displayName":"姓名简拼",
        //     "inputSig":"[人员基本信息.姓名简拼]",
        //     "hintMsg":"[人员基本信息.姓名简拼]"
        // console.log('iDataType留着将来弹窗： ', fields.iDataType)
        // this.context.ctx.handleState({
        //     inputSig: fields.inputSig,
        //     formulaText: '说明：' + fields.hintMsg
        // })
    }

    render() {
        let _this = this
        const tables = this.state.tables && this.state.tables.length > 0 ? (
            <ul>
                {
                    this.state.tables.map(table => {
                        const active = (table.typeId === this.state.current) ? 'item-content-list-li-active' : ''
                        return (
                            <li
                                className={active + " item-content-list-li"}
                                key={table.typeId}
                                strCode={table.strCode}
                                inputSig={table.inputSig}
                                hintMsg={table.hintMsg}
                                onClick={this.getFields.bind(this,table.typeId, table.typeName, table.typeName)}
                            >{table.typeName}</li>
                        )
                    })
                }
            </ul>
        ) : null

        const fields = this.state.inputFields && this.state.inputFields.length > 0 ? (
               
                <ul>
                    {
                        this.state.inputFields.map(table => {
                            const activeField = (table.strCode === _this.state.currentField)? 'item-content-list-li-active' : ''
                            return (
                                <li
                                    className={activeField + " item-content-list-field"}
                                    key={table.strCode}
                                    strCode={table.strCode}
                                    inputSig={table.inputSig}
                                    hintMsg={table.hintMsg}
                                    onClick={this.setFormulaVal.bind(this,table.strCode, table.inputSig, table.hintMsg)}
                                    onDoubleClick={this.setFormulaValByDouble.bind(this,table)}
                                >{table.displayName}</li>
                            )
                        })
                    }
                </ul>
        ) : null
        return (
            <div className="item-content-list">
                <div className="item-content-list-item floatLeft">{tables}</div>
                <div className="item-content-list-item floatLeft">
                <NCInput style={{height:'25px',fontSize:'12px'}} value={this.state.inputValue} onChange = {this.inputChange}/>
                    {fields}
                </div>
            </div>
        )
    }
}

export default FormulaField;
