/*
 * @Author: zhaochyu
 * @PageInfo: 启用
 * @Date: 2020-02-10 18:39:55
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-03-19 15:39:50
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, PAGEID, URL, HEADFILED } from '../../constance';
import { setBrowseStatusButton } from '../viewController/buttonController';
import { showWarningDialog, showErrorInfo, showSuccessInfo } from '../../../pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export function startuseBtnClick(index, record) {
	let pageid = PAGEID.listpagecodeorg;
	if (!record.pk_org_v.value) {
		showErrorInfo(getLangByResId(this, '4001CARRIER-000011')); /* 国际化处理： 组织节点不能启用集团数据*/
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
				showSuccessInfo(getLangByResId(this, '4001CARRIER-000029')); /* 国际化处理： 启用成功！*/
				setBrowseStatusButton.call(this);
				this.props.table.selectAllRows(AREA.listTable, false);
				//lineSelected.call(this, this.props);
			}
		}
	});


	// 执行启用操作提示
	// showWarningDialog(getLangByResId(this, '4001CARRIER-000012'), getLangByResId(this, '4001CARRIER-000013'), {
	// 	/* 国际化处理： 启用,确定要启用吗？*/
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
	// 					showSuccessInfo(getLangByResId(this, '4001CARRIER-000029')); /* 国际化处理： 启用成功！*/
	// 					setBrowseStatusButton.call(this);
	// 					this.props.table.selectAllRows(AREA.listTable, false);
	// 					//lineSelected.call(this, this.props);
	// 				}
	// 			}
	// 		});
	// 	}
	// });
}
