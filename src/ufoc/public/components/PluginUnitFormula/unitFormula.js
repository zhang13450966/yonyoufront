import React, { Component } from "react";
import { createPage, base, ajax, actions } from "nc-lightapp-front";

window.$appRoot = window.$appRoot ? window.$appRoot : {state:{json:{}}}

import "./meConfig"
// import { grid as gridAction } from "../../core/api";
import { findDOMNode } from "react-dom";
import { immutable } from "nc-lightapp-front";
// import { loadformula } from "../../public/ajaxMethod";
// import MetaDataRefer from "../../public/component/MetaDataRefer";
// import { getSinglCellFromFormatCellByCoordinate, setFormatCellsByCell } from "../../core/api";
import meta from "./columns";
// import { deleteFormulaItem } from '../../core/api';

import mockRes from "./formulaData.json";
import { creatRefer } from "./refer/GridRefer"
import AccPeriodUFOERefExport from "../AccPeriodUFOERefExport"
const { fromJS } = immutable;

const { NCMenu, NCTabs, NCTextArea, NCButton, NCInput, NCSelect, NCIcon } = base;


const NCOption = NCSelect.NCOption;

const SubMenu = NCMenu.NCSubMenu;

const Item = NCMenu.Item;
import ModelRefer from "./modelBox";
const { NCTabPane } = NCTabs;
import { CONSTANT } from "./constant";
import defaultPropsConfig from "./initConfig";
import defaultPropsCallback from "./initFunction";
import { returnToTheResult, launchParameters } from "./formulaConfig";
import GuidButton from "./GuidButton";
import "./index.less";
window.mThatFn = function (that) {
    window.mThat = that;
}
class UnitFormula extends Component {

    constructor(props) {
        super(props);
        props.use.table('funDesc');
        props.use.editTable("conditionsMeta");
        //console.log("传入的props", this.props);
        let {
            symbolAreaConfig, funcAreaConfig, funcAreaTab,
            whetherShareSymbol,
            contentConfig = []
        } = this.props;
        let initShowData = {};
        if (!contentConfig) {
            contentConfig = [
                {
                    key: "key1",
                    content: "",//如果有值  在切换或者初始化进入以后会渲染该值
                }
            ];
        }
        if (!contentConfig.length) {
            contentConfig = [
                {
                    key: "key1",
                    content: "",//如果有值  在切换或者初始化进入以后会渲染该值
                }
            ];
        }
        contentConfig.forEach((i) => {
            initShowData[i.key] = i.content;
        });
        this.initStatus = true;
        this.state = {
            dataSource: [],
            showData: initShowData,
            functionDesc: null,
            currentFuncInfo: undefined,
            functionParameters: null,
            guideCause: "",
            textareaCause: "",
            subMenuSelectedKeys: [],
            defaultSelectedKeys: [],
            formulaAreaActive: this.props.formulaAreaActive,
           
            tabIndexKey: "0",
            // 业务函数类
            isShow: false,
            ExternalItem: null,
            funcType: "GLOpenBal",
            estimateText: "",//双击型参照

            // 平台型参照预置值
            platReferData: new Map(),
            searchValue: "",//搜索的值
            searchValueList:new Map(),//搜索出来的列表数据 按照模糊匹配  
            showSearList:false,
            // 专门的会计期间方案数据
            AccPeriodSchemeDefaultTreeRefData:{}
        }
        this.operatorBtn = new Map();
        this.relationBtn = new Map();
        this.tabcode = new Map();
        // 将 符号区归类
        Array.isArray(symbolAreaConfig) && symbolAreaConfig.some((a) => {
            let { operator = [], relation = [], key = "" } = a;
            if (whetherShareSymbol) {
                operator = symbolAreaConfig[0].operator;
                relation = symbolAreaConfig[0].relation;
            }
            if (!key) {
                console.error(JSON.stringify(i) + ": symbolAreaConfig  no key");
                return true;
            }
            this.operatorBtn.set(key, new Map());
            Array.isArray(operator) && operator.some((i) => {
                if (!i || !i.name) {
                    console.error(JSON.stringify(i) + ": symbolAreaConfig  operator no name");
                    return true;
                }
                if (!i.key) {
                    i.key = i.name;
                }
                this.operatorBtn.get(key).set(i.key, i)
            });
            this.relationBtn.set(key, new Map());
            Array.isArray(relation) && relation.some((i) => {
                if (!i || !i.name) {
                    console.error(JSON.stringify(i) + ": symbolAreaConfig  relation no name");
                    return true;
                }
                if (!i.key) {
                    i.key = i.name;
                }
                this.relationBtn.get(key).set(i.key, i)
            });
        });
        // 再请求到数据以后 会重置
        Array.isArray(funcAreaTab) && funcAreaTab.some((i) => {
            if (!i || !i.name) {
                console.error(JSON.stringify(i) + ": symbolAreaConfig  relation no name");
                return true;
            }
            if (!i.key) {
                i.key = i.name;
            }
            this.tabcode.set(i.key, i)
        });

        this.saveReferparamIndex = null;

        this.currentFunction = null;

        this.processorMapping = new Map([
            // 1
            // [
            //     "nc.ui.iufo.formula.wizard.KeyWordRefProcessor",
            //     {
            //         type: "input",
            //     },
            // ],
            [
                "com.ufsoft.script.function.AreaRefProcessor",
                {
                    type: "input",
                },
            ],
            // 2
            [
                "com.ufsoft.script.function.NoneRefProcessor",
                {
                    type: "input",
                },
            ],
            // 3
            [
                "com.ufida.report.free.plugin.formula.NoneRefWithCellProcessor",
                {
                    type: "input",
                    // initValue: gridAction.getFormatCells() || "",
                    initValue: "",
                },
            ],
            // 4 下拉 公式变量的下拉列表，获取当前报表的所有变量  徐洋在做
            [
                "com.ufida.report.free.plugin.formula.AnaFormulaVarProcessor",
                {
                    type: "select",
                    dataType: "string",
                    path: ["m_extendModel", "m_repLevelInfo", "variables", "variables"],
                    displayFiled: "name",
                    valueFiled: "key",
                },
            ],
            // 5
            [
                "com.ufida.report.free.plugin.formula.AnaFormulaPageDimProcessor",
                {
                    type: "select",
                    dataType: "string",
                    path: [
                        'm_extendModel',
                        'm_repLevelInfo',
                        'com.ufida.iufo.table.model.ReportCondition',
                        'm_condition',
                    ],
                    displayFiled: "name",
                    valueFiled: "fldname",
                },
            ],
            // 6
            [
                "com.ufida.report.free.plugin.formula.AnaFormulaSmartModelRefProcessor",
                {
                    type: "refer",
                    dataType: "string",
                },
            ],
            // 7
            [
                "com.ufida.report.free.plugin.formula.AnaFormulaFrQueryItemProcessor",
                {
                    type: "select",
                    dataType: "string",
                    path: ["m_context", "key_report_FrQueryModel"],
                    displayFiled: "name",
                    valueFiled: "code",
                },
            ],
            // 8
            [
                "com.ufida.report.free.plugin.formula.AnaFormulaParamProcessor",
                {
                    type: "select",
                    dataType: "string",
                    path: ["m_extendModel", "m_repLevelInfo", "params"],
                    displayFiled: "name",
                    valueFiled: "code",
                    prefix: 'pa_',
                },
            ],
        ]);

        this.backProcessorMapping = new Map([
            // 1
            [
                "com.ufida.report.free.plugin.formula.AnaFormulaNCDataFmtProcessor",
                {
                    type: "select",
                    dataType: "number",
                },
            ],
            //2
            [
                "com.ufida.report.free.plugin.formula.AnaFormulaCountTypeRefProcessor",
                {
                    type: "select",
                    dataType: "number",
                },
            ],
            // 3
            [
                "com.ufida.report.free.plugin.formula.AnaFormulaPageDimValueProcessor",
                {
                    type: "select",
                    dataType: "number",
                },
            ],
            // 4
            [
                "com.ufida.report.free.plugin.formula.AnaFormulaRealOrDisValueProcessor",
                {
                    type: "select",
                    dataType: "number",
                },
            ],
            // 5
            [
                "com.ufida.report.free.plugin.formula.AnaFormulaSmartMacroProcessor",
                {
                    type: "select",
                    dataType: "string",
                },
            ],
        ]);
        // 双击函数收集
        this.textObj = {
            "if...Return":
                "if()\n" +
                " return(',')",
            "Else...Return":
                "else\n" +
                " return(',')",
            "Table.check": "Table.check(,'2,' , '0,审核通过')",
            "SZDAY": "SZDAY()",
            "SZMONTH": "SZMONTH()",
            "SZSEASON": "SZSEASON()",
            "SZYEAR": "SZYEAR()",
            "ZDAY": "ZDAY()",
            "ZHALFYEAR": "ZHALFYEAR()",
            "ZMONTH": "ZMONTH()",
            "ZPERIOD": "ZPERIOD()",
            "ZSEASON": "ZSEASON()",
            "ZWEEK": "ZWEEK()",
            "ZYEAR": "ZYEAR()",
        }
        // actions.reportModel.getDataByPath();

    }

    componentWillMount() {
        if(_.isEmpty($appRoot.state.json)){
            // 初始化调用getPlatformLang方法获取多语
            let callback = (json, bool, LangData) => {
                $appRoot.state.json = json;
            }
            $nccPlatform.getMultiLang({ domainName: 'ufoe', moduleId: 'public_lang' , callback }) // moduleId为所需加载json文件夹名称前缀
        }
    }


    componentDidMount() {
        this.init();

        setTimeout(() => {
            const areaDom = document.querySelector('.unit-formul-modal .UnitFormula textarea');
            if (areaDom) areaDom.focus();
        }, 500)
    }
    componentDidUpdate() {
        document.querySelectorAll(".platformRefer_input").forEach((i) => {
            i.setAttribute("disabled", "disabled")
        });

    }

    /**
     *初始化
     *
     * @memberof UnitFormula
     */
    init = async (searchConfig) => {
        const _instantformula = this.props.param ? fromJS(this.props.param.value) : "";
        // 此处为取出输入框原有的值 使用 reduex  不适用
        // let instantFormula = _instantformula || actions.reportModel.getCommon([
        //     "m_formatCellsModel",
        //     "m_htExtProp",
        //     "com.ufsoft.script.base.AreaFormulaModel",
        //     "public_instantFormula",
        // ]);

        // if (instantFormula) {

        //     instantFormula = instantFormula.toJS();

        //     instantFormula = Array.isArray(instantFormula) ? instantFormula : [];

        //     const { row, col } = gridAction.getSelectedCell();

        //     const findRes = _instantformula ? instantFormula[0] : instantFormula.find(formulaInfo => {

        //         const [coordinates] = formulaInfo;

        //         return row == coordinates.row && col == coordinates.col;
        //     })

        //     if (findRes) {

        //         // eslint-disable-next-line no-unused-vars
        //         const [coordinates, strContent] = findRes;

        //         this.setState({ showData: strContent.m_strContent })
        //     }
        // }

        // const { param = {} } = this.props;
        // 请求公式数据 Mendege
        // loadformula(param.query).then(res => {
        //     const { tabs } = res;

        //     const dataSource = tabs.map((tab, index) => {
        //         tab.tabCode = this.tabcode[index].code;
        //         return tab;
        //     });

        //     this.props.meta.setMeta(meta());

        //     const currentFuncInfo = dataSource[0].funcTypes[0].funcs[0]
        //     const totalParam = currentFuncInfo.info.paramNames.length;

        //     this.currentFunction = null;
        //     this.setState({
        //         dataSource,
        //         subMenuSelectedKeys: [dataSource[0].funcTypes[0].funcTypeName],
        //         currentFuncInfo,
        //         functionParameters: new Array(totalParam),
        //         defaultSelectedKeys: currentFuncInfo.funcCode,
        //     })
        // });
        // let res = mockRes;

        // let vres =  await $nccUtil.promiseAjax(CONSTANT.queryRptMngFormula);
        // console.log("请求回来的公式数据",vres);
        // 此处接收请求方法  如果有请求方法  那么不会取
        // 下部整体会被替换
        // 是否加载 columns 里的模板
        if (this.props.isConditionsReference) {
            this.props.meta.setMeta(meta());


        } else {
            let { funcAreaConfig, requestFuncAreaConfig, funcAreaTab } = this.props;
            if (requestFuncAreaConfig) {
                funcAreaConfig = await requestFuncAreaConfig();
            }
            this.tabcode = new Map();
            // 再请求到数据以后 会重置
            Array.isArray(funcAreaTab) && funcAreaTab.some((i) => {
                if (!i || !i.name) {
                    console.error(JSON.stringify(i) + ": symbolAreaConfig  relation no name");
                    return true;
                }
                if (!i.key) {
                    // if(i.key!==0){
                    //     i.key = i.name;
                    // }
                    i.key = i.name;
                }
                this.tabcode.set(i.key, i)
            });
            const dataSource = funcAreaConfig.map((tab, index) => {
                tab.tabCode = this.tabcode.get(tab.key).key;
                return tab;
            });

            this.props.meta.setMeta(meta());
            let currentFuncInfo = dataSource[0].funcTypes[0].funcs[0];
            let subMenuSelectedKeys = [dataSource[0].funcTypes[0].funcTypeName];
            let tabIndexKey = dataSource[0].key;
            let showSear = {
                
            };
            // let 
            // 搜索时加载
            if(searchConfig){
                let {funcAreaConfigIndex,funcTypesIndex,funcsIndex} = searchConfig;
                currentFuncInfo = dataSource[funcAreaConfigIndex].funcTypes[funcTypesIndex].funcs[funcsIndex];
                subMenuSelectedKeys = [dataSource[funcAreaConfigIndex].funcTypes[funcTypesIndex].funcTypeName];
                tabIndexKey = dataSource[funcAreaConfigIndex].key;
                console.log($appRoot.state.json['public_lang-000158'],dataSource,funcAreaConfigIndex,funcTypesIndex,dataSource[funcAreaConfigIndex].funcTypes[funcTypesIndex],subMenuSelectedKeys);/* 国际化处理： 搜索点击时的展开信息*/
            }
            
            const totalParam = currentFuncInfo.info && currentFuncInfo.info.paramNames ? currentFuncInfo.info.paramNames.length : 0;

            this.currentFunction = null;

            if (this.textObj[currentFuncInfo.funcCode]) {
                currentFuncInfo.isEstimate = true;
            } else {
                currentFuncInfo.isEstimate = false;
            }

            // 是不是字符型 是不是从审核方案进入 的init
            if (currentFuncInfo.isEstimate) {

                this.setState({
                    dataSource,
                    subMenuSelectedKeys: subMenuSelectedKeys,
                    currentFuncInfo,
                    showSearList:false,
                    functionParameters: new Array(totalParam),
                    defaultSelectedKeys: currentFuncInfo.funcCode,
                    tabIndexKey: tabIndexKey,
                    estimateText: this.textObj[currentFuncInfo.funcCode]
                })
            } else {
                this.setState({
                    dataSource,
                    showSearList:false,
                    subMenuSelectedKeys: subMenuSelectedKeys,
                    currentFuncInfo,
                    functionParameters: new Array(totalParam),
                    defaultSelectedKeys: currentFuncInfo.funcCode,
                    tabIndexKey: tabIndexKey
                })
            }
        }




    }

    //***************************开始上半区********************************** */

    /**
     *创建editorarea键盘
     *
     * @memberof UnitFormula
     */
    createOptBtns = btnConfig => {
        let htmls;
        if (!btnConfig) {
            return null;
        }
        htmls = [...btnConfig.values()].map((config, index) => {
            const { name, key } = config;
            return (
                <NCButton onClick={this.handelSetName} key={index} data-name={key} className="opt-btn">
                    {name}
                </NCButton>
            );
        });

        return htmls;
    };

    /**
     *创建编辑区功能按钮
     确定  取消  验证
     *
     * @memberof UnitFormula
     */
    textAreaFunctionBtnConfig = () => {

        const { showData, formulaAreaActive } = this.state;
        let keyshowData = showData[formulaAreaActive.key] || "";
        const btnConfig = [
            //操作按钮配置
            { key: "ok", name: $appRoot.state.json['public_lang-000021'], onClick: () => { this.handleOk("textareaCause", keyshowData) } },/* 国际化处理： 确定*/
            { key: "cancel", name: $appRoot.state.json['public_lang-000022'], onClick: this.handleCancel },/* 国际化处理： 取消*/
            { key: "validate", name: $appRoot.state.json['public_lang-000159'], onClick: () => { this.handleValidate("textareaCause", keyshowData) } },/* 国际化处理： 验证*/
        ];

        return btnConfig;
    }

    handleCancel = () => {
        if (this.props.isConditionsReference) {
            if (this.props.beCancelBtnClickCallBack) {
                this.props.beCancelBtnClickCallBack();
            }
        }
        this.props.pThat.props.modal.close(this.props.mid);
        if (this.props.beCancelGuidButtonBtnClickCallBack) {
            this.props.beCancelGuidButtonBtnClickCallBack();
        }


    }

    /**
     *公式编辑器确定按钮
     *
     * @memberof UnitFormula
     */
    handleOk = (area, validateString) => {
        console.log($appRoot.state.json['public_lang-000160'], area, validateString);/* 国际化处理： 点击确定按钮*/
        const { showData, formulaAreaActive } = this.state;
        let keyshowData = showData[formulaAreaActive.key] || "";

        // if (!showData) return this.props.closeModal();
        // 验证函数
        this.handleValidate(area, validateString,"textareaCause").then((ob) => {
            let {flag,formula} = ob;
            // 关键字
            if (flag) {
                if (this.props.isConditionsReference) {
                    if (this.props.beSureBtnClickCallBack) {
                        this.props.beSureBtnClickCallBack(formula||validateString);
                    }
                    if (this.props.beCancelBtnClickCallBack) {
                        this.props.beCancelBtnClickCallBack();
                    }
                    this.props.pThat.props.modal.close(this.props.mid);
                    if (this.props.beCancelGuidButtonBtnClickCallBack) {
                        this.props.beCancelGuidButtonBtnClickCallBack();
                    }
                    return;
                }
                this.props.configBeSureBtnClick(formula||validateString);
            }

            // 以下为自由报表逻辑
            return;
            // if (flag) {

            //     if (validateString == '') {
            //         const { row, col } = gridAction.getSelectedCell();
            //         deleteFormulaItem({ row, col }, { row, col });

            //     } else {

            //         const formulas = actions.reportModel.getCommon([
            //             "m_formatCellsModel",
            //             "m_htExtProp",
            //             "com.ufsoft.script.base.AreaFormulaModel",
            //             "public_instantFormula",
            //         ]);


            //         let isOverwrite = false;

            //         let formulas2JS = [];
            //         if (formulas) {
            //             formulas2JS = Array.isArray(formulas.toJS()) ? formulas.toJS() : [];
            //         }


            //         const { row, col } = gridAction.getSelectedCell();

            //         const coordinates = gridAction.getFormatCells();

            //         const instantFormula = [
            //             {
            //                 row,
            //                 col,
            //                 m_key: coordinates,
            //             }, {
            //                 m_strContent: showData,
            //             },
            //         ]

            //         let express = actions.plugin.getCommon(["pluginConfigMap", "UnitFormula", "express"]);
            //         express = express ? express.toJS() : "";

            //         if (express && express.callback) {
            //             express.callback(instantFormula);
            //         } else {
            //             const updatedFormulas = formulas2JS.map(formulaInfo => {

            //                 // eslint-disable-next-line no-unused-vars
            //                 const [coordinates, strContent] = formulaInfo;

            //                 if (row == coordinates.row && col == coordinates.col) {

            //                     isOverwrite = true;

            //                     return instantFormula;
            //                 }

            //                 return formulaInfo;
            //             })

            //             if (!isOverwrite) updatedFormulas.push(instantFormula);

            //             const m_cells = getSinglCellFromFormatCellByCoordinate({ row, col });

            //             if (!m_cells) {
            //                 setFormatCellsByCell({
            //                     m_nRow: row,
            //                     m_nCol: col,
            //                     isPrint: true,
            //                 });
            //             } else {
            //                 const cellInfo = { ...m_cells, ...{ m_Value: '' } };
            //                 setFormatCellsByCell({
            //                     m_nRow: row,
            //                     m_nCol: col,
            //                     ...cellInfo,
            //                 });
            //             }

            //             actions.reportModel.setCommon([
            //                 "m_formatCellsModel",
            //                 "m_htExtProp",
            //                 "com.ufsoft.script.base.AreaFormulaModel",
            //                 "public_instantFormula",
            //             ], fromJS(updatedFormulas));

            //             const res = actions.reportModel.getCommon([
            //                 "m_formatCellsModel",
            //             ]);

            //             console.log(formatDesignMultiLang['formatDesign-000503'], res.toJS());

            //             actions.plugin.setCommon(["pluginConfigMap", "UnitFormula", "express"], "");


            //         }
            //     }

            //     this.props.closeModal();
            // }
        })




    }


    // 验证提示区域 按钮
    createControlBtns = btnConfig => {

        return btnConfig.map((eve, index) => {
            const { name, onClick, key } = eve;
            return (
                <NCButton key={index} onClick={onClick} className="opt-btn" fieldid={key}>
                    {name}
                </NCButton>
            );
        });
    };

    handleTextAreaChange = value => {
        const { showData, formulaAreaActive } = this.state;
        showData[formulaAreaActive.key] = value;
        this.setState({ showData: showData });
    };

    handelSetName = e => {
        const { name } = e.target.dataset;
        //console.log("mmmmmmmmmmm");
        this.handlePushStr(name);
    };

    handlePushStr = btnContent => {
        let { formulaAreaActive, showData } = this.state;
        let textArea = this.textArea.querySelectorAll("textarea")[0];
        if (this.selected) {
            // 全选后,在选择的值,直接覆盖之前的值解决  NCCLOUD-166749 这个bug, 财务 杨龙,和测试周崚 让改
            this.selected = false;

            showData[formulaAreaActive.key] = btnContent;
            this.setState({ showData: showData }, () => {
                this.setCursorPosition(textArea, btnContent.length);
            });
        } else {
            let textAreaLen = textArea.value.length;
            let textAreaValue = textArea.value;
            let selectionStart = textArea.selectionStart;
            let finalRange = (textAreaValue.substr(0, selectionStart) + btnContent).length;
            let finalValue =
                textAreaValue.substr(0, selectionStart) + btnContent + textAreaValue.substring(selectionStart, textAreaLen);

            showData[formulaAreaActive.key] = finalValue;
            this.setState({ showData: showData }, () => {
                this.setCursorPosition(textArea, finalRange);
            });
        }
    };

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
                range.moveStart("character", -len);
                range.moveEnd("character", -len);
                range.moveStart("character", index);
                range.moveEnd("character", 0);
                range.select();
            }
        }, 10);
    };
    // 渲染上半区的方法
    generatorTopTabs = () => {

        const { formulaAreaConfig } = this.props;
        let { tabConfig } = formulaAreaConfig;
        // const { DragWidthCom } = this.props;
        if (tabConfig.length > 1) {
            return (
                <div className="tabs-left " id="top-tab-formula">
                    <NCTabs
                        tabBarStyle="primary"
                        defaultActiveKey={tabConfig[0].key}
                        fieldid= 'tabs-left'
                        onChange={key => {
                            //console.log("顶部tab 切换", key);
                            let { formulaAreaActive } = this.state;
                            if (this.props.formulaAreaTabChange) {
                                // 只执行外部逻辑
                                //this.props.formulaAreaTabChangeStop
                                this.props.formulaAreaTabChange(this,"tab",this.formulaAreaActive.key,key);
                            } else {
                                // 仅 执行内部逻辑   
                            }
                            // const { funcTypes } = dataSource.filter(tab => tab.tabCode == key)[0];
                            // const currentFuncInfo = funcTypes[0].funcs[0]
                            // const totalParam = currentFuncInfo.info.paramNames.length;
                            // this.currentFunction = null;

                            // this.setState({
                            //     subMenuSelectedKeys: [funcTypes[0].funcTypeName],
                            //     currentFuncInfo,
                            //     functionParameters: new Array(totalParam),
                            //     defaultSelectedKeys: currentFuncInfo.funcCode,
                            // });

                        }}
                    // extraContent={}  //搜索框渲染处
                    >
                        {
                            tabConfig.map(tab => {
                                const { name, key } = tab;
                                return (
                                    <NCTabPane tab={name} key={key} fieldid={name}>
                                        <div className="tab-pane-wrapper">
                                            {this.formulaSymbolsDom(name, key)}
                                        </div>
                                    </NCTabPane>
                                )
                            })
                        }

                    </NCTabs>
                </div >
            )
        } else {
            return (
                <div className="tabs-left " id="top-tab-formula">
                    <div className="tab-pane-wrapper">
                        {this.formulaSymbolsDom(
                            tabConfig[0], tabConfig[0].key
                        )
                        }
                    </div>
                </div >
            )
        }

    }
    formulaSymbolsDom = (name, key) => {
        const { showData, formulaAreaActive } = this.state;
        let keyshowData = showData[key] || "";
        return (
            <div className="uf-top">
                <div className="uf-t-textarea">
                    <NCTextArea
                        ref={dom => {
                            this.textArea = findDOMNode(dom);
                        }}
                        onEnter={true}
                        selfRangControl={false}
                        onBlur={() => { }}
                        value={keyshowData}
                        className="editor-show-area"
                        onChange={this.handleTextAreaChange}
                    />
                    {/* <textarea rows="3" cols="20">
                    在w3school，你可以找到你所需要的所有的网站建设教程。
                    </textarea> */}
                    {/* <TextArea></TextArea> */}

                </div>
                <div className="uf-t-btn">
                    <div className="centerWrap">
                        <div className="editor-comp-btns">{this.createOptBtns(this.operatorBtn.get(formulaAreaActive.key))}</div>
                        <div className="editor-opt-btns">{this.createOptBtns(this.relationBtn.get(formulaAreaActive.key))}</div>
                    </div>
                </div>
            </div>
        )


    }
    //***************************开始下半区********************************** */
    /**
     *渲染搜索区域的数据
     *
     * @memberof searchListDom
     */
    searchListDom = (srarchValue,searchList)=>{
        if(srarchValue&&this.state.showSearList){
            if(searchList.size){
                return <ul className="search_list_box search_list_non-empty_box">
                    {[...searchList.values()]}
                </ul>
            }else{
                return <div className="search_list_box search_list_empty_box">{$appRoot.state.json['public_lang-000193']}</div>/* 国际化处理： 搜索结果为空*/
            }
        }else{
            return null
        }
    }
    /**
     *渲染下半部tab区
     *
     * @memberof UnitFormula
     */
    generatorTabs = () => {

        const { dataSource } = this.state;

        const { DragWidthCom } = this.props;
        if (!dataSource.length) { return null }
        return (
            <div className="tabs-left" id="fu_me_tabs_left">
                <NCTabs
                    tabBarStyle="primary"
                    defaultActiveKey={dataSource[0].key}
                    activeKey={this.state.tabIndexKey}
                    fieldid= 'tabs-left'
                    onChange={key => {
                        const { funcTypes } = dataSource.filter(tab => tab.tabCode == key)[0];
                        const currentFuncInfo = funcTypes[0].funcs[0];
                        if (this.textObj[currentFuncInfo.funcCode]) {
                            currentFuncInfo.isEstimate = true;
                        } else {
                            currentFuncInfo.isEstimate = false;
                        }
                        if (!currentFuncInfo.isEstimate) {
                            const totalParam = currentFuncInfo.info.paramNames.length;
                            this.currentFunction = null;

                            this.setState({
                                subMenuSelectedKeys: [funcTypes[0].funcTypeName],
                                currentFuncInfo,
                                functionParameters: new Array(totalParam),
                                defaultSelectedKeys: currentFuncInfo.funcCode,
                                tabIndexKey: key,
                                estimateText: "",
                                platReferData: new Map()
                            });
                        } else {
                            this.currentFunction = null;

                            this.setState({
                                subMenuSelectedKeys: [funcTypes[0].funcTypeName],
                                currentFuncInfo,
                                // functionParameters: new Array(totalParam),
                                defaultSelectedKeys: currentFuncInfo.funcCode,
                                tabIndexKey: key,
                                estimateText: this.textObj[currentFuncInfo.funcCode],
                                platReferData: new Map()
                            });
                        }


                    }}
                    extraContent={
                        <div className="search_box">
                            <$nccPlatform.base.NCFormControl
                                type="search"
                                value={this.state.searchValue}
                                onFocus={()=>{
                                    this.setState({showSearList:true });
                                }}
                                onBlur = {()=>{
                                    setTimeout(()=>{
                                        this.setState({showSearList:false });
                                    },1000)
                                }}
                                onChange={this.searchChange}
                                // onSearch = {this.searchList}
                                placeholder={$appRoot.state.json['public_lang-000161']}/* 国际化处理： 搜索方法名称*/
                            >
                                
                            </$nccPlatform.base.NCFormControl>
                            
                        </div>
                    }  //搜索框渲染处
                >
                    
                    {
                        dataSource.map(tab => {
                            const { tabName, key } = tab;
                            return (
                                <NCTabPane tab={tabName} key={key} fieldid= {key}>
                                    <div className="tab-pane-wrapper">
                                        <DragWidthCom
                                            // 左树区域
                                            leftDom={this.generatorFunctionList(tab)}
                                            defLeftWid="600px"
                                            leftMinWid="140px"
                                            rightMinWid="100px"
                                            rightDom={this.generatorGuideAndOperation(tab)}
                                        />
                                    </div>
                                </NCTabPane>
                            )
                        })
                    }

                </NCTabs>
            </div >
        )
    }

    /**
     *渲染函数列表
     *
     * @memberof UnitFormula
     */
    generatorFunctionList = tab => {
        const { funcTypes } = tab;
        // subMenuSelectedKeys 默认展开的菜单  defaultSelectedKeys 默认选中的菜单项
        const { subMenuSelectedKeys, defaultSelectedKeys } = this.state;
       console.log($appRoot.state.json['public_lang-000162'],defaultSelectedKeys,subMenuSelectedKeys);/* 国际化处理： 选中菜单数据*/
        return (
            <div className="fun-container">
                <NCMenu
                    mode="inline"
                    className="fun-lists"
                    onOpenChange = {(ars)=>{
                        console.log($appRoot.state.json['public_lang-000163'],ars);/* 国际化处理： 展开关闭回调*/
                        // const currentFuncInfo = item.props.funcInfo;
                        this.setState({
                            subMenuSelectedKeys:ars,
                        })
                    }}
                    onSelect={({ item, key, selectedKeys }) => {
                        
                        this.currentFunction = null;
                        const currentFuncInfo = item.props.funcInfo;
                        let virFuncCode = currentFuncInfo.funcCode;
                        console.log($appRoot.state.json['public_lang-000164'],key, selectedKeys,currentFuncInfo);/* 国际化处理： 点击菜单*/
                        if(currentFuncInfo.funcCodeCn){
                            virFuncCode = currentFuncInfo.funcCodeCn;
                        }
                        if (currentFuncInfo.info && !currentFuncInfo.info.paramNames) {
                            currentFuncInfo.info.paramNames = null;
                            this.setState({
                                // subMenuSelectedKeys:funcCode,
                                defaultSelectedKeys:virFuncCode,
                                currentFuncInfo,
                                functionParameters: [],
                                guideCause: '',
                                estimateText: "",
                                platReferData: new Map()

                            })
                            return false;
                        }else if (currentFuncInfo.info) {
                            const totalParam = currentFuncInfo.info.paramNames.length;
                            this.setState({
                                currentFuncInfo,
                                defaultSelectedKeys:virFuncCode,
                                functionParameters: new Array(totalParam),
                                guideCause: '',
                                estimateText: "",
                                platReferData: new Map()
                            })
                        } else {



                            this.setState({
                                currentFuncInfo,
                                defaultSelectedKeys:virFuncCode,
                                // functionParameters: new Array(totalParam),
                                guideCause: '',
                                estimateText: this.textObj[currentFuncInfo.funcCode],
                                platReferData: new Map()

                            })
                        }

                    }}
                   
                    // defaultSelectedKeys={defaultSelectedKeys} 
                    openKeys={subMenuSelectedKeys}
                    defaultOpenKeys={subMenuSelectedKeys}
                    selectedKeys={[defaultSelectedKeys]} 

                >
                    {
                        funcTypes.map(funcType => {

                            const { funcTypeName, funcs } = funcType;

                            // const samplePanel = (
                            //     <NCMenu>
                            //         <Item key="1a">{"使用示例"}</Item>
                            //         <Item key="2a">{"查看示例"}</Item>
                            //         <Item key="3a">{"示例管理器"}</Item>
                            //     </NCMenu>
                            // )

                            return (
                                <SubMenu title={funcTypeName} key={funcTypeName}>
                                    {
                                        funcs.map(func => {
                                            let { funcCode, simpDesc, funcCodeCn,funcName } = func;
                                            let events = {};
                                            if (this.textObj[funcCode]) {
                                                events = {
                                                    onDoubleClick:()=>{
                                                        //console.log("双击事件被触发");
                                                        this.currentFunction = this.textObj[funcCode];
                                                        this.setState({estimateText:this.currentFunction},()=>{
                                                            this.handleGuideUse("guideCause", this.currentFunction)
                                                        })
                                                        
                                                    }
                                                }
                                            }
                                            if (funcCodeCn) {
                                                funcCode = funcCodeCn;
                                            }
                                            return (
                                                <Item key={funcCode} funcInfo={func}>
                                                    {/* 函数列表示例面板隐藏 */}
                                                    {/* <NCDropdown
                                                        trigger={["click"]}
                                                        overlay={samplePanel}
                                                        placement="bottomLeft"
                                                        animation="slide-up">
                                                        <i className="icon iconfont icon-xiaoxi2 panel" />
                                                    </NCDropdown> */}

                                                    <span {...events} className="func-code">{funcCode}</span>
                                                    <span  className="func-funcName">{funcName}</span>
                                                    <span
                                                     className="func-name"
                                                      onClick={() => { this.openFunDesc(func) }}
                                                      
                                                      >
                                                        {simpDesc}
                                                    </span>
                                                </Item>
                                            )
                                        })
                                    }

                                </SubMenu>
                            )
                        })
                    }
                </NCMenu>
            </div >);
    }

    /**
     *生成参数表区域
     *
     * @memberof UnitFormula
     */
    generatorParameterTable = (currentFuncInfo, reftype) => {
        console.log($appRoot.state.json['public_lang-000165'], currentFuncInfo);/* 国际化处理： 参数列表处理*/
        let isBusinessFunc = currentFuncInfo["isBusiFunc"];

        //  directRefer Mselect
        if (reftype === "directRefer" && isBusinessFunc) {
            this.isBusinessFunc = true;
            const { info, processorMapping, funcCode, paramRefList, funcName, indRefUrl } = currentFuncInfo;
            let paramKey = indRefUrl;
            return this.generatorParameterItem({
                label: funcName,
                type: "externalRefer",
                param: this.props.getParms(),
                paramKey,
            }
                , 0);
            // //console.log();
            // return ;
        } else if (reftype === "directRefer") {
            const { info, processorMapping, funcCode, paramRefList, funcName, indRefUrl } = currentFuncInfo;
            let paramKey = indRefUrl;

            return this.generatorParameterItem({
                label: funcName,
                type: "directRefer",
                param: this.props.getParms(),
                paramKey
            }
                , 0);
        }
        this.isBusinessFunc = false;


        if (Object.keys(currentFuncInfo).length == 0) return null;

        /**
          * processorMapping 可能为空
          */
        const { info = {}, processorMapping, funcCode, paramRefList } = currentFuncInfo;
        const { paramNames, paramRefProcesses } = info;

        if (!paramNames) return null;
        // paramNames 这个一定有 所以要循环这个 之后去paramRefProcesses里面取
        return paramNames.map((paramName, index) => {

            // 如果没有paramRefProcesses控制器，那么paramRefProcesses赋值为‘’，默认展示为input输入
            const paramRefProcesse = paramRefProcesses ? paramRefProcesses[index] : '';


            // 如果处理器为空字符串，那么就渲染为input类型
            if (paramRefProcesse == "") return this.generatorParameterItem({ label: paramName, type: "input", funcCode }, index);

            // 如果后端没有处理处理器下拉参数
            if (this.processorMapping.has(paramRefProcesse)) {

                const { type, path, displayFiled, valueFiled, initValue, dataType, prefix } = this.processorMapping.get(paramRefProcesse);

                if (type == "input") return this.generatorParameterItem({ label: paramName, type: "input", initValue, funcCode, dataType }, index);

                if (type == "select") {
                    // actions.reportModel.getDataByPath();
                    // displayFiled: "code",
                    // valueFiled: "name"

                    // const dataSource = actions.reportModel.getDataByPath(path);
                    const dataSource = [];



                    // const options = this.handleParameterOptions(dataSource, displayFiled, valueFiled, prefix);
                    const options = [];

                    return this.generatorParameterItem({ label: paramName, type: "select", initValue, funcCode, dataType }, index, options);
                }

                if (type == "refer") return this.generatorParameterItem({ label: paramName, type: "refer", initValue, funcCode, dataType }, index);
                
            }
            // 非常规参照之非直接型参照  (部门自定义)
            if (paramRefList[index]) {
                let paramKey = paramRefList[index];


                // 时间属性 、
                if (paramKey.indexOf(".do")>-1) {
                    return this.generatorParameterItem({
                        label: paramName, type: "platformRefer",
                        param: this.props.getParms(paramKey), paramKey,
                        platformReferCode: funcCode
                    }, index);
                    
                }//特殊参照  利用公式编辑器
                else if (paramKey === "ufoe/exports/components/ConditionsReference/index/") {
                    // return this.generatorParameterItem({ 
                    //     label: paramName, type: "refer", 
                    //     param: this.props.getParms(), paramKey ,
                    //     platformReferCode:funcCode
                    // }, index);
                    // const { info, processorMapping, funcCode, paramRefList, funcName,indRefUrl } = currentFuncInfo;
                    // let paramKey = indRefUrl;
                    paramKey = "ufoe/exports/components/ConditionsReference/index";
                    return this.generatorParameterItem({
                        label: paramName,
                        type: "directReferFormula",
                        param: this.props.getParms(),
                        paramKey,
                    }
                        , index);
                } //会计期间  exports/components/
                else if(paramKey === "uapbd/refer/pubinfo/AccperiodMonthTreeGridRef/index"){
                    paramKey = "ufoe/exports/components/AccPeriodUFOERef/index"
                    return this.generatorParameterItem({
                        label: paramName,
                        type: "AccPeriod",
                        param: this.props.getParms(),
                        paramKey,
                    }
                    , index);
                } else {
                    return this.generatorParameterItem({
                        label: paramName, type: "refer",
                        param: this.props.getParms(), paramKey,
                        platformReferCode: funcCode
                    }, index);
                }
            }

            // backProcessorMapping
            // 如果后端处理了处理器下拉参数
            if (processorMapping && processorMapping[paramRefProcesse]) {

                const optionDataSource = processorMapping[paramRefProcesse];

                const { dataType } = this.backProcessorMapping.get(paramRefProcesse);

                const options = [];

                for (let value in optionDataSource) {

                    const display = optionDataSource[value];

                    options.push({ display, value })
                }
                return this.generatorParameterItem({ label: paramName, type: "select", funcCode, dataType }, index, options);
            }

        })
    }

    handleParameterOptions = (dataSource, displayFiled, valueFiled, prefix = '') => {

        if (Object.prototype.toString.call(dataSource) == "[object Object]") {

            const options = [];

            for (let key in dataSource) {

                const value = dataSource[key];

                options.push({
                    display: value[displayFiled],
                    value: value[valueFiled],
                })
            }

            return options;
        }

        if (!Array.isArray(dataSource)) return [];

        return dataSource.map(item => ({ display: item[displayFiled], value: prefix + item[valueFiled] }));

    }

    handleParameterItemOnChange = (value, paramIndex, funcCode, dataType) => {


        const { functionParameters } = this.state;

        if (dataType == "string") {

            functionParameters[paramIndex] = `"${value}"`;

        } else if (dataType == "number") {

            functionParameters[paramIndex] = value;
        } else {
            // 这里预留放置“” 空字符串处理器
            functionParameters[paramIndex] = value;
        }



        this.setState({ functionParameters });

    }
    // 搜索回调

    searchChange = (v) => {
        console.log($appRoot.state.json['public_lang-000166'],this,v);/* 国际化处理： 当前正在搜索*/
        let funcAreaConfig = this.props.funcAreaConfig;
        let funcAreaTab = this.props.funcAreaTab;
        let list = new Map();
        funcAreaConfig.forEach((i,k)=>{
            i.funcTypes.forEach((e,f)=>{
                e.funcs.forEach((c,d)=>{
                    let str = c.funcCodeCn||c.funcCode;
                    let searchText = v;
                    let reg = new RegExp(searchText,"i");
                    let strArray = str.split(reg);
                    if(strArray.length>1){
                        let newStr = [];
                        strArray.forEach((a,b) => {
                            if(b!==0){
                                newStr.push(<span key={a+""+b}><span style={{color:"red"}}>{searchText}</span>{a}</span>);
                                // newStr.push(i);
                            }else{
                                newStr.push(<span key={a+""+b}>{a}</span>);
                            }
                        });
                        list.set(str,<li onClick={()=>{
                            let searchConfig = {
                                funcAreaConfigIndex:k,
                                funcTypesIndex:f,
                                funcsIndex:d,
                                // callback:()=>{
                                //     this.setState({showSearList:false});
                                // }
                            }
                            this.setState({estimateText:""})
                            this.init(searchConfig);
                        }} className="u-menu-item">{newStr}</li>);
                    }
                })
            });
        });
        //console.log("当前正在搜索后",this,list);
        this.setState({ searchValue: v,searchValueList:list });
    }
    // 分割地址参数
    splitReferUrl = (url = "") => {
        let urlArray = url.split("?");
        let refcode = urlArray[0];
        let configs = {};
        if (urlArray[1]) {
            // urlArray[1].split("=").forEach()
            let urlArrayParam = urlArray[1].split("=");
            while (urlArrayParam.length > 1) {
                configs[urlArrayParam.shift()] = urlArrayParam.shift();
            }
        }
        //console.log("参数地址处理", refcode, configs);
        return {
            refcode: refcode,
            param: configs,
        }
    }
    /**
     *生成参数列表Item
     *
     * @memberof UnitFormula
     */
    generatorParameterItem = (config, paramIndex, options = []) => {
        //console.log("生成参数列表Item", config, paramIndex, options);
        let { label, type, initValue = "", funcCode, dataType, paramKey, platformReferCode } = config;

        const { functionParameters } = this.state;

        let itemValue = functionParameters[paramIndex] == undefined ? initValue : functionParameters[paramIndex];

        if (initValue && !this.currentFunction.includes(initValue)) {
            this.handleParameterItemOnChange(initValue, paramIndex, funcCode, dataType);
        }

        const inputItem = (
            <div className="parameter-item">
                <span className="parameter-label">{label}</span>
                <div className="parameter-item-put">
                    <NCInput
                        key={funcCode}
                        onChange={value => { this.handleParameterItemOnChange(value, paramIndex, funcCode, dataType) }}
                        value={itemValue}
                    />
                </div>
            </div>
        )

        const selectItem = (
            <div className="parameter-item">
                <span className="parameter-label">{label}</span>
                <div className="parameter-item-put">

                    <NCSelect
                        showClear={false}
                        key={funcCode}
                        onSelect={value => { this.handleParameterItemOnChange(value, paramIndex, funcCode, dataType) }}
                        value={dataType == "string" ? itemValue.slice(1, itemValue.length - 1) : itemValue}
                        fieldid= 'select'
                    >
                        {
                            options.map(option => <NCOption key={option.value} value={option.value}>{option.display}</NCOption>)
                        }
                    </NCSelect>
                </div>
            </div>
        )
        //  非常规参照之非直接型参照  常规参照需要另写 
        const referItem = (
            <div className="parameter-item">
                <span className="parameter-label">{label}</span>
                <div className="parameter-item-put parameter-item-refer">
                    <div className="parameter-item-refer-container" title={itemValue}>{itemValue}</div>
                    <div>
                        <NCIcon
                            onClick={() => {
                                // eslint-disable-next-line react/no-string-refs
                                let { refcode, param } = this.splitReferUrl(paramKey);
                                if(refcode === "ufoe/exports/components/Mselect/index.js"){
                                    paramKey = "ufoe/exports/components/Mselect/index";
                                }else{
                                    paramKey = refcode;
                                }
                                
                                let sonCconfig = launchParameters["public"].call(this);
                                // //console.log("自己的参数",launchParameters[paramKey].call(this));
                                if (launchParameters[paramKey]) {
                                    sonCconfig = Object.assign(
                                        sonCconfig,
                                        launchParameters[paramKey].call(this,{
                                            mselectTrueData:itemValue
                                        })
                                    );

                                }


                                this.props.modelRefer.showModelLoadComponent(
                                    {
                                        modalConfig: {
                                            title: label,
                                            ...param
                                        },

                                        refcode: refcode,
                                        onChange: this.onInsert,
                                        param: {
                                            ...this.props.getParms(paramKey),
                                            unitFormulaText: this.state.showData["key1"] || ""
                                        },
                                        ...sonCconfig

                                    }
                                );
                                this.saveReferparamIndex = paramIndex;
                                this.formniaUrl = paramKey;

                                this.formniaUrl = paramKey;
                            }}
                            type="uf-listwithdots"
                        />
                    </div>
                </div>

            </div >
        )
        // 非常规参照之直接型参照
        const directReferItem = (
            <div className="parameter-item">
                <span className="parameter-label">{label}</span>
                <div className="parameter-item-put parameter-item-refer">
                    <div className="parameter-item-refer-container" title={itemValue}>{itemValue}</div>
                    <div>
                        <NCIcon
                            onClick={() => {
                                let { refcode, param } = this.splitReferUrl(paramKey);
                                let sonCconfig = launchParameters["public"].call(this);
                                // //console.log("自己的参数",launchParameters[paramKey].call(this));
                                if (launchParameters[paramKey]) {
                                    sonCconfig = Object.assign(
                                        sonCconfig,
                                        launchParameters[paramKey].call(this)
                                    );

                                }
                                paramKey = refcode = "ufoe/exports/components/GetData/index";
                                this.props.modelRefer.showModelLoadComponent(
                                    {
                                        modalConfig: {
                                            title: label,
                                            ...param
                                        },

                                        refcode: refcode,
                                        onChange: this.onInsert,
                                        param: { ...this.props.getParms(paramKey), unitFormulaText: this.state.showData["key1"] || "" },
                                        ...sonCconfig

                                    }
                                );
                                this.saveReferparamIndex = paramIndex;
                                this.formniaUrl = paramKey;

                                this.formniaUrl = paramKey;
                            }}
                            type="uf-listwithdots"
                        />
                    </div>
                </div>

            </div >
        )

      
        // 特殊公式之  使用本公式编辑组件 比如关键字条件 等 
        let directReferFormulaItem = () => {
            return (
                <div className="parameter-item">
                    <span className="parameter-label">{label}</span>
                    <div className="parameter-item-put parameter-item-refer">
                        <div className="parameter-item-refer-container" title={itemValue}>{itemValue}</div>
                        <div>
                            <GuidButton
                                ifFormula={true}

                                selector="#GuidButtonContainer" /** 外部门函数组件容器 */
                                beSureBtnClickCallBack={this.onInsert}
                                guidButtontype={paramKey}
                                funcType={label}
                                onClickFn={() => {
                                    this.saveReferparamIndex = paramIndex;
                                    this.formniaUrl = paramKey;
                                    this.formniaUrl = paramKey;
                                    // 需要在这里设置相应的表格数
                                    // this.setState({isShow:true});
                                }}
                                renderDone={(that) => {
                                    // 渲染完成以后设置表格数据
                                    //console.log(" 渲染完成以后设置表格数据", that);
                                    let data = {
                                        rows: [
                                            {
                                                values: {
                                                    "theLeftExpressionType": { display: $appRoot.state.json['public_lang-000167'], value: "2" },/* 国际化处理： 关键字参照*/
                                                    "theLeftExpressionValue": { display: "", value: "" },
                                                    "operator": { display: "=", value: "=" },
                                                    "theRightExpressionType": { display: $appRoot.state.json['public_lang-000139'], value: "1" },/* 国际化处理： 字符串*/
                                                    "theRightExpressionValue": { display: "", value: "" },
                                                }
                                            }
                                        ]
                                    }
                                    setTimeout(() => {
                                        window.mThat.props.editTable.setTableData("conditionsMeta", data);
                                        window.mThat.props.editTable.setStatus("conditionsMeta", "edit");
                                    }, 100)
                                }}
                                formulaConfig={{
                                    isConditionsReference: true,
                                    mid: "conditions_reference",
                                    title: label,
                                    beSureBtnClick: (res) => {
                                        //console.log("二级确定", res);
                                    },
                                    ConditionsReferenceText: itemValue,

                                    // isShow : this.state.isShow
                                }}
                                funcStr={this.state.showData["key1"] || ""}
                                // buttonType={`common`} /** 最原始在右上角的“向导”按钮 */
                                {...this.props}>
                                <NCIcon
                                    type="uf-listwithdots"
                                />
                            </GuidButton>

                        </div>
                    </div>

                </div >
            )
        }
        // 常规参照之 外部门参照
        const externalItem = (
            <div className="parameter-item">
                <span className="parameter-label">{label}</span>
                <div className="parameter-item-put parameter-item-refer">
                    <div className="parameter-item-refer-container" title={itemValue}>{itemValue}</div>
                    <div>
                        <GuidButton
                            selector="#GuidButtonContainer" /** 外部门函数组件容器 */
                            beSureBtnClickCallBack={this.onInsert}
                            guidButtontype={paramKey}
                            funcType={label}
                            onClickFn={() => {
                                this.saveReferparamIndex = paramIndex;
                                this.formniaUrl = paramKey;
                                this.formniaUrl = paramKey;
                            }}
                            funcStr={this.state.showData["key1"] || ""}
                            // buttonType={`common`} /** 最原始在右上角的“向导”按钮 */
                            {...this.props}>
                            <NCIcon
                                type="uf-listwithdots"
                            />
                        </GuidButton>

                    </div>
                </div>

            </div >
        )
        // 常规参照之 外部门参照
        // const { functionParameters } = this.state;
        // //console.log("参照回调", value, this.saveReferparamIndex, functionParameters);
        // functionParameters[this.saveReferparamIndex] = str;
        const platformItem = () => {
            // const { functionParameters } = this.state;
            // //console.log("生成普通参照回调", value, this.saveReferparamIndex, functionParameters);
            // let str = functionParameters[paramIndex];
            let sValue = {
                refname: "",
                refpk: "",
                refcode: ""
            };
            if (this.state.platReferData.has(paramIndex)) {
                sValue = this.state.platReferData.get(paramIndex);
            }


            return (
                <div className="parameter-item">
                    <span className="parameter-label">{label}</span>
                    {
                        creatRefer({
                            refName: label,
                            columnConfig: [{ name: [$appRoot.state.json['public_lang-000168'], $appRoot.state.json['public_lang-000169'],], code: ['refcode', 'refname'] }],/* 国际化处理： 编码,名称*/
                            url: paramKey,
                            value: sValue,
                            refcode: paramKey + platformReferCode,
                            onChange: (value) => {
                                console.log($appRoot.state.json['public_lang-000170'], JSON.stringify(value));/* 国际化处理： 平台型参照回调*/
                                let cloneValue = _.cloneDeep(value);
                                this.formniaUrl = "platformItem";
                                this.saveReferparamIndex = paramIndex;
                                let platReferData = this.state.platReferData;
                                // if (paramKey === "/nccloud/ufoe/refer/versionNoRef.do") {
                                //     value.refpk = value.refcode;
                                //     value.refname = value.refcode;
                                // }
                                value.refpk = value.refcode;
                                value.refname = value.refcode;
                                if(value.values&&value.values.value){
                                    value.refpk = value.values.value.value;
                                    value.refname = value.values.value.value;
                                }
                                // 会计期间方案 platReferData
                                console.log($appRoot.state.json['public_lang-000171'],paramKey,platReferData)/* 国际化处理： 会计期间方案*/
                                platReferData.set(paramIndex, cloneValue)
                                // let /nccloud/uapbd/pub/AccPeriodSchemeDefaultTreeRef.do
                                let AccPeriodSchemeDefaultTreeRefData = this.state.AccPeriodSchemeDefaultTreeRefData;
                                if(paramKey==="/nccloud/uapbd/pub/AccPeriodSchemeDefaultTreeRef.do"){
                                    AccPeriodSchemeDefaultTreeRefData = cloneValue;
                                }
                                this.setState({ platReferData: platReferData,AccPeriodSchemeDefaultTreeRefData:AccPeriodSchemeDefaultTreeRefData });
                                this.onInsert(value);
                            },
                            queryCondition: {...config.param}
                        })
                    }
                </div >
            );


        };
        // 会计期间
        const accPeriodUFOERefItem = () => {
            // const { functionParameters } = this.state;
            // //console.log("生成普通参照回调", value, this.saveReferparamIndex, functionParameters);
            // let str = functionParameters[paramIndex];
            let sValue = {
                refname: "",
                refpk: "",
                refcode: ""
            };
            if (this.state.platReferData.has(paramIndex)) {
                sValue = this.state.platReferData.get(paramIndex);
            }


            return (
                <div className="parameter-item parameter-item-unit-formula">
                    <span className="parameter-label">{label}</span>
                    {
                        AccPeriodUFOERefExport({
                            refName: label,
                            // columnConfig: [{ name: ["编码", "名称",], code: ['refcode', 'refname'] }],
                            // url: paramKey,
                            value: sValue,
                            refcode: paramKey + platformReferCode+"AccPeriod",
                            referClassName : "platformRefer_box",
                            className : "platformRefer_input",
                            onChange: (value) => {
                                //console.log("平台型参照回调", JSON.stringify(value));

                                this.formniaUrl = "platformItem";
                                this.saveReferparamIndex = paramIndex;
                                let platReferData = this.state.platReferData;
                                if (paramKey === "/nccloud/ufoe/refer/versionNoRef.do") {
                                    value.refpk = value.refcode;
                                    value.refname = value.refcode;
                                }
                                platReferData.set(paramIndex, value)
                                this.setState({ platReferData: platReferData });
                                this.onInsert(value);
                            },
                            queryCondition:()=>{
                                    return {
                                        pk_accperiodscheme:this.state.AccPeriodSchemeDefaultTreeRefData.refpk,//会计期间方案  必选的  
                                    ...this.props.getParms(paramKey)
                                    }
                            }
                        })
                    }
                </div >
            );


        };
        if (type == "input") return inputItem;
        if (type == "select") return selectItem;
        if (type == "refer") return referItem;
        if (type == "directRefer") return directReferItem;
        if (type == "directReferFormula") return directReferFormulaItem();
        if (type == "externalRefer") return externalItem;
        if (type == "platformRefer") return platformItem();
        if (type == "AccPeriod") return accPeriodUFOERefItem();


    }

    /**
     *参照回调处理
     *
     * @memberof UnitFormula
     */
    onInsert = value => {
        console.log($appRoot.state.json['public_lang-000172'], value);/* 国际化处理： 公式选择参照处理*/
        if (this.saveReferparamIndex == null) return null;
        let str = "";
        if (this.formniaUrl && returnToTheResult[this.formniaUrl]) {
            str = returnToTheResult[this.formniaUrl].call(this, value)
        } else if (typeof value === "string") {
            if(value.indexOf("(")!==-1 && value.indexOf("=")==-1){
                value = value.split("(")[1].split(")")[0]
            }
            str = value;
        }

        // this.formniaUrl `"${expression || m_fldname}"`;
        // const { expression, m_fldname } = value.field;

        const { functionParameters } = this.state;
        //console.log("参照回调", value, this.saveReferparamIndex, functionParameters);
        functionParameters[this.saveReferparamIndex] = str;

        this.setState({ functionParameters });

        this.saveReferparamIndex = null;

    };



    /**
     *生成向导区和操作按钮区
     *
     * @memberof UnitFormula
     */
    generatorGuideAndOperation = () => {
        console.log($appRoot.state.json['public_lang-000173']);/* 国际化处理： 生成向导区和操作按钮区*/
        let { currentFuncInfo = {}, functionParameters, guideCause } = this.state;

        let { funcCode, funcFormat, funcCodeCn } = currentFuncInfo;
        if (funcCodeCn) {
            funcCode = funcCodeCn;
        }
        if (functionParameters.every(item => item == undefined)) {
            this.currentFunction = funcCode ? funcCode + '()' : '';
        } else {
            // this.currentFunction = funcCode ? `${funcCode}(${new String(functionParameters).toString()})` : "";
            this.currentFunction = funcCode ? functionParameters.join(',').split('(')[0] == funcCode ? `${new String(functionParameters).toString()}` : `${funcCode}(${new String(functionParameters).toString()})` : "";
            
            this.currentFunction = this.strFiltrateEmty(this.currentFunction);
        }
        let rdom = null;
        let obj = {};
        if (this.textObj[funcCode]) {
            rdom = <div className="guide">
                <div className="guide-content-text">
                    {$appRoot.state.json['public_lang-000194']}{/* 国际化处理： 双击函数名可以直接使用*/}
                </div>
            </div>
            obj = {
                isTextObj:"condition"
            };
        } else {
            rdom = <div className="guide">
                <div className="guide-top">
                    <div className="top-code">
                        <span>{$appRoot.state.json['public_lang-000174']} : </span>{/* 国际化处理： 函数编码*/}
                        <span>{funcCode} </span>
                    </div>
                    <div className="top-format">
                        <span>{$appRoot.state.json['public_lang-000175']} : </span>{/* 国际化处理： 函数格式*/}
                        <span>{funcFormat} </span>
                    </div>
                </div>
                <div className="guide-middle">
                    <div className="paramList">{$appRoot.state.json['public_lang-000195']}</div>{/* 国际化处理： 参数表*/}
                    {this.state.estimateText ? <textarea value={this.state.estimateText} className="my-textarea" disabled="disabled" >

                    </textarea > :
                        (currentFuncInfo.isIndRefer ?
                            this.generatorParameterTable(currentFuncInfo, "directRefer") :
                            this.generatorParameterTable(currentFuncInfo))
                    }

                </div>

                <div className="guide-bottom">
                    <div className="func-container">
                        <span>{$appRoot.state.json['public_lang-000176']} : </span>{/* 国际化处理： 函数内容*/}
                        <span>{this.currentFunction}</span>
                    </div>
                    <div className="tip-info">
                        <span>{$appRoot.state.json['public_lang-000177']} : </span>{/* 国际化处理： 提示信息*/}
                        <span title={guideCause}>{guideCause} </span>
                    </div>
                </div>
            </div>

        }
        return (
            <div className="guide-container">
                {/* 搜索列表存在区域 searchValue ,searchValueList */}
                {this.searchListDom(this.state.searchValue,this.state.searchValueList)}
                {rdom}
                <div className="opration">
                    <div className="opration-guide normal-opration">{this.createControlBtns(this.guideFunctionBtnConfig(obj))}</div>
                    {/* <div className="opration-sample normal-opration">{this.createControlBtns(this.guideSampleBtnConfig())}</div> */}
                </div>
            </div>
        )

    }
    /**
     *函数区去空逗号
     *
     * @memberof 
     */
    strFiltrateEmty = (str) => {
        let newStr = str.split('').reverse();
        let virStrArr = [];
        let virFlag = false;
        let goOn = false;
        for (let i = 0; i < newStr.length; i++) {
            let it = newStr[i];
            if (newStr[0] === ")") {
                if (i === 0) {
                    virStrArr.push(it);
                } else {
                    if (it === "," && newStr[i + 1] === ",") {
                        if (goOn === false) {
                            continue;
                        } else {
                            virStrArr.push(it);
                        }

                    } else {
                        goOn = true;
                        virStrArr.push(it);
                    }
                }

            } else {
                virFlag = true;
                break;
            }
        }
        if (virStrArr[1] === ",") {
            virStrArr.splice(1, 1);
        }
        let rtr = virStrArr.reverse().join('');
        //console.log("公式转换", rtr);
        return rtr;
    }
    /**
     *向导功能按钮
     *
     * @memberof UnitFormula
     */
    guideFunctionBtnConfig = (type = "") => {
        if (type === "conditions") {
            let btnConfig = [
                //操作按钮配置 if(this.props.isConditionsReference)
                {
                    key: "guideUse", name: $appRoot.state.json['public_lang-000178'], onClick: () => {/* 国际化处理： 添加*/
                        this.handleGuideUse("conditions_add", this.currentFunction)
                    }
                },
                {
                    key: "guideUse", name: "And", onClick: () => {
                        this.handleGuideUse("And", this.currentFunction)
                    }
                },
                {
                    key: "guideUse", name: "Or", onClick: () => {
                        this.handleGuideUse("Or", this.currentFunction)
                    }
                },
                { key: "guideCancel", name: $appRoot.state.json['public_lang-000179'], onClick: this.handleGuideClear },/* 国际化处理： 清除*/
            ];

            return btnConfig;
        } else {
            let btnConfig = [
                //操作按钮配置
                { key: "guideUse", name: $appRoot.state.json['public_lang-000180'], onClick: () => { this.handleGuideUse("guideCause", this.currentFunction) } },/* 国际化处理： 使用*/
                { key: "guideValidate", name: $appRoot.state.json['public_lang-000159'], onClick: () => { this.handleValidate("guideCause", this.currentFunction) } },/* 国际化处理： 验证*/
                { key: "eliminate", name: $appRoot.state.json['public_lang-000179'], onClick: this.handleGuideClear },/* 国际化处理： 清除*/
            ];
            if(typeof type === "object"&&type.isTextObj==="condition"){
                btnConfig = [
                    //操作按钮配置
                    { key: "guideUse", name: $appRoot.state.json['public_lang-000180'], onClick: () => { this.handleGuideUse("guideCause", this.currentFunction) } }/* 国际化处理： 使用*/
                ];
            }
            return btnConfig;
        }

    }
    // 清楚回调
    handleGuideClear = () => {
        this.setState({ functionParameters: [], guideCause: "", platReferData: new Map() })
    }

    /**
     *函数向导区使用按钮
     *
     * @memberof UnitFormula
     */
    handleGuideUse = (area, validateString) => {
        //console.log("添加大牛", this.currentFunction);
        // 是否是关键字
        if (this.props.isConditionsReference) {
            if (area === "eliminate") {
                this.props.editTable.setValByKeyAndIndex("conditionsMeta",
                    0, "theLeftExpressionValue", { value: "", display: "" });
                this.props.editTable.setValByKeyAndIndex("conditionsMeta",
                    0, "theRightExpressionValue", { value: "", display: "" });
                return;
            }
            // 校验  
            let text = "";
            let oneValue = this.props.editTable.getValByKeyAndIndex("conditionsMeta", 0, "theLeftExpressionValue").value;
            let twoValue = this.props.editTable.getValByKeyAndIndex("conditionsMeta", 0, "theRightExpressionValue").value;
            //console.log("关键字添加", oneValue, twoValue);
            if (!oneValue && !twoValue) {
                $nccPlatform.toast({
                    color: 'warning',
                    content: $appRoot.state.json['public_lang-000181'],/* 国际化处理： 左表达式不能为空 右表达式不能为空*/
                })
                return;
            }
            if (!oneValue) {
                $nccPlatform.toast({
                    color: 'warning',
                    content: $appRoot.state.json['public_lang-000182'],/* 国际化处理： 左表达式不能为空*/
                })
                return;
            }
            if (!twoValue) {
                $nccPlatform.toast({
                    color: 'warning',
                    content: $appRoot.state.json['public_lang-000183'],/* 国际化处理： 右表达式不能为空*/
                })
                return;
            }
            if (area === "conditions_add") {
                text = oneValue + "=" + twoValue;
                this.handlePushStr(text);
            } else if (area === "And") {
                this.handlePushStr("And");
            } else if (area === "Or") {
                this.handlePushStr("Or");
            }
            // //console.log("关键字添加",this);

        } else {
            if (this.state.estimateText) {
                this.handlePushStr(this.state.estimateText);
            } else {
                this.handleValidate(area, validateString).then((ob) => {
                    let {flag,formula} = ob;
                    if (flag) {
                        this.handlePushStr(this.currentFunction);
                    }
                })
            }
        }


    }

    /**
     *公式验证 
     *
     * @memberof UnitFormula
     */
    handleValidate = (area, validateString,textareaCause) => {
        // this.currentFunction

        return new Promise(resolve => {
            if (area === "guideCause" && this.state.estimateText) {
                this.setState({ [area]: $appRoot.state.json['public_lang-000184'] });/* 国际化处理： 验证成功*/
                resolve(true);
                return;
            }
            if (validateString == '') {
                resolve(true);
                this.setState({ [area]: $appRoot.state.json['public_lang-000184'] });/* 国际化处理： 验证成功*/
            } else {

                this.formulaToVerify(validateString).then(res => {

                    const { flag, cause ,formula} = res;

                    if (flag && flag !== "false") {
                        if(formula&&area==="textareaCause"){
                            const { showData, formulaAreaActive } = this.state;
                            showData[formulaAreaActive.key] = formula;
                            this.setState({ showData: showData });
                        }

                        this.setState({ [area]: $appRoot.state.json['public_lang-000184'] });/* 国际化处理： 验证成功*/
                    } else {

                        this.setState({ [area]: cause });

                    }
                    
                    

                    resolve({flag,formula});
                })
            }
        })
    }

    /**
     *向导示例按钮
     *
     * @memberof UnitFormula
     */
    guideSampleBtnConfig = () => {

        const btnConfig = [
            //操作按钮配置
            { key: "sampleSave", name: $appRoot.state.json['public_lang-000185'], onClick: this.handleSampleSave },/* 国际化处理： 保存为示例*/
            { key: "sampleUse", name: $appRoot.state.json['public_lang-000186'], onClick: this.handleSampleUse },/* 国际化处理： 使用示例*/
            { key: "sampleBrowse", name: $appRoot.state.json['public_lang-000187'], onClick: this.handleSampleBrowse },/* 国际化处理： 查看示例*/
            { key: "sampleManager", name: $appRoot.state.json['public_lang-000188'], onClick: this.handleSampleManager },/* 国际化处理： 查看管理器*/
        ];

        return btnConfig;
    }

    //!!!!!!!!!!!!!!!!下半区功能部分--常规功能!!!!!!!!!!!!!!!!

    generatorFunctionDesc = () => {
       
        const { createSimpleTable } = this.props.table;
        const { functionDesc } = this.state;

        if (!functionDesc) return null;

        const { simpDesc,paramList } = functionDesc;
        console.log($appRoot.state.json['public_lang-000189'],functionDesc);/* 国际化处理： 函数说明*/
        let txtVakye = "";
        if(paramList&&paramList.length===1){
            txtVakye = paramList[0];
        }
        return (
            <div className="fun-desc-wrapper">
                <div className="fun-desc-top">
                    <span>{$appRoot.state.json['public_lang-000190']} : </span>{/* 国际化处理： 函数功能*/}
                    <span>{simpDesc}</span>
                </div>
                < div className="fun-desc-table-wrapper" >
                    {
                        txtVakye?<p style={{ whiteSpace:'pre'}}>
                            {txtVakye}
                        </p>
                        :createSimpleTable("funDesc", {
                            height: 500,
                        })
                    }
                    
                </div >
            </div>
        )


    }

    openFunDesc = info => {

        const { paramList } = info;

        const { modal, table } = this.props;
        let { show } = modal;

        const data = {
            rows: [],
        }

        let record = null;

        paramList.map((item, index) => {
            if (index % 2 == 0) {
                record = {};
                record.values = {
                    paramName: {
                        value: item,
                    },
                };
            } else {
                record.values.paramDesc = { value: item }

                data.rows.push(record);
            }
        })

        table.setAllTableData("funDesc", data);

        this.setState({ functionDesc: info }, () => {
            show("fun-desc")
        })
    }

    /**
     *公式验证
     *
     * @memberof UnitFormula
     */
    formulaToVerify = formulaString => {

        return new Promise(resolve => {
            // checkFormula
            //console.log("验证公式", formulaString);
            let url = this.props.checkFormulaUrl||CONSTANT.checkFormula;
            ajax({
                loading: false,
                url: url,
                data: { formula: formulaString},
                success: res => {
                    //console.log("验证公司返回结果", res);
                    let data = {
                        flag: res.data.checkstatus, cause: res.data.msg,
                        formula:res.data.formula
                    }
                    resolve(data);
                },
            });
            // resolve({
            //     cause: "在第1个字符处出现语法错误：区域格式错误",
            //     flag: false
            // });
        })
        // let vres = await $nccUtil.promiseAjax(CONSTANT.checkFormula,{ formula: formulaString });

    }
    //!!!!!!!!!!!!!!!!下半区功能部分--关键字条件功能!!!!!!!!!!!!!!!!
    conditionsReferenceDom = () => {
        window.mThatFn(this);
        let conditionsData = this.state.conditionsData;
        return <div className="conditionsReference_box">
            <div className="_left">
                {
                    this.props.editTable.createEditTable("conditionsMeta", {
                        height: 150,
                        showCheck: true,
                        // onBeforeEvent: this.onBeforeEventThree,
                        onBeforeEvent: (...ars) => {
                            //console.log("表单编辑前", ars);
                        },
                        // isAddRow:true,
                        // onSelected:this.onSelected,
                        // onSelectedAll:this.onSelectedAll,
                        // onAfterEvent: this.ononAfterEventThree
                        onAfterEvent: (...ars) => {
                            //console.log("表单编辑后", ars, this.props.meta.getMeta());
                            let rowid = ars[6].rowid;
                            let meta = this.props.meta.getMeta();
                            let key = "";
                            // refcode: "ufoe/refer/inner/KeyCombinationRef/index"
                            // return;
                            if (ars[2] === "theLeftExpressionType") {
                                // let meta = mThat.props.meta.getMeta();
                                meta["conditionsMeta"].items.some((i) => {
                                    if (i.attrcode === "theLeftExpressionValue" && ars[3] === "1") {
                                        i.itemtype = "input";
                                        return true;
                                    }
                                    if (i.attrcode === "theLeftExpressionValue" && ars[3] === "2") {
                                        i.itemtype = "refer";
                                        return true;
                                    }
                                    if (i.attrcode === "theLeftExpressionValue" && ars[3] === "3") {
                                        i.itemtype = "input";
                                        return true;
                                    }
                                })
                                key = "theLeftExpressionValue";

                            }
                            if (ars[2] === "theRightExpressionType") {
                                // let meta = mThat.props.meta.getMeta();
                                meta["conditionsMeta"].items.some((i) => {
                                    if (i.attrcode === "theRightExpressionValue" && ars[3] === "1") {
                                        i.itemtype = "input";
                                        return true;
                                    }
                                    if (i.attrcode === "theRightExpressionValue" && ars[3] === "2") {
                                        i.itemtype = "refer";
                                        return true;
                                    }
                                })

                                key = "theRightExpressionValue";
                            }
                            if (ars[2] === "theRightExpressionType" || ars[2] === "theLeftExpressionType") {
                                this.props.meta.setMeta(meta, () => {
                                    this.props.editTable.setValByKeyAndRowId("conditionsMeta",
                                        rowid, key, { value: "", display: "" })
                                });
                            }
                            if (ars[2] === "theLeftExpressionValue" && typeof ars[3] === "object") {
                                if (!ars[3].value) {
                                    return;
                                }
                                key = "theLeftExpressionValue";
                                let text = `K('${ars[3].refname}')`;
                                let text2 = `ZKEY('${ars[3].refname}')`;
                                this.props.meta.setMeta(meta, () => {
                                    this.props.editTable.setValByKeyAndRowId("conditionsMeta",
                                        rowid, key, { value: text, display: text })
                                });
                                this.props.meta.setMeta(meta, () => {
                                    this.props.editTable.setValByKeyAndRowId("conditionsMeta",
                                        rowid, "theRightExpressionValue", { value: text2, display: text2 })
                                });
                            }




                        }
                        // selectedChange:this.tableEvent[MAIN_RIGHT_TABLEID]["selectedChange"].bind(this),
                        // onSelectedAll:this.tableEvent[MAIN_RIGHT_TABLEID]["onSelectedAll"].bind(this),
                        // onSelected:this.tableEvent[MAIN_RIGHT_TABLEID]["onSelected"].bind(this),

                    })
                }
            </div>
            <div className="_right">
                {this.createControlBtns(this.guideFunctionBtnConfig("conditions"))}
            </div>

        </div>

    }
    // 整体渲染方法
    render() {

        const { textareaCause, formulaAreaActive } = this.state;
        const { modal } = this.props;
        let { createModal } = modal;
        //console.log("Content()", this, this.state);
        let style = {};
        if (this.props.isConditionsReference) {
            style = { height: 500, margin: 0 };
        }
        return (
            <div style={style} className="uf-wrapper mendege-uf-wrapper">
                <div className="uf-container">
                    {/* 顶部区域*/}
                    {this.generatorTopTabs()}
                    {/* 验证提示区域 验证提示区域  键盘验证   我们说的是这样么 */}
                    <div className="fu-middle">
                        <div className="textarea-cause">{textareaCause}</div>
                        <div className="editor-control-btns">{this.createControlBtns(this.textAreaFunctionBtnConfig())}</div>
                    </div>
                    {
                        this.props.isConditionsReference
                            ?
                            this.conditionsReferenceDom() :
                            <div className="uf-bottom">
                                <div className="bottom-container">
                                    {this.generatorTabs()}
                                </div>
                            </div>
                    }
                    {createModal("fun-desc", {
                        title: $appRoot.state.json['public_lang-000189'],/* 国际化处理： 函数说明*/
                        // resizable: false,
                        className: "fun-desc",
                        content: this.generatorFunctionDesc(),
                        zIndex: 300,
                        noFooter: true,
                    })}

                    {/* <MetaDataRefer
                            // eslint-disable-next-line react/no-string-refs
                            ref="composeTree"
                            onInsert={this.onInsert}
                        /> */}
                    {//GuidButtonContainer
                        <div id={"GuidButtonContainer"}></div>
                    }

                </div>

            </div>
        )
    }
}
UnitFormula.defaultProps = {
    ...defaultPropsConfig,
    ...defaultPropsCallback
}
let UnitFormulaSon = createPage({})(ModelRefer(UnitFormula));

export default function UnitFormulaBox(WrappedComponent, configBox) {
    return class Son extends React.Component {
        constructor(props) {
            super(props);
            this.props = props;
            this.state = {
                showFlag: true
            }

        }

        componentWillMount() {
            if(_.isEmpty($appRoot.state.json)){
                // 初始化调用getPlatformLang方法获取多语
                let callback = (json, bool, LangData) => {
                    $appRoot.state.json = json;
                }
                $nccPlatform.getMultiLang({ domainName: 'ufoe', moduleId: 'public_lang' , callback }) // moduleId为所需加载json文件夹名称前缀
            }
        }

        // 打开弹窗 需要传入 url 以及 type
        showModel = async (config = {}, modeConfig = {}) => {

            let { mid = "" } = config;
            // 此处请求数据  可以使用外部传入的 方法 
            if (config.isConditionsReference) {
                //console.log("关键字  关键", config);
                let { funcAreaConfig, funcAreaTab } = config;
                if (!funcAreaConfig) {
                    funcAreaConfig = [];
                    let flag = false;
                    if (!funcAreaTab) {
                        funcAreaTab = [];
                        flag = true;
                    }
                    funcAreaConfig = this.queryRptMngFormula.map((i, k) => {
                        i.key = String(k);
                        if (flag) {
                            funcAreaTab.push({
                                key: String(k),
                                name: i.tabName
                            });
                        }
                        return i;
                    })
                }
                // 此处接收请求方法  如果有请求方法  那么不会取
                // let { funcAreaConfig ,requestFuncAreaConfig} = this.props;
                config.configBeSureBtnClick = config.beSureBtnClick;
                config.contentConfig[0].content = config.ConditionsReferenceText;
                config.funcAreaConfig = funcAreaConfig;
                config.funcAreaTab = funcAreaTab;
                this.beCancelGuidButtonBtnClickCallBack = config.beCancelGuidButtonBtnClickCallBack;
                config.pThat = this;
                // this.configBeSureBtnClick = config.beSureBtnClick
                this.props.modal.show(mid, {
                    content: this.Content(config),
                    ...modeConfig
                }, () => {

                })
            } else {
                let vres;

                if (!this.queryRptMngFormula) {
                    let url = CONSTANT.queryRptMngFormula;
                    if (config.url) {
                        url = config.url;
                    }
                    vres = await $nccUtil.promiseAjax(url);
                    
                    this.queryRptMngFormula = JSON.parse(vres.data);
                    
                    
                }
                console.log($appRoot.state.json['public_lang-000191'],this.queryRptMngFormula);/* 国际化处理： 公式数据*/
                let { funcAreaConfig, funcAreaTab } = config;
                if (!funcAreaConfig) {
                    funcAreaConfig = [];
                    let flag = false;
                    if (!funcAreaTab) {
                        funcAreaTab = [];
                        flag = true;
                    }
                    funcAreaConfig = this.queryRptMngFormula.map((i, k) => {
                        i.key = String(k);
                        if (flag) {
                            funcAreaTab.push({
                                key: String(k),
                                name: i.tabName
                            });
                        }
                        return i;
                    })
                }
                // 此处接收请求方法  如果有请求方法  那么不会取
                // let { funcAreaConfig ,requestFuncAreaConfig} = this.props;
                config.configBeSureBtnClick = config.beSureBtnClick;
                    // config.contentConfig = config.contentConfig;
                config.funcAreaConfig = funcAreaConfig;
                config.funcAreaTab = funcAreaTab;
                config.pThat = this;
                // this.configBeSureBtnClick = config.beSureBtnClick
                this.props.modal.show(mid, {
                    content: this.Content(config),
                    // content:this.Content({
                    //     configBeSureBtnClick:config.beSureBtnClick,
                    //     contentConfig:config.contentConfig

                    // }),
                    ...modeConfig
                }, () => {

                })
            }

        }
        // 关闭弹窗
        closeModel = (mid) => {
            this.props.modal.close(mid);
        }
        Content = (config = {}) => {
            // return config?<UnitFormulaSon {...config} {...this.props}></UnitFormulaSon>:null
            function fn() {

            }
            return <UnitFormulaSon  {...this.props} {...config}></UnitFormulaSon>
        }
        /**
        /**
         * @method 参数形式调用该方法 目前只试验过表格
         *  config 详细 需要的参数 
         *  that 外部组件this  必须的 ,type="editTable", 搭配使用平台组件类型  暂时只支持表格 id 组件id
         *   getParmsFn 扩展参数方法  需要返回 当前组件需要的参数  unitFormulaId 公式组件的id 
         *  attrCode :相应操作列的code 
         *   
         *   createRefer({
             that:this,
            type:"editTable",
            getParmsFn:()=>{},
            valueFn:(text, record, index)=>{
                return  record.values[CONSTANT.treeTableConfig[4].key].value
            }
            unitFormulaId:CONSTANT.getDataTreeTable4,
                id:CONSTANT.three_table_id,
            attrCode:CONSTANT.treeTableConfig[4].key,
        //      isBowser:true,//是否开启浏览态
                faultTolerant:(text, record, index)=>{
                    
                    return record.values[CONSTANT.treeTableConfig[3].key].value === "expression"
                }
        *   })
        */
        createRefer = function (config = {}) {

            let { that, type = "editTable", id, valueFn, attrCode, faultTolerant, unitFormulaId, getParmsFn, inputDisable = false } = config;
            if (!that) {
                return function (text, record, index) {
                    console.error("this is no  that");
                }
            }
            return function (text, record, index) {
                //console.log("表格固定阐述", text, record, index);
                if (faultTolerant(text, record, index)) {
                    return (
                        <div>
                            <div className="m_NCIcon_box">
                                <div className="NCIcon_input m_NCIcon_input">
                                    <NCInput
                                        disable={inputDisable}
                                        key={"NCIcon_input" + index}
                                        onChange={(e) => {
                                            // let twoTableState = this.state.twoTableState;
                                            // twoTableState[index] = e;
                                            // this.setState({twoTableState});
                                            that.props.editTable.setValByKeyAndIndex(id, index, attrCode, { value: e, display: e });
                                        }}
                                        value={valueFn(text, record, index)}
                                    />
                                </div>
                                <div className="NCIcon_icon m_NCIcon_icon">
                                    <NCIcon
                                        onClick={() => {
                                            //console.log("图标点击事件");
                                            //   //console.log("点击确定回调",this,text, record, index);
                                            // 设置表格数据
                                            let contentConfig = [];
                                            contentConfig[0] = {
                                                key: "key1",
                                                content: record.values[attrCode].value//如果有值  在切换或者初始化进入以后会渲染该值
                                            };
                                            that.props.unitFormula.showModel({
                                                mid: unitFormulaId,
                                                contentConfig: contentConfig,
                                                getParms: getParmsFn.bind(that),
                                                beSureBtnClick: (data) => {
                                                    //console.log("点击确定回调", data, "set_calculation_index_table_meta",);
                                                    // let twoTableState = this.state.twoTableState;
                                                    // twoTableState[index] = data;
                                                    // this.setState({twoTableState});
                                                    that.props.editTable.setValByKeyAndIndex(id, index, attrCode, { value: data, display: data });
                                                    that.props.unitFormula.closeModel(unitFormulaId);
                                                },
                                                ...config
                                            },
                                                {}
                                            );
                                        }}
                                        type="uf-listwithdots"
                                    />
                                </div>

                            </div>
                        </div>

                    )
                } else {
                    return (
                        <div className="NCIcon_box">

                            <div className="NCIcon_input">
                                <NCInput
                                    key={"NCIcon_input" + index}
                                    disable
                                    onChange={(e) => {
                                        // let twoTableState = that.state.twoTableState;
                                        // twoTableState[index] = e;
                                        // that.setState({ twoTableState });
                                    }}
                                    value={valueFn(text, record, index)}
                                />
                            </div>
                        </div>




                    )
                }
            }


        }
        createFormRefer = function (config = {}) {
            let { refConfig = {} } = config;
            let { label, itemValue, paramKey, isConditionsReference = true } = config;
            return (
                <div className="parameter-item">
                    <span className="parameter-label">{label}</span>
                    <div className="parameter-item-put parameter-item-refer">
                        <div className="parameter-item-refer-container" title={itemValue}>{itemValue}</div>
                        <div>
                            <NCIcon
                                onClick={() => {
                                    // eslint-disable-next-line react/no-string-refs
                                    let { refcode, param } = refConfig.that.splitReferUrl(paramKey);
                                    paramKey = refcode = "ufoe/exports/components/Mselect/index";
                                    let sonCconfig = launchParameters["public"].call(this);
                                    console.log($appRoot.state.json['public_lang-000192'],launchParameters[paramKey].call(this));/* 国际化处理： 自己的参数*/
                                    if (launchParameters[paramKey]) {
                                        sonCconfig = Object.assign(
                                            sonCconfig,
                                            launchParameters[paramKey].call(this)
                                        );

                                    }
                                    refConfig.that.props.modelRefer.showModelLoadComponent(
                                        {
                                            modalConfig: {
                                                title: label,
                                                ...param
                                            },

                                            refcode: refcode,
                                            onChange: refConfig.that.onInsert,
                                            param: {
                                                ...refConfig.that.props.getParms(paramKey),
                                                unitFormulaText: refConfig.that.state.showData["key1"] || ""
                                            },
                                            ...sonCconfig,
                                            ...refConfig.that.props,


                                        }
                                    );
                                    refConfig.that.saveReferparamIndex = paramIndex;
                                    refConfig.that.formniaUrl = paramKey;

                                    refConfig.that.formniaUrl = paramKey;
                                }}
                                type="uf-listwithdots"
                            />
                        </div>
                    </div>

                </div >
            )
        }

        render() {

            let { title = title, mid = "formula_editor", Content = null, buttons = null } = configBox;
            mid == "formula_editor" && $appRoot && (title = $appRoot.state.json['182001016-000205']); /* 国际化处理： 计算指标公式编辑*/
            let unitFormula = {
                showModel: this.showModel,
                Content: this.Content,
                closeModel: this.closeModel,
                createRefer: this.createRefer
            }
            //console.log("弹窗内容是佛更新2", configBox);
            // this.mid = mid;
            return <div>
                <WrappedComponent unitFormula={unitFormula}   {...this.props} />
                {
                    this.props.modal.createModal(mid, {
                        title: title,
                        resizable: false,
                        userControl: true,
                        className: mid,
                        content: this.Content(),
                        closeModalEve: () => {
                            if (this.beCancelGuidButtonBtnClickCallBack) {
                                this.beCancelGuidButtonBtnClickCallBack();

                            }
                            this.closeModel(mid);
                        },
                        //    leftBtnName:'确定', //左侧按钮名称F
                        //    rightBtnName:'取消', //右侧按钮名称
                        hasCloseBtn: false,//控制“X”按钮，显示true，不显示false，默认不显示
                        //    beSureBtnClick:this.modelEvent[constantConfig.ADD_TREE_MODE_ID]["beSureBtnClick"].bind(this), 
                        //    cancelBtnClick: this.modelEvent[constantConfig.ADD_TREE_MODE_ID]["cancelBtnClick"].bind(this),
                        closeByClickBackDrop: false,//点击遮罩关闭提示框，默认是false点击不关闭,点击关闭是true
                        // showCustomBtns: true,
                        noFooter: true,
                        bodyHeight: 570,
                        validateCloseBtn: true,
                        size:"xlg"
                    })
                }
            </div>


        }
    }
}


