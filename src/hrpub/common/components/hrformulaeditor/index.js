/**
 * Created by wanghongxiang on 2018/10/18.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { base, ajax, toast, getMultiLang, inlt } from 'nc-lightapp-front';
const {NCLoading} = base
import FuncComponent from './components/func';
import FormulaArea from './components/container';
import FormulaBtns from './components/btns';
import FormulaField from './components/fields';
// TODO: 提供扩展的btns, 函数, 数据库表及字段

const {
    NCButton,
    NCRow,
    NCCol,
    NCTabs,
    NCTextArea,
    NCModal,
    NCTree,
    NCCheckbox
} = base;
const { NCTabPane } = NCTabs;
const { Header, Body, Footer } = NCModal;

import './index.less';
import HrRefer from "../hr-refer";
import HrReferLoader from "../hr-refer/ReferLoader";
import HrPanel from '../hrPanels'
import ModalUtil from './utils/index'

const staticURL = {
    common: '/nccloud/formula/web/formulatype.do'
}

const propTypes = {
    formulaData: PropTypes.array,
    formulaUrl: PropTypes.string,
    validateUrl: PropTypes.string,
    defaultFormulaStr: PropTypes.string,
    searchParam: PropTypes.object,
    saveCallback: PropTypes.func,
    referSaveBack: PropTypes.func,
    btnConfig: PropTypes.array
};
const defaultProps = {
    formulaData: [],
    defaultFormulaStr: '',
    formulaUrl: '/nccloud/hrwa/formula/FormulaTypeAction.do',
    validateUrl: '/nccloud/hrwa/formula/TranslateFormulaAction.do',
    saveFormulaUrl: '/nccloud/hrwa/formula/FormulaValidateAction.do',
    recallFormulaUrl: '/nccloud/hrwa/classitem/QueryByItemPkAction.do',
    searchParam: {},
    saveCallback: () => {
    },
    closeCallback: () => {

    },
    referSaveBack: () => {
    },
    showRecall: '',
    btnConfig: null,
    btnClass: '',
    conditionSQL: ''
};

class HRFormulaEditor extends Component {
    static childContextTypes = {
        ctx: PropTypes.object,
        classType: PropTypes.any,
        hrReferChange: PropTypes.func
    }

    constructor(props) {
        super(props)
        this.state = {
            pageConfig: {}, // 存储业务信息
            showModal: false,
            childrenList: [],
            formulaText: '',
            refQuery: {},
            searchParam: this.props.searchParam || {},
            inputSig: '',    // 当前公式
            refcode: '',   //用于参照
            refConfig: {
                isShowUnit: true,
                unitProps: {}
            },   // 参照配置文件
            fieldData: {},   // 当前使用field属性
            comp: '',     // panel 名字
            countryPkRef:'',
            currentField: null,  // 当前点击字段全部属性
            json: null,
            loading:false,
            formulaStrCopy:'',
            dynParaArr :[],
            countryPk: [],
            btnConfig: [],  // 公式按钮
            defined: false,   // 自定义公式
            switchDefined: 0, // 标识是否是自身触发的输入
            hideDefined: false  //是否隐藏自定义勾选框
        }
        this.countryPk = []
        this.originFormula = null
        this.close = this.close.bind(this)
        this.saveForm = this.saveForm.bind(this)
        this.validate = this.validate.bind(this)
        this.hrReferChange = this.hrReferChange.bind(this)
        this.handleState = this.handleState.bind(this)
        this.recallFormula = this.recallFormula.bind(this)
    }

    getChildContext() {
        return {
            ctx: this,
            hrReferChange: this.hrReferChange,
            classType: this.state.classType
        }
    }

    componentWillReceiveProps() {
        let callback = (json, status, inlt) => {
            if (status) {
                this.setState({
                    json: json
                }, () => {
                    this.setState({
                        btnConfig: this.props.btnConfig ? this.props.btnConfig : [
                            { name: this.state.json['hrpub-000049'], value: this.state.json['hrpub-000049'], pos: 'top' },
                            { name: this.state.json['hrpub-000050'], value: this.state.json['hrpub-000050'], pos: 'top' },
                            { name: this.state.json['hrpub-000051'], value: this.state.json['hrpub-000051'], pos: 'top' },
                            { name: this.state.json['hrpub-000052'], value: this.state.json['hrpub-000052'], pos: 'top' },
                            { name: this.state.json['hrpub-000053'], value: this.state.json['hrpub-000053'], pos: 'top' },
                            { name: '+', value: '+', pos: 'bottom' },
                            { name: '-', value: '-', pos: 'bottom' },
                            { name: '*', value: '*', pos: 'bottom' },
                            { name: '/', value: '/', pos: 'bottom' },
                            { name: '<', value: '<', pos: 'bottom' },
                            { name: '>', value: '>', pos: 'bottom' },
                            { name: '=', value: '=', pos: 'bottom' },
                            { name: '(', value: '(', pos: 'bottom' },
                            { name: ')', value: ')', pos: 'bottom' },
                            { name: '<=', value: '<=', pos: 'bottom' },
                            { name: '>=', value: '>=', pos: 'bottom' },
                            { name: '<>', value: '<>', pos: 'bottom' }
                        ]
                    })
                })
                window.ff = this

            }
        }
        getMultiLang({ domainName: 'hrpub', moduleId: 'hrpub', callback })
    }

    // 获取公共函数
    getCommon() {
        return new Promise((resolve, reject) => {
            ajax({
                url: staticURL.common,
                data: {},
                success: res => {
                    if (res.success) {
                        resolve(JSON.parse(JSON.stringify(res.data)))
                    } else {
                        reject(res.error)
                    }
                }
            })
        })
    }

    // 获取业务公式
    getFormulaRegion() {
        let o = this
        return new Promise((resolve, reject) => {
            if (this.props.formulaUrl) {
                ajax({
                    url: this.props.formulaUrl,
                    data: o.state.searchParam,
                    success: res => {
                        if (res.success) {
                            let data = JSON.parse(res.data)
                            resolve(data)
                        } else {
                            reject(res.error)
                        }
                    }
                })
            } else {
                resolve([])
            }
        })
    }

    handleState(obj, callback = () => {
    }) {
        this.setState(obj, () => {
            callback()
        })
    }

    formulaStrCopyFun = (str,s) => {
        
        let num = str.indexOf(s)
        if(num==-1) return
        if(num>-1) {
            if(s=='人员基本信息.籍贯') {
                this.state.dynParaArr.push({
                    nativeStr:num
                })
                this.state.formulaStrCopy = str.replace(s,'aaaaaaaaa')
            } else if (s == '人员基本信息.国籍/地区') {
                this.state.dynParaArr.push({
                    nationalityStr:num
                })
                this.state.formulaStrCopy = str.replace(s,'aaaaaaaaaaaa')
            } else if(s == '人员基本信息.户口所在地') {
                this.state.dynParaArr.push({
                    registerStr:num
                })
                this.state.formulaStrCopy = str.replace(s,'aaaaaaaaaaaa')
            }
            this.setState(this.state,()=>{
                this.formulaStrCopyFun(this.state.formulaStrCopy,s)
            })
            
        }
    }
    validate() {
        let formulaStr = this.hrFormulaArea.getCurrentFormula();
        let formula = this.state.vformula || ''
        let defaultFormulaStr = this.state.defaultFormulaStr
        let { conditionSQL, conditionStr } = this.props;
        if (formulaStr !== defaultFormulaStr) {
            formula = ''
        }
        let { json, searchParam } = this.state;
        console.log(this.countryPk,'uu')
        // this.setState({
        //     dynParaArr:[],
        //     formulaStrCopy:formulaStr
        // },()=>{
        //     let nativeStr = '人员基本信息.籍贯'
        //     // let nativeNum = formulaStrCopy.indexOf(nativeStr)
        //     let nationalityStr = '人员基本信息.国籍/地区'
        //     // let nationalityNum = formulaStrCopy.indexOf(nationalityStr)
        //     let registerStr = '人员基本信息.户口所在地'
        //     // let registerNum = formulaStrCopy.indexOf(registerStr)
        //     this.formulaStrCopyFun(this.state.formulaStrCopy,nativeStr)
        //     this.formulaStrCopyFun(this.state.formulaStrCopy,nationalityStr)
        //     this.formulaStrCopyFun(this.state.formulaStrCopy,registerStr)
        //     console.log(this.state.dynParaArr,'dynParaArrdynParaArr')
        // })
        

       

        ajax({
            url: this.props.saveFormulaUrl,
            data: Object.assign(searchParam, {
                formulastr: formulaStr,
                // 解决国籍不能删除问题，前端置空，后端处理
                // dynPara:this.countryPk.length>1?this.countryPk.join(','):this.countryPk[0]?this.countryPk[0]:'',
                condition: this.countryPkRef?this.countryPkRef:'',
                classType: this.state.classType,
                formula: ''
            }),
            success: res => {
                if (res.success) {
                    toast({ color: 'success', content: json['hrpub-000128'] });
                } else {
                    toast({ color: 'error', content: json['hrpub-000129'] });
                }
            }
        })
    }

    show(searchParam = {}, Obj = {}) {
        this.setState({
            inputSig: '',    // 当前公式
            refcode: '',
            showModal: true,
            pageConfig: Obj.pageConfig || {},
            searchParam: searchParam,
            pk_wa_item: Obj.pk_wa_item,
            defaultFlag: Obj.defaultFlag,
            defined: !Obj.defaultFlag,
            classType: Obj.classType || null,
            hideDefined: Obj.hideDefined,
            defaultFormulaStr: this.props.defaultFormulaStr || searchParam.defaultFormulaStr,
            vformula: Obj.vformula
        }, () => {
            this.getFormulaRegion().then(result => {
                this.countryPk = []
                this.setState({
                    childrenList: result
                }, () => {
                    this.hrFormulaArea.setCurrentFormula(this.props.defaultFormulaStr || searchParam.defaultFormulaStr)
                })
            })
            // this.recallFormula(false)

        })
    }

    recallFormula(flag = true) {
        if (this.state.searchParam.recallFormula) {
            this.hrFormulaArea.setCurrentFormula('')
        } else {
            let data = this.state.searchParam
            //薪资恢复公式接口数据
            if (!this.state.searchParam.bmRecall) {
                data = Object.assign(data, {
                    pk_wa_item: this.state.pk_wa_item
                })
            }
            ajax({
                // url: '/nccloud/hrwa/classitem/QueryByItemPkAction.do',
                url: this.props.recallFormulaUrl,
                data: data,
                success: res => {
                    if (res.success && res.data) {
                        if (this.state.defaultFlag) {
                            this.setState({
                                defined: false
                            })
                        } else {
                            this.setState({
                                defined: true
                            })
                        }
                        this.originFormula = res.data.formulaStr
                        if (flag) {
                            this.hrFormulaArea.setCurrentFormula(res.data.formulaStr)
                        }
                    }
                }
            })
        }

    }

    close = () => {
        this.setState({
            showModal: false
        })
        this.props.closeCallback()
    }

    saveForm() {
        let { conditionSQL, conditionStr } = this.props;
        let { searchParam,json } = this.state;
        let formulaStr = this.hrFormulaArea.getCurrentFormula();
        let formula = this.state.vformula || ''
        let defaultFormulaStr = this.state.defaultFormulaStr
        this.setState({
            loading:true
        })
        if (formulaStr !== defaultFormulaStr) {
            formula = ''
        }
        ajax({
            url: this.props.saveFormulaUrl,
            data: Object.assign(searchParam, {
                formulastr: this.hrFormulaArea.getCurrentFormula(),
                condition: this.countryPkRef?this.countryPkRef:'',
                // dynPara:this.countryPk.length>1?this.countryPk.join(','):this.countryPk[0]?this.countryPk[0]:'',
                // condition: this.state.countryPkRef?this.state.countryPkRef:'',
                classType: this.state.classType,
                formula: ''
            }),
            success: res => {
                if (res.success) {
                    this.props.defaultFormulaStr = this.hrFormulaArea.getCurrentFormula()
                    this.props.saveCallback(res, this.state.defined)
                    // toast({color: 'success', content: '保存成功！'})
                    this.close()
                    setTimeout(()=>{
                        this.setState({
                            loading:false
                        })
                    },800)
                } else {
                    this.setState({
                        loading:false
                    })
                    toast({color: 'danger', content: json['hrpub-000129']});
                }
            },
            error:(err) => {
                this.setState({
                    loading:false
                },()=>{
                    toast({color: 'danger', content: json['hrpub-000129']});
                })
                 
            }
        })
    }

    // 公式fields 参照回调
    hrReferChange(val0, val1) {
        console.log(val0, val1,'val0, val1')
        const { json } = this.state;
        let fields = this.state.fieldData;
        let display = val0.values && val0.values['md_enumvalue.name'] ? val0.values['md_enumvalue.name'].value : val1.display
        this.setState({
            countryPkRef:val0.refpk,
            inputSig: `${fields.inputSig} = "${display}"`,
            formulaText: fields.hintMsg ? json['hrpub-000039'] + '：' + fields.hintMsg : ''
        })
    }

    // 公式左侧 弹出内容回调事件
    panelConfirm(data) {
        const { json } = this.state;
        let field = this.state.strCode
        //TODO: 接下来的基本操作就是格式输出
        let inputSig = ModalUtil.handleFieldByType(data, field)
        this.setState({
            inputSig: inputSig,
            formulaText: field.hintMsg ? json['hrpub-000039'] + '：' + field.hintMsg : ''
        })
    }

    render() {
        var conf = this.state.json ? {
            multiLang: { domainName: 'hrpub', currentLocale: 'zh-CN', moduleId: 'hrpub' },
            refType: 'grid',
            refName: 'hrpub-000004',/* 国际化处理： 证书类型*/
            placeholder: 'hrpub-000004',/* 国际化处理： 证书类型*/
            refCode: 'hrwa.ref.MDEnumRefModel',
            queryGridUrl: '/nccloud/hrwa/ref/MDEnumRefModel.do',
            // columnConfig: [{name: [ 'hrpub-000005', 'hrpub-000006' ],code: [ 'refcode', 'refname' ]}],/* 国际化处理： 编码,名称*/
            columnConfig: [{ name: [this.state.json['hrpub-000005'], this.state.json['hrpub-000006']], code: ['refcode', 'refname'] }],/* 国际化处理： 编码,名称*/
            isMultiSelectedEnabled: false
        } : {};
        var config = Object.assign({}, conf, this.state.refQuery)
        let modal = this.state.json ? (
            <React.Fragment>
               
                <NCModal
                    id="hr-formula"
                    className="hr-formula"
                    visible={
                        this.state.showModal
                    }
                    onCancel={
                        this.close
                    }
                    height="680"
                    size="xlg"
                    mask='static'
                >
                    <Header className="hr-formula-header" closeButton>
                        {/* <span className="hr-formula-header-name">{this.state.json['hrpub-000041']}</span> */}
                        {this.state.json['hrpub-000041']}
                    </Header>
                    <Body className="hr-formula-body">
                        <div>
                            <header className="hr-formula-body-header">
                                {/*自定义公式*/}
                                <div className="hr-formula-body-header-btns">
                                    {/*自定义公式*/}
                                    <span style={{ display: this.state.hideDefined ? 'none' : '' }}>
                                        <NCCheckbox className="hr-panel-checkbox" disabled={true} checked={this.state.defined}></NCCheckbox>
                                        <span>{this.state.json['hrpub-000070']} </span>
                                    </span>

                                    <NCButton onClick={this.validate.bind(this)}>{this.state.json['hrpub-000042']}{/*验证公式*/}</NCButton>
                                    <NCButton style={{ display: this.props.showRecall }} onClick={this.recallFormula.bind(this)}>
                                        {this.state.searchParam.btnName === 'reset' ? this.state.json['hrpub-000072'] : this.state.json['hrpub-000043']}{/*恢复公式*/}</NCButton>
                                </div>
                            </header>
                            <NCRow className="hr-formula-body-container">
                                <NCCol className="hr-formula-body-container-item" md={4} xs={4} sm={4}>
                                    <div className="item-content">
                                        <div className="item-content-header">
                                            <span>{this.state.json['hrpub-000040']}{/*函数*/}</span>
                                        </div>
                                        <div>
                                            <FuncComponent />
                                        </div>
                                    </div>
                                </NCCol>
                                <NCCol className="hr-formula-body-container-item" md={12} xs={12} sm={12}>
                                    <div className="item-content item-content-area-content">
                                        <div className="item-content-area">
                                            <div className="item-content-header item-content-header-line"></div>
                                            <FormulaArea ref={hrFormulaArea => this.hrFormulaArea = hrFormulaArea}
                                                val={this.state.inputSig}></FormulaArea>
                                        </div>
                                        <div className="item-content-btns">
                                            <FormulaBtns btnClass="hr-btn-class" btnConfig={this.state.btnConfig}></FormulaBtns>
                                        </div>
                                    </div>
                                </NCCol>
                                <NCCol className="hr-formula-body-container-item" md={8} xs={8} sm={8}>
                                    <div className="item-content">
                                        <div>
                                            <div className="item-content-header floatLeft"><span>{this.state.json['hrpub-000044']}{/*数据库表*/}</span></div>
                                            <div className="item-content-header floatLeft"><span>{this.state.json['hrpub-000045']}{/*表字段*/}</span></div>
                                        </div>
                                        <div>
                                            <FormulaField childrenList={this.state.childrenList && this.state.childrenList.tableList}></FormulaField>
                                        </div>
                                    </div>
                                </NCCol>
                            </NCRow>
                        </div>
                        <div className="hr-formula-text">
                            {this.state.formulaText}
                        </div>
                    </Body>

                    <Footer>
                        <NCButton colors='primary' onClick={this.saveForm}>{this.state.json['hrpub-000046']}{/*保存*/}</NCButton>
                        <NCButton onClick={this.close}>{this.state.json['hrpub-000047']}{/*取消*/}</NCButton>
                    </Footer>
                </NCModal>
                <NCLoading
                     container={this}
                     show={this.state.loading}
                >
                </NCLoading>
                <div style={{ display: 'none' }}>
                    <HrRefer
                        ref="hr-refer"
                        className="hr-refer"
                        {...this.state.refConfig}
                        onChange={this.hrReferChange.bind(this)}
                    ></HrRefer>
                    <HrReferLoader
                        ref="hr-refer-loader"
                        className="hr-refer-loader"
                        refcode={this.state.refcode}
                    ></HrReferLoader>
                </div>
                <HrPanel ref="hr-panel-modal"
                    comp={this.state.comp}
                    panelConfirm={this.panelConfirm.bind(this)}
                    searchParam={this.state.searchParam}
                    pageConfig={this.state.pageConfig}
                ></HrPanel>

                <HrRefer
                    style={{ display: 'none' }}
                    ref="psntype-refer"
                    {...config}
                    onChange={this.hrReferChange.bind(this)}
                ></HrRefer>
            </React.Fragment>
        ) : null
        return (
            <div>
                {
                    modal
                }
            </div>
        )
    }
}

HRFormulaEditor.propTypes = propTypes
HRFormulaEditor.defaultProps = defaultProps
export default HRFormulaEditor