/*
 * @Author: zhaochyu 
 * @PageInfo: 启用 
 * @Date: 2020-02-10 18:39:55 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-09-30 10:18:53
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, PAGEID, FILED, URL } from '../../constance';
import { setBrowseStatusButton, lineSelected } from '../viewController/buttonController';
import { showWarningDialog, showErrorInfo, showSuccessInfo } from '../../../pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export function startuseBtnClick(index, record) {
	let type = this.props.getUrlParam(FILED.type);
	let pageid = type == 0 ? PAGEID.pagecodeorg : PAGEID.pagecodegroup;
	// if (type == 0) {
	// 	if (!record.values.pk_org_v.value) {
	// 		showErrorInfo(getLangByResId(this, '4001VEHICLE-000010')); /* 国际化处理： 组织节点不启用集团数据*/
	// 		return;
	// 	}
	// }


	let pk = record.values.cvehicleid.value;
	let data = { id: [ pk ], pagecode: pageid };

	if (type == 0) {
		if (!record.values.pk_org_v.value) {
			showErrorInfo(getLangByResId(this, '4001VEHICLE-000010')); /* 国际化处理： 组织节点不启用集团数据*/
			return;
		}
	}


	ajax({
		method: 'post',
		data: data,
		url: URL.startuse,
		success: (res) => {
			if (res.success) {
				this.props.editTable.setValByKeyAndIndex(
					AREA.listTable,
					index,
					FILED.ts,
					res.data.listhead.rows[0].values.ts
				);
				this.props.editTable.setValByKeyAndIndex(
					AREA.listTable,
					index,
					FILED.bsealflag,
					res.data.listhead.rows[0].values.bsealflag
				);
				showSuccessInfo(getLangByResId(this, '4001VEHICLE-000013')); /* 国际化处理： 启用成功!*/
				setBrowseStatusButton.call(this);
				this.props.editTable.selectAllRows(AREA.listTable, false);
				lineSelected.call(this, this.props);
			}
		}
	});



	// 执行操作提示
	// showWarningDialog(getLangByResId(this, '4001VEHICLE-000011'), getLangByResId(this, '4001VEHICLE-000012'), {
	// 	/* 国际化处理： 启用,确定要启用吗？*/
	// 	beSureBtnClick: () => {
	// 		let pk = record.values.cvehicleid.value;
	// 		let data = { id: [ pk ], pagecode: pageid };
	//
	// 		if (type == 0) {
	// 			if (!record.values.pk_org_v.value) {
	// 				showErrorInfo(getLangByResId(this, '4001VEHICLE-000010')); /* 国际化处理： 组织节点不启用集团数据*/
	// 				return;
	// 			}
	// 		}
	//
	//
	// 		ajax({
	// 			method: 'post',
	// 			data: data,
	// 			url: URL.startuse,
	// 			success: (res) => {
	// 				if (res.success) {
	// 					this.props.editTable.setValByKeyAndIndex(
	// 						AREA.listTable,
	// 						index,
	// 						FILED.ts,
	// 						res.data.listhead.rows[0].values.ts
	// 					);
	// 					this.props.editTable.setValByKeyAndIndex(
	// 						AREA.listTable,
	// 						index,
	// 						FILED.bsealflag,
	// 						res.data.listhead.rows[0].values.bsealflag
	// 					);
	// 					showSuccessInfo(getLangByResId(this, '4001VEHICLE-000013')); /* 国际化处理： 启用成功!*/
	// 					setBrowseStatusButton.call(this);
	// 					this.props.editTable.selectAllRows(AREA.listTable, false);
	// 					lineSelected.call(this, this.props);
	// 				}
	// 			}
	// 		});
	// 	}
	// });
}
