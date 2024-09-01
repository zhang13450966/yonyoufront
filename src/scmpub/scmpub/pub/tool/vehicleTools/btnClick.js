/*
 * @Author: zhaochyu 
 * @PageInfo: 车型定义公共方法
 * @Date: 2020-01-15 14:54:37 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-12-31 11:34:51
 */
import { ajax } from 'nc-lightapp-front';
import { URL, PAGEID } from './constant';
import { setBrowseStatusButton, setEditStatusButton } from './buttoncontroll';
import { showWarningDialog, showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getMainOrgAfter } from './getOrgAfter';
const AREA = { listTable: 'listhead' };
/**
 * 新增
 */
function addBtnClick() {
	let rowid = null;
	let rowindex = this.props.editTable.getNumberOfRows(AREA.listTable);
	let rowdatas = this.props.editTable.getAllData(AREA.listTable);
	this.props.editTable.addRow(AREA.listTable);
	this.props.editTable.setValByKeyAndIndex(AREA.listTable, rowindex, 'pk_org', {
		value: this.state.pk_org,
		display: this.state.refname
	});
	this.props.editTable.setColEditableByKey(AREA.listTable, 'pk_org', false);
	this.props.editTable.setValByKeyAndIndex(AREA.listTable, rowindex, 'org_id', {
		value: '',
		display: this.state.refname,
		scale: '-1'
	});
	setEditStatusButton.call(this);
	this.props.editTable.setStatus(AREA.listTable, 'edit', () => {
		rowdatas &&
			rowdatas.rows &&
			rowdatas.rows.map((row) => {
				if (!row.values.pk_org_v.value) {
					rowid = row.rowid;
					this.props.editTable.setEditableRowByRowId(AREA.listTable, rowid, false);
				}
			});
	});
}
/**
 * 删除
 */
function deleteBtnClick() {
	let indexSet = new Set();
	let checkeddata = this.props.editTable.getCheckedRows(AREA.listTable);
	checkeddata.map((row) => {
		indexSet.add(row.index);
	});
	if (this.props.editTable.getStatus(AREA.listTable) == 'edit') {
		this.props.editTable.deleteTableRowsByIndex(AREA.listTable, Array.from(indexSet));
		this.props.button.setButtonDisabled([ 'Delete' ], true);
		return;
	}
	// 执行删除操作提示
	showWarningDialog('删除', '确定要删除吗？', {
		/* 国际化处理： 删除,确定要删除吗？*/
		beSureBtnClick: () => {
			let rows = this.props.editTable.getCheckedRows(AREA.listTable);
			rows = rows.map((row) => {
				return row.data;
			});
			ajax({
				method: 'post',
				data: {
					pageid: PAGEID,
					model: {
						areaType: 'table',
						areacode: AREA.listTable,
						rows: rows
					}
				},
				url: URL.delete,
				success: (res) => {
					if (res.success) {
						this.props.editTable.deleteTableRowsByIndex(AREA.listTable, Array.from(indexSet));
						setBrowseStatusButton.call(this);
					}
				}
			});
		}
	});
}
/**
 * 取消
 */
function cancelBtnClick() {
	// 执行取消操作提示
	showWarningDialog('取消', '确定要取消吗？', {
		/* 国际化处理： 确认要取消吗？*/
		beSureBtnClick: () => {
			this.props.editTable.cancelEdit(AREA.listTable);
			setBrowseStatusButton.call(this);
		}
	});
}
/**
 * 刷新
 */
function RefreshBtnClick() {
	let event = this.state.mainOrg;
	getMainOrgAfter.call(this, AREA.listTable, URL.orgChange, event, PAGEID, 'isOrg');
}
/**
 * 修改
 */
function EditBtnClick() {
	let rowid = null;
	setEditStatusButton.call(this);
	this.props.editTable.setStatus(AREA.listTable, 'edit', () => {
		let rowdatas = this.props.editTable.getAllData(AREA.listTable);
		rowdatas &&
			rowdatas.rows &&
			rowdatas.rows.map((row) => {
				if (!row.values.pk_org_v.value) {
					rowid = row.rowid;
					this.props.editTable.setEditableRowByRowId(AREA.listTable, rowid, false);
				}
			});
	});
}
/**
 * 保存
 */
function SaveBtnClick() {
	let rows = this.props.editTable.getAllRows(AREA.listTable, true);
	let flag = this.props.editTable.checkRequired(AREA.listTable, rows);
	if (!flag) {
		return;
	}
	let data = {
		pageid: PAGEID,
		model: {
			areaType: 'table',
			areacode: AREA.listTable,
			rows: rows
		}
	};
	this.props.validateToSave(data, () => {
		ajax({
			url: URL.save,
			data: {
				pageid: PAGEID,
				model: {
					areaType: 'table',
					areacode: AREA.listTable,
					rows: rows
				}
			},
			success: (res) => {
				if (res && res.data) {
					if (res.data[AREA.listTable]) {
						res.data.listhead.rows.map((k) => {
							if (k.values.pk_org_v.value) {
								k.values.org_id = { display: k.values.pk_org_v.display, value: '' };
							} else {
								k.values.org_id = { display: k.values.pk_group.display, value: '' };
							}
						});
						this.props.editTable.setTableData(AREA.listTable, res.data.listhead);
						this.props.editTable.setStatus(AREA.listTable, 'browse');
					} else {
						this.props.editTable.setTableData(AREA.listTable, {
							rows: [],
							areacode: AREA.listTable
						});
					}
				} else {
					props.editTable.setTableData(AREA.listTable, {
						rows: [],
						areacode: AREA.listTable
					});
				}
				this.props.editTable.setStatus(AREA.listTable, 'browse');
				setBrowseStatusButton.call(this);
				showSuccessInfo('保存成功!');
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					this.props.dealFormulamsg(
						res.formulamsg //参数一：返回的公式对象
					);
				}
			}
		});
	});
}
export { addBtnClick, deleteBtnClick, cancelBtnClick, RefreshBtnClick, EditBtnClick, SaveBtnClick };
