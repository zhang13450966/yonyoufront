import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.less';
import Modal from 'antd-mobile/lib/modal';
import 'antd-mobile/dist/antd-mobile.css';

class Alert extends Component {
    componentDidMount(){
        this.addHotKey();
    }
    onOk = () =>{       
        this.onCancel(); 
        this.props.onOk();
    }
    onCancel = () =>{
        document.querySelector('#login_div').removeChild(document.querySelector("#alertid"));
    }
    onHotKey = (e)=>{
        if(e.which==13){
            this.removeHotKey();
            this.onOk();
        }else if(e.which==27){
           this.removeHotKey();
           this.onCancel();
        }
    }
    addHotKey = () =>{
        if (document.addEventListener){
              document.addEventListener("keydown",this.onHotKey,true);
            }else{
              document.attachEvent("onkeydown",this.onHotKey);
        }
    }
    removeHotKey = () =>{
        if (document.removeEventListener){
              document.removeEventListener("keydown",this.onHotKey,true);
            }else{
              document.removeEventListener("onkeydown",this.onHotKey);
        }
    }
    render() {

        const {title,getLang} = this.props;
        return <div className="login-alert-content">
            <div className="login-alert-panel"><i  class="iconfont attention icon-zhuyi1"></i>	{title}</div>
            <div className="login-alert-bottom"><button className="u-button btn alert-ok" onClick={this.onOk}>{getLang("00032","确定")}</button><button className="u-button btn alert-cancel" onClick={this.onCancel}>{getLang("00014","取消")}</button></div>
        </div>
    }
}
export default function CreateAlert(title,onOk,getLang){
    // let tr = document.createElement('div');
    // tr.className="login-alert";
    // tr.id="alertid";
    // ReactDOM.render(<Alert title={title} onOk={onOk} getLang={getLang}></Alert>,tr);    
    // document.querySelector('#login_div').appendChild(tr);

    Modal.alert(title, '', [{
        text: getLang("00014","取消"), 
        onPress: () => {}
    }, {
        text: getLang("00032","确定"), 
        onPress: () => {
            onOk();
        }
    }])
}