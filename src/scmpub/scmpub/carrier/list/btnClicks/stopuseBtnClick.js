/*
 * @Author: zhaochyu
 * @PageInfo: 停用
 * @Date: 2020-02-10 18:46:54
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-03-19 15:39:57
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, PAGEID, HEADFILED, URL } from '../../constance';
import { setBrowseStatusButton } from '../viewController/buttonController';
import { showWarningDialog, showErrorInfo, showSuccessInfo } from '../../../pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export function stopuseBtnClick(index, record) {
	let pageid = PAGEID.listpagecodeorg;
	if (!record.pk_org_v.value) {
		showErrorInfo(getLangByResId(this, '4001CARRIER-000028')); /* 国际化处理： 组织节点不能停用集团数据*/
		return;
	}

	let pk = record.ccarrierid.value;
	let data = { id: pk, pagecode: pageid };
	ajax({
		method: 'post',
		data: data,
		url: URL.listuse,
		success: (res) => {
			if (res.success) {
				this.props.table.setValByKeyAndIndex(
					AREA.listTable,
					index,
					HEADFILED.ts,
					res.data.list_head.rows[0].values.ts
				);
				this.props.table.setValByKeyAndIndex(
					AREA.listTable,
					index,
					HEADFILED.bsealflag,
					res.data.list_head.rows[0].values.bsealflag
				);
				showSuccessInfo(getLangByResId(this, '4001CARRIER-000030')); /* 国际化处理： 停用成功！*/
				setBrowseStatusButton.call(this);
				this.props.table.selectAllRows(AREA.listTable, false);
			}
		}
	});


	// 执行停用操作提示
	// showWarningDialog(getLangByResId(this, '4001CARRIER-000016'), getLangByResId(this, '4001CARRIER-000017'), {
	// 	/* 国际化处理： 停用,确定要停用吗？*/
	// 	beSureBtnClick: () => {
	// 		let pk = record.ccarrierid.value;
	// 		let data = { id: pk, pagecode: pageid };
	// 		ajax({
	// 			method: 'post',
	// 			data: data,
	// 			url: URL.listuse,
	// 			success: (res) => {
	// 				if (res.success) {
	// 					this.props.table.setValByKeyAndIndex(
	// 						AREA.listTable,
	// 						index,
	// 						HEADFILED.ts,
	// 						res.data.list_head.rows[0].values.ts
	// 					);
	// 					this.props.table.setValByKeyAndIndex(
	// 						AREA.listTable,
	// 						index,
	// 						HEADFILED.bsealflag,
	// 						res.data.list_head.rows[0].values.bsealflag
	// 					);
	// 					showSuccessInfo(getLangByResId(this, '4001CARRIER-000030')); /* 国际化处理： 停用成功！*/
	// 					setBrowseStatusButton.call(this);
	// 					this.props.table.selectAllRows(AREA.listTable, false);
	// 				}
	// 			}
	// 		});
	// 	}
	// });
}
