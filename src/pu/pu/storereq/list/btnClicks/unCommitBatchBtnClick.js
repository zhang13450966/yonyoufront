/*
 * @Author: mikey.zhangchqf 
 * @Date: 2018-06-13 11:25:58 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2019-01-03 16:00:06
 */

import { STOREREQ_LIST, STOREREQ_CARD, FBILLSTATUS, ATTRCODE } from '../../siconst';
import { ajax, toast } from 'nc-lightapp-front';
import { showBatchOprMessage } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { updateCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { buttonController } from '../viewControl';
let formId = STOREREQ_LIST.formId; //'head';

export default function clickDelBtn(props) {
	// 获取选中行
	
	let _this = this;
	let rows = props.table.getCheckedRows(formId);
	// 如果没有选中行，则提示并返回，不进行任何操作
	if (rows.length <= 0) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4004STOREREQ-000026') /* 国际化处理： 请选择需要收回的数据！*/
		});
		return;
	}
	// for (let j = 0; j < rows.length; j++) {
	// 	let fbillstatus = rows[j].data.values.fbillstatus.value;
	// 	if (fbillstatus != FBILLSTATUS.approve && fbillstatus != FBILLSTATUS.approved) {
	// 		toast({
	// 			color: 'warning',
	// 			content: '请选择状态为审批中或者审批的数据！'
	// 		});
	// 		return;
	// 	}
	// }
	// 获取待操作表格行的行号
	let indexs = rows.map((item) => {
		return item.index;
	});
	// 执行操作
	let delRows = [];
	rows.map((item) => {
		let data = {
			id: item.data.values.pk_storereq.value,
			ts: item.data.values.ts.value
		};
		delRows.push(data);
	});
	// 拼装json
	let data = {
		deleteInfos: delRows,
		pageid: STOREREQ_LIST.listpageid
	};
	// 发送请求
	ajax({
		url: STOREREQ_LIST.uncommitURL,
		data: data,
		success: (res) => {
			if (res.success) {
				showBatchOprMessage(
					getLangByResId(this, '4004STOREREQ-000020'),
					res.data,
					{},
					getLangByResId(this, '4004STOREREQ-000047')
				); /* 国际化处理： 提交成功*/
				//更新列表上的数据
				updateCacheDataForList(props, STOREREQ_LIST.formId, ATTRCODE.pk_storereq, res.data);
				buttonController.setListButtonVisiable(props, this.state.currentTab);
			} else {
				// toast({
				// 	color: 'warning',
				// 	content: '提交失败！'
				// });
			}
		}
	});
}
