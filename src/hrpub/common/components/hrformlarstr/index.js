
import React, { Component } from 'react';
import {base,ajax,toast} from 'nc-lightapp-front'


class Hrformlarstr extends Component{
    constructor(props){
        super(props)
        this.state ={
            showModal: false,
            json: {},
        }

        let callback = (json,status,inlt)=>{
            if(status){
                this.setState({
                    json: json
                })
            }
        }
        //获取多语
        props.MultiInit.getMultiLang({ moduleId: 'hrpub', domainName: 'hrpub', callback })
        
    }


    componentDidMount(){   
    }

    componentWillReceiveProps(nextProps){
        let data ={
            ...this.props.searchParam
        }
        //查询公式中的项目
        if(nextProps.searchParam.pk_wa_class && nextProps.searchParam.pk_wa_taxsetbase && nextProps.searchParam.itemtype){
            if(!this.compareObject(data,nextProps.searchParam)){
                ajax({
                    url: nextProps.searchUrl || '/nccloud/hrwa/psntax/QueryWaItemAction.do',
                    data: nextProps.searchParam,
                    success: ((res)=>{
                        //格式化公式下拉框的值
                        this.setFormularstrName(res)                 
                    })
                }) 
            }  
        }      
    }

    setFormularstrName(res){
        if(res.data){
            let data = res.data.clctItems
            let formularstrName = []
            //得到数据来源的下拉框值
            data.forEach((value) => {
                let data = {
                    key: value.itemkey,
                    value: value.name
                }
                formularstrName.push(data)
            })
            this.state.formularstrName = formularstrName 
            this.setState(this.state)
        }
    }

    //判断两个object是否一致
    compareObject(beforeData,afterData){
        let flag = true
        let arr = []
        for (var i in beforeData) {
            arr.push({[i]:beforeData[i]}); //属性
        }
        arr.forEach((item)=>{
            if(Object.values(item)[0] !== afterData[Object.keys(item)[0]]){
                flag =  false
            }   
        })
        return flag
    }


    handleClick(opt){
        var tc = document.getElementById("txtCon");
        var tclen = tc.value.length;
        tc.focus();
        let sign = opt.currentTarget.innerText
        if (sign === this.state.json['i6013-000461']) {/* 国际化处理： 原薪资额*/
            sign = "[" + sign + "]"
        }
        tc.value = tc.value.substr(0, tc.selectionStart) + sign + tc.value.substring(tc.selectionStart, tclen);
    }

    formularstrNameChange(value){
        let name;
        let formularstrName = this.state.formularstrName
        formularstrName.forEach((data) => {
            if (data.value === value) {
                name = "[" + data.value + "]"
                return
            }
        })
        var tc = document.getElementById("txtCon");
        var tclen = tc.value.length;
        tc.focus();
        tc.value = tc.value.substr(0, tc.selectionStart) + name + tc.value.substring(tc.selectionStart, tclen);
    }

    show(){
        this.setState({
            showModal: true
        },function(){
            document.getElementById("txtCon").value = this.props.formularstr || ''
        })   
    }

    close(){
        this.setState({
            showModal: false
        })
    }

    sure(){
        let txtCon = document.getElementById("txtCon").value
        if (txtCon) {
            let Pattern = `(\\d+\\s*\\[)|(]\\s*\\[)|(]\\s*\\d+)`
            let reg = new RegExp(Pattern)
            if (txtCon.match(reg) !== null) {
                // this.props.modal.show('formularstr')
                toast({ color: 'warning', content: this.state.json['hrpub-000109'] });
                /* 国际化处理： 公式错误，不能识别*/
            } else {
                if (txtCon != null) {
                    let txtConAfter = txtCon
                    let txtConVlaue = txtCon
                    let formularstrName = this.state.formularstrName
                    let i = 0
                    while (i < formularstrName.length) {
                        let item = formularstrName[i].value
                        if (txtConAfter.indexOf("[" + item + "]") > -1) {
                            txtConAfter = txtConAfter.replace("[" + item + "]", "11")
                            txtConVlaue = txtConVlaue.replace("[" + item + "]", 'wa_data.'+formularstrName[i].key)
                            i = 0;
                        } else {
                            i++;
                        }
                    }
                    let sRegex = new RegExp(`^([0-9]+[/+-/*//]){0,100}[0-9]+$`);
                    if (sRegex.test(txtConAfter)) {
                        this.setState({
                            showModal: false
                        },function(){
                            this.props.beSureClick(txtCon,txtConVlaue)
                        })
                       
                    } else {
                        // this.props.modal.show('formularstr')
                        toast({ color: 'warning', content: this.state.json['hrpub-000109'] });
                        /* 国际化处理： 公式错误，不能识别*/

                    }
                }
            }
        } else {
            this.setState({
                showModal: false
            },function(){
                this.props.beSureClick(txtCon,txtCon)
            })
        }
        
    }


    render(){
        // const {formularstrName} = this.props
        const {NCButton,NCSelect,NCModal} = base
        const {Header,Body,Footer} = NCModal
        const {showModal,formularstrName,json} = this.state
        console.log(showModal)
        return( 
            <div>
                <NCModal
                  visible ={showModal}
                  onCancel ={this.close.bind(this)}
                >
                    <Header
                    >
                        <span>{json['hrpub-000120']}</span>
                    </Header>
                    <Body>
                        <div style={{ float: 'left' }}>
                            <NCButton onClick={this.handleClick.bind(this)}>+</NCButton>
                            <NCButton onClick={this.handleClick.bind(this)}>-</NCButton>
                            <NCButton onClick={this.handleClick.bind(this)}>*</NCButton>
                            <NCButton onClick={this.handleClick.bind(this)}>/</NCButton>
                        </div>
                        <div style={{ float: 'left', width: '200px', paddingLeft: '10px' }}>
                            <NCSelect
                                onSelect={this.formularstrNameChange.bind(this)}
                                data={formularstrName}
                            >
                            </NCSelect>
                        </div>
                        <div className="type_textarea" style={{clear: 'both',paddingTop: 10}}>
                            <textarea id="txtCon" runat="server" placeholder={json['hrpub-000120']} style={{
                                width: '100%',
                                height: '100px'
                            }}></textarea>{/* 国际化处理： 公式*/}
                        </div>
                    </Body>
                    <Footer>
                        <NCButton onClick={this.sure.bind(this)}>{json['hrpub-000055']}</NCButton>
                        <NCButton onClick={this.close.bind(this)}>{json['hrpub-000056']}</NCButton>
                    </Footer>
                </NCModal>
            </div>
        )
    }

}

export default  Hrformlarstr