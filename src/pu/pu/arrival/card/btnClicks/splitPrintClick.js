/*
 * @Author: zhangshqb 
 * @PageInfo: 分单打印  
 * @Date: 2018-04-28 10:17:14 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-07-06 14:18:25
 */
import { AREA, FIELD } from '../../constance';
import { ajax } from 'nc-lightapp-front';

export default function(props) {
	let pk_org = props.form.getFormItemsValue(AREA.form, FIELD.pk_org).value;
	let data = {
		pk_org: pk_org
	};
	let id = props.form.getFormItemsValue(AREA.form, FIELD.pk_arriveorder).value;
	ajax({
		url: '/nccloud/pu/arrival/querysplitparam.do',
		data: data,
		method: 'post',
		success: (res) => {
			if (res.success) {
				let splitData = {
					appcode: this.props.getAppCode(),
					params: res.data,
					printType: 'pdf',
					printUrl: '/nccloud/pu/arrival/splitprint.do',
					pks: [ id ]
				};
				this.setState({ showSpilt: true, splitData: splitData });
			}
		}
	});
}
