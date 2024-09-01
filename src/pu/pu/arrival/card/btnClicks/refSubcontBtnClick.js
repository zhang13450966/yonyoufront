/*
 * @Author: zhangshqb 
 * @PageInfo: 参照委外订单拉单
 * @Date: 2018-04-28 10:17:14 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 16:44:55
 */
import { ajax } from 'nc-lightapp-front';
import { URL, COMMON, PAGECODE } from '../../constance';
import { clearTransferCache } from '../../../../../scmpub/scmpub/pub/cache';
import { showErrorDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil.js';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function() {
	let _this = this;
	ajax({
		url: '/nccloud/scmpub/pub/sysinitgroup.do',
		data: [ '4012' ],

		success: (res) => {
			if (res.success) {
				if (res.data['4012']) {
					clearTransferCache(_this.props, COMMON.arrivalRef61CacheKey);
					_this.props.pushTo(URL.transfer61, { type: 'ref61', pagecode: PAGECODE.transferSubcont });
				} else {
					showErrorDialog(null, getLangByResId(_this, '4004ARRIVAL-000014')); /* 国际化处理： 请启用委外模块！*/
				}
			}
		}
	});
}
