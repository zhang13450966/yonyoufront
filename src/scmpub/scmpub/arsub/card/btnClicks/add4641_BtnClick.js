/*
 * @Author: 刘奇 
 * @PageInfo: 新增按钮-客户费用申请单点击事件
 * @Date: 2019-03-05 14:55:07 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-09-08 13:56:03
 */

import { ajax } from 'nc-lightapp-front';
import { ARSUB_CONST } from '../../const';
import { showErrorDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil.js';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { REF4641_CONST } from '../../ref4641/const';
import { clearTransferCache } from '../../../../../scmpub/scmpub/pub/cache';
export default function add4641_BtnClick(props) {
	ajax({
		url: '/nccloud/scmpub/pub/sysinitgroup.do',
		data: [ '4038' ],
		success: (res) => {
			if (res.success) {
				if (res.data['4038']) {
					clearTransferCache(props, REF4641_CONST.dataSource);
					props.pushTo(ARSUB_CONST.Ref4641_URL, { pagecode: REF4641_CONST.transPageId });
				} else {
					showErrorDialog(null, getLangByResId(this, '4006ARSUB-000036')); /* 国际化处理： 请启用相应模块！*/
				}
			}
		}
	});
}
