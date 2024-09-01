import React, { Component } from "react";
import { base } from "nc-lightapp-front";
import UseridsRefer from "../../../public/uap/index.js";
const { NCModal, NCButton, NCRadioGroup, NCTextArea, NCFormControl, NCRadio } =
    base;
import Utils from "@public/utils";
const { langCheck } = Utils;
require("./index.less");

export default class ShareModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showShareModal: false,
            title:
                props.data.getUrlParam("n") ||
                props.data.getSearchParam("n") ||
                "", //消息标题
            sendmethod: "0", //附件类型
            content: "", //消息正文
            userids: null, //接收人
        };
    }

    closeShareModal = () => {
        this.setState({
            showShareModal: false,
            sendmethod: "0", //附件类型
            content: "", //消息正文
            userids: null, //接收人
        });
    };

    showShareModal() {
        this.setState(
            { showShareModal: true },
            () => {
                setTimeout(() => {
                    document.getElementById("msgTitleRef").focus();
                    document.getElementById("msgTitleRef").select();
                }, 300);
            },
        );
    }

    onParamChange(way, e) {
        this.setState({ [way]: e });
    }

    render() {
        const { title, sendmethod, content, userids, showShareModal } =
            this.state;
        if (!showShareModal) return null;
        return (
            <NCModal
                onHide={this.closeShareModal}
                fieldid="share"
                show={showShareModal}
                id="shareModal"
                className="report-modal-class"
            >
                <NCModal.Header
                    className="report-modal-header"
                    closeButton={true}
                >
                    <NCModal.Title
                        fieldid={langCheck("reportMultiLang", "100301-000107")}
                    >
                        {langCheck("reportMultiLang", "100301-000107")}
                    </NCModal.Title>
                    {/* 国际化处理： 报表订阅*/}
                </NCModal.Header>
                <NCModal.Body className="report-modal-body">
                    <div className="user-info nc-theme-common-font-c">
                        <span className="left">
                            {langCheck("reportMultiLang", "100301-000071")}
                        </span>
                        {/* 国际化处理： 消息标题*/}
                        <div className="right">
                            <NCFormControl
                                id="msgTitleRef"
                                autoFocus
                                fieldid="title"
                                value={title}
                                onChange={this.onParamChange.bind(
                                    this,
                                    "title",
                                )}
                            />
                        </div>
                    </div>
                    <div className="user-info nc-theme-common-font-c">
                        <span className="left">
                            {langCheck("reportMultiLang", "100301-000079")}
                        </span>
                        {/* 国际化处理： 接收人*/}
                        <div className="right">
                            <UseridsRefer
                                value={userids}
                                fieldid="userids"
                                onChange={value => {
                                    this.setState({ userids: value });
                                }}
                                queryCondition={{
                                    isAllUserVisible: true,
                                    showSysAdmin: "true",
                                    showGroupAdmin: "true",
                                }}
                            />
                        </div>
                    </div>
                    <div className="user-info nc-theme-common-font-c">
                        <span className="left">
                            {langCheck("reportMultiLang", "100301-000080")}
                        </span>
                        {/* 国际化处理： 附件类型*/}
                        <div className="right" style={{ width: "auto" }}>
                            <NCRadio.NCRadioGroup
                                selectedValue={sendmethod}
                                onChange={this.onParamChange.bind(
                                    this,
                                    "sendmethod",
                                )}
                            >
                                <NCRadio value="0">{"EXCEL"}</NCRadio>
                                <NCRadio value="1">{"PDF"}</NCRadio>
                                <NCRadio value="2">{"CSV"}</NCRadio>
                            </NCRadio.NCRadioGroup>
                        </div>
                    </div>
                    <div className="user-info nc-theme-common-font-c">
                        <span className="left">
                            {langCheck("reportMultiLang", "100301-000081")}
                        </span>
                        {/* 国际化处理： 消息正文*/}
                        <div className="right" style={{ width: 354 }}>
                            <NCTextArea
                                fieldid="content"
                                value={content}
                                onChange={this.onParamChange.bind(
                                    this,
                                    "content",
                                )}
                            />
                        </div>
                    </div>
                </NCModal.Body>
                <NCModal.Footer className="report-modal-footer">
                    <NCButton
                        fieldid="share"
                        colors="primary"
                        className="sure-button"
                        onClick={this.props.shareReport.bind(this, this.state)}
                    >
                        {langCheck("reportMultiLang", "100301-000039")}
                        {/* 国际化处理： 分享*/}
                    </NCButton>
                    <NCButton
                        fieldid="cancel"
                        className="cancel-button"
                        onClick={this.closeShareModal.bind(this)}
                    >
                        {langCheck("reportMultiLang", "100301-000048")}
                    </NCButton>
                    {/* 国际化处理： 取消*/}
                </NCModal.Footer>
            </NCModal>
        );
    }
}
