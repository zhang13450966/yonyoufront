/*
 * @Author: 刘奇 
 * @PageInfo: 输出按钮  
 * @Date: 2019-03-15 09:35:58 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-05-31 11:33:14
 */

import { output, ajax } from 'nc-lightapp-front';
import { PREPAIDINVOICE_CONST, PrepaidinvoiceHeadItem } from '../../const';
import getSelectedOperaDatas from './listPageData';
import { showErrorInfo } from '../../../pub/tool/messageUtil';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';

export default function buttonClick(props) {
	let seldatas = getSelectedOperaDatas(props);

	if (seldatas == null || seldatas.index == undefined) {
		showErrorInfo(null, getLangByResId(this, '4006PREPAIDINVOICE-000018')); /* 国际化处理： 请选择要操作的单据！*/
		return;
	}
	let pks = [];
	let selrows = props.table.getAllTableData(PREPAIDINVOICE_CONST.formId).rows;

	seldatas.index.forEach((element) => {
		pks.push(selrows[element].values[PrepaidinvoiceHeadItem.hid].value);
	});
	ajax({
		url: PREPAIDINVOICE_CONST.printdatapermission,
		data: pks,
		success: (res) => {
			if (res.success) {
				output({
					url: PREPAIDINVOICE_CONST.printUrl,
					data: { oids: pks, outputType: PREPAIDINVOICE_CONST.output }
				});
			}
		}
	});
}
