/*
 * @Author: zhangchangqing 
 * @PageInfo: 列表批量提交按钮
 * @Date: 2018-04-19 10:36:58 
 * @Last Modified by: tianzhyw
 * @Last Modified time: 2021-10-26 15:45:23
 */
import { ajax } from 'nc-lightapp-front';
import { ATTRCODE, BUYINGREQ_LIST, FBILLSTATUS } from '../../siconst';
import { buttonController } from '../viewControl';
import { showBatchOprMessage } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import {
	updateCacheDataForList,
	updateCacheDataForListWhenChangePK
} from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
export default function clickCommitBtn(props, assign) {
	// 获取选中行
	let rows = props.table.getCheckedRows(BUYINGREQ_LIST.formId);
	let delRows = [];
	let indexs = [];
	rows.map((item) => {
		let data = {
			id: item.data.values.pk_praybill.value,
			ts: item.data.values.ts.value
		};
		delRows.push(data);
		indexs.push(item.index);
	});
	// 批量选择多行时索引号置空
	if (rows.length > 1) {
		indexs = null;
	}
	// 拼装json
	let data = {
		deleteInfos: delRows,
		pageid: BUYINGREQ_LIST.listpageid
	};
	if (assign) {
		data['assign'] = JSON.stringify(assign);
	}
	ajax({
		url: BUYINGREQ_LIST.commitURL,
		data: data,
		success: (res) => {
			if (res.success) {
				showBatchOprMessage(
					getLangByResId(this, '4004PRAYBILLR-000031'),
					res.data,
					{},
					getLangByResId(this, '4004PRAYBILLR-000036')
				); /* 国际化处理： 提交成功！*/
				//更新列表上的数据
				//判断是否是审批中，审批通过之前主键还没换掉
				if (
					res.data.sucessVOs &&
					res.data.sucessVOs.list_head.rows[0].values.fbillstatus.value == FBILLSTATUS.approved
				) {
					updateCacheDataForListWhenChangePK(
						props,
						BUYINGREQ_LIST.formId,
						ATTRCODE.pk_praybill,
						ATTRCODE.pk_srcpraybill,
						res.data,
						indexs
					);
				} else {
					updateCacheDataForList(props, BUYINGREQ_LIST.formId, ATTRCODE.pk_praybill, res.data, indexs);
				}
				buttonController.setListButtonVisiable(this.props);
			}
		}
	});
}
