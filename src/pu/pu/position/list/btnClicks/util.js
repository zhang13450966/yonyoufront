/*
 * @Author: wangceb
 * @PageInfo: 工具类
 * @Date: 2019-03-11 16:49:52
 * @Last Modified by: wangceb
 * @Last Modified time: 2019-03-14 16:27:55
 */
import { ajax, getBusinessInfo } from 'nc-lightapp-front';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export function getHeadDefaultValue() {
	let businessInfo = getBusinessInfo();
	let pk_group = { display: businessInfo.groupName, value: businessInfo.groupId };
	let pk_org = { display: this.mainorgvalue.refname, value: this.mainorgvalue.refpk };
	//1代表采购岗，0 代表计划岗
	let fpositiontype = this.nodecode === '40010520' ? { value: '1', display: '1' } : { value: '0', display: '0' };
	return { pk_group: pk_group, pk_org: pk_org, fpositiontype: fpositiontype };
}

export function getBodyDefaultValue() {
	let pk_org = { display: this.mainorgvalue.refname, value: this.mainorgvalue.refpk };
	let fflag = {
		value: '1',
		display: getLangByResId(this, '4004POSITION-000000')
	};
	return { pk_org: pk_org, fflag: fflag };
}
