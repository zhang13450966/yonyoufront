/*
 * @Author: 刘奇 
 * @PageInfo: 打印功能实现
 * @Date: 2019-03-29 14:04:21 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-07-13 17:40:58
 */

import { ajax } from 'nc-lightapp-front';
import { PREPAIDINVOICE_CONST } from '../../const';
import getSelectedOperaDatas from './listPageData';
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function btnClick(props) {
	let seldatas = getSelectedOperaDatas(props);

	if (seldatas == null || seldatas.index == undefined) {
		showErrorInfo(null, getLangByResId(this, '4006PREPAIDINVOICE-000026')); /* 国际化处理： 请选择要打印的订单！*/
		return;
	}
	let pks = [];
	let selrows = props.table.getAllTableData(PREPAIDINVOICE_CONST.formId).rows;

	seldatas.index.forEach((element) => {
		pks.push(selrows[element].values.corderhistoryid.value);
	});

	let pk_org = props.table.getCheckedRows(PREPAIDINVOICE_CONST.formId)[0].data.values.pk_org.value;
	let queryinfo = { pk_org: pk_org };
	ajax({
		url: '/nccloud/so/saleorder/querysplitparam.do',
		data: queryinfo,
		success: (res) => {
			if (res.success) {
				let splitData = {
					appcode: props.getAppCode(),
					params: res.data,
					printType: 'pdf',
					printUrl: '/nccloud/so/saleorderrevise/splitprint.do',
					pks: pks
				};
				this.setState({ showSpilt: true, splitData: splitData });
			}
		}
	});
}
