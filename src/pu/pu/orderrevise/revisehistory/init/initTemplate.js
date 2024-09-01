/*
 * @Author: mikey.zhangchqf 
 * @Date: 2018-08-27 13:58:43 
 * @Last Modified by:   mikey.zhangchqf 
 * @Last Modified time: 2018-08-27 13:58:43 
 */

import { ajax } from 'nc-lightapp-front';
import { URL, PAGECODE, FIELD, LIST_BUTTON, STATUS, OrderReviseCache } from '../../constance';
export default function(props) {
	let querydata = {
		pagecode: PAGECODE.historycode
	};
	ajax({
		url: URL.queryPage,
		data: querydata,
		success: (res) => {
			let meta = res.data;
			props.meta.setMeta(meta);
		}
	});
}
