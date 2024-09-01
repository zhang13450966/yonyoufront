import { ARSUB_CONST } from '../../const';
import { head_afterEvent } from '../events';

export default function(props, context) {
	/**
	 * 处理新增操作后的获取默认主组织
	 */
	let pk_org_v = (context || {}).pk_org_v;
	let pk_org_v_name = context.org_v_Name;
	if (pk_org_v) {
		props.form.setFormItemsValue(ARSUB_CONST.formId, {
			pk_org_v: { value: context.pk_org_v, display: context.org_v_Name }
		});
		props.form.setFormItemsValue(ARSUB_CONST.formId, {
			pk_org: { value: context.pk_org, display: context.org_Name }
		});

		head_afterEvent.call(this, props, ARSUB_CONST.formId, 'pk_org_v', { value: pk_org_v, display: pk_org_v_name });
	} else {
		props.initMetaByPkorg();
		let disabledItem = { pk_org_v: false };
		props.form.setFormItemsDisabled(ARSUB_CONST.formId, disabledItem);
	}
}
