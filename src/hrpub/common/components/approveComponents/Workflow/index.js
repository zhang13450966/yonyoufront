import React, { Component } from 'react';
import { getSysFieldid,base } from 'nc-lightapp-front';
import NCUploader from 'uap/common/components/NCUploader';
import getAttachments from '../ApproveOperationBtns/getAttachment';
import './index.less';
const { NCTooltip } = base;
export default class ApproveComment extends Component {
    constructor(props) {
        super(props);
        // 002 用户  003 消息 004 邮件
        this.titles = [this.props.json['002'], this.props.json['003'], this.props.json['004']]
        this.state = {
            billMessage: props.billMessage || {}, // lefttree 查询参数
            //附件
            showUploader: false,
            attrfiles: [],
        };
    }

    componentWillReceiveProps(nextProps, oldProps) {
        let billMessage = nextProps.billMessage;
        if (nextProps.billMessage && this.props.billMessage && nextProps.billMessage.billid != this.props.billMessage.billid) {
            this.setState({
                billMessage: billMessage
            })
        }
        if (nextProps.pk_checkflow && this.props.pk_checkflow != nextProps.pk_checkflow) {
            getAttachments(nextProps.pk_checkflow).then(lists => {
                let attrfiles = [];
                lists.forEach((item) => {
                    if (item.fileSize) {
                        attrfiles.push({
                            pk_file: item.pk_doc,
                            filesize: item.fileSize,
                            name: item.name
                        })
                    }
                });
                this.setState({ attrfiles }, () => {
                    console.log('attrfiles', this.state.attrfiles)
                });
            })
        }
    }

    //获取已上传附件信息
    getGroupList = (list) => {
        let billMessage = this.state.billMessage;
        let attrfiles = [];
        const imgArr = ['gif', 'jpg', 'jpeg', 'jpe', 'pic', 'png'];
        list.forEach((item, index) => {
            if (item.fileSize) {
                let filetype = item.name.slice(item.name.lastIndexOf('.') + 1);
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
            billMessage: { ...billMessage, attachcount: attrfiles.length }
        }, () => {
            console.log('attrfiles', this.state.attrfiles)
        });
        this.props.setAttr({
            attrfiles,
            billMessage: { ...billMessage, attachcount: attrfiles.length }
        });
    }

    render() {
        let { showUploader } = this.state;
        let { json } = this.props;
        // console.log('billMessage', billMessage);
        return <div>
            <div className="approve-comment nc-theme-sp-detail-bgc">
                <div className="comment-sel">
                    {/* 工作流审批附件 */}
                    <NCTooltip overlay={json['index_016']} placement="left">
                    <span fieldid={getSysFieldid('fujian')} className="sel-item" onClick={(eve) => { this.setState({ showUploader: !showUploader }) }}>{json['index_013']}</span>
                    </NCTooltip>
                </div>
                {/* 上传附件 */}
                {showUploader && <NCUploader
                    fieldid="attachment_upload"
                    // billId={billMessage.billid}
                    isApprove={true}
                    noControlPermission={true}
                    disableDownload={true}
                    billId={this.props.pk_checkflow}
                    getGroupList={this.getGroupList.bind(this)}
                    onHide={() => {
                        this.setState({
                            showUploader: false
                        })
                    }}
                />}
            </div>
        </div>
    }

}
