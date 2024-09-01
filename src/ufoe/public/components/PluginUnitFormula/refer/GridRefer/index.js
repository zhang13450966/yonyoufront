import React, {Component} from 'react';
// console.log("参照",window)
import {high} from 'nc-lightapp-front';
// const {high} = $nccPlatform;

const { Refer } = high; 
const { ReferLoader } = Refer;
export  class ReferCom extends Component{
	
	constructor(props){
		super(props);
	}

	render(){
		
		
		return(
			<div className="referCom-wrapper" >
				<Refer
					{ ...this.props }
					fieldid={ 'selfrefcom'}
				/>
			</div>
		)
	}
}
export function creatRefer(config = {}) {
    let {refName,columnConfig,url,value,onChange,queryCondition,refcode,showHistory = true} = config;
    let referComponent;
    if(config.url.indexOf(".do")>-1){
        referComponent = <ReferCom
            refType='grid'
            refName={refName}/* 国际化处理： 业务属性*/
            // placeholder={refName}/* 国际化处理： 请先选择业务属性*/
            rootNode={{ refpk: 'root', refname: refName }}/* 国际化处理： 业务属性*/
            columnConfig={columnConfig||[]}/* 国际化处理： 编码,名称*/
            fieldid={url}
            value={value}
            onChange={onChange}
            queryGridUrl={url}
            queryCondition = {queryCondition}
            className = {"platformRefer_input"}
            referClassName = {"platformRefer_box"}
            refcode={refcode}
            showHistory={showHistory}
        />
    }else{
        if(config.url=='/nccloud/ufoc/refer/inner/HbProjectRef/index'){
            refName = $appRoot.state.json['public_lang-000292']; /* 国际化处理： 合并报表项目*/
        }else if(config.url=='/nccloud/uapbd/refer/fiacc/AccountDefaultGridTreeRef/index'){
            refName = $appRoot.state.json['public_lang-000291']; /* 国际化处理： 会计科目*/
        }
        referComponent = <ReferLoader
            refcode={url}
            value={value}
            refName={refName}/* 国际化处理： 合并方案*/
            onChange={onChange}
            queryCondition={queryCondition}
        />
    }
    return referComponent;
}
