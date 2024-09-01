import React from 'react';
let { base, createPage } = $nccPlatform;

window.$appRoot = window.$appRoot ? window.$appRoot : {state:{json:{}}}

import {setModeDef,getModeDef,switchoverOrgSet,setMeTableData,transformOne,
    twoModalBeSureBtnClick,onBeforeEventThree,createRefer,ononAfterEventThree,getTreeNodeParents
} from "./modelContentMethod"
import {buttonEvent,formEvent} from "./event"
import "./index.less"
// let { base } = $nccPlatform;
const { NCCheckbox ,NCButton,NCButtonGroup} = base;
import {CONSTANT} from "./constant";
import {Headline} from "./Headline";
import MyTree from "./MyTree";
import Mymodal from "./Modal";
import UnitFormula from "../PluginUnitFormula/unitFormula"

class ArticleSteps extends React.Component {
    constructor(props){
        super(props);
        this.props = props;
        this.props.use.editTable(CONSTANT.twoTableId,CONSTANT.two_modal_table_id,CONSTANT.three_two_table_id);
        this.props.use.form('threeFormMeta')
        this.state = {
            stepIndex:0,
            oneTabIndex:0,
            //第一步 电子表格 分页数据
            reportPagination: {
                total: 1,
            },
            twoTableState:[],
            // oneTreeData:data
        }
        this.slectTreePk = "";
        this.twoModalBeSureBtnClick = twoModalBeSureBtnClick.bind(this);
        this.onBeforeEventThree = onBeforeEventThree.bind(this);
        this.createRefer = createRefer.bind(this);
        this.ononAfterEventThree = ononAfterEventThree.bind(this);
        // 寻找树节点 父pk 组
        this.getTreeNodeParents = getTreeNodeParents.bind(this);
        this.twoTable = false;
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

    // 初始化整个弹窗  完成 取消 以后调用   type 是否关闭弹窗 如果不关闭弹窗  会默认回到第一步
    initModel = (type)=>{

 
    }
    verifyClick = (nextType,pervType)=>{
        if(pervType===0){
            if(!this.slectTreePk){
                $nccPlatform.toast({ color: 'warning', content: $appRoot.state.json['public_lang-000081']}); /* 国际化处理： 请选择数据集对象*/
                return false;
            } 
            
        }

    }
    // 步骤条点击事件
    clickStepIcon =  async (e,type,straightIn = false) => {
        console.log($appRoot.state.json['public_lang-000082'],e,type,straightIn);/* 国际化处理： 步骤条点击*/
        let flag = true;
        let isQualified;//合格性校验
        if(!straightIn){
            if(e&&e.target&&e.target.className.indexOf("u-steps-icon")!==-1){
                flag  = false;
           }
           if(flag){
                return;
           }
           if(type===this.state.stepIndex){
               console.log($appRoot.state.json['public_lang-000013'],type);/* 国际化处理： 重复点击*/
             return
            }
        }
        if(this.verifyClick(type,this.state.stepIndex)===false){
            return;
        }
       switch(type){
            case 0:
                console.log($appRoot.state.json['public_lang-000014']);/* 国际化处理： 点击步骤1*/
                this.setState({stepIndex:type,oneTabIndex:0},()=>{
                    
                });
            break;
            case 1:
                console.log($appRoot.state.json['public_lang-000015']);/* 国际化处理： 点击步骤2*/
                if(this.twoSlectTreePk){
                    // 如果 不一样  需要清空当前数据
                    if(this.twoSlectTreePk!==this.slectTreePk){
                        this.twoSlectTreePk = this.slectTreePk;
                        // 清空后续两个表格数据  以及最后一步表单数据
                        this.props.editTable.setTableData(CONSTANT.twoTableId,{rows:[]});
                        // 第三步表单数据
                        this.props.form.EmptyAllFormValue(CONSTANT.threeFormMetaId);
                        // 第三步表格数据
                        this.props.editTable.setTableData(CONSTANT.three_table_id,{rows:[]});
                        this.props.editTable.setTableData(CONSTANT.three_two_table_id,{rows:[]});
                        
                    }
                }
                this.twoSlectTreePk = this.slectTreePk;
                // ufoe/getdata/getDataSmartDefFieldGet.do
                this.setState({stepIndex:type});
                
            break;
            case 2:
                // 请求物料数据
                try {
                    let vres =  await $nccUtil.promiseAjax(CONSTANT.getDataSmartDefFieldGet,{
                        pk_def:this.slectTreePk
                    });
                    // 操作符
                    let Operators = [
                        {display:"=",value:"="},
                        {display:">",value:">"},
                        {display:">=",value:">="},
                        {display:"<",value:"<"},
                        {display:"<>",value:"<>"},
                        {display:"<>",value:"<>"},
                        {display:"in",value:"in"},
                        {display:"like",value:"like"}
                    ];
                    // 字段集合
                    let fieldCollection = [
                        
                    ]
                    this.multiLangTextMap = new Map();
                    vres.data.fieldList.forEach((i,k)=>{
                        this.multiLangTextMap.set(i.multiLangText.display,i)
                        fieldCollection.push(
                            {
                                value:i.multiLangText.display,
                                display:i.multiLangText.display
                            }
                        )
                    });
                    let meta = this.props.meta.getMeta();
                    meta["three_table_id"].items.forEach(i=>{
                        if(i.attrcode === CONSTANT.treeTableConfig[0].key){
                            i["itemtype"] = "select";
                            i["initialvalue"] = {
                                "display": "AND",
                                "value": "AND"
                              };
                            i["options"] =  [
                                {
                                  "display": "AND",
                                  "value": "AND"
                                }
                              ]
                        }
                        if(i.attrcode === CONSTANT.treeTableConfig[1].key){
                            i["itemtype"] = "select";
                            i["initialvalue"] = fieldCollection[0];
                            i["options"] =  fieldCollection;
                        }
                        if(i.attrcode === CONSTANT.treeTableConfig[2].key){
                            i["itemtype"] = "select";
                            i["initialvalue"] = Operators[0];
                            i["options"] =  Operators;
                        }
                        if(i.attrcode === CONSTANT.treeTableConfig[3].key){
                            i["itemtype"] = "select";
                            i["initialvalue"] = {
                                "display": $appRoot.state.json['public_lang-000083'],/* 国际化处理： 常量*/
                                "value": "1"
                            };
                            i["options"] =  [
                                {
                                  "display": $appRoot.state.json['public_lang-000083'],/* 国际化处理： 常量*/
                                  "value": "1"
                                },
                                {
                                    "display": $appRoot.state.json['public_lang-000084'],/* 国际化处理： 表达式*/
                                    "value": "3"
                                }
                              ];
                        }

                        // if(i.attrcode === CONSTANT.treeTableConfig[4].key){
                            
                        //     i["itemtype"] = "input";
                        //     // i["initialvalue"] = {
                        //     //     "display": "常量",
                        //     //     "value": "1"
                        //     // };
                        //     // i["options"] =  [
                        //     //     {
                        //     //       "display": "常量",
                        //     //       "value": "1"
                        //     //     },
                        //     //     {
                        //     //         "display": "表达式",
                        //     //         "value": "3"
                        //     //     }
                        //     //   ];
                        // }
                    });
                    console.log($appRoot.state.json['public_lang-000085'],this.paramConds);/* 国际化处理： 第二个表格数据*/
                    if(vres.data&&Array.isArray(vres.data.params)&&vres.data.params.length>0){
                        this.twoTable = true;
                    }else{
                        this.twoTable = false;
                    }
                    // if(!meta["three_two_table_id"]){
                        
                        
                    // }
                    
                    
                    this.props.meta.setMeta(meta,()=>{
                        if(vres.data.params&&!this.paramCondsFlag){
                            this.paramCondsFlag = true;
                            let paramCondsMap = new Map();
                            if(this.paramConds){
                                this.paramConds.forEach((i)=>{
                                    paramCondsMap.set(i.code.value,i);
                                });
                            }
                            vres.data.params.forEach((i)=>{
                                if(paramCondsMap.has(i.code.value)){
                                    let ni = paramCondsMap.get(i.code.value);
                                    ni.dataType&&(i.dataType=ni.dataType);
                                    ni.name&&(i.name=ni.name);
                                    ni.value&&(i.value=ni.value);
                                }
                            });
                            if(vres.data.params){
                               
                                vres.data.params = vres.data.params.map(i=>{
                                    return {
                                        values:i
                                    }
                                })
                                this.props.editTable.insertRowsAfterIndex(CONSTANT.three_two_table_id, vres.data.params);
                            }
                            
                        }
                        setTimeout(()=>{
                            this.setState({stepIndex:type});
                        },10)
                    });
                } catch (error) {
                    console.error(error);
                }
                
            break;
       }



    }
    // 第一个步骤切换tab回调
    clickFun = (oneTabIndex)=>{
        // //切换之前需要将当前步骤数据存入缓存数据  
        this.setState({oneTabIndex},()=>{
            
        });
    }

/**
 * @method 步骤条dom
 */
    stepDom = ()=>{
        let {NCStep} = $nccPlatform.base
        const NCSteps = NCStep.NCSteps;
        return (
            <div className="m-u-steps">
                  <NCSteps current={this.state.stepIndex}>
                      <NCStep title={$appRoot.state.json['public_lang-000086']} description=""  onClick={(e)=>{/* 国际化处理： 语义模型*/
                      this.clickStepIcon(e,0);
                  }} />
                      <NCStep title={$appRoot.state.json['public_lang-000071']} description=""  onClick={(e)=>{/* 国际化处理： 字段*/
                      this.clickStepIcon(e,1);
                  }} />
                      <NCStep style={{width:"120px"}} className = "last_step" title={$appRoot.state.json['public_lang-000087']} description=""  onClick={(e)=>{/* 国际化处理： 取数条件*/
                      this.clickStepIcon(e,2);
                  }} />
                </NCSteps>
            </div>
          )
      
    }
    /**
     * @method 内容区域dom
     */
    stepContentDom = ()=>{
        let stepIndex = this.state.stepIndex;
        let dom = null;
        let displayBlock = {"display":"block"}
        let displayNone = {"display":"none"}
        switch(stepIndex){
            case 0:
                dom = [this.stepOneContent({style:displayBlock}),this.stepTwoContent({style:displayNone}),this.stepThreeContent({style:displayNone})];
            break;
            case 1:
                dom = [this.stepOneContent({style:displayNone}),this.stepTwoContent({style:displayBlock}),this.stepThreeContent({style:displayNone})];
            break;
            case 2:
                dom =[this.stepOneContent({style:displayNone}),this.stepTwoContent({style:displayNone}),this.stepThreeContent({style:displayBlock})];
            break;

        }

        return dom;
    }
    /**
     * @method 第三步骤dom
     */
    stepThreeContent = (config)=>{
        let {style = {}} = config;
        let {base} = $nccPlatform;
        let {NCRadio} = base;
        let isAllHeight = {
            adaptionHeight:true,
            otherAreaHeight:110,
        }
        
        if(this.twoTable){
            isAllHeight = {
                adaptionHeight:true,
                otherAreaHeight:260,
            }
        }
        return <div className="step_two_box" style={style}>
                    <div className={"step_three_form_box"}>
                        {
                                this.props.form.createForm(
                                    CONSTANT.threeFormMetaId,{
                                        // 编辑前事件
                                        onBeforeEvent:(...ars)=>{
                                            formEvent[ars[1]]&&
                                            formEvent[ars[1]][ars[2]]&&
                                            formEvent[ars[1]][ars[2]]["onBeforeEvent"]&&
                                            formEvent[ars[1]][ars[2]]["onBeforeEvent"].call(this,ars);
                                        },
                                        //编辑后事件
                                        onAfterEvent: (...ars)=>{
                                            console.log($appRoot.state.json['public_lang-000088'],ars);/* 国际化处理： 表单编辑后*/
                                            formEvent[ars[1]]&&
                                            formEvent[ars[1]][ars[2]]&&
                                            formEvent[ars[1]][ars[2]]["onAfterEvent"]&&
                                            formEvent[ars[1]][ars[2]]["onAfterEvent"].call(this,ars);
                                        
                                        },
                                    }
                                )
                        }
                    </div>
                    <div className={"step_three_table_box"}>
                    <Headline config={
                                        {
                                            title:"",
                                            style:{border:"none",marginBottom: 5},
                                           
                                        }}
                                        button = {()=>{
                                            return (<div>
                                                <NCButtonGroup>
                                                    <NCButton onClick = {()=>{
                                                        buttonEvent["ThreeAdd"].call(this);
                                                    }} colors="accent">
                                                        {$appRoot.state.json['public_lang-000024']}{/* 国际化处理： 新增*/}
                                                    </NCButton>
                                                    <NCButton onClick = {()=>{
                                                        buttonEvent["ThreeDelete"].call(this);
                                                    }} colors="accent">
                                                        {$appRoot.state.json['public_lang-000025']}{/* 国际化处理： 删除*/}
                                                    </NCButton>
                                                </NCButtonGroup>
                                            </div>)
                                        }}
                                        ></Headline>
                        {
                            this.props.editTable.createEditTable(CONSTANT.three_table_id, {
                                ...isAllHeight,
                                showCheck:true,
                                onBeforeEvent: this.onBeforeEventThree,
                                
                                // isAddRow:true,
                                // onSelected:this.onSelected,
                                // onSelectedAll:this.onSelectedAll,
                                onAfterEvent: this.ononAfterEventThree
                                // selectedChange:this.tableEvent[MAIN_RIGHT_TABLEID]["selectedChange"].bind(this),
                                // onSelectedAll:this.tableEvent[MAIN_RIGHT_TABLEID]["onSelectedAll"].bind(this),
                                // onSelected:this.tableEvent[MAIN_RIGHT_TABLEID]["onSelected"].bind(this),

                            })
                        }
                        {
                            this.twoTable?this.props.editTable.createEditTable(CONSTANT.three_two_table_id, {
                                height:150,
                                showCheck:true,
                                onBeforeEvent: this.onBeforeEventThree,
                                
                                // isAddRow:true,
                                // onSelected:this.onSelected,
                                // onSelectedAll:this.onSelectedAll,
                                onAfterEvent: this.ononAfterEventThree
                                // selectedChange:this.tableEvent[MAIN_RIGHT_TABLEID]["selectedChange"].bind(this),
                                // onSelectedAll:this.tableEvent[MAIN_RIGHT_TABLEID]["onSelectedAll"].bind(this),
                                // onSelected:this.tableEvent[MAIN_RIGHT_TABLEID]["onSelected"].bind(this),

                            }):null
                        }
                        
                    </div>

                 
        </div>
    }
    /**
     * @method 第二步骤dom
     */
    stepTwoContent = (config)=>{
        let {style = {}} = config;
        let {base} = $nccPlatform;
        let {NCRadio} = base;
        return <div className="step_two_box" style={style}>
                    <Headline config={
                                        {
                                            title:"",
                                            style:{border:"none",marginBottom: 5},
                                           
                                        }}
                                        button = {()=>{
                                            return (<div>
                                                <NCButtonGroup>
                                                    <NCButton onClick = {()=>{
                                                        buttonEvent["Add"].call(this);
                                                    }} colors="accent">
                                                        {$appRoot.state.json['public_lang-000024']}{/* 国际化处理： 新增*/}
                                                    </NCButton>
                                                    <NCButton onClick = {()=>{
                                                        buttonEvent["Delete"].call(this);
                                                    }} colors="accent">
                                                       { $appRoot.state.json['public_lang-000025']}{/* 国际化处理： 删除*/}
                                                    </NCButton>
                                                </NCButtonGroup>
                                                <sapn style={{marginLeft:10}}></sapn>
                                                <NCButtonGroup>
                                                    <NCButton onClick = {()=>{
                                                        buttonEvent["Top"].call(this);
                                                    }} colors="accent">
                                                       { $appRoot.state.json['public_lang-000026']}{/* 国际化处理： 置顶*/}
                                                    </NCButton>
                                                    <NCButton onClick = {()=>{
                                                        buttonEvent["MoveUp"].call(this);
                                                    }} colors="accent">
                                                        {$appRoot.state.json['public_lang-000027']}{/* 国际化处理： 上移*/}
                                                    </NCButton>
                                                    <NCButton onClick = {()=>{
                                                        buttonEvent["MoveDown"].call(this);
                                                    }} colors="accent">
                                                        {$appRoot.state.json['public_lang-000028']}{/* 国际化处理： 下移*/}
                                                    </NCButton>
                                                    <NCButton onClick = {()=>{
                                                        buttonEvent["Bottom"].call(this);
                                                    }} colors="accent">
                                                        {$appRoot.state.json['public_lang-000029']}{/* 国际化处理： 置底*/}
                                                    </NCButton>
                                                </NCButtonGroup>
                                               
                                            </div>)
                                        }}
                                        ></Headline>
                <div  style = {{flex:"1"}}>
                    {
                        this.props.editTable.createEditTable(CONSTANT.twoTableId, {
                            adaptionHeight:true,
                            showCheck:true,
                            isAddRow:true,
                            // onSelected:this.onSelected,
                            // onSelectedAll:this.onSelectedAll,
                            // onAfterEvent: ()=>{}
                            // selectedChange:this.tableEvent[MAIN_RIGHT_TABLEID]["selectedChange"].bind(this),
                            // onSelectedAll:this.tableEvent[MAIN_RIGHT_TABLEID]["onSelectedAll"].bind(this),
                            // onSelected:this.tableEvent[MAIN_RIGHT_TABLEID]["onSelected"].bind(this),

                        })
                    }
                </div>
                
                 
        </div>
    }
    /** 别  窗外孤灯泪雨凉  我与风雪又无言 夜深天寒入人心 只狗秃驴别南墙 
     * @method 第一步骤dom
     */
    stepOneContent = (config)=>{
        let {style = {}} = config;
        return <div className="one_steps_content" style = {style} >
                <MyTree getDataTreeId={CONSTANT.oneTreeId} {...this.props} slectTreePk = {(pk,ars)=>{
                    this.slectTreePk = pk;
                    this.selectCode = ars[1].code;
                }}></MyTree>
        </div>
    }
    async componentDidMount(){
        
        // this.props.form.setFormStatus(PAGE_CONST.bussAndGroup,"edit");
        // this.props.form.setFormStatus(PAGE_CONST.ReceivingTaskOrg,"edit");
        // 模拟 
        // this.props.modal.show("CustomOrgModeBox")
        console.log($appRoot.state.json['public_lang-000089'],this.props.param);/* 国际化处理： 后台参数*/
        this.alterData = null;
        try {
            let param =  this.props.param;
            param.getData = param.unitFormulaText;
            // 验证是否是属于修改
            let vifdata = await $nccUtil.promiseAjax(CONSTANT.getDataParse,param);
            console.log($appRoot.state.json['public_lang-000090'],vifdata);/* 国际化处理： 校验数据*/
            if(vifdata.data){
                this.alterData = vifdata.data;
            }
            // **************

            
            // **************
            // 请求第一步数据 需要判断是不是第一步
            if(this.state.stepIndex===0){
                
                let vres = await $nccUtil.promiseAjax(CONSTANT.oneTreeUrl,param);
                console.log($appRoot.state.json['public_lang-000091'],vres);/* 国际化处理： 请求树数据*/
                if(vres.data){
                    this.props.syncTree.setSyncTreeData(CONSTANT.oneTreeId, vres.data);
                }
                
            }
            let meta = this.props.meta.getMeta();
            meta[CONSTANT.twoTableId] = CONSTANT.two_table_meta.call(this);
            meta[CONSTANT.two_modal_table_id] = CONSTANT.two_modal_table_meta.call(this);
            meta[CONSTANT.threeFormMetaId] = CONSTANT.threeFormMeta.call(this);
            meta[CONSTANT.three_table_id] = CONSTANT.three_table_meta.call(this);
            if(this.alterData&&this.alterData.paramConds){
                meta[CONSTANT.three_two_table_id] = CONSTANT.three_two_table_meta.call(this);
            }
            this.props.meta.setMeta(meta,()=>{
                this.props.editTable.setStatus(CONSTANT.twoTableId,"edit");
            });
            this.props.form.setFormStatus(CONSTANT.threeFormMetaId,'browser');
            // 外界传递的回调
            this.props.updateProps&&this.props.updateProps(this.upData);
            // 是否存在修改数据  如果存在  需要定位树节点 以及设置后续步骤的数据
            if(this.alterData){
                let refpk  = this.alterData.pk_def;
                let code  = this.alterData.defCode;
                let pk_pids = this.getTreeNodeParents(refpk);
                this.props.syncTree.setNodeSelected("get_data_one_tree_id", refpk);
                this.props.syncTree.openNodeByPk("get_data_one_tree_id",pk_pids);
                this.selectCode = code;
                this.slectTreePk = refpk;
                this.twoSlectTreePk = refpk;
                //设置数据
                let fields = this.alterData.fields;
                this.fieldConds = this.alterData.fieldConds; 
                let funcRowCord = this.alterData.funcRowCord;
                fields = fields.map(i=>{
                    return {
                        values:i
                    }
                })
                // 设置第二步表格
                this.props.editTable.insertRowsAfterIndex(CONSTANT.twoTableId, fields);
                // 设置第三步表单数据
                this.props.form.setAllFormValue({
                    [CONSTANT.threeFormMetaId]:{
                        rows:[{
                            values:funcRowCord
                        }]
                    }
                });
                this.fieldConds = this.fieldConds.map(i=>{
                    return {
                        values:i
                    }
                })
                // 设置第三步第一个表格
                if(this.fieldConds){
                    this.props.editTable.insertRowsAfterIndex(CONSTANT.three_table_id, this.fieldConds);
                }
                
                if(this.alterData.paramConds){
                    this.paramConds = this.alterData.paramConds;
                    // this.alterData.paramConds = this.alterData.paramConds.map(i=>{
                    //     return {
                    //         values:i
                    //     }
                    // })
                }
                // this.props.editTable.insertRowsAfterIndex(CONSTANT.three_two_table_id, this.alterData.paramConds);
            }
        } catch (error) {
            console.error(error);
        }
        
    }
    upData = ()=>{
            return new Promise((reslove,reject)=>{
                this.upDataContent(reslove,reject);
            })
            
    }
    upDataContent = async (reslove,reject)=>{
            let error =  {
                error:$appRoot.state.json['public_lang-000092']/* 国际化处理： 当前不可以保存*/
            };
            let that = this;
            console.log($appRoot.state.json['public_lang-000093'],this);/* 国际化处理： 子组件的this*/
            // 第一步数据
            let pk_def = this.slectTreePk;
            let defcode = this.selectCode;
            // 第二步数据
            let twoData = this.props.editTable.getAllRows(CONSTANT.twoTableId);
            // let multiLangTextMap = new Map();
            if(twoData.length){
                twoData = twoData.map(i=>{
                    // this.multiLangTextMap.set(i.multiLangText.display,i);
                    return i.values.multiLangText.display
                }
                    );
                twoData = twoData.join(",");
            }
            let rowDTO = {
                
            }
            // 第三步表单数据  
            let threeFormData = this.props.form.getAllFormValue(CONSTANT.threeFormMetaId);
            if(threeFormData.rows){
                for(let key in threeFormData.rows[0].values){
                    if (Object.hasOwnProperty.call(threeFormData.rows[0].values, key)) {
                        rowDTO[key] = threeFormData.rows[0].values[key].value;
                        
                    }
                    
                }

            }
            // 第三步表格数据
            let threeTableData = this.props.editTable.getAllRows(CONSTANT.three_table_id);
            if(threeTableData.length){
                let valueArray = [];
                threeTableData.forEach((i,k)=>{
                    valueArray[k] = {};
                    if(i.values){
                        if(this.multiLangTextMap.has(i.values.field.value)){
                            valueArray[k]["fieldType"] = this.multiLangTextMap.get(i.values.field.value).dataType.value;
                        }
                        for(let key in i.values){
                            if (Object.hasOwnProperty.call(i.values, key)) {
                                valueArray[k][key] = i.values[key].value;
                                
                            }
                           
                        }
                    }
                });

                rowDTO.rowdetails1 = valueArray;
            }
            // 第二个表格  three_two_table_id
            if(this.twoTable){
                let threeTwoTableData = this.props.editTable.getAllRows(CONSTANT.three_two_table_id);
                if(threeTwoTableData.length){
                    let twovalueArray = [];
                    threeTwoTableData.forEach((i,k)=>{
                        twovalueArray[k] = {};
                        if(i.values){
                            for(let key in i.values){
                                if (Object.hasOwnProperty.call(i.values, key)) {
                                    twovalueArray[k][key] = i.values[key].value;
                                    
                                }
                                
                            }
                        }
                    });

                    rowDTO.rowdetails2 = twovalueArray;
                }
            }
            let param = {
                pk_def,
                defcode,
                selFld:twoData,// "selFld":"排序项主键,排序项编码,排序项名称,所属整合方案,维度或度量pk",||multiLangText
                rowDTO
            }
           
            try {
                if(!pk_def){
                    error.error=$appRoot.state.json['public_lang-000081'];/* 国际化处理： 请选择数据集对象*/
                    reslove(error); 
                    return;
                }
                if(this.props.editTable.getAllRows(CONSTANT.twoTableId).length===0){
                    error.error=$appRoot.state.json['public_lang-000094'];/* 国际化处理： 请选择数据集函数查询字段*/
                    reslove(error); 
                    return;
                }
                console.log($appRoot.state.json['public_lang-000095'],param);/* 国际化处理： 点击完成出现的数据-参数*/
                let vres = await $nccUtil.promiseAjax(CONSTANT.getDataConstru,param);
                console.log($appRoot.state.json['public_lang-000096'],vres);/* 国际化处理： 点击完成出现的数据-返回*/
                // reject(error);
                if(vres.success&&vres.data){
                    reslove(vres.data)
                }else{
                    reslove(error)
                }
                
                
            } catch (err) {
                console.log(err);
                reslove(error);
            }
    }
    componentWillUnmount(){
        // 外界传递的回调
        this.props.updateProps&&this.props.updateProps(null);
    }
    render() {
        return <div className="ModelContent get_data" id="">
            {
                this.stepDom()            
            }
            {this.stepContentDom()}
            <Mymodal 
            getDataModalId = {CONSTANT.two_modal_id}
            title = {$appRoot.state.json['public_lang-000097']}/* 国际化处理： 选择元数据*/
            Content = {()=>{
                return this.props.editTable.createEditTable(CONSTANT.two_modal_table_id, {
                    adaptionHeight:true,
                    showCheck:true,
                    isAddRow:true,
                    // onSelected:this.onSelected,
                    // onSelectedAll:this.onSelectedAll,
                    // onAfterEvent: ()=>{}
                    // selectedChange:this.tableEvent[MAIN_RIGHT_TABLEID]["selectedChange"].bind(this),
                    // onSelectedAll:this.tableEvent[MAIN_RIGHT_TABLEID]["onSelectedAll"].bind(this),
                    // onSelected:this.tableEvent[MAIN_RIGHT_TABLEID]["onSelected"].bind(this),

                })
            }}
            twoModalBeSureBtnClick = {this.twoModalBeSureBtnClick} //点击确定按钮事件
            // cancelBtnClick: this.cancelBtnClick, //取消按钮事件回调
            {...this.props}

            ></Mymodal>
            {/* <CustomOrgMode
            beSureBtnClick = {(id,data)=>{
                setMeTableData.call(this,{
                    data:$nccStore.getMeDef(["sefData","stepThreeData","table","customData"]),
                    id:"orgRange"
                });
                // 清空表单数据 
                this.props.form.EmptyAllFormValue("CustomOrgSetForm");
                // 清空树的数据 以及选中
                this.props.syncTree.setSyncTreeData("myTree",[]);
                this.props.modal.close(id);
            }}
             setModeDef={setModeDef.bind(this)} {...this.props} title = "自定义组织选择" id="CustomOrgModeBox"></CustomOrgMode> */}
            
        </div>;
      
    }
    renderFeis(){
        console.log($appRoot.state.json['public_lang-000019']);/* 国际化处理： 弹窗内容是佛更新2*/
        let {title=$appRoot.state.json['public_lang-000020'],id="AuthorityModel",Content=null,buttons = null} = this.props;/* 国际化处理： 空弹窗标题*/
      
        
       return this.props.modal.createModal(id,{
           title:title,
           userControl:true,  
           size:"max",
           content:this.Content(),
           leftBtnName:$appRoot.state.json['public_lang-000021'], /* 国际化处理： 确定*///左侧按钮名称
           rightBtnName:$appRoot.state.json['public_lang-000022'], /* 国际化处理： 取消*///右侧按钮名称
           hasCloseBtn:false,//控制“X”按钮，显示true，不显示false，默认不显示
        //    beSureBtnClick:this.modelEvent[constantConfig.ADD_TREE_MODE_ID]["beSureBtnClick"].bind(this), 
        //    cancelBtnClick: this.modelEvent[constantConfig.ADD_TREE_MODE_ID]["cancelBtnClick"].bind(this),
           closeByClickBackDrop:false,//点击遮罩关闭提示框，默认是false点击不关闭,点击关闭是true
           showCustomBtns: true,
                    customBtns: (
                        <div>
                            {
                                this.state.stepIndex!==0?
                                <NCButton onClick = {()=>{
                                    buttonEvent["highestBoxs"]["lastStep"].call(this);
                                }} colors="accent">
                                    {$appRoot.state.json['public_lang-000030']}{/* 国际化处理： 上一步*/}
                                </NCButton>
                                :null
                            }
                           {
                                this.state.stepIndex!==2?
                                <NCButton  onClick = {()=>{
                                    buttonEvent["highestBoxs"]["nextStep"].call(this);
                                }}  colors="accent">
                                    {$appRoot.state.json['public_lang-000031']}{/* 国际化处理： 下一步*/}
                                </NCButton>
                                :null
                            }
                           
                            <NCButton  onClick = {()=>{
                                    buttonEvent["highestBoxs"]["accomplish"].call(this);
                                }} colors="accent">
                                {$appRoot.state.json['public_lang-000032']}{/* 国际化处理： 完成*/}
                            </NCButton>
                            <NCButton onClick = {()=>{
                                    buttonEvent["highestBoxs"]["cancel"].call(this);
                                }}  colors="accent">
                                {$appRoot.state.json['public_lang-000022']}{/* 国际化处理： 取消*/}
                            </NCButton>
                        </div>
                    )
       })
    }
}
export default (ArticleSteps = createPage({})(UnitFormula(ArticleSteps,{ 
    mid: CONSTANT["getDataTreeTable4"], 
    title: $appRoot.state.json['public_lang-000098'] /* 国际化处理： 公式编辑-暂时命名*/
})));
// export default (ArticleSteps);
