/*
 * @Author: wangceb 
 * @PageInfo: 列表下 收回(包括表头收回和行操作收回) 按钮处理
 * @Date: 2018-04-19 10:33:09 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-03-29 14:04:41
 */

import { ajax } from 'nc-lightapp-front';
import { PREPAIDINVOICE_CONST, PrepaidinvoiceHeadItem } from '../../const';
import getSelectedOperaDatas from './listPageData';
import { buttonControl } from '../viewController/buttonController';
import { updateCacheDataForList } from '../../../pub/cache';
import { showBatchOprMessage, showErrorInfo, showSuccessInfo } from '../../../pub/tool/messageUtil';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';

export default function buttonClick(props, record, index) {
	let seldatas = getSelectedOperaDatas(props, record, index);
	if (seldatas == null || seldatas.index == undefined) {
		showErrorInfo(null, getLangByResId(this, '4006PREPAIDINVOICE-000018')); /* 国际化处理： 请选择要操作的单据！*/
		return;
	}
	unCommitBills.call(this, props, seldatas.pks, seldatas.index, index);
}

// 批量提交销售订单
function unCommitBills(props, pks, indexs, index) {
	ajax({
		url: PREPAIDINVOICE_CONST.listuncommitUrl,
		data: { pks: pks, pageid: PREPAIDINVOICE_CONST.listPageId },
		success: (res) => {
			if (res.success) {
				if (indexs != null && indexs.length > 1) {
					showBatchOprMessage(null, res.data, {}, getLangByResId(this, '4006PREPAIDINVOICE-000022'));
				} else {
					showSuccessInfo(getLangByResId(this, '4006PREPAIDINVOICE-000013')); /* 国际化处理： 提示,收回成功！*/
				}
				updateCacheDataForList(props, PREPAIDINVOICE_CONST.formId, PrepaidinvoiceHeadItem.hid, res.data, index);
				buttonControl.call(this, this.props);
			}
		}
	});
}
