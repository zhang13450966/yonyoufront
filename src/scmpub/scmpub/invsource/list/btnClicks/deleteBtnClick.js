/*
 * @Author: 王龙华 
 * @PageInfo: 删除按钮点击事件  分为编辑态和浏览态删除
 * @Date: 2018-04-11 14:13:22 
 * @Last Modified by: 王龙华
 * @Last Modified time: 2018-10-26 16:02:19
 */
import { ajax } from 'nc-lightapp-front';
import { INVSOURCE_CONST } from '../../const';
import { showSuccessInfo } from '../../../pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import buttonController from '../../list/viewController/buttonController'
import {  showDeleteDialog } from '../../../pub/tool/messageUtil';

export default function deleteBtnClick(props, record, index) {
	let status = props.editTable.getStatus(INVSOURCE_CONST.TABLEID);
	if (status == INVSOURCE_CONST.EDIT_STATUS) {
		let selectRow = props.editTable.getCheckedRows(INVSOURCE_CONST.TABLEID);
		let index = [];
		for (let row of selectRow) {
			index.push(row.index);
		}
		props.editTable.deleteTableRowsByIndex(INVSOURCE_CONST.TABLEID, index);
	    buttonController.call(this, props, status)
	} else {	
		const selectedData = props.editTable.getCheckedRows(INVSOURCE_CONST.TABLEID);
		let indexArr = [];
		let dataArr = [];
		// 组装数据，满足后台保存前规则校验
		selectedData.forEach((val) => {
			let delObj = {
				status: '3',
				values: {
					ts: {
						display: getLangByResId(this, '4001INVSOURCE-000001'), /* 国际化处理： 时间戳*/
						value:val.data.values.ts.value
					},
					pk_invsource: {
						display: getLangByResId(this, '4001INVSOURCE-000002'), /* 国际化处理： 主键*/
						value:val.data.values.pk_invsource.value
					},
					pk_stockorgreq: {
						display: getLangByResId(this, '4001INVSOURCE-000004'), /* 国际化处理： 需求库存组织*/
	                    value:val.data.values.pk_stockorgreq.value		
					},
					vmarcode: {
						display: getLangByResId(this, '4001INVSOURCE-000006'), /* 国际化处理： 物料分类名称*/
						value:val.data.values.vmarcode.value
					},
					pk_group: {
						display: getLangByResId(this, '4001INVSOURCE-000007'), /* 国际化处理： 所属集团*/
						value:val.data.values.pk_group.value
					}
				}
			};
			delObj.rowId = val.data.rowid;		
			dataArr.push(delObj);
			indexArr.push(val.index);
		});
		showDeleteDialog({
			beSureBtnClick: deleteBtn.bind(this, props,indexArr,dataArr)
		});
	}
}
function deleteBtn( props,indexArr,dataArr){
	let data = {
		pageid: INVSOURCE_CONST.PAGECODE,
		tableId: {
			areaType: 'table',
			pageinfo: null,
			rows: dataArr
		}
	};
	ajax({
		url: INVSOURCE_CONST.SAVE_URL,
		data,
		success: (res) => {
			let { success, data } = res;
			if (success) {			
				props.editTable.deleteTableRowsByIndex(INVSOURCE_CONST.TABLEID, indexArr, true);
				buttonController.call(this, props, INVSOURCE_CONST.BROWSER_STATUS)
				showSuccessInfo(getLangByResId(this, '4001INVSOURCE-000008')); /* 国际化处理： 删除成功*/
			}
		}
	});
}
