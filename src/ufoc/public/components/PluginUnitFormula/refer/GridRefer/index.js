import React, {Component} from 'react';
// console.log("参照",window)
import {high} from 'nc-lightapp-front';
// const {high} = $nccPlatform;

const { Refer } = high; 
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
    let {refName,columnConfig,url,value,onChange,queryCondition,refcode} = config;
   
   
    return (
        <ReferCom
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
            // disabled = {true}
            refcode={refcode}
        />
    );

    
}
