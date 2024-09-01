/*
 * @Author: hufeim 
 * @Description: 采购里程碑进度看板
 * @Date: 2022-01-12 10:28:38 
 * @Last Modified by: hufeim
 * @Last Modified time: 2022-01-19 11:33:05
 */

import { PAGECODE, AREA } from '../../constance';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';

export default function(props) {
	let callback = (data) => {
		if (data) {
			if (data.template) {
				let meta = data.template;
				modifierMeta.call(this, props, meta);
				props.meta.setMeta(meta);
			}
			this.forceUpdate();
		}
	};
	props.createUIDom({ pagecode: PAGECODE }, callback);
}

function modifierMeta(props, meta) {
	let getFirstValueOfRefer = (attrcode) => {
		let fieldValue = (props.search.getSearchValByField(AREA.searchArea, attrcode) || {}).value;
		if (fieldValue && fieldValue.firstvalue) {
			return fieldValue.firstvalue.includes(',') ? null : fieldValue.firstvalue;
		} else {
			return null;
		}
	};
	meta[AREA.searchArea] &&
		meta[AREA.searchArea].items.forEach((item) => {
			setRefShowDisabledData(item);
			setPsndocShowLeavePower(item);
			switch (item.attrcode) {
				case 'pk_org': // 采购组织
					item.queryCondition = () => {
						return {
							GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter'
						};
					};
					break;
				case 'pk_dept': // 采购部门
					item.isShowUnit = true;
					item.queryCondition = () => {
						return {
							pk_org: getFirstValueOfRefer('pk_org'),
							busifuncode: 'pu'
						};
					};
					break;
				case 'cemployeeid': // 采购员
					item.isShowUnit = true;
					item.queryCondition = () => {
						return {
							pk_org: getFirstValueOfRefer('pk_org'),
							pk_dept: getFirstValueOfRefer('pk_dept'),
							busifuncode: 'pu'
						};
					};
					break;
				case 'vordertrantype': // 订单类型
					item.queryCondition = () => {
						return {
							parentbilltype: '21',
							SCM_CONSIDERBUSITYPE: 'Y',
							SCM_BUSIORG: getFirstValueOfRefer('pk_org')
						};
					};
					break;
				default:
					if (item.itemtype == 'refer') {
						item.isShowUnit = true;
						item.queryCondition = () => {
							return {
								pk_org: getFirstValueOfRefer('pk_org'),
								busifuncode: 'pu'
							};
						};
					}
					break;
			}
		});
}
