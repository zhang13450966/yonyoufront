/*
 * @Author: wangceb
 * @PageInfo: 垂直布局的双表格
 * @Date: 2019-03-01 15:02:54
 * @Last Modified by: liulux
 * @Last Modified time: 2022-04-02 16:17:13
 */
import React, { Fragment } from 'react';
import { base } from 'nc-lightapp-front';
import './index.less';
import { getCardDisableHotKeyBtn } from '../../pub/tool/hotKeysUtil';
import MainOrgRef from 'scmpub/scmpub/components/MainOrgRef';
import { headRowSelect } from './viewController/pageController';
import { simplifyData } from '../../pub/tool/simplifyDataUtil';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil';
const { NCDiv, NCAffix } = base;

function createVerticalEditTableWithOrgPanel(pageConfig, upAreaConfig, downAreaConfig) {
	// 界面组装

	let { btnArea, onBtnClick, appname, mainOrgConfig, isShowIcon } = pageConfig;
	return (
		// <div className="nc-bill-extCard">
		<div className="nc-bill-list">
			<NCAffix>
				<div className="nc-bill-top-area">
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">
							{isShowIcon &&
								createListTitle(this, {
									title: appname
								})}
							{mainOrgConfig && (
								<div>
									<MainOrgRef
										refPath={mainOrgConfig.refPath}
										placeholder={mainOrgConfig.placeholder} /* 国际化处理： 销售组织*/
										refCode={mainOrgConfig.refCode}
										refType={mainOrgConfig.refType}
										queryTreeUrl={mainOrgConfig.queryTreeUrl}
										disabled={mainOrgConfig.disabled}
										onChange={mainOrgConfig.onChange}
										className="title-search-detail"
										isShowDisabledData={true}
										value={mainOrgConfig.value}
										required={mainOrgConfig.required}
										queryCondition={mainOrgConfig.queryCondition}
									/>
								</div>
							)}
						</div>
						<div className="header-button-area">
							{this.props.button.createButtonApp({
								area: btnArea,
								buttonLimit: 4,
								onButtonClick: onBtnClick
							})}
						</div>
					</NCDiv>
				</div>
			</NCAffix>
			{createVerticalEditTable.call(this, pageConfig, upAreaConfig, downAreaConfig)}
		</div>
		// </div>
	);
}

function createVerticalEditTable(pageConfig, upAreaConfig, downAreaConfig) {
	let { cardTable } = this.props;
	let { createCardTable } = cardTable;
	let { pk_head_field, pk_body_field } = pageConfig;
	this.pk_head_field = pk_head_field;
	this.pk_body_field = pk_body_field;
	this.headDataCache = {};
	this.bodyDataCache = {};

	// downAreaConfig.adaptionHeight = true;

	downAreaConfig.hideSwitch = () => {
		return false;
	};

	downAreaConfig.tableHead = getTableHead.bind(this, downAreaConfig);

	upAreaConfig.hideSwitch = () => {
		return false;
	};
	let cloneCofing = { ...upAreaConfig };

	cloneCofing.onRowClick = (...rest) => {
		let isCanChange = headRowSelect.bind(this)(...rest);
		if (isCanChange && upAreaConfig.onRowClick) {
			upAreaConfig.onRowClick(...rest);
		}
	};

	cloneCofing.onBeforeEvent = (...rest) => {
		console.log(...rest);

		let isCanChange = cloneCofing.isMultiRowsEdit ? true : isCurRowForBefore.bind(this)(...rest);
		if (!isCanChange) {
			return false;
		} else if (isCanChange && upAreaConfig.onBeforeEvent) {
			return upAreaConfig.onBeforeEvent(...rest);
		}
		return true;
	};

	let getTopTableHeight = () => {
		if (this.state && this.state.topTableClose) {
			return { flex: 'none' };
		} else if (this.state && this.state.hideDownTable) {
			return {};
		} else {
			return { height: 300, flex: 'none' };
		}
	};

	return (
		<Fragment>
			<div className="nc-bill-table-area top-table" style={getTopTableHeight()}>
				{createCardTable(upAreaConfig.tableId, {
					...cloneCofing,
					onHeadAngleToggle: (props, moduleId, value) => {
						this.setState({ topTableClose: !value });
					},
					adaptionHeight: true
				})}
			</div>
			{this.state &&
			!this.state.hideDownTable && (
				<div className="nc-bill-table-area bottom-table">
					{createCardTable(downAreaConfig.tableId, { ...downAreaConfig, adaptionHeight: true })}
				</div>
			)}
			{pageConfig.getExtArea && pageConfig.getExtArea.call(this)}
		</Fragment>
	);
}

function isCurRowForBefore(props, moduleId, key, record, index) {
	return index === this.selectIndex;
}

//获取列表肩部信息
function getTableHead(downAreaConfig) {
	let { createButtonApp } = this.props.button;
	return (
		<div className="definition-icons">
			{createButtonApp({
				area: downAreaConfig.btnArea,
				buttonLimit: 8,
				onButtonClick: downAreaConfig.onBtnClick,
				ignoreHotkeyCode: getCardDisableHotKeyBtn()
			})}
		</div>
	);
}

function setTableData(data, upTableId, downTableId) {
	if (data) {
		let headrows = JSON.parse(JSON.stringify(data[0].head[upTableId]));
		headrows.rows = [];
		data.forEach((row) => {
			headrows.rows = headrows.rows.concat(row.head[upTableId].rows);
		});
		setUpTableData.call(this, headrows, upTableId);
		setDownTableData.call(this, data[0], downTableId);
		this.props.cardTable.focusRowByIndex(upTableId, 0);
	} else {
		setUpTableData.call(this, { rows: [] }, upTableId);
		setDownTableData.call(this, { rows: [] }, downTableId);
	}
}

export function updateTableData(data, upTableId, downTableId) {
	updateUpTableData.call(this, data[0].head[upTableId], upTableId);
	setDownTableData.call(this, data[0], downTableId);
}

function updateHeadCache(heads) {
	if (heads.rows.length > 0) {
		heads.rows.forEach((row) => {
			let pk_bill = row.values[this.pk_head_field].value;
			this.headDataCache[pk_bill] = row;
		});
	} else {
		this.headDataCache = {};
	}
}

function updateBodyCache(bodydata, downTableId) {
	if (bodydata.body && bodydata.body[downTableId]) {
		let pk_bill = bodydata.body[downTableId].rows[0].values[this.pk_head_field].value;
		this.bodyDataCache[pk_bill] = bodydata;
	}
}

export function deleteTableData(upTableId, downTableId, indexs, pk_bills, isDeepDel = true) {
	if (Array.isArray(indexs)) {
		this.props.cardTable.delRowsByIndex(upTableId, indexs, undefined, isDeepDel);
		this.selectIndex = this.selectIndex - indexs.length;
	} else {
		this.props.cardTable.delRowsByIndex(upTableId, this.selectIndex, undefined, isDeepDel);
		this.selectIndex--;
	}
	this.props.cardTable.setTableData(downTableId, { rows: [] }, null);

	deleteCacheByPk.call(this, pk_bills);
}

function deleteCacheByPk(pk_bills) {
	if (!Array.isArray(pk_bills)) {
		pk_bills = [ pk_bills ];
	}
	pk_bills.forEach((pk_bill) => {
		if (!pk_bill) {
			return;
		}

		delete this.headDataCache[pk_bill];
		delete this.bodyDataCache[pk_bill];
	});
}

export function getCacheByPk(pk_bill) {
	return this.bodyDataCache[pk_bill];
}
function updateUpTableData(data, upTableId) {
	this.props.cardTable.updateDataByIndexs(
		upTableId,
		[ { index: this.selectIndex, data: data.rows[0] } ],
		true,
		true,
		true
	);
	updateHeadCache.call(this, data);
}

function setUpTableData(data, upTableId) {
	this.props.cardTable.setTableData(upTableId, data, null, true, true);
	updateHeadCache.call(this, data);
}

function setDownTableData(data, downTableId) {
	if (data.body && data.body[downTableId]) {
		this.props.cardTable.setTableData(downTableId, data.body[downTableId], null, true, true);
		updateBodyCache.call(this, data, downTableId);
	} else {
		this.props.cardTable.setTableData(downTableId, { rows: [] }, null, true, true);
		updateBodyCache.call(this, { rows: [] }, downTableId);
	}
}

export function setTableStatus(upTableId, downTableId, uistatus) {
	this.props.cardTable.setStatus(upTableId, uistatus);
	this.props.cardTable.setStatus(downTableId, uistatus);

	// 编辑态，设置其他表头行不能编辑
	// 	if (uistatus === 'edit') {
	//         let headIndexs = [];
	//         let newdata = props.editTable.getVisibleRows(AREA.headTableArea, false, true);
	//         for (let i = 0; i < newdata.length; i++) {
	//             if (i != index) {
	//                 headIndexs.push(i);
	//             }
	//         }
	//         onRow_BtnClick.call(this, props, null, null, index);
	//         props.editTable.setStatus(AREA.headTableArea, STATUS.edit);
	//         props.editTable.setEditableRowByIndex(AREA.headTableArea, index, true);
	//         props.editTable.setEditableRowByIndex(AREA.headTableArea, headIndexs, false);
	// 	}
}

export function cancelEdit(upTableId, downTableId) {
	// this.props.cardTable.setStatus(upTableId, 'browse');
	this.props.cardTable.resetTableData(upTableId);
	// this.props.cardTable.setStatus(downTableId, 'browse');
	this.props.cardTable.resetTableData(downTableId);
}

export function doAddAction(upTableConfig, downTableConfig) {
	this.selectIndex = this.props.cardTable.getNumberOfRows(upTableConfig.moduleId);
	this.props.cardTable.addRow(upTableConfig.moduleId, undefined, upTableConfig.data, true, upTableConfig.callback);
	// this.selectIndex = this.props.cardTable.getNumberOfRows(upTableConfig.moduleId) - 1;
	this.props.cardTable.setTableData(downTableConfig.moduleId, { rows: [] }, null, false);
	this.props.cardTable.addRow(
		downTableConfig.moduleId,
		undefined,
		downTableConfig.data,
		false,
		downTableConfig.callback
	);
}
export function createBodyAfterEventData(pageid, head_code, body_code, key, changedrows, index, userobject) {
	let cardData = getSaveData.call(this, pageid, head_code, body_code);

	let data = {
		attrcode: key,
		changedrows: changedrows,
		grid: cardData,
		index: index
	};
	data.index = 0;
	// // 删除display/scale 优化上行流量
	let rows = data.grid.body[body_code].rows;
	let newRows = [ rows[index] ];
	data.grid.body[body_code].rows = newRows;
	// 处理编辑传递单行处理
	data.grid.head[head_code] = simplifyData(data.grid.head[head_code]);
	data.grid.body[body_code] = simplifyData(data.grid.body[body_code]);

	// userObject 处理
	userobject = userobject ? userobject : {};

	// let crownos = [];
	// rows.map((row) => {
	// 	if (row.status != '3') {
	// 		crownos.push(row.values['crowno'] ? row.values['crowno'].value : null);
	// 	}
	// });
	userobject['scm_originindex'] = index + '';
	// userobject['scm_allrownos'] = crownos;
	data.userobject = userobject;

	return data;
}

export function processBillCardBodyEditResult(downTableId, data, i) {
	if (
		data &&
		data.grid &&
		data.grid.body &&
		data.grid.body[downTableId] &&
		data.grid.body[downTableId].rows.length > 0
	) {
		let rows = data.grid.body[downTableId].rows;
		let insertArray = [];
		let updateArray = [];
		for (let j = 0; j < rows.length; j++) {
			let row = rows[j];
			let obj = { index: i + j, data: row };
			if (j == 0) {
				updateArray.push(obj);
			} else {
				insertArray.push(obj);
			}
		}
		if (updateArray.length > 0) {
			this.props.cardTable.updateDataByIndexs(downTableId, updateArray);
		}
		if (insertArray.length > 0) {
			this.props.cardTable.insertDataByIndexs(downTableId, insertArray, true);
		}
	}
}

export function getSaveData(pageid, head_code, body_code) {
	let saveData = {
		pageid: pageid,
		head: {},
		body: {}
	};
	let metaObj = this.props.meta.getMeta();
	metaObj.pageid && (saveData.templetid = metaObj.pageid);

	if (metaObj[head_code] && metaObj[head_code].moduletype && metaObj[head_code].moduletype === 'table') {
		saveData.head[head_code] = {};
		saveData.head[head_code].rows = this.props.cardTable.getRowsByIndexs(head_code, this.selectIndex);
		saveData.head[head_code].areacode = head_code;
		saveData.head[head_code].areaType = 'form';
	}
	if (metaObj[body_code] && metaObj[body_code].moduletype && metaObj[body_code].moduletype === 'table') {
		saveData.body[body_code] = this.props.cardTable.getAllData(body_code);
		saveData.body[body_code].areacode = body_code;
		saveData.body[body_code].areaType = 'table';
	}
	return saveData;
}

export { createVerticalEditTable, setTableData, setUpTableData, setDownTableData, createVerticalEditTableWithOrgPanel };
