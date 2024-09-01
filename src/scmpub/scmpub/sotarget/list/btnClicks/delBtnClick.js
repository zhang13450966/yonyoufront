/*
 * @Author: zhangchangqing
 * @PageInfo: 删除按钮事件
 * @Date: 2018-04-19 10:36:58
 * @Last Modified by: qishy
 * @Last Modified time: 2021-03-12 13:52:13
 */
import { TARGET_LIST } from '../../siconst';
import { ajax } from 'nc-lightapp-front';
import { deleteCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonController } from '../viewControl';
export default function clickDelBtn(props, record, index) {
	//自己的逻辑
	let pk = record.pk_target.value;
	let ts = record.ts.value;
	// 执行删除操作
	let delRows = [];
	delRows.push({
		id: pk,
		ts: ts
	});
	// 拼装json
	let data = {
		deleteInfos: delRows
	};
	ajax({
		url: TARGET_LIST.batchDeleteURL,
		data: data,
		success: (res) => {
			// 删除成功之后，前台删除数据
			deleteCacheDataForList.call(this, props, TARGET_LIST.formId, pk);
			if (index >= 0 && record) {
				props.table.deleteTableRowsByIndex(TARGET_LIST.formId, index);
			}
			showSuccessInfo(getLangByResId(this, '4001TARGET-000004')); /* 国际化处理： 删除成功！*/
			buttonController.setListButtonVisiable(this.props, true);
		}
	});
}
