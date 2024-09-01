/*
 * @Author: liulux
 * @PageInfo: 卡片整单关闭按钮  
 * @Date: 2021-9-04 23:23:17 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-09-06 10:41:03
 */
import { ajax } from 'nc-lightapp-front';
import { ARSUB_CONST, ArsubHeadItem, ArsubBodyItem } from '../../const';
import { showResumeModal } from 'scmpub/scmpub/components/ResumeModal';
import { batchOperateUtils } from '../../utils';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';
import { getPkTsDataIncludeBodyInCard } from '../../../pub/tool/operateDataUtil';

export default function billOpenBtnClick(props, skipCodes) {
	//获取卡片页表头表体pk-ts关系
	let data = getPkTsDataIncludeBodyInCard.call(this, props, {});
	skipCodes = skipCodes ? skipCodes : new Array();
	data['skipCodes'] = skipCodes;

	ajax({
		url: ARSUB_CONST.cardbillopenUrl,
		data: data,
		success: (res) => {
			if (res.success && res.data) {
				// 交互式异常处理
				if (res.data.isResume && res.data.isResume == true) {
					if (res.data.url) {
						res.data.url = '../../../../' + res.data.url;
					}
					showResumeModal.bind(this)(
						props,
						'ResumeMessageDlg',
						skipCodes,
						res.data,
						billOpenBtnClick.bind(this, props, skipCodes)
					);
					return;
				} else {
					batchOperateUtils.singleOp.call(this, props, res, {
						messageTitle: getLangByResId(this, '4006ARSUB-000020')
					});
				} /* 国际化处理： 打开成功*/
			}
		}
	});
}
