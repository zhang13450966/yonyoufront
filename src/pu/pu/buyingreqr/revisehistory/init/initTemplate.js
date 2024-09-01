/*
 * @Author: mikey.zhangchqf 初始化模板
 * @Date: 2018-08-27 18:37:23 
 * @Last Modified by:   mikey.zhangchqf 
 * @Last Modified time: 2018-08-27 18:37:23 
 */

import { ajax } from 'nc-lightapp-front';
import { BUYINGREQ_LIST, BUYINGREQ_CARD, BUYINGREQ_LIST_BUTTON, ATTRCODE, ATTRCODES } from '../../siconst';
export default function(props) {
	let querydata = {
		pagecode: BUYINGREQ_LIST.historypageid
	};
	ajax({
		url: BUYINGREQ_CARD.queryTemplet,
		data: querydata,
		success: (res) => {
			let meta = res.data;
			props.meta.setMeta(meta);
		}
	});
}
