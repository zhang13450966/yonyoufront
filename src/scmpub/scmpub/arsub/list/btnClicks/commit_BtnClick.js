/*
 * @Author: wangceb 
 * @PageInfo: 列表下 提交(包括表头提交和行操作提交) 按钮处理
 * @Date: 2018-04-19 10:33:09 
 * @Last Modified by: sunxxf
 * @Last Modified time: 2021-01-13 17:01:43
 */

import { ajax, base } from 'nc-lightapp-front';
import { ARSUB_CONST, ArsubHeadItem } from '../../const';
import getSelectedOperaDatas from './listPageData';
import { buttonControl } from '../viewController/buttonController';
import { updateCacheDataForList } from '../../../pub/cache';
import { showBatchOprMessage, showErrorInfo, showSuccessInfo } from '../../../pub/tool/messageUtil';
import { initLang, getLangByResId } from '../../../pub/tool/multiLangUtil';
import { showResumeModal } from 'scmpub/scmpub/components/ResumeModal';

export default function buttonClick(props, record, index, assign, skipCodes) {
	this.commitInfo = {
		record: record,
		index: index
	};
	let seldatas = getSelectedOperaDatas(props, record, index);
	if (seldatas == null || seldatas.index == undefined) {
		showErrorInfo(null, getLangByResId(this, '4006ARSUB-000018')); /* 国际化处理： 请选择要操作的单据！*/
		return;
	}
	skipCodes = skipCodes ? skipCodes : new Array();

	commitBills.call(this, props, record, seldatas.pks, seldatas.index, index, assign, skipCodes);
}

// 批量提交
function commitBills(props, record, pks, indexs, index, assign, skipCodes) {
	skipCodes = skipCodes ? skipCodes : new Array();
	let info = { pks: pks, pageid: ARSUB_CONST.listPageId, skipCodes: skipCodes };
	if (assign) {
		info['assign'] = JSON.stringify(assign);
	}
	ajax({
		url: ARSUB_CONST.listcommitUrl,
		data: info,
		success: (res) => {
			if (res.data.isResume && res.data.isResume == true) {
				showResumeModal.bind(this)(
					props,
					'MessageDlg',
					skipCodes,
					res.data,
					buttonClick,
					props,
					record,
					index,
					assign
				);
				return;
			} else {
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
					if (record) {
						showSuccessInfo(getLangByResId(this, '4006ARSUB-000007')); /* 国际化处理： 提示,提交成功！*/
					} else {
						showBatchOprMessage(null, res.data, {}, getLangByResId(this, '4006ARSUB-000021'));
					}
					updateCacheDataForList(props, ARSUB_CONST.formId, ArsubHeadItem.carsubid, res.data, index);
					buttonControl.call(this, this.props);
				}
			}
		}
	});
}
