/*
 * @Author: xiahui 
 * @PageInfo: 确认匹配结果
 * @Date: 2019-05-20 09:47:38 
 * @Last Modified by: xiahui
 * @Last Modified time: 2019-07-27 15:57:57
 */
import { ajax } from 'nc-lightapp-front';
import { URL } from '../../constance';
import { showSuccessInfo, showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getEntireCheckedMatchedData } from '../utils/matchUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import matchedSearch from './matchedSearch';

export default function(props) {
	let { matchedPks } = getEntireCheckedMatchedData(props);
	if (!matchedPks || matchedPks == 0) {
		showWarningInfo(getLangByResId(this, '4004MATCH-000000')); /* 国际化处理： 所选发票数据没有选全！*/
		return;
	}

	ajax({
		url: URL.confirm,
		data: matchedPks,
		success: (res) => {
			if (res.success && res.data) {
				showSuccessInfo(getLangByResId(this, '4004MATCH-000001')); /* 国际化处理： 确认匹配结果成功*/
				matchedSearch.call(this, props);
			}
		}
	});
}
