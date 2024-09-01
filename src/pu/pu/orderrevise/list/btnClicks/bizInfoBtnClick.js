/*
 * @Author: gaoxwu 
 * @PageInfo: 内部交易信息 
 * @Date: 2021-06-16 18:39:58 
 * @Last Modified by: gaoxwu
 * @Last Modified time: 2021-07-21 16:24:44
 */
import { ajax } from 'nc-lightapp-front';
import { URL, PAGECODE } from '../../constance/index';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function(props) {
	let seldatas = props.table.getCheckedRows(PAGECODE.list_head);
	//seldatas = seldatas.map((item) => item.data);
	if (seldatas.length == 0) {
		showErrorInfo(null, getLangByResId(this, '4004ORDERREVISE-000006')); /* 国际化处理： 请选择数据！*/
		return;
	}
	let pk_order = seldatas[0].data.values.pk_order.value;
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
