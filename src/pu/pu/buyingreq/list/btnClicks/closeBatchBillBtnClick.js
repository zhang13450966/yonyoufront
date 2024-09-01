/*
 * @Author: zhangchangqing
 * @PageInfo: 删除按钮事件
 * @Date: 2018-04-19 10:36:58
 * @Last Modified by: heyfn
 * @Last Modified time: 2022-04-18 13:33:29
 */
import { BUYINGREQ_LIST, ATTRCODE } from '../../siconst';
import { ajax } from 'nc-lightapp-front';
import { showSuccessInfo, showBatchOprMessage } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { updateCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonController } from '../viewControl';
let formId = BUYINGREQ_LIST.formId; //'head';

export default function clickBtn(props) {
	// 获取选中行
	let rows = props.table.getCheckedRows(formId);
	// 如果没有选中行，则提示并返回，不进行任何操作
	if (rows.length <= 0) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4004PRAYBILL-000030') /* 国际化处理： 请选择需要提交的数据！*/
		});
		return;
	}
	// 发送请求
	let delRows = [];
	rows.map((item) => {
		let data = {
			id: item.data.values.pk_praybill.value,
			ts: item.data.values.ts.value
		};
		delRows.push(data);
	});
	// 发送请求
	ajax({
		url: BUYINGREQ_LIST.closeBillURL,
		data: {
			deleteInfos: delRows,
			pageid: BUYINGREQ_LIST.listpageid
		},
		success: (res) => {
			if (res.success) {
				//showBatchOprMessage(getLangByResId(this, '4004PRAYBILL-000029'), res.data); /* 国际化处理： 提交成功*/
				// showSuccessInfo(getLangByResId(this, '4004PRAYBILL-000054')); /* 国际化处理： 整单关闭成功！*/
				showBatchOprMessage(
					"",
					res.data,
					{},
					""
				);
				//更新列表上的数据
				updateCacheDataForList(props, BUYINGREQ_LIST.formId, ATTRCODE.pk_praybill, res.data);
				/**
				 * 变成编辑态时，不保留勾选
				 * selectAllRows(moduleId, checked)
				 * moduleId  区域ID
				 * checked为true    全选
				 * checked为false  全不选
				 */
				this.props.table.selectAllRows(BUYINGREQ_LIST.formId, false);
				buttonController.setListButtonVisiable(this.props, true);
			}
		}
	});
}
