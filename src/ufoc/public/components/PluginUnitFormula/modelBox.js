import React from 'react';
let { base ,createPage} = $nccPlatform;
const {NCButton} = base;
// import Mselect from "./component/Mselect"; $nccPlatform.base.NCButton
import LoadComponent from "./LoadComponent";


export default function ModelRefer(WrappedComponent,config={}) {
    return class Son extends React.Component {
        constructor(props){
            super(props);
            this.props = props;
            this.state = {
               data:{
                   url:""
               },
               Com:null
            }
            $appRoot.PluginUnitFormula_modelbox = this
            
        }
        initComponent = ()=>{
            
        }
        // 打开弹窗 需要传入 url 以及 type
        showModel = async (config = {})=>{
            let {url,type} = config;
            // 此处可以根据 url 以及 type 选择渲染什么参照
            let data = this.state.data;
            let modalConfig = config.modalConfig;
            delete config.modalConfig;
            this.modalChange = config.onChange;
            this.props.modal.show("ModelRefer",{
                content:(
                    <div className="PluginUnitFormulaBox" >
                        <LoadComponent {...this.props} 
                        setData = {this.setData}
                        rightRight = {false} 
                        isRadio={false} 
                        updateProps = {this.updateProps} 
                        refcode = {url}
                        {...config}
                        ></LoadComponent>
             </div>),
             ...modalConfig

            },()=>{
                       
            })
            return;
            // this.setState({data:data,Com},()=>{
            //     this.props.modal.show("ModelRefer",{
            //         content:(
            //             <div className="PluginUnitFormulaBox" >
            //                 <loadComponent {...this.props} 
            //                 setData = {this.setData}
            //                 rightRight = {false} 
            //                 isRadio={false} 
            //                 updateProps = {this.updateProps} 
            //                 refcode = {url}
            //                 {...config}
            //                 ></loadComponent>
            //      </div>
            //         )

            //     },()=>{
                           
            //     })
            // });
        }
        // 数据回调  需要 Com 组件内部在数据已经完成后调用 并把数据收集上来
        setData = (data)=>{
            this.data = data;
        }
        // 子组件内部更新数据方法
        updateProps = (fn)=>{
            this.updateSon = fn;
        }
        Content =  (config = {})=> {
            
            let Com = this.state.Com;
            return <div className="PluginUnitFormulaBox" >
                        <Com {...this.props} 
                        setData = {this.setData}
                        updateProps = {this.updateProps} 
                        {...config}
                        ></Com>
                     </div>;
          
        }
        render(){
            console.log($appRoot.state.json['public_lang-000019']);/* 国际化处理： 弹窗内容是佛更新2*/
            // let {title="空弹窗标题",id="AAAAAA",Content=null,buttons = null} = this.props;
            let modelRefer = {
                showModelLoadComponent:this.showModel,
                Content:this.Content
            }
            return <div>
                <WrappedComponent modelRefer={modelRefer}   {...this.props} />
                {
                    this.props.modal.createModal("ModelRefer",{
                        title:this.state.title,
                        userControl:true,  
                        size:"max",
                        // content:this.Content(),
                        leftBtnName:$appRoot.state.json['public_lang-000021'], /* 国际化处理： 确定*///左侧按钮名称
                        rightBtnName:$appRoot.state.json['public_lang-000022'], /* 国际化处理： 取消*///右侧按钮名称
                        hasCloseBtn:false,//控制“X”按钮，显示true，不显示false，默认不显示
                        closeByClickBackDrop:false,//点击遮罩关闭提示框，默认是false点击不关闭,点击关闭是true
                        showCustomBtns: true,
                        customBtns: (
                            <div>
                                <NCButton  onClick = {async ()=>{
                                            console.log($appRoot.state.json['public_lang-000154'],this.data);/* 国际化处理： 点击确定*/
                                            let data = this.data;
                                            
                                            if(this.updateSon){
                                                data = await this.updateSon();
                                                console.log($appRoot.state.json['public_lang-000155'],data);/* 国际化处理： 点击确定2*/
                                                if(data.error){

                                                    $nccPlatform.toast({
                                                        color: 'warning',
                                                        content: data.error,
                                                    })
                                                    return;
                                                }
                                                this.data = data;
                                                
                                            }
                                            this.modalChange(this.data);
                                            this.props.modal.close("ModelRefer");
                                        // buttonEvent["highestBoxs"]["accomplish"].call(this);
                                    }} colors="accent">
                                   { $appRoot.state.json['public_lang-000021']}{/* 国际化处理： 确定*/}
                                </NCButton>
                                <NCButton onClick = {()=>{
                                    if(this.data){
                                        $nccPlatform.promptBox({
                                            color: 'warning',
                                            title: $appRoot.state.json['public_lang-000022'],/* 国际化处理： 取消*/
                                            content: $appRoot.state.json['public_lang-000156'],/* 国际化处理： 确定取消？*/
                                            beSureBtnClick: ()=>{
                                                
                                               this.props.modal.close("ModelRefer");
                                            }
                                        });
                                    }else{
                                        this.props.modal.close("ModelRefer");
                                    }
                                            


                                    }}  colors="accent">
                                    {$appRoot.state.json['public_lang-000022']}{/* 国际化处理： 取消*/}
                                </NCButton>
                            </div>
                        ),
                        ...config
                    })
                }
            </div>
            
          
        }
    }
}
