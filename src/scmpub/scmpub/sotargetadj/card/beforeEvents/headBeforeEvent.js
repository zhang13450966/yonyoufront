/*
 * @Author: zhangchangqing 
 * @PageInfo:   表头编辑前事件 单据号编辑前事件，这类方法必须有返回值，返回true为可编辑，false为不可编辑
 * @Date: 2018-05-03 14:54:12 
 * @Last Modified by: qishy
 * @Last Modified time: 2021-02-05 11:16:04
 */

import { TARGETADJ_CARD, ATTRCODE } from '../../siconst';
import vbillcodeBeforeEvent from './vbillcodeBeforeEvent';
import marVperBeforeEvent from './marVperBeforeEvent';

import SaleMarUtils from '../../../../refer/SaleMarterial/utls/SaleMarUtls';
export default async function(props, moduleId, key, value, data) {
	let flag = true;
	let meta = this.props.meta.getMeta();
	let status = this.props.getUrlParam(TARGETADJ_CARD.status);
	if (key == ATTRCODE.pk_org) {
		if (status && status == 'edit') {
			return false;
		} else {
			return true;
		}
	} else if (key == ATTRCODE.ctargetid) {
		if (status && status == 'edit') {
			return false;
		} else {
			return true;
		}
	} else if (key == ATTRCODE.vbillcode) {
		flag = await vbillcodeBeforeEvent.call(this, props, moduleId, key, value, data);
	} else if (key == ATTRCODE.cmarsetid || key == ATTRCODE.vperiod) {
		//物料和期间过滤
		meta[TARGETADJ_CARD.headf].items.map((item) => {
			if (item.attrcode == key) {
				item.queryCondition = () => {
					let targetid = this.props.form.getFormItemsValue(TARGETADJ_CARD.headf, ATTRCODE.ctargetid).value;
					return {
						TARGETID: targetid,
						targetid: targetid,
						GridRefActionExt: TARGETADJ_CARD.materialURL
					};
				};
			}
		});
		//物料指标设定方式
		let fmarsetflag = 6;
		fmarsetflag = await marVperBeforeEvent.call(this, props, moduleId, key, value, data);
		this.ctargetvalue = {
			values: {
				fmarsetflag: {
					value: fmarsetflag
				}
			}
		};

		props.meta.setMeta(meta);
		SaleMarUtils(this.props, this.ctargetvalue, TARGETADJ_CARD.headf, 'cmarsetid');
	} else if (ATTRCODE.otherfields.includes(key)) {
	}

	return flag;
}
