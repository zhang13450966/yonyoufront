/*
 * @Author: jiangfw
 * @PageInfo: 单据号编辑前事件，这类方法必须有返回值，返回true为可编辑，false为不可编辑
 * @Date: 2018-07-23 14:17:10 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2018-07-28 17:17:00
 */
import { ajax, toast } from 'nc-lightapp-front';
import { URL, FIELD, BILLTYPE, AREA } from '../../constance';
export default async function(props) {
	let constance = {
		key: FIELD.vbillcode,
		formareaid: AREA.form,
		pk_org_key: FIELD.pk_org,
		billtype: BILLTYPE.arrival
	};
	// let flag = await canEditAble(props, constance);
	return await canEditAble(props, constance);
}

function canEditAble(props, constance) {
	return new Promise(function(resolve, reject) {
		let { key, formareaid, pk_org_key, billtype } = constance;
		let pk_org = props.form.getFormItemsValue(formareaid, pk_org_key);
		if (!pk_org || !pk_org.value) {
			resolve(false);
		} else {
			let data = {
				key: key,
				params: {
					pk_org: pk_org.value,
					billtype: billtype
				}
			};
			ajax({
				url: URL.beforeEditHead,
				data: data,
				success: (res) => {
					if (res.data) {
						let isedit = res.data.isedit;
						if (isedit) {
							resolve(isedit);
						} else if (res.data.message) {
							toast({
								color: 'warning',
								content: res.data.message
							});
						}
						resolve(false);
					}
				},
				error: (error) => {
					toast({
						color: 'warning',
						content: error.message
					});
					resolve(false);
				}
			});
		}
	});
}
