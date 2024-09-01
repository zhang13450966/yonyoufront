/*
 * @Author: zhaochyu 
 * @PageInfo: 停用
 * @Date: 2020-02-10 18:46:54 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-12-31 14:13:56
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, PAGEID, FILED, URL } from '../../constance';
import { setBrowseStatusButton } from '../viewController/buttonController';
import { showWarningDialog, showErrorInfo, showSuccessInfo } from '../../../pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export function stopuseBtnClick(index, record) {
	let type = this.props.getUrlParam(FILED.type);
	let pageid = type == 0 ? PAGEID.pagecodeorg : PAGEID.pagecodegroup;
	if (type == 0) {
		if (!record.values.pk_org_v.value) {
			showErrorInfo(getLangByResId(this, '4001VEHICLETYPE-000015')); /* 国际化处理： 组织节点不停用集团数据*/
			return;
		}
	}

	let pk = record.values.cvehicletypeid.value;
	let data = { id: [ pk ], pagecode: pageid };
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
				showSuccessInfo(getLangByResId(this, '4001VEHICLETYPE-000018')); /* 国际化处理： 停用成功!*/
				setBrowseStatusButton.call(this);
				this.props.editTable.selectAllRows(AREA.listTable, false);
			}
		}
	});


	// 执行删除操作提示
	// showWarningDialog(getLangByResId(this, '4001VEHICLETYPE-000016'), getLangByResId(this, '4001VEHICLETYPE-000017'), {
	// 	/* 国际化处理： 停用,确定要停用吗？*/
	// 	beSureBtnClick: () => {
	// 		let pk = record.values.cvehicletypeid.value;
	// 		let data = { id: [ pk ], pagecode: pageid };
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
	// 					showSuccessInfo(getLangByResId(this, '4001VEHICLETYPE-000018')); /* 国际化处理： 停用成功!*/
	// 					setBrowseStatusButton.call(this);
	// 					this.props.editTable.selectAllRows(AREA.listTable, false);
	// 				}
	// 			}
	// 		});
	// 	}
	// });
}
