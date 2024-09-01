/*
 * @Author: yinliangc 
 * @PageInfo: 付款计划，起算依据-feffdatetype，比率-nrate，金额-norigmny编辑前
 * @Date: 2021-12-22 14:14:03 
 * @Last Modified by: guoylei
 * @Last Modified time: 2022-03-18 14:19:44
 */
import { ajax } from 'nc-lightapp-front';
import { URL } from '../../constance';
/**
 * 起算依据、比率、金额，如果付款计划子表累计付款金额有值，或者孙表累计应付金额有值，则不允许编辑
 * @param {*} params 参数是一个对象，其中包括表头主键，编辑字段名称 
 */
export default function effRateMnyBeforeEvent(params) {
	return new Promise(function(resolve, reject) {
		let { hid, key, pk_order } = params;
		//let data = { key, hid };
		let data = {
			key: key,
			params: {
				hid: hid,
				pk_order: pk_order
			}
		};
		ajax({
			url: URL.beforeEvent,
			data: data,
			async: false,
			success: (res) => {
				let editFlag = res.data.isedit;
				if (editFlag) {
					resolve(editFlag);
				} else {
					resolve(false);
				}
			}
		});
	});
}
