/**
 * @file UFO函数向导按钮
 */
import { ajax, toast, base, getMultiLang } from 'nc-lightapp-front';
import PropTypes from 'prop-types';
const { NCButton } = base;
import LoadComponent from "./LoadComponent";
export default class GuidButton extends React.Component {
    static propTypes = {
        beSureBtnClickCallBack: PropTypes.func.isRequired,    //点击向导确定回调
        guidButtontype: PropTypes.string.isRequired,    //模块类型，模块地址
        funcType: PropTypes.string.isRequired,    //函数类型
        selector: PropTypes.any,
        funcStr: PropTypes.any.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            isShow: true,
            renderComponent: null,
            json: {}
        }
        this.initGuid = this.initGuid.bind(this);
        this.renderGuid = this.renderGuid.bind(this);
        this.createJSX = this.createJSX.bind(this);
        this.afterScriptLoad = this.afterScriptLoad.bind(this);
    }

    /**
     * method  动态加载js
     * @param {*} url 
     */
    loadScript = (url) => {
        return new Promise(function (resolve, reject) {
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.async = true;

            if (script.readyState) {
                script.onreadystatechange = function () {
                    if (script.readyState == "loaded" || script.readyState == "complete") {
                        script.onreadystatechange = null;
                        console.log("success");
                        resolve("success");
                    }
                }
            } else {
                script.onload = function () {
                    console.log("success");
                    resolve("success");
                }
            }
            script.src = url;
            document.head.appendChild(script).parentNode.removeChild(script);
        })
    }

    async initGuid() {
        let method = this.props.guidButtontype;
        if (method) {
            if (window[method]) {
                this.afterScriptLoad(method); // 已经加载过script标签
            } else {
                await this.loadScript("../../../../" + method + ".js");
                this.afterScriptLoad(method);
            }
            this.props.onClickFn();
        }
    }

    afterScriptLoad(method) {
        let _this = this;
        
        if(this.props.ifFormula){
            let  GuidComponents = window[method].default;
            
            this.setState({
                renderComponent: GuidComponents,
                isShow: true
            }, () => {
                console.log("afterScript", this);
            })
            setTimeout(() => { _this.renderGuid(); });
            
        }else{
            let  {GuidComponents} = window[method].default;
            if(!GuidComponents){
                GuidComponents = window[method].default;
            }
            this.setState({
                renderComponent: GuidComponents,
                isShow: true
            }, () => {
                console.log("afterScript", this);
            })
            setTimeout(() => { _this.renderGuid(); });
        }
       
       
    }

    createJSX() {
        let _this = this;
        let RenderCom = this.state.renderComponent;
        let formulaConfig = {};
        if(this.props.ifFormula){
            formulaConfig = {...this.props,
                ...this.props.formulaConfig,
                beCancelGuidButtonBtnClickCallBack:()=>{
                    this.setState({
                        isShow: false,
                    }, () => {
                    });
                    setTimeout(() => { _this.renderGuid(); });
                },
                updateThis:(that)=>{
                    this.sonThat = that;
                }

            };
            
        }
        
        return (
            <RenderCom
                beSureBtnClickCallBack={(res) => {
                    this.props.beSureBtnClickCallBack(res);
                }}
                beCancelBtnClickCallBack={() => {
                    this.setState({
                        isShow: false,
                    }, () => {
                    });
                    setTimeout(() => { _this.renderGuid(); });
                }}
                funcType={this.props.funcType}
                
                funcStr={typeof this.props.funcStr === "function" ? this.props.funcStr() : this.props.funcStr}
                isShow={this.state.isShow}
                {...formulaConfig}
               
            />
        )
    }

    renderGuid() {
        let tempSelector = this.props.selector;
        var selector;

        let jsx = this.createJSX();
        if (Object.prototype.toString.call(tempSelector) === "[object HTMLDivElement]") {
            selector = tempSelector;
        } else if (typeof tempSelector === "string") {
            selector = document.querySelector(tempSelector);
        } else {
            selector = document.body;
        }
        $nccPlatform.render(jsx, selector);
        if(this.props.renderDone&&this.state.isShow){
            this.props.renderDone(this.sonThat)
        }
    }

    render() {
        // onClickFn
        return <span style={{ "color": "#0099FF", "cursor": "pointer" }} onClick={this.initGuid}>{this.props.children }</span>
       
    }
}
