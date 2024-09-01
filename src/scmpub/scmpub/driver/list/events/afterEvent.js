/*
 * @Author: zhaochyu
 * @PageInfo: 编辑后事件
 * @Date: 2020-02-12 20:26:07
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-07-14 15:39:41
 */

import { VOFIELD, URL, PAGEID, AREA, FILED } from '../../constance';
import { createGridAfterEventData } from '../../../pub/tool/afterEditUtil';
import { ajax, getBusinessInfo } from 'nc-lightapp-front';
import { showErrorInfo } from '../../../pub/tool/messageUtil';

export default function afterEvent(props, moduleId, key, value, changedrows, index, record) {
	if (key == 'cpsndocid' || key == 'cvehicleid' || key == 'vidcard' || key == 'ccarrierid') {
		if (changedrows.length == 1) {
			if (changedrows && changedrows[0].newvalue.value == changedrows[0].oldvalue.value) {
				return;
			}
		}
		let data = createGridAfterEventData(
			props,
			PAGEID.pagecodegroup,
			AREA.listTable,
			moduleId,
			key,
			changedrows,
			index
		);
		ajax({
			url: URL.afterEdit,
			data: data,
			async: false,
			success: (res) => {
				if (res.data && res.data.grid[moduleId]) {
					let updateRows = [];
					updateRows.push({ index: index, data: res.data.grid[moduleId].rows[0] });
					this.props.editTable.updateDataByIndexs(moduleId, updateRows);
				}
				//由身份证计算年龄
				if (res.data.userObject.vidcard) {
					this.props.editTable.setValByKeyAndIndex(moduleId, index, 'age', {
						value: res.data.userObject.age,
						display: res.data.userObject.age
					});
				}
				if (this.state.status === 'add' && key === 'cpsndocid') {
					let rowindex = this.props.editTable.getNumberOfRows(AREA.listTable);
					if (rowindex == index + 1) {
						addRow.call(this, rowindex);
					}
				}
			},
			error: (error) => {
				this.props.editTable.setValByKeyAndIndex(moduleId, index, key, {
					value: null,
					display: null
				});
				showErrorInfo(error.message);
			}
		});
	} else if (key == 'bcarrierflag') {
		VOFIELD.map((item) => {
			this.props.editTable.setValByKeyAndIndex(moduleId, index, item, {
				value: null,
				display: null
			});
		});
	} else if (key == 'vdrivercode' && this.state.status === 'add') {
		let rowindex = this.props.editTable.getNumberOfRows(AREA.listTable);
		if (rowindex == index + 1) {
			addRow.call(this, rowindex);
		}
	}
}

function addRow(rowindex) {
	this.props.editTable.addRow(AREA.listTable);
	this.props.editTable.setValByKeyAndIndex(AREA.listTable, rowindex, 'pk_org', {
		value: this.state.pk_org,
		display: this.state.refname
	});
	let type = this.props.getUrlParam(FILED.type);
	if (type == 0) {
		this.props.editTable.setValByKeyAndIndex(AREA.listTable, rowindex, 'org_id', {
			value: this.state.refname,
			scale: '-1'
		});
	} else {
		this.props.editTable.setValByKeyAndIndex(AREA.listTable, rowindex, 'org_id', {
			value: getBusinessInfo().groupName
		});
	}
}
