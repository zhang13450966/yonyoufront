/*
 * @Author: 刘奇 
 * @PageInfo: 批次号档案
 * @Date: 2018-04-27 13:31:12
 * @Last Modified by: zhangflr
 * @Last Modified time: 2022-04-02 17:17:45
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, base } from 'nc-lightapp-front';
import { initTemplate } from './init';
import { search_BtnClick, onList_BtnClicks } from './btnClicks';
import { table_AfterEvent, table_BeforeEvent } from './afterEvents';
import { AREA, STATUS, BUTTON } from './constance';
import { initLang, getLangByResId } from '../../pub/tool/multiLangUtil';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil';
const { NCAffix, NCDiv } = base;
class List extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.searchId = AREA.searchArea;
		this.tableId = AREA.tableArea;
		props.use.search(this.searchId);
		props.use.editTable(this.tableId);
		this.oid = AREA.oid;
		this.pageId = AREA.pageArea;
		this.buttonType = '';
	}
	// 关闭浏览器提示，2018-08-15
	componentWillMount() {
		initLang(this, [ '4001batchcode' ], 'scmpub', initTemplate.bind(this, this.props));
		window.onbeforeunload = () => {
			let status = this.props.editTable.getStatus(this.tableId);
			if (status == STATUS.edit) {
				return getLangByResId(this, '4001BATCHCODE-000010'); /* 国际化处理： 当前单据未保存，您确认离开此页面？*/
			}
		};
	}
	setBtnVisble = () => {
		let status = this.props.editTable.getStatus(this.tableId);
		let flag = status === STATUS.edit ? false : true;
		this.props.button.setButtonVisible([ BUTTON.edit, BUTTON.print, BUTTON.output, BUTTON.refresh ], flag);
		this.props.button.setButtonVisible([ BUTTON.save, BUTTON.cancel ], !flag);
		this.props.button.setButtonVisible([ BUTTON.add, BUTTON.delete ], true);
		//设置查询区编辑性
		this.props.search.setDisabled(this.searchId, !flag);
		//设置删除提示的显示隐藏
		if (flag) {
			this.props.button.setPopContent(
				'DeleteLine',
				getLangByResId(this, '4001BATCHCODE-000011')
			); /* 国际化处理： 确认要删除该信息吗？*/
		} else {
			this.props.button.setPopContent('DeleteLine', '');
		}
	};
	setBtnEnable = () => {
		let selectLength = this.props.editTable.getCheckedRows(this.tableId).length;

		let flag = selectLength > 0 ? false : true;
		this.props.button.setDisabled({
			[BUTTON.delete]: flag,
			[BUTTON.print]: flag,
			[BUTTON.output]: flag
		});
		let allLength = this.props.editTable.getAllRows(this.tableId, true).length;

		let editflag = allLength > 0 ? false : true;
		this.props.button.setDisabled({
			[BUTTON.edit]: editflag
		});
	};
	toggleShow = () => {
		this.props.editTable.selectAllRows(this.tableId, false);
		this.setBtnVisble();
		this.setBtnEnable();
		this.setTableVisible();
	};
	setTableVisible = () => {
		let status = this.props.editTable.getStatus(this.tableId);
		let flag = status === STATUS.edit ? true : false;
		if (flag) {
			this.props.editTable.getAllRows(this.tableId, true).forEach((val) => {
				if (val.status != 2) {
					this.props.editTable.setEditableByKey(this.tableId, val.rowid, 'cmaterialvid', false);
				}
				if (val.values['pk_batchcode'].value) {
					this.props.editTable.setEditableByKey(this.tableId, val.rowid, 'vbatchcode', false);
				}
			});
		}
	};


	render() {
		let { editTable, search, modal } = this.props;
		let { createEditTable } = editTable;
		let { NCCreateSearch } = search;
		const { createModal } = modal;

		// NCC-207072 Ctrl+s 保存会先有一个提醒 走是查询方案的保存和界面的保存按钮
		let tableStatus = this.props.editTable.getStatus(this.tableId);
		let editStatus = tableStatus === STATUS.edit ? false : true;//浏览态时候是true

		return (
			<div className="nc-single-table">
				<NCAffix>
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-singleTable-header-area">
						<div className="header-title-search-area">{createListTitle(this)}</div>
						<div className="header-button-area">
							{this.props.button.createButtonApp({
								area: BUTTON.list_head,
								buttonLimit: 6,
								onButtonClick: onList_BtnClicks.bind(this)
							})}
						</div>
					</NCDiv>
				</NCAffix>
				<div
					className="nc-singleTable-search-area"
					style={{ display: this.props.editTable.getStatus(this.tableId) === 'edit' ? 'none' : 'block' }}
				>
					{NCCreateSearch(this.searchId, {
						clickSearchBtn: search_BtnClick.bind(this),
						defaultConditionsNum: 4,
						currentSearch:editStatus  //控制快捷键
					})}
				</div>
				<div className="nc-singleTable-table-area">
					{createEditTable(this.tableId, {
						showIndex: true,
						onAfterEvent: table_AfterEvent.bind(this),
						onBeforeEvent: table_BeforeEvent.bind(this),
						selectedChange: this.setBtnEnable.bind(this),
						adaptionHeight: true,
						isAddRow: true,
						showCheck: true
					})}
				</div>
				{createModal('MessageDlg', {
					content: ''
				})}
			</div>
		);
	}
}

List = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: AREA.pageArea,
		bodycode: {
			[AREA.tableArea]: 'editTable'
		}
	},
	orderOfHotKey: [ AREA.tableArea ]
})(List);

ReactDOM.render(<List />, document.querySelector('#app'));
