import React, { Component } from "react";
import { base } from "nc-lightapp-front";
const { NCModal, NCButton } = base;
import Utils from "@public/utils";
const { langCheck } = Utils;
require("./index.less");

export default class ConfirmModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showConfirmModal: false,
        };
    }

    closeConfirmModal = () => {
        this.setState({
            showConfirmModal: false,
        });
    };

    render() {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <NCModal
                fieldid="confirm"
                show={showConfirmModal}
                id="confirmModal"
                backdrop={false}
                className="report-smallmodal-class"
                size='sm'
            >
                <NCModal.Header className="report-modal-header" />
                <NCModal.Body className="report-modal-body">
                    {langCheck("reportMultiLang", "100301-000046")}
                </NCModal.Body>
                {/* 国际化处理： 当前数据较多，系统在处理完成后会发送通知消息，是否继续？*/}
                <NCModal.Footer className="report-modal-footer">
                    <NCButton
                        fieldid="continue"
                        colors="primary"
                        className="sure-button"
                        onClick={this.props.sureConfirmModal}
                    >
                        {langCheck("reportMultiLang", "100301-000047")}
                        {/* 国际化处理： 继续*/}
                    </NCButton>
                    <NCButton
                        fieldid="cancel"
                        className="cancel-button"
                        onClick={this.closeConfirmModal}
                    >
                        {langCheck("reportMultiLang", "100301-000048")}
                        {/* 国际化处理： 取消*/}
                    </NCButton>
                </NCModal.Footer>
            </NCModal>
        );
    }
}
