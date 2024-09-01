import React, { Component } from "react";
import { base } from "nc-lightapp-front";
const { NCModal, NCButton, NCFormControl } = base;
import { createInstance, getExampleText, getInstanceText } from "./methods";
import Utils from "@public/utils";
const { langCheck } = Utils;
require("./instance.less");

export default class Instance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            modalText: "",
        };
    }

    openModal() {
        let modalText = "";
        if (this.props.instance_type)
            modalText = getInstanceText(this.props.instance_type);
        this.setState({
            show: true,
            modalText,
        });
    }

    closeModal() {
        this.setState({
            show: false,
            modalText: "",
        });
    }

    //字段双击
    setItem = (item) => {
        this.setInsertHTML(item.display);
    };

    //设值
    setInsertHTML = (item) => {
        const { modalText } = this.state;
        let dom = document.querySelectorAll(".rpt-form-control textarea"),
            insert;
        Array.from(dom).forEach((node) => {
            if (node.getAttribute("attrcode") === "instance") {
                insert = node.selectionStart;
            }
        });
        let expression = modalText;
        if (insert || insert == 0) {
            expression =
                expression.substr(0, insert) +
                `[${item}]` +
                expression.substr(insert, expression.length);
        } else {
            expression += `[${item}]`;
        }
        this.setState(
            {
                modalText: expression,
            }
        );
    };

    //实例命名方式弹窗输入框事件
    onTextareaChange = (val) => {
        this.setState({
            modalText: val,
        });
    };

    onClose = () => {
        const { modalText } = this.state;
        this.props.onInstanceInsert(getExampleText(modalText).real);
        this.closeModal();
    };

    render() {
        const { show, modalText } = this.state;
        const list = createInstance();
        let exampleText = getExampleText(modalText).text;
        return (
            <NCModal
                onHide={() => this.closeModal()}
                size="lg"
                className="instanceModal"
                fieldid="instance"
                show={show}
                backdrop={false}
            >
                <NCModal.Header closeButton={true}>
                    {langCheck("reportTimeMultiLang", "100303-000073")}
                </NCModal.Header>
                <NCModal.Body>
                    <div className="instance-box">
                        <div className="left nc-theme-area-split-bc">
                            <h4 className="title nc-theme-gray-area-bgc nc-theme-bbr-bc nc-theme-common-font-c">
                                {langCheck(
                                    "reportTimeMultiLang",
                                    "100303-000078"
                                )}
                            </h4>
                            <span className="info nc-theme-common-font-c">
                                {langCheck(
                                    "reportTimeMultiLang",
                                    "100303-000079"
                                )}
                            </span>
                            <ul className="list">
                                {list.map((item) => (
                                    <li
                                        onDoubleClick={() => this.setItem(item)}
                                        key={item.value}
                                    >
                                        {item.display}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="right">
                            <h4 className="title nc-theme-gray-area-bgc nc-theme-bbr-bc nc-theme-common-font-c">
                                {langCheck(
                                    "reportTimeMultiLang",
                                    "100303-000075"
                                )}
                            </h4>
                            <NCFormControl
                                className="rpt-form-control"
                                onChange={this.onTextareaChange}
                                value={modalText}
                                attrcode="instance"
                                componentClass="textarea"
                                autoFocus={true}
                            />
                            <h4 className="title nc-theme-gray-area-bgc nc-theme-bbr-bc nc-theme-common-font-c">
                                {langCheck(
                                    "reportTimeMultiLang",
                                    "100303-000076"
                                )}
                            </h4>
                            <span>{exampleText}</span>
                        </div>
                    </div>
                </NCModal.Body>

                <NCModal.Footer>
                    <NCButton
                        fieldid="sure"
                        colors="primary"
                        onClick={this.onClose}
                    >
                        {langCheck("reportTimeMultiLang", "100303-000022")}
                    </NCButton>
                    <NCButton
                        fieldid="cancel"
                        onClick={() => this.closeModal()}
                    >
                        {langCheck("reportTimeMultiLang", "100303-000023")}
                    </NCButton>
                </NCModal.Footer>
            </NCModal>
        );
    }
}
