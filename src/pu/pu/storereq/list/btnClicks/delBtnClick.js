/*
 * @Author: zhangchangqing 
 * @PageInfo: 删除按钮事件
 * @Date: 2018-04-19 10:36:58 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2019-01-03 16:00:21
 */
import { STOREREQ_LIST } from '../../siconst';
import { ajax } from 'nc-lightapp-front';
import { deleteCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { showWarningDialog, showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { buttonController } from '../viewControl';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function clickDelBtn(props, record) {
	
	// // 弹出确认删除的框
	// showWarningDialog(getLangByResId(this, '4004STOREREQ-000046'), getLangByResId(this, '4004STOREREQ-000028'), {
	// 	/* 国际化处理： 确认要删除吗？*/
	// 	beSureBtnClick: backtotransfer.bind(this, props, record)
	// });
	backtotransfer.call(this, props, record);
}
function backtotransfer(props, record) {
	//自己的逻辑
	let numberindex = record.numberindex.value;
	let pk = record.pk_storereq.value;
	let ts = record.ts.value;
	ajax({
		url: STOREREQ_LIST.deleteURL,
		data: {
			id: pk,
			ts: ts
		},
		success: (res) => {
			// 删除成功之后，前台删除数据
			props.table.deleteTableRowsByIndex(STOREREQ_LIST.formId, numberindex - 1);
			deleteCacheDataForList(props, STOREREQ_LIST.formId, pk);
			buttonController.setListButtonVisiable(props, this.state.currentTab);
			showSuccessInfo(getLangByResId(this, '4004STOREREQ-000037')); /* 国际化处理： 删除成功！*/
		}
	});
}
