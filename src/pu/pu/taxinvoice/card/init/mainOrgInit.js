/*
* @Author: chaiwx 
* @PageInfo: 主组织默认值事件
* @Date: 2018-09-18 19:50:54 
 * @Last Modified by: jiangphk
 * @Last Modified time: 2019-03-21 12:25:39
*/
import { BUTTONID, AREA, FIELDS } from '../../constance';
import { headAfterEvents } from '../afterEvents';

export default function(props, context) {
	let pk_org_v = context.pk_org_v;
	let disabledItem = { pk_org_v: false };
	props.form.setFormItemsDisabled(AREA.cardFormId, disabledItem);
	if (pk_org_v) {
		headAfterEvents.call(this, props, AREA.cardFormId, FIELDS.pk_org_v, { value: pk_org_v }, null, {
			values: {
				pk_stockorg: { value: context.pk_org, name: context.org_Name }
			}
		});
	} else {
		props.initMetaByPkorg(FIELDS.pk_org_v);
		props.button.setDisabled({
			[BUTTONID.AddFeeLine]: true,
			[BUTTONID.AddMatLine]: true,
			[BUTTONID.OnhandQuery]: true
		});
	}
}
