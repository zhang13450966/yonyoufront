import React, { Component } from 'react';
import {base, ajax, deepClone, toast } from 'nc-lightapp-front';
import MulTargetTransfer from './MulTargetTransfer/index.js';
import NCUploader from 'uap/common/components/NCUploader';
import getAttachments from '../ApproveOperationBtns/getAttachment';
require('./index.less');
const { NCCheckbox, NCButton, NCModal } = base;
const { Header, Title, Body, Footer } = NCModal;

const peopleToHeavy = (topTargetKeys,bottomTargetKeys) => {//去除重复的选定人，生成数目
    let arr = topTargetKeys.concat();
    bottomTargetKeys.map( (item, index) => {
        !arr.includes(item) && arr.push(item)
    })
    return arr.length;
}

export default class ApproveComment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            billMessage: props.billMessage || {},
            //附件
            showUploader: false,
            //抄送用户
            userModal: false,
            //另数据的key===人员id
            dataSource: [],
            topTargetKeys: [],
            bottomTargetKeys: [],
            json: props.json || {},
            inlt: props.inlt || null,
            attrfiles: [],//已上传附件信息
            isTrack: props.isTrack
        };
    }

    componentDidMount(){
        // index_000 用户  index_001 消息  index_002 邮件 
        this.titles = [this.state.json['index_000'], this.state.json['index_001'], this.state.json['index_002']];
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            btns:nextProps.btns,
            isTrack: nextProps.isTrack,
            json: nextProps.json,
            inlt: nextProps.inlt
        });
        if(nextProps.pk_checkflow && this.props.pk_checkflow != nextProps.pk_checkflow) {
            getAttachments(nextProps.pk_checkflow).then(lists=>{
                let attrfiles = [];
                lists.forEach( (item) => {
                    if(item.fileSize) {
                        attrfiles.push({
                            pk_file: item.pk_doc,
                            filesize: item.fileSize,
                            name: item.name
                        })
                    }
                });
                this.setState({
                    attrfiles,
                    billMessage: {...nextProps.billMessage, attachcount: attrfiles.length}
                }, () => {
                    console.log('attrfiles', this.state.attrfiles)
                });
                this.props.setAttr({ 
                    attrfiles, 
                    billMessage: {...nextProps.billMessage, attachcount: attrfiles.length}
                });
            })
        }
        
    }

    //-------------------------用户穿梭框------------------//
    //打开用户模态框
    openUserModal = () => {
        this.topTargetKeys = deepClone(this.state.topTargetKeys);
        this.bottomTargetKeys = deepClone(this.state.bottomTargetKeys);
        ajax({
            url: '/nccloud/riart/approve/queryAllUserForCopySend.do',
            method: 'post',
            data: {
                pk_checkflow: this.props.pk_checkflow
            },
            success: (res) => {
                if (res.data) {
                    this.setState({
                        userModal: true,
                        dataSource: res.data.rows.rows.map((item)=>{
                            return {
                                key: item.values.cuserid.value,
                                ...item.values
                            }
                        })
                    })
                }
                else {
                    // index_003 操作失败
                    toast({ content: this.state.json['index_003'], color: 'error' });
                }
            }
        });
    }
    closeUserModal = () => {
        this.setState({
            userModal: false,
            topTargetKeys: this.topTargetKeys,
            bottomTargetKeys: this.bottomTargetKeys
        })
        this.props.setAttr({ sendUsers: {
            'message': this.topTargetKeys,
            'mail': this.bottomTargetKeys
        }});
    }

    //追踪change
    handleIsTrack = () => {
        const currentTrack=this.state.isTrack
        this.setState({isTrack:!currentTrack})
    }

    //抄送用户穿梭框选择用户事件
    onChange = (data) => {
        this.setState({
            topTargetKeys: data.topTargetKeys,//消息
            bottomTargetKeys: data.bottomTargetKeys //邮件
        })
    }
    sendUsers = () => {
        this.topTargetKeys = deepClone(this.state.topTargetKeys);
        this.bottomTargetKeys = deepClone(this.state.bottomTargetKeys);
        this.setState({
            userModal: false
        })
        this.props.setAttr({
            sendUsers: {
                'message': this.state.topTargetKeys,
                'mail': this.state.bottomTargetKeys
            }
        });
    }

    handleSuccess = () => {
        if(this.props.onHandleSuccess && typeof this.props.onHandleSuccess == 'function' ) {//审批详情操作成功自动返回审批列表
            this.props.onHandleSuccess();
        }
        return ;
    }

    //获取已上传附件信息
    getGroupList = (list) => {
        let billMessage = this.state.billMessage;
        let attrfiles = [];
        const imgArr=['gif','jpg','jpeg','jpe','pic','png'];
        list.forEach( (item, index) => {
            if(item.fileSize) {
                let filetype=item.name.slice(item.name.lastIndexOf('.')+1);
                attrfiles.push({
                    pk_file: item.pk_doc,
                    filesize: item.fileSize,
                    name: item.name,
                    filetype: imgArr.includes(filetype) ? 'image' : null
                })
            }
        })
        this.setState({
            attrfiles,
            billMessage: {...billMessage, attachcount: attrfiles.length}
        }, () => {
            console.log('attrfiles', this.state.attrfiles);
        });
        this.props.setAttr({
            attrfiles,
            billMessage: {...billMessage, attachcount: attrfiles.length}
        });
    }

    render() {
        const {
            showUploader,
            //抄送用户
            userModal,
            dataSource,
            topTargetKeys,
            bottomTargetKeys,
            // attachcount,
            json,
        } = this.state;

        return (
            <div className="approve-comment nc-theme-sp-detail-bgc">
                <div className="comment-sel">
                    {/* { index_013 上传附件 } */}
                    <span className="sel-item nc-theme-sp-common-font-c" onClick={(eve) => {
                            this.setState({
                                showUploader: true
                            });
                        }}>{json['index_013']}</span>

                    <span className="sel-item nc-theme-sp-common-font-c" onClick={this.openUserModal}>
                        {/* index_008 抄送用户 index_009 人 */}
						{`${json['index_008']}  (${peopleToHeavy(topTargetKeys,bottomTargetKeys)})`} 
					</span>
                    {  /*追踪复选框*/ }
                    <span className="sel-item nc-theme-sp-common-font-c">
                        <span onClick={() => this.props.setAttr({isTrack: 'set'})}>{json['index_006']}</span>
                        <NCCheckbox 
                        type="checkbox"
                        checked={this.state.isTrack}
                        onChange={() => this.props.setAttr({isTrack: 'set'})}
                        ></NCCheckbox>
                    </span>
                </div>

                {/* 抄送用户 */}
                <NCModal
                    fieldid="copyTo"
                    visible={userModal}
                    onCancel={this.closeUserModal}
                    className='user-modal'
                    mask={true}
                    size = "lg"
                >
                    <Header closeButton>
                        {/* index_010 用户选择 */}
                        <Title fieldid={json['index_010']}>{json['index_010']}</Title>
                    </Header >
                    <Body>
                    <MulTargetTransfer
                        className='send-user'
                        showSortBtn={false}
                        titles={this.titles}
                        onChange={this.onChange}
                        dataSource={dataSource}
                        topTargetKeys={topTargetKeys}
                        bottomTargetKeys={bottomTargetKeys}
                    />
                    </Body>
                    <Footer>
                        {/* index_011 确认 */}
                        <NCButton colors='primary' onClick={this.sendUsers}>{json['index_011']}</NCButton>
                        {/* index_012 取消 */}
                        <NCButton style={{marginLeft: '8px'}} onClick={this.closeUserModal}>{json['index_012']}</NCButton>
                    </Footer>
                </NCModal>

                {/* 上传附件 */}
                { showUploader && <NCUploader
                    billId={this.props.pk_checkflow}
                    // customize={{storepath:'riamsgattachfiles'}}
                    noControlPermission={true}
                    isApprove={true}
                    disableDownload={true}
                    canDownLoad={false}
                    getGroupList={this.getGroupList.bind(this)}
                    onHide={()=>{
                        this.setState({
                            showUploader: false
                        })
                    }}
                />}
            </div>
        );
    }
}
