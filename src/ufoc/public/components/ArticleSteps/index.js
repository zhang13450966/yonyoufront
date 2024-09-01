import React from 'react';
import {setModeDef,getModeDef,switchoverOrgSet,setMeTableData,transformOne} from "./modelContentMethod";

window.$appRoot = window.$appRoot ? window.$appRoot : {state:{json:{}}}

import {buttonEvent,formEvent} from "./event"
import "./index.less"
let { base } = $nccPlatform;
const { NCCheckbox ,NCButton,NCButtonGroup} = base;
import {CONSTANT} from "./constant";
import {Headline} from "./Headline"
// 模拟数据
class ArticleSteps extends React.Component {
    constructor(props){
        super(props);
        this.props = props;
        this.props.use.editTable("set_calculation_index_table")
        this.state = {
            stepIndex:0,
            oneTabIndex:0,
            //第一步 电子表格 分页数据
            reportPagination: {
                total: 1,
            },
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

    // 初始化整个弹窗  完成 取消 以后调用   type 是否关闭弹窗 如果不关闭弹窗  会默认回到第一步
    initModel = (type)=>{

 
    }
    // 步骤条点击事件
    clickStepIcon =  async (e,type,straightIn = false) => {
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
       switch(type){
            case 0:
                console.log($appRoot.state.json['public_lang-000014']);/* 国际化处理： 点击步骤1*/
                this.setState({stepIndex:type,oneTabIndex:0},()=>{
                    
                });
            break;
            case 1:
                console.log($appRoot.state.json['public_lang-000015']);/* 国际化处理： 点击步骤2*/
                
                this.setState({stepIndex:type});
                
            break;
            case 2:
                this.setState({stepIndex:type});
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
                      <NCStep title={$appRoot.state.json['public_lang-000016']} description=""  onClick={(e)=>{/* 国际化处理： 选择指标*/
                      this.clickStepIcon(e,0);
                  }} />
                      <NCStep title={$appRoot.state.json['public_lang-000017']} description=""  onClick={(e)=>{/* 国际化处理： 设置计算指标*/
                      this.clickStepIcon(e,1);
                  }} />
                      <NCStep style={{width:"120px"}} className = "last_step" title={$appRoot.state.json['public_lang-000018']} description=""  onClick={(e)=>{/* 国际化处理： 预览*/
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
        return <div className="step_two_box" style={style}>
                    {$appRoot.state.json['public_lang-000023']
                    // dom
                    }{/* 国际化处理： 第三步*/}

                 
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
                                                        {$appRoot.state.json['public_lang-000025']}{/* 国际化处理： 删除*/}
                                                    </NCButton>
                                                </NCButtonGroup>
                                                <sapn style={{marginLeft:10}}></sapn>
                                                <NCButtonGroup>
                                                    <NCButton onClick = {()=>{
                                                        buttonEvent["Top"].call(this);
                                                    }} colors="accent">
                                                        {$appRoot.state.json['public_lang-000026']}{/* 国际化处理： 置顶*/}
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
        let oneTabIndex =  this.state.oneTabIndex;
        let {base,high} = $nccPlatform;
        let {style = {}} = config;
        let selectData = this.props.table.getCheckedRows($nccStore.getDef("taskAppConfigList").constantConfig.MAIN_RIGHT_TABLEID);
        if(!selectData){
            return null
        }
        if(!Array.isArray(selectData)||selectData.length===0){
            return;
        }
        return <div className="one_steps_content" style = {style} >
                
        </div>
    }
    componentDidMount(){
        // this.props.form.setFormStatus(PAGE_CONST.bussAndGroup,"edit");
        // this.props.form.setFormStatus(PAGE_CONST.ReceivingTaskOrg,"edit");
        // 模拟 
        // this.props.modal.show("CustomOrgModeBox")
        let meta = this.props.meta.getMeta();
        meta[CONSTANT.twoTableId] = CONSTANT.set_calculation_index_table_meta.call(this);
        this.props.meta.setMeta(meta,()=>{
            this.props.editTable.setStatus(CONSTANT.twoTableId,"edit");
        });
    }
    Content() {
        return <div className="ModelContent" id="ModelContent">
            {
                this.stepDom()            
            }
            {this.stepContentDom()}
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
    render(){
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
export default (ArticleSteps);
