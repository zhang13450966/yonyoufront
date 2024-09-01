/*
 * @Author: wangceb 
 * @PageInfo: 列表下 提交(包括表头提交和行操作提交) 按钮处理
 * @Date: 2018-04-19 10:33:09 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-12-31 11:19:14
 */

import { ajax } from 'nc-lightapp-front';
import { PREPAIDINVOICE_CONST, PrepaidinvoiceHeadItem } from '../../const';
import getSelectedOperaDatas from './listPageData';
import { buttonControl } from '../viewController/buttonController';
import { updateCacheDataForList } from '../../../pub/cache';
import { showBatchOprMessage, showErrorInfo, showSuccessInfo } from '../../../pub/tool/messageUtil';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';

export default function buttonClick(props, record, index, assign) {
	this.commitInfo = {
		record: record,
		index: index
	};
	let seldatas = getSelectedOperaDatas(props, record, index);
	if (seldatas == null || seldatas.index == undefined) {
		showErrorInfo(null, getLangByResId(this, '4006PREPAIDINVOICE-000018')); /* 国际化处理： 请选择要操作的单据！*/
		return;
	}

	commitBills.call(this, props, seldatas.pks, seldatas.index, index, assign);
}

// 批量提交
function commitBills(props, pks, indexs, index, assign) {
	let info = { pks: pks, pageid: PREPAIDINVOICE_CONST.listPageId };
	if (assign) {
		info['assign'] = JSON.stringify(assign);
	}
	ajax({
		url: PREPAIDINVOICE_CONST.listcommitUrl,
		data: info,
		success: (res) => {
			if (res.success) {
				if (
					res.data &&
					res.data.workflow &&
					(res.data.workflow == 'approveflow' || res.data.workflow == 'workflow')
				) {
					this.setState({
						compositedata: res.data,
						compositedisplay: true
					});
					return;
				}
				if (indexs != null && indexs.length > 1) {
					showBatchOprMessage(null, res.data, {}, getLangByResId(this, '4006PREPAIDINVOICE-000021'));
				} else {
					showSuccessInfo(getLangByResId(this, '4006PREPAIDINVOICE-000007')); /* 国际化处理： 提示,提交成功！*/
				}
				updateCacheDataForList(props, PREPAIDINVOICE_CONST.formId, PrepaidinvoiceHeadItem.hid, res.data, index);
				buttonControl.call(this, this.props);
			}
		}
	});
}
