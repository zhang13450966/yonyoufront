/*
 * @Author: wangceb 
 * @PageInfo: 列表下 收回(包括表头收回和行操作收回) 按钮处理
 * @Date: 2018-04-19 10:33:09 
 * @Last Modified by: sunxxf
 * @Last Modified time: 2021-01-13 17:01:59
 */

import { ajax } from 'nc-lightapp-front';
import { ARSUB_CONST, ArsubHeadItem } from '../../const';
import getSelectedOperaDatas from './listPageData';
import { buttonControl } from '../viewController/buttonController';
import { updateCacheDataForList } from '../../../pub/cache';
import { showBatchOprMessage, showErrorInfo, showSuccessInfo } from '../../../pub/tool/messageUtil';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';
import { showResumeModal } from 'scmpub/scmpub/components/ResumeModal';

export default function buttonClick(props, record, index, skipCodes) {
	let seldatas = getSelectedOperaDatas(props, record, index);
	if (seldatas == null || seldatas.index == undefined) {
		showErrorInfo(null, getLangByResId(this, '4006ARSUB-000018')); /* 国际化处理： 请选择要操作的单据！*/
		return;
	}
	skipCodes = skipCodes ? skipCodes : new Array();

	unCommitBills.call(this, props, record, seldatas.pks, seldatas.index, index, skipCodes);
}

// 批量提交销售订单
function unCommitBills(props, record, pks, indexs, index, skipCodes) {
	ajax({
		url: ARSUB_CONST.listuncommitUrl,
		data: { pks: pks, pageid: ARSUB_CONST.listPageId },
		success: (res) => {
			if (res.data.isResume && res.data.isResume == true) {
				showResumeModal.bind(this)(props, 'MessageDlg', skipCodes, res.data, buttonClick, props, record, index);
				return;
			} else {
				if (res.success) {
					if (record) {
						showSuccessInfo(getLangByResId(this, '4006ARSUB-000013')); /* 国际化处理： 提示,收回成功！*/
					} else {
						showBatchOprMessage(null, res.data, {}, getLangByResId(this, '4006ARSUB-000022'));
					}
					updateCacheDataForList(props, ARSUB_CONST.formId, ArsubHeadItem.carsubid, res.data, index);
					buttonControl.call(this, this.props);
				}
			}
		}
	});
}
