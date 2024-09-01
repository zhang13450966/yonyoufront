/*
 * @Author: zhangchangqing
 * @PageInfo: 删除按钮事件
 * @Date: 2018-04-19 10:36:58
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2020-02-25 13:27:40
 */
import { TARGETADJ_LIST } from '../../siconst';
import { ajax } from 'nc-lightapp-front';
import { deleteCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonController } from '../viewControl';
export default function clickDelBtn(props, record) {
	backtotransfer.call(this, props, record);
}
function backtotransfer(props, record) {
	//自己的逻辑
	let numberindex = record.numberindex.value;
	let pk = record.pk_targetadj.value;
	let ts = record.ts.value;
	ajax({
		url: TARGETADJ_LIST.deleteURL,
		data: {
			id: pk,
			ts: ts
		},
		success: (res) => {
			// 删除成功之后，前台删除数据
			props.table.deleteTableRowsByIndex(TARGETADJ_LIST.formId, numberindex - 1);
			deleteCacheDataForList(props, TARGETADJ_LIST.formId, pk);
			showSuccessInfo(getLangByResId(this, '4001TARGETADJ-000015')); /* 国际化处理： 删除成功！*/
			buttonController.setListButtonVisiable(this.props, true);
		}
	});
}
