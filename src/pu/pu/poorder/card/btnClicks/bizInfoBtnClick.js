/*
 * @Author: gaoxwu 
 * @PageInfo: 内部交易信息 
 * @Date: 2021-06-16 18:39:58 
 * @Last Modified by: gaoxwu
 * @Last Modified time: 2021-06-18 11:33:35
 */
import { URL, PAGECODE } from '../../constance/index';
import { ajax } from 'nc-lightapp-front';

export default function(props) {
	let pk_order = props.form.getFormItemsValue(PAGECODE.cardhead, 'pk_order').value;

	ajax({
		url: URL.transinfo,
		data: pk_order,
		success: (res) => {
			if (res.success) {
				this.setState({ showBusinessModal: true, pk_order: pk_order });
			}
		}
	});
}
