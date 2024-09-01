import React,{ Component } from "react";
import {base} from 'nc-lightapp-front';
const {NCTextArea, NCInput,NCIcon} = base;
import './index.less'
export default class HrInput extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            value:"lwl"
        }
    }
    onChange = (val)=>{
        this.setState({
            value:val
        })
        console.log("改变值")
    }
    render () {
        let {onChange,onSearch,value,placeholders,maxTextLength,width} = this.props;
        if(value === ''){
            console.log('为空');
        }
        return (
            <div>
               <div className = "mainInput" >
                    <NCInput
                            maxLength={maxTextLength}
                            value={value}
                            placeholder={placeholders}
                            onChange={onChange}
                    />
                    <span className = "list-icon-refer" onClick={(e) => {
                        if (typeof onSearch === 'function') {
                            onSearch();
                        }
                    }}>
                    </span>
                </div> 
              
            </div>
        )
    }
} 