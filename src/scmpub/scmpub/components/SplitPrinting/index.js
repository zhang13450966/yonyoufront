/*
 * @Author: wangceb 
 * @PageInfo: 费用兑付明细 公共组件
 * @Date: 2018-04-04 13:10:26 
 * @Last Modified by: chenggangk
 * @Last Modified time: 2022-04-11 14:59:06
 */
import React, { Component } from 'react';
import { createPage, base } from 'nc-lightapp-front';
import initTemplate from './init/initTemplate';
import { SPLITPRINT_CONST } from './const';
import { initLang, getLangByResId } from '../../pub/tool/multiLangUtil';
import poc from 'uap/common/components/printOnClient';
const { printPreview } = poc;
import './index.less';
let { NCButton: Button, NCModal: Modal, NCHotKeys, NCTooltip } = base;
let { Header, Body, Footer } = Modal;

class SplitPrintDlg extends Component {
	constructor(props) {
		super(props);
		props.use.editTable(SPLITPRINT_CONST.TABLEID);
		this.state = {};
	}

	componentWillMount() {
		initLang(this, [ '4001splitprinting' ], 'scmpub', initTemplate.bind(this, this.props));
	}
	// 打印
	clickOK = () => {
		this.props.closeDlg();

		let allrows = this.props.editTable.getAllData(SPLITPRINT_CONST.TABLEID);

		let selectRows = [];
		allrows.rows.forEach((element) => {
			if (element.values.isSplit.value) {
				selectRows.push(element);
			}
		});

		allrows.rows = selectRows;

		let splitParams = {
			pageid: SPLITPRINT_CONST.TABLEID,
			table: allrows
		};

		let { printUrl, pks, appcode, nodekey, scene, billtype } = this.props.data;
		let userjsons = encodeURI(JSON.stringify(splitParams));
		let printParams = {
			appcode: appcode,
			nodekey: nodekey,
			oids: pks,
			printType: true,
			realData: true,
			controlPrintNum: true,
			userjson: userjsons,
			billtype: billtype
		};
		printPreview(this.props, printUrl, printParams);
	};

	onBeforeEvent = (props, moduleId, item, index) => {
		if (item.attrcode === 'values') {
			let type = props.editTable.getValByKeyAndIndex(SPLITPRINT_CONST.TABLEID, index, 'type').value;
			if (type === 'HeadDate' || type === 'BodyDate') {
				return true;
			}
			return false;
		}
		return true;
	};

	addDefaultBtns = () => {
		const { closeDlg } = this.props;
		return (
			<div className="buttons">
				<NCTooltip
					placement="top"
					inverse
					overlay={`${getLangByResId(this, '4001SPLITPRINTING-000001')}  (${NCHotKeys.USUAL_KEYS
						.NC_MODAL_CONFIRM})`}
					trigger={[ 'hover', 'focus' ]}
					className="model-helper-overlay"
				>
					<Button fieldid="icmodal_sure_btn" className="button-primary" onClick={this.clickOK}>
						{getLangByResId(this, '4001SPLITPRINTING-000001') /*确定*/}(<u>Y</u>)
					</Button>
				</NCTooltip>
				<NCTooltip
					placement="top"
					inverse
					overlay={`${getLangByResId(this, '4001SPLITPRINTING-000002')}  (${NCHotKeys.USUAL_KEYS
						.NC_MODAL_CALCEL})`}
					trigger={[ 'focus', 'hover' ]}
					className="model-helper-overlay"
				>
					<Button fieldid="icmodal_cancel_btn" onClick={closeDlg}>
						{getLangByResId(this, '4001SPLITPRINTING-000002') /*取消*/}(<u>N</u>)
					</Button>
				</NCTooltip>
			</div>
		);
	};

	render() {
		let { createEditTable } = this.props.editTable;
		const { footBtn = true, closeDlg } = this.props;

		return (
			<Modal className="split-print-modal" show={this.props.show} onHide={this.props.closeDlg}>
				<NCHotKeys
					keyMap={{
						confirmBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CONFIRM,
						cancelBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CALCEL
					}}
					handlers={{
						confirmBtnHandler: () => {
							// 确定按钮的事件 增加top的判断避免所有弹窗逻辑都被触发
							this.clickOK();
						},
						cancelBtnHandler: () => {
							// 取消按钮的事件 增加top的判断避免所有弹窗逻辑都被触发
							closeDlg.call(this);
						}
					}}
					className="simpleModal-hotkeys-wrapper"
					focused={true}
					attach={document.body}
					display="inline-block"
				/>
				<Header closeButton>
					<div className="title">{getLangByResId(this, '4001SPLITPRINTING-000000') /* 国际化处理： 分单处理*/}</div>
				</Header>
				<Body>
					<div className="nc-single-table flex-container">
						<div className="nc-singleTable-table-area flex-container">
							{createEditTable(SPLITPRINT_CONST.TABLEID, {
								onBeforeEvent: this.onBeforeEvent,
								cancelCustomRightMenu: true,
								inModal: true
							})}
						</div>
					</div>
				</Body>
				<Footer>
					<div className="footer-right">{footBtn && this.addDefaultBtns()}</div>
				</Footer>
			</Modal>
		);
	}
}

SplitPrintDlg = createPage({})(SplitPrintDlg);

export default SplitPrintDlg;
