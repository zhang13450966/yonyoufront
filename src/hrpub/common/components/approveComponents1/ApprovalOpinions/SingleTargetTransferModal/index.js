import React, { Component } from 'react';
import { base, getMultiLang, toast, ajax, deepClone } from 'nc-lightapp-front';
import SingleTargetTransfer from '../SingleTargetTransfer/index.js';
const { NCButton, NCModal } = base;
const { Header, Title, Body, Footer } = NCModal;

export default class SingleTargetTransferModal extends Component {
    constructor(props) {
        super(props);
        this.titles = ['用户', '消息', '邮件']
        this.state = {

            //审批详情
            showApproveModal: false,

            //审批意见
            comment: '',
            track: false,

            //审批按钮
            btns: [],
            billMessage: {},

            //附件
            showUploader: false,

            //抄送用户
            userModal: false,

            //另数据的key===人员id
            dataSource: [],
            targetKeys: [],
            json: {},
            inlt: null
        };
    }

    componentWillMount(){
        let callback = (json, status, inlt) => {
            if(status){
                this.setState({json, inlt});
            }else{
                console.log('未加载 containers_approvalopinions.json 多语文件');
            }
        }
        getMultiLang({moduleId: 'containers_approvalopinions', callback});
    }


    //-------------------------用户穿梭框------------------//
    //打开用户模态框
    open = () => {
        if (this.props.dataSource && this.props.dataSource.length) {
            this.setState({
                userModal: true,
                dataSource: JSON.parse(JSON.stringify(this.props.dataSource))
            })
        } else {
            ajax({
                url: '/nccloud/riart/approve/queryAllUserForCopySend.do',
                method: 'post',
                success: (res) => {
                    if (res.data) {
                        this.setState({
                            userModal: true,
                            dataSource: res.data.rows.rows.map((item) => {
                                return {
                                    key: item.values.cuserid.value,
                                    ...item.values
                                }
                            })
                        })
                    }
                    else {
                        // singletargettransfermodal_003 操作失败
                        toast({ content: this.state.json['singletargettransfermodal_003'], color: 'error' });
                    }
                }
            });
        }

    }
    closeUserModal = () => {
        this.setState({
            userModal: false,
            targetKeys: this.targetKeys
        })
    }

    //抄送用户穿梭框选择用户事件
    onChange = (targetKeys) => {
        // let choiceList = []
        this.setState({
            targetKeys: targetKeys
        })
        // for (let item of this.state.dataSource) {
        //     if (this.state.targetKeys.includes(item.user_code)) {
        //         choiceList.push(item)
        //     }
        // }
        // if (typeof this.props.changeCallback === 'function') {this.props.changeCallback(choiceList)}
    }
    sendUsers = () => {
        this.targetKeys = deepClone(this.state.targetKeys);
        let choiceList = []
        for (let item of this.state.dataSource) {
            if (this.state.targetKeys.includes(item.key)) {
                choiceList.push(item)
            }
        }

        if (typeof this.props.changeCallback === 'function') {
            this.props.changeCallback(choiceList)
        }
        this.setState({
            userModal: false
        })
    }


    render() {
        const {
            //抄送用户
            dataSource,
            targetKeys,
            json
        } = this.state;
        return <NCModal
            fieldid="copyTo"
            visible={this.state.userModal}
            onCancel={this.closeUserModal}
            className='user-modal'
            mask={true}
        >
            <Header closeButton>
                {/* singletargettransfermodal_004 用户选择 */}
                <Title>{json['singletargettransfermodal_004']}</Title>
            </Header>
            <Body>
                <SingleTargetTransfer
                    className='send-user'
                    dataSource={dataSource}
                    targetKeys={targetKeys}
                    onChange={this.onChange}
                    json = {this.state.json}
                />
            </Body>
            <Footer>
                {/* singletargettransfermodal_005 确定 */}
                <NCButton fieldid="confirm" colors='primary' onClick={this.sendUsers}> {json['singletargettransfermodal_005']}</NCButton>
                {/* singletargettransfermodal_006 取消 */}
                <NCButton fieldid="cancel" colors='close' onClick={this.closeUserModal}> {json['singletargettransfermodal_006']} </NCButton>
            </Footer>
        </NCModal>
    }
}
