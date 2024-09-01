//简单提示组件
import React, { Component } from 'react';
let {base} = $nccPlatform;
const { NCDiv } = base;
import './Headline.less'
export class Headline extends Component{
    constructor(props){
        super(props);
        this.state = {
            config:this.props.config
        }
        //外部引入方法bind区域
        
    }
    //默认props
    static defaultProps = {
        config:{
            title:　"",
        classBox:"",
        style:{}
        }
    }
    
    
    render(){
        let {classBox="",style={},title=""} = this.props.config;
        console.log($appRoot.state.json['public_lang-000012'],this.props.noHeader);/* 国际化处理： 设置阿萨德*/
        if(this.props.noHeader){
            return (
                <NCDiv  areaCode={this.props.noHeader.areaCode} fieldid = {this.props.noHeader.fieldid}  style={style} className = {classBox?classBox + " Headline  nc-theme-title-font-c nc-theme-common-header-bgc nc-theme-area-split-bc ":" Headline  nc-theme-title-font-c nc-theme-common-header-bgc nc-theme-area-split-bc"} >
                <span  fieldid={title+"_title"} className="headline_title">
                    {title}
                </span>
                    <div className={"Headline-center"}>
                        {this.props.center&&this.props.center()}
                    </div>
                    <div className={"Headline-buttons"}>
                        {this.props.button1&&this.props.button1()}
                        {this.props.button&&this.props.button()}
                    </div>

                </NCDiv>
            )
        }else{
            return (
                <NCDiv  areaCode={NCDiv.config.HEADER} style={style} className = {classBox?classBox + " Headline  nc-theme-title-font-c nc-theme-common-header-bgc nc-theme-area-split-bc ":" Headline  nc-theme-title-font-c nc-theme-common-header-bgc nc-theme-area-split-bc"} >
                <span  fieldid={typeof title ==='string'?title+"_title":this.props.TexteTitle}>
                    {title}
                </span>
                    <div className={"Headline-buttons"}>
                        {this.props.button1&&this.props.button1()}
                        {this.props.button&&this.props.button()}
                    </div>

                </NCDiv>
            )
        }

    }
}
// Headline.defaultProps = {
//     title:""
// }
