/*
 * @Author: 刘奇 
 * @PageInfo: 新增按钮-返利结算单点击事件
 * @Date: 2019-03-05 14:55:07 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-09-08 13:55:07
 */

import { ajax } from 'nc-lightapp-front';
import { ARSUB_CONST } from '../../const';
import { showErrorDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil.js';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { REF4621_CONST } from '../../ref4621/const';
import { clearTransferCache } from '../../../../../scmpub/scmpub/pub/cache';

export default function add4621_BtnClick(props) {
	ajax({
		url: '/nccloud/scmpub/pub/sysinitgroup.do',
		data: [ '4036' ],
		success: (res) => {
			if (res.success) {
				if (res.data['4036']) {
					clearTransferCache(props, REF4621_CONST.dataSource);
					props.pushTo(ARSUB_CONST.Ref4621_URL, { pagecode: REF4621_CONST.transPageId });
				} else {
					showErrorDialog(null, getLangByResId(this, '4006ARSUB-000036')); /* 国际化处理： 请启用相应模块！*/
				}
			}
		}
	});
}
