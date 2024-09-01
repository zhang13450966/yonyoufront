/*
 * @Author: fangmj7
 * @PageInfo: 删除按钮事件
 * @Date: 2018-04-19 10:36:58
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-03-16 16:42:59
 */
import { AREA, URL } from '../../constance';
import { ajax } from 'nc-lightapp-front';
import { deleteCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { showWarningDialog, showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonController } from '../viewController';
export default function clickDelBtn(props, record) {
	// // 弹出确认删除的框
	// showWarningDialog(getLangByResId(this, '4004PRAYBILL-000057'), getLangByResId(this, '4004PRAYBILL-000037'), {
	// 	/* 国际化处理： 确认要删除吗？*/
	// 	beSureBtnClick: backtotransfer.bind(this, props, record)
	// });
	backtotransfer.call(this, props, record);
}
function backtotransfer(props, record) {
	//自己的逻辑
	let numberindex = record.numberindex.value;
	let pk = record.pk_planconfirm.value;
	let ts = record.ts.value;
	// 拼装json
	let deleteinfos = [];
	let deletinfo = {
		pk: pk,
		ts: ts
	};
	deleteinfos.push(deletinfo);
	let data = {
		billInfo: deleteinfos
	};
	ajax({
		url: URL.delete,
		data: data,
		success: (res) => {
			// 删除成功之后，前台删除数据
			props.table.deleteTableRowsByIndex(AREA.head, numberindex - 1);
			deleteCacheDataForList(props, AREA.head, pk);
			showSuccessInfo(getLangByResId(this, '4004planconfirm-000009')); /* 国际化处理： 删除成功！*/
			buttonController.call(this, props);
		}
	});
}
