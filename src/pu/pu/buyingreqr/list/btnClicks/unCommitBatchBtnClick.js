/*
 * @Author: tianzhyw 
 * @PageInfo: 列表页面收回按钮
 * @Date: 2021-06-02 15:28:04 
 * @Last Modified by: tianzhyw 
 * @Last Modified time: 2021-06-02 15:28:04 
 */
import { ajax } from 'nc-lightapp-front';
import { BUYINGREQ_LIST, ATTRCODE } from '../../siconst';
import { buttonController } from '../viewControl';
import { showBatchOprMessage } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { updateCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
export default function clickUnCommitBtn(props) {
	//获取选中行
	let rows = props.table.getCheckedRows(BUYINGREQ_LIST.formId);
	// 执行操作
	let delRows = [];
	rows.map((item) => {
		let data = {
			id: item.data.values.pk_praybill.value,
			ts: item.data.values.ts.value
		};
		delRows.push(data);
	});
	// 拼装json
	let data = {
		deleteInfos: delRows,
		pageid: BUYINGREQ_LIST.listpageid,
		// 批量收回时区分请购单维护和修订
		isRevise: BUYINGREQ_LIST.isRevise
	};
	// 发送请求
	ajax({
		url: BUYINGREQ_LIST.uncommitURL,
		data: data,
		success: (res) => {
			if (res.success) {
				let title = getLangByResId(this, '4004PRAYBILLR-000034');
				let btnName = getLangByResId(this, '4004PRAYBILLR-000037');
				showBatchOprMessage(title, res.data, {}, btnName);
				// showBatchOprMessage(
				// 	getLangByResId(this, '4004PRAYBILLR-000037'),
				// 	res.data,
				// 	{},
				// 	getLangByResId(this, '4004PRAYBILLR-000034')
				// ); /* 国际化处理： 收回成功！*/
				//更新列表上的数据
				updateCacheDataForList(props, BUYINGREQ_LIST.formId, ATTRCODE.pk_praybill, res.data);
				buttonController.setListButtonVisiable(this.props);
			}
		}
	});
}
