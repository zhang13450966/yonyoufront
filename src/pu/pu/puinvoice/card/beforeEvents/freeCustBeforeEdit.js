/*
 * @Author: jiangfw 
 * @PageInfo: 散户编辑前
 * @Date: 2018-06-12 21:02:31 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2018-08-29 16:38:34
 */
import { FIELD, URL } from '../../constance';
import { ajax } from 'nc-lightapp-front';

// export default async function beforeEdit(props, areaIds, item) {
// let headArea = areaIds.headArea;
// let pk_supplier_item = props.form.getFormItemsValue(headArea, FIELD.pk_supplier);
// if (!(pk_supplier_item && null != pk_supplier_item.value)) {
// 	//供应商为空，散户不可编辑
// 	props.form.setFormItemsDisabled(headArea, { [FIELD.pk_freecust]: false });
// } else {
// 	//是否散户
// 	let flag = await isFreeCust(pk_supplier_item);
// 	//为散户，可编辑，不为散户，不可编辑
// 	props.form.setFormItemsDisabled(headArea, { [FIELD.pk_freecust]: flag });
// 	// 根据供应商过滤
// 	item.queryCondition = () => {
// 		return { pk_supplier: pk_supplier_item.value };
// 	};
// }
// }
export default async function isFreeCust(pk_supplier) {
	return new Promise(function(resolve) {
		let data = {
			key: FIELD.pk_freecust,
			params: {
				pk_supplier: pk_supplier
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
	});
}
