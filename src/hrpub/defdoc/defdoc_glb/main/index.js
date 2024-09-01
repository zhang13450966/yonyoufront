import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Defdocbase from  '../../../defdoc/defdoc_base/main'
import { createPage, ajax, base, high, toast } from 'nc-lightapp-front';

/**
 * author wanglinw
 *
 */
class Defdocglb extends Component {
    constructor(props){
        super(props);
        this.state={
            isFinish:false,
            json:{}
        }
        let callback=(json,status,inlt)=>{
            this.setState({isFinish:true,json:json});
        }
        props.MultiInit.getMultiLang({moduleId:'10140UDDBGO',/*currentLocale:'zh-CN',*/domainName:'uapbd',callback});
    }
    render(){
        let config = {
            listpagecode:'10140UDDB_glb',
            formpagecode:'10140UDDB_treecard',
            globleorg:{
                value:'GLOBLE00000000000000',
                display:this.state.json['10140UDDBGO-000039']/* 国际化处理： 全局*/
            },
            funcode:'10140UDDB',
            appcode:'10140UDDB',
            title:this.props.params.jsonConfig.code,/* 国际化处理： 基础档案-全局*/
            nodeType:'GLOBE_NODE',//节点类型
            appid:'0001Z0100000000081E1',//小应用id
            params: this.props.params,
            billType:'defdoc_glb'
        };
        config.json=this.state.json;
        if(!this.state.isFinish){
            return null;
        }
        return(
            <Defdocbase {...{config:config}}/>
        );
    }
}

Defdocglb = createPage({
	initTemplate: ()=>{}
})(Defdocglb);

export default Defdocglb
