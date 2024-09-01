/*
 * @Author: wangceb 
 * @PageInfo: 打印次数，费用兑付明细 公共组件
 * @Date: 2018-04-04 13:10:26 
 * @Last Modified by: guozhq
 * @Last Modified time: 2021-01-13 13:14:31
 */

import React, { Component } from 'react';
import { createPage, base } from 'nc-lightapp-front';
import initTemplate from './init/initTemplate';
import { SPLITPRINT_CONST } from './const';
import { initLang, getLangByResId } from '../../pub/tool/multiLangUtil';

import poc from 'uap/common/components/printOnClient';
const { printPreview } = poc;
let { NCButton: Button, NCModal: Modal, NCHotKeys, NCTooltip } = base;
let { Header, Body, Footer } = Modal;
import './index.less';

class SplitPrintTimesDlg extends Component {
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

		let { printUrl, pks } = this.props.data;
		let printInfo = {
			oids: pks,
			printType: true,
			realData: true,
			userjson: JSON.stringify(splitParams)
		};
		printPreview(this.props, printUrl, printInfo);
	};

	onBeforeEvent = (props, moduleId, item, index, value, rowdata) => {
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
			<Modal className="split-print-modal" show={this.props.show}>
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
				<Header>
					<div className="title">{getLangByResId(this, '4001SPLITPRINTING-000000') /* 国际化处理： 分单处理*/}</div>
					<i className="iconfont icon-guanbi dnd-cancel" onClick={this.props.closeDlg} />
				</Header>
				<Body>
					<div className="nc-single-table">
						<div className="nc-singleTable-table-area">
							{createEditTable(SPLITPRINT_CONST.TABLEID, {
								onBeforeEvent: this.onBeforeEvent,
								cancelCustomRightMenu: true
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

SplitPrintTimesDlg = createPage({})(SplitPrintTimesDlg);

export default SplitPrintTimesDlg;
