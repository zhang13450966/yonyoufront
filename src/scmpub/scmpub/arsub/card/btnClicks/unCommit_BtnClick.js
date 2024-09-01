/*
 * @Author: liulux
 * @PageInfo: 卡片整单关闭按钮  
 * @Date: 2021-9-04 23:23:17 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-09-19 16:02:47
 */
import { ajax } from 'nc-lightapp-front';
import { getPkTsDataIncludeBodyInCard } from '../../../pub/tool/operateDataUtil';
import { batchOperateUtils } from '../../utils';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';
import { ARSUB_CONST } from '../../const';
import { showResumeModal } from 'scmpub/scmpub/components/ResumeModal';

export default function unCommitBtnClick(props, skipCodes) {
	//获取卡片页表头表体pk-ts关系
	let data = getPkTsDataIncludeBodyInCard.call(this, props, {});
	skipCodes = skipCodes ? skipCodes : new Array();
	data['skipCodes'] = skipCodes;

	ajax({
		url: ARSUB_CONST.carduncommitUrl,
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
						'MessageDlg',
						skipCodes,
						res.data,
						unCommitBtnClick.bind(this, props, skipCodes)
					);
					return;
				} else {
					batchOperateUtils.singleOp.call(this, props, res, {
						messageTitle: getLangByResId(this, '4006ARSUB-000013')
					}); /* 国际化处理： 收回成功！*/
				}
			}
		}
	});
}
