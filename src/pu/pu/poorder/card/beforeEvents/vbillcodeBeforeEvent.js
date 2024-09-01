/*
 * @Author: CongKe 
 * @PageInfo: 单据号编辑前事件，这类方法必须有返回值，返回true为可编辑，false为不可编辑
 * @Date: 2018-07-25 10:03:14 
 * @Last Modified by: CongKe
 * @Last Modified time: 2018-08-02 19:01:35
 */
import { ajax, toast } from 'nc-lightapp-front';
import { URL } from '../../constance';
import { duration } from 'moment';

export default function(props, constance) {
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
				url: URL.headbeforeedit,
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
