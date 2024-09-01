/*
 * @Author: lichaoah 
 * @PageInfo: 表头过滤
 * @Date: 2019-12-18 10:11:21 
 * @Last Modified by: qishy
 * @Last Modified time: 2020-07-18 13:53:04
 */

import { TARGET_CARD, AREA, TARGET_LIST } from '../../siconst';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';
export default function(props, meta) {
	meta[TARGET_CARD.formId].items.map((item) => {
		setPsndocShowLeavePower(item);
		setRefShowDisabledData(item);
		if (item.attrcode === TARGET_CARD.pk_org) {
			item.queryCondition = () => {
				return { TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		}
	});

	meta[TARGET_CARD.target_mar].items.map((item) => {
		item.queryCondition = () => {
			let pk_org = props.form.getFormItemsValue(TARGET_CARD.formId, TARGET_LIST.pk_org).value;
			return {
				pk_org: pk_org
			};
		};
	});
}
