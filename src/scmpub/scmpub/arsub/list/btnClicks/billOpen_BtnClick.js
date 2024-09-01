/*
 * @Author: 刘奇 
 * @PageInfo: 列表整单关闭按钮  
 * @Date: 2019-03-13 15:57:17 
 * @Last Modified by: huoyzh
 * @Last Modified time: 2020-03-20 18:21:48
 */

import { ajax } from 'nc-lightapp-front';
import { ARSUB_CONST, ArsubHeadItem } from '../../const';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';
import getSelectedOperaDatas from './listPageData';
import { showBatchOprMessage, showErrorInfo, showSuccessInfo } from '../../../pub/tool/messageUtil';
import { buttonControl } from '../viewController/buttonController';
import { updateCacheDataForList } from '../../../pub/cache';

export default function billOpen_BtnClick(props) {
	let seldatas = getSelectedOperaDatas(props);
	if (seldatas == null || seldatas.index == undefined) {
		showErrorInfo(null, getLangByResId(this, '4006ARSUB-000018')); /* 国际化处理： 请选择要操作的单据！*/
		return;
	}
	ajax({
		url: ARSUB_CONST.listbillopenUrl,
		data: { pks: seldatas.pks, pageid: ARSUB_CONST.listPageId },
		success: (res) => {
			let { success, data } = res;
			if (success) {
				showBatchOprMessage(
					null,
					res.data,
					{},
					getLangByResId(this, '4006ARSUB-000024')
				); /* 国际化处理： 提示,整单关闭成功！*/
				updateCacheDataForList(props, ARSUB_CONST.formId, ArsubHeadItem.carsubid, res.data);
				buttonControl.call(this, this.props);
			}
		}
	});
}
