/* 
* @Author: lichaoah  
* @PageInfo:年编辑前   
* @Date: 2020-02-27 13:35:12  
 * @Last Modified by: qishy
 * @Last Modified time: 2021-03-22 13:47:15
*/
import { ajax } from 'nc-lightapp-front';
import { TARGET_CARD } from '../../siconst';
export default function isRef(props, moduleId, key) {
	return new Promise(function(resolve, reject) {
		let result = false;
		let status = props.getUrlParam(TARGET_CARD.status);
		//编辑态查看是否被引用
		if (status == TARGET_CARD.edit) {
			ajax({
				url: TARGET_CARD.headBeforeEventUrl,
				data: {
					key: key,
					params: {
						[TARGET_CARD.pk_target]: props.form.getFormItemsValue(TARGET_CARD.formId, TARGET_CARD.pk_target)
							.value,
						[TARGET_CARD.fmaintainflag]: props.form.getFormItemsValue(
							TARGET_CARD.formId,
							TARGET_CARD.fmaintainflag
						).value
					}
				},
				async: false,
				success: (res) => {
					if (res.success && res.data) {
						result = res.data.result;
						resolve(result);
					}
				}
			});
		} else {
			resolve(false);
		}
	});
}
