import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Defdocbase from  '../../../defdoc/defdoc_base/main'
import { createPage, ajax, base, high, toast } from 'nc-lightapp-front';

/**
 * author wanglinw
 *
 */
class Defdocorg extends Component {
    constructor(props){
        super(props);
        this.state={
            isFinish:false,
            json:{},
            extralParams: {}
        }
        let callback=(json,status,inlt)=>{
            this.setState({isFinish:true,json:json});
        }
        props.MultiInit.getMultiLang({moduleId:'10140UDDBGO',/*currentLocale:'zh-CN',*/domainName:'uapbd',callback});
    }
    render(){
        let config = {}
        if (this.state.json) {
            config = {
                listpagecode:'10140UDDO_org',
                formpagecode:'10140UDDO_treecard',
                funcode:'10140UDDO',
                appcode:'10140UDDO',
                title: this.props.params.jsonConfig.code,/* 国际化处理： 基础档案-组织 */
                nodeType:'ORG_NODE',//节点类型
                appid:'0001Z0100000000081E1',//小应用id
                params: this.props.params,
                billType:'defdoc_org'
            };
            config.json=this.state.json;
        }

        if(!this.state.isFinish){
            return null;
        }
        return(
            <Defdocbase {...{config:config}}/>
        );
    }
}

Defdocorg = createPage({
	initTemplate: ()=>{}
})(Defdocorg);

export default Defdocorg
