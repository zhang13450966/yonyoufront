/*
 * @Author: lichaoah 
 * @PageInfo: 表体过滤
 * @Date: 2019-12-04 15:39:22 
 * @Last Modified by: wanguoyu
 * @Last Modified time: 2020-07-29 15:15:05
 */

import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';
import { TARGET_CARD } from '../../siconst';
import { high } from 'nc-lightapp-front';

const { Refer } = high;
let { ReferLoader } = Refer;

export default function(props, meta) {
	//组织范围过滤
	meta[TARGET_CARD.target_org].items.map((item) => {
		setPsndocShowLeavePower(item);
		setRefShowDisabledData(item);
		if (item.attrcode == TARGET_CARD.csaleorgid) {
			item.queryCondition = () => {
				// let pk_org = (props.form.getFormItemsValue(TARGET_CARD.formId, TARGET_CARD.pk_org) || {}).value;
				return {
					TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter'
				};
			};
		}
	});
	//设置物料基本分类和物料多选

	// meta[TARGET_CARD.target_mar].items.find(
	// 	(item) => item.attrcode == TARGET_CARD.cmarbaseclassid
	// ).isMultiSelectedEnabled = true;
	// meta[TARGET_CARD.target_mar].items.find(
	// 	(item) => item.attrcode == TARGET_CARD.cmaterialid
	// ).isMultiSelectedEnabled = true;

	//物料范围过滤
	meta[TARGET_CARD.target_mar].items.map((item) => {
		setPsndocShowLeavePower(item);
		setRefShowDisabledData(item);
		if (item.attrcode == TARGET_CARD.cmarcombineid) {
			// 物料组合
			item.renderStatus = TARGET_CARD.browse;
			item.render = (a, row, index) => {
				let value = row.values.cmarcombineid;
				return (
					<ReferLoader
						refValue={value.value}
						refcode={'sr/refer/marcombine/marcombineRef/index'}
						clickContainer={<div> {value.display}</div>}
						isBrowse="true"
					/>
				);
			};
		} else if (item.attrcode == TARGET_CARD.crmvmarcomid) {
			// 排除物料组合
			item.renderStatus = TARGET_CARD.browse;
			item.render = (a, row, index) => {
				let value = row.values.crmvmarcomid;
				return (
					<ReferLoader
						refValue={value.value}
						refcode={'sr/refer/marcombine/marcombineRef/index'}
						clickContainer={<div> {value.display}</div>}
						isBrowse="true"
					/>
				);
			};
		}
		item.queryCondition = () => {
			let pk_org = (props.form.getFormItemsValue(TARGET_CARD.formId, TARGET_CARD.pk_org) || {}).value;
			return {
				pk_org: pk_org
			};
		};
	});
	//指标项过滤
	meta[TARGET_CARD.target_item].items.map((item) => {
		setPsndocShowLeavePower(item);
		setRefShowDisabledData(item);
	});
}
