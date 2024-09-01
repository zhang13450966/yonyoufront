/*
 * @Author: jiangfw 
 * @PageInfo: 提交
 * @Date: 2018-06-22 13:35:47 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2019-02-28 17:06:24
 */
import { ajax } from 'nc-lightapp-front';
import { URL, FIELD, AREA } from '../../constance';
import getSelectedDatas from './getSelectedDatas';
import { updateCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache';
import { showBatchOprMessage, showWarningInfo, showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { btnController } from '../viewControl';

export default function clickBatchCommitBtn(props, record, index, assign) {
	let seldatas = getSelectedDatas(props, record, index);
	if (seldatas == null || seldatas.index == undefined) {
		showWarningInfo(null, getLangByResId(this, '4004PUINVOICE-000041') /*  国际化处理： 请注意 请选择要提交的发票！*/);
		return;
	}

	commitBills.call(this, props, seldatas.bills, seldatas.index, record, index, assign);
}

// 批量提交采购发票
function commitBills(props, bills, selIndex, record, index, assign) {
	let commitInfos = {
		dataInfo: bills
	};
	if (assign) {
		commitInfos['assign'] = JSON.stringify(assign);
	}

	ajax({
		url: URL.batchCommit,
		data: commitInfos,
		success: (res) => {
			// 提交即指派
			if (
				res.data &&
				res.data.workflow &&
				(res.data.workflow == 'approveflow' || res.data.workflow == 'workflow')
			) {
				//缓存当前数据
				this.commitInfo = {
					record: record,
					index: index
				};
				this.setState({
					compositedata: res.data,
					compositedisplay: true
				});
				return;
			}

			if (res.success) {
				showBatchOprMessage(null, res.data, {}, getLangByResId(this, '4004PUINVOICE-000071' /*提交 */));
				updateCacheDataForList(props, AREA.list_head, FIELD.pk_invoice, res.data, index);
				btnController.call(this, this.props);
			}
		},
		error: (res) => {
			showErrorInfo(res.message);
		}
	});
}
