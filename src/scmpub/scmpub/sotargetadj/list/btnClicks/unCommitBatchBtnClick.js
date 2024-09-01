/*
 * @Author: zhangchqf 
 * @PageInfo: 批量收回
 * @Date: 2020-02-21 11:04:59 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2020-02-25 13:26:25
 */

import { TARGETADJ_LIST, ATTRCODE } from '../../siconst';
import { ajax, toast } from 'nc-lightapp-front';
import { showBatchOprMessage } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { updateCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonController } from '../viewControl';
let formId = TARGETADJ_LIST.formId; //'head';

export default function clickDelBtn(props) {
	// 获取选中行

	let rows = props.table.getCheckedRows(formId);
	// 如果没有选中行，则提示并返回，不进行任何操作
	if (rows.length <= 0) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4001TARGETADJ-000035') /* 国际化处理： 请选择需要收回的数据！*/
		});
		return;
	}
	// 获取待操作表格行的行号
	let indexs = rows.map((item) => {
		return item.index;
	});
	// 执行操作
	let delRows = [];
	rows.map((item) => {
		let data = {
			id: item.data.values.pk_targetadj.value,
			ts: item.data.values.ts.value
		};
		delRows.push(data);
	});
	// 拼装json
	let data = {
		deleteInfos: delRows,
		pageid: TARGETADJ_LIST.listpageid
	};
	// 发送请求
	ajax({
		url: TARGETADJ_LIST.uncommitURL,
		data: data,
		success: (res) => {
			if (res.success) {
				showBatchOprMessage(
					getLangByResId(this, '4001TARGETADJ-000029'),
					res.data,
					{},
					getLangByResId(this, '4001TARGETADJ-000058')
				); /* 国际化处理： 提交成功*/
				//更新列表上的数据
				updateCacheDataForList(props, TARGETADJ_LIST.formId, ATTRCODE.pk_targetadj, res.data);
				buttonController.setListButtonVisiable(this.props, true);
			} else {
			}
		}
	});
}
