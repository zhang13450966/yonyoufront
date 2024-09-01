/*
 * @Author: zhaochyu 
 * @PageInfo: 主组织编辑后事件
 * @Date: 2018-06-06 21:20:00 
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-01-29 16:42:46
 */
import { ajax, base } from 'nc-lightapp-front';
import { URL, PAGECODE, FIELD } from '../constance';
import getData from '../utils';
import { showErrorInfo } from '../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { headAfterEventData } from '../utils';
export default function afterEvent(props, moduleId, key, value, before, index) {
	if (before[0].oldvalue.value == null || before[0].oldvalue.value == '') {
		let data = headAfterEventData(props, moduleId, key, before);
		ajax({
			url: URL.orgafter,
			data: data,
			mode: 'normal',
			success: (res) => {
				if (!res.data.success) {
					showErrorInfo(res.data.error.message);
				} else if (res.data && res.data.data && res.data.data.head && res.data.data.head[PAGECODE.headId]) {
					//渲染主组织编辑后带回来的数据
					let items = Object.keys(res.data.data.head[PAGECODE.headId].rows[0].values);
					props.beforeUpdatePage();
					for (let i = 0; i < items.length; i++) {
						let item = items[i];
						let itemvalue = res.data.data.head[PAGECODE.headId].rows[0].values[item];
						props.editTable.setValByKeyAndIndex(PAGECODE.headId, index, item, {
							value: itemvalue.value,
							display: itemvalue.display,
							scale: '-1'
						});
					}
					let pk_org = props.editTable.getValByKeyAndIndex(PAGECODE.headId, index, FIELD.pk_org);
					if (pk_org.value && (pk_org.value != null || pk_org.value != '')) {
						props.editTable.setEditableRowByIndex(PAGECODE.bodyId, 0, true);
					}
					props.updatePage(PAGECODE.headId, PAGECODE.bodyId);
				}
			}
		});
	} else if (before[0].newvalue.value !== before[0].oldvalue.value) {
		//获取表头编辑后数据
		let data = headAfterEventData(props, moduleId, key, before);
		//获取表体行数量
		let rows = props.editTable.getNumberOfRows(PAGECODE.bodyId);
		if (before[0].newvalue.value == '' || before[0].newvalue.value == null) {
			//删除表体所有行
			for (let ii = 0; ii < rows; ii++) {
				props.editTable.deleteTableRowsByIndex(PAGECODE.bodyId, 0);
			}
			//为表体新增一行
			props.editTable.addRow(PAGECODE.bodyId);
			props.editTable.setValByKeyAndIndex(PAGECODE.bodyId, 0, FIELD.bshow, {
				value: true,
				display: getLangByResId(this, '4004COSTFACTOR-000001') /* 国际化处理： 是*/
			});
			props.editTable.setValByKeyAndIndex(PAGECODE.bodyId, 0, FIELD.ishoworder, {
				value: '1',
				display: 1
			});
			return;
		} else {
			ajax({
				url: URL.orgafter,
				data: data,
				mode: 'normal',
				success: (res) => {
					if (!res.data.success) {
						// NCMessage.create({
						// 	content: res.data.error.message,
						// 	color: 'dark',
						// 	position: 'topLeft'
						// });
						showErrorInfo(res.data.error.message);
					} else if (res.data && res.data.data && res.data.data.head && res.data.data.head[PAGECODE.headId]) {
						let items = Object.keys(res.data.data.head[PAGECODE.headId].rows[0].values);
						//给表头赋值
						for (let i = 0; i < items.length; i++) {
							let item = items[i];
							let itemvalue = res.data.data.head[PAGECODE.headId].rows[0].values[item];
							props.editTable.setValByKeyAndIndex(PAGECODE.headId, index, item, {
								value: itemvalue.value,
								display: itemvalue.display,
								scale: '-1'
							});
						}
					}
					props.editTable.setEditableRowByIndex(PAGECODE.bodyId, 0, true);
					//删除表体所有行
					for (let ii = 0; ii < rows; ii++) {
						props.editTable.deleteTableRowsByIndex(PAGECODE.bodyId, 0);
					}
					//为表体新增一行
					props.editTable.addRow(PAGECODE.bodyId);
					props.editTable.setValByKeyAndIndex(PAGECODE.bodyId, 0, FIELD.bshow, {
						value: true,
						display: getLangByResId(this, '4004COSTFACTOR-000001') /* 国际化处理： 是*/
					});
					props.editTable.setValByKeyAndIndex(PAGECODE.bodyId, 0, FIELD.ishoworder, {
						value: '1',
						display: 1
					});
				}
			});
		}
	}
}
