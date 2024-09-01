/*
 * @Author: zhangflr 
 * @Date: 2020-09-09 15:00:07 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-10-22 13:34:50
 */
import { FILED } from '../../constance';
export default function(props, moduleId, key, index, value, record) {
	if (key.attrcode == 'cdeptid_v') {
		//按组织过滤
		setQueryCondition.call(this, props, moduleId, key.attrcode);
		setShowUnit.call(this, props, moduleId, key.attrcode);
	} else if (key.attrcode == 'cvehicletypeid') {
		setQueryCondition.call(this, props, moduleId, key.attrcode);
	} else if (key.attrcode == 'ccarrierid') {
		let fattributeflag = record.values.fattributeflag;
		if (fattributeflag.value == '' || fattributeflag.value == 2 || fattributeflag.value == 3) {
			setQueryCondition.call(this, props, moduleId, key.attrcode);
		} else {
			return false;
		}
	} else if (key.attrcode == 'bsealflag') {
		return false;
	}
	return true;
}

function setQueryCondition(props, moduleId, code) {
	let meta = props.meta.getMeta();
	let item = meta[moduleId].items.find((item) => item.attrcode == code);
	item.queryCondition = () => {
		return {
			pk_org: this.state.pk_org,
			busifuncode: 'tr' //物流业务场景
		};
	};
	props.meta.setMeta(meta);
}

function setShowUnit(props, moduleId, code) {
	let type = props.getUrlParam(FILED.type);
	if (type == 1) {
		let meta = props.meta.getMeta();
		let item = meta[moduleId].items.find((item) => item.attrcode == code);
		item.isShowUnit = true;
		props.meta.setMeta(meta);
	}
}
