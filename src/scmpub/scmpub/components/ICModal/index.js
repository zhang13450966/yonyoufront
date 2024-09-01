/*
 * @Author: maopch 
 * @PageInfo:  孙表页面模态框
 * @Date: 2018-05-08 13:18:05 
 * @Last Modified by: hufeim
 * @Last Modified time: 2022-03-02 14:17:51
 */
import React, { Component } from 'react';
import { base } from 'nc-lightapp-front';
let { NCButton: Button, NCModal: Modal, NCHotKeys, NCTooltip } = base;
let { Header, Body, Footer, Title } = Modal;
import { initLang, getLangByResId } from '../../pub/tool/multiLangUtil';
import './index.less';
export default class ICModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show: false
		};
		initLang(this, [ '4001components' ], 'scmpub', () => this.setState(this.state));
	}

	closeModal = () => {
		this.setState({ show: false });
	};

	sureBtnClick = () => {
		const { onHide, onOkBtnClick } = this.props;
		let flag = onOkBtnClick();
		if (flag == null || flag === true) {
			onHide();
		}
	};

	addDefaultBtns = () => {
		const { onHide } = this.props;
		return (
			<div className="buttons">
				<NCTooltip
					placement="top"
					inverse
					overlay={`${getLangByResId(this, '4001COMPONENTS-000000')}  (${NCHotKeys.USUAL_KEYS
						.NC_MODAL_CONFIRM})`}
					trigger={[ 'hover', 'focus' ]}
					className="model-helper-overlay"
				>
					<Button fieldid="icmodal_sure_btn" className="button-primary" onClick={this.sureBtnClick}>
						{getLangByResId(this, '4001COMPONENTS-000000') /*确定*/}(<u>Y</u>)
					</Button>
				</NCTooltip>
				<NCTooltip
					placement="top"
					inverse
					overlay={`${getLangByResId(this, '4001COMPONENTS-000001')}  (${NCHotKeys.USUAL_KEYS
						.NC_MODAL_CALCEL})`}
					trigger={[ 'focus', 'hover' ]}
					className="model-helper-overlay"
				>
					<Button fieldid="icmodal_cancel_btn" onClick={onHide}>
						{getLangByResId(this, '4001COMPONENTS-000001') /*取消*/}(<u>N</u>)
					</Button>
				</NCTooltip>
			</div>
		);
	};

	render() {
		const { show, title, footBtn = true, footLeft, onHide } = this.props;
		return (
			<Modal
				className="modal"
				show={show}
				ref={(NCModal) => (this.NCModal = NCModal)}
				fieldid="location"
				size="xlg"
				onHide={this.props.onHide}
				centered
				zIndex={290}
			>
				<NCHotKeys
					keyMap={{
						confirmBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CONFIRM,
						cancelBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CALCEL
					}}
					handlers={{
						confirmBtnHandler: () => {
							// 确定按钮的事件 增加top的判断避免所有弹窗逻辑都被触发
							if (this.NCModal && this.NCModal.isTopModal()) {
								this.sureBtnClick();
							}
						},
						cancelBtnHandler: () => {
							// 取消按钮的事件 增加top的判断避免所有弹窗逻辑都被触发
							if (this.NCModal && this.NCModal.isTopModal()) {
								onHide.call(this);
							}
						}
					}}
					className="simpleModal-hotkeys-wrapper"
					focused={true}
					attach={document.body}
				/>

				<Header className="ic-modal-header" closeButton>
					<Title className="head-title nc-theme-common-font-c">{title}</Title>
				</Header>
				<Body className="ic-modal-body">{this.props.content}</Body>
				<Footer className="ic-modal-footer">
					<div className="footer-left">{footLeft}</div>
					<div className="footer-center" />
					<div className="footer-right">{footBtn && this.addDefaultBtns()}</div>
				</Footer>
			</Modal>
		);
	}
}
