import React, { PureComponent } from "react";
import { base } from "nc-lightapp-front";
const { NCModal, NCButton, NCRadio } = base;
import Utils from "@public/utils";
const { langCheck } = Utils;
require("./index.less");

export default class OutputModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showOutputModal: false,
            type: "",
        };
    }

    componentWillReceiveProps(props) {
        const { outputModalData } = props;
        let templateid =
            (outputModalData &&
                outputModalData[0] &&
                outputModalData[0].templateid) ||
            "";
        if (templateid != "") {
            this.setState({
                type: templateid,
            });
        }
    }

    closeOutputModal() {
        this.setState({
            showOutputModal: false,
        });
    }

    onParamChange(e) {
        this.setState({
            type: e,
        });
    }

    render() {
        const { showOutputModal, type } = this.state;
        const { outputModalData } = this.props;
        if (!showOutputModal) return null;

        return (
            <NCModal
                fieldid="output"
                show={showOutputModal}
                id="outputModal"
                className="report-modal-class"
            >
                <NCModal.Header  className="report-modal-header">
                    <NCModal.Title
                        fieldid={langCheck("reportMultiLang", "100301-000038")}
                    >
                        {langCheck("reportMultiLang", "100301-000038")}
                    </NCModal.Title>
                    {/* 国际化处理： 打印*/}
                </NCModal.Header>
                <NCModal.Body className="report-modal-body">
                    <NCRadio.NCRadioGroup
                        selectedValue={type}
                        onChange={this.onParamChange.bind(this)}
                    >
                        {outputModalData !== null &&
                            outputModalData.map((item) => (
                                <NCRadio value={item.templateid}>
                                    {item.templatename}
                                </NCRadio>
                            ))}
                    </NCRadio.NCRadioGroup>
                </NCModal.Body>
                <NCModal.Footer className="report-modal-footer">
                    <NCButton
                        fieldid="output"
                        colors="primary"
                        className="sure-button"
                        onClick={this.props.outputReport.bind(this, type)}
                    >
                        {langCheck("reportMultiLang", "100301-000038")}
                        {/* 国际化处理： 打印*/}
                    </NCButton>
                    <NCButton
                        fieldid="cancel"
                        className="cancel-button"
                        onClick={this.closeOutputModal.bind(this)}
                    >
                        {langCheck("reportMultiLang", "100301-000048")}
                    </NCButton>
                    {/* 国际化处理： 取消*/}
                </NCModal.Footer>
            </NCModal>
        );
    }
}
