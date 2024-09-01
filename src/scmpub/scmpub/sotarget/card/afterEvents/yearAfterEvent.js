/* 
* @Author: lichaoah  
* @PageInfo:年度编辑后   
* @Date: 2020-02-18 17:05:58  
 * @Last Modified by: wanguoyu
 * @Last Modified time: 2020-07-31 13:45:27
*/
import { ajax } from 'nc-lightapp-front';
import { createExtBillHeadAfterEventData } from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';
import { processExtBillCardHeadEditResult } from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';

import { TARGET_CARD } from '../../siconst';

export default function (props, moduleId, key, value, oldValue) {
	//若组织为空，取消点击后事件
	let pk_org = props.form.getFormItemsValue(TARGET_CARD.formId, TARGET_CARD.pk_org);
	if (!pk_org || value.value == undefined) {
		return;
	}
	let cardData = createExtBillHeadAfterEventData(
		props,
		TARGET_CARD.cardpageid,
		TARGET_CARD.formId,
		[
			TARGET_CARD.target_org,
			TARGET_CARD.target_mar,
			TARGET_CARD.target_period,
			TARGET_CARD.target_item,
			TARGET_CARD.target_ratio
		],
		moduleId,
		key,
		value
	);
	ajax({
		url: TARGET_CARD.headAfterEventUrl,
		data: cardData,
		success: (res) => {
			processExtBillCardHeadEditResult(
				props,
				moduleId,
				[
					TARGET_CARD.target_org,
					TARGET_CARD.target_period,
					TARGET_CARD.target_mar,
					TARGET_CARD.target_item,
					TARGET_CARD.target_ratio
				],
				res.data
			);
		}
	});
}
