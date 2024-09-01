/*
 * @Author: 刘奇 
 * @PageInfo: 输出按钮  
 * @Date: 2019-03-15 09:35:58 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-06-12 14:58:50
 */

import { output, ajax } from 'nc-lightapp-front';
import { ARSUB_CONST, ArsubHeadItem } from '../../const';
import getSelectedOperaDatas from './listPageData';
import { showErrorInfo } from '../../../pub/tool/messageUtil';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';

export default function buttonClick(props) {
	let seldatas = getSelectedOperaDatas(props);

	if (seldatas == null || seldatas.index == undefined) {
		showErrorInfo(null, getLangByResId(this, '4006ARSUB-000018')); /* 国际化处理： 请选择要操作的单据！*/
		return;
	}
	let pks = [];
	let selrows = props.table.getAllTableData(ARSUB_CONST.formId).rows;

	seldatas.index.forEach((element) => {
		pks.push(selrows[element].values[ArsubHeadItem.carsubid].value);
	});
	ajax({
		url: ARSUB_CONST.printdatapermission,
		data: pks,
		success: (res) => {
			if (res.success) {
				output({
					url: ARSUB_CONST.printUrl,
					data: { oids: pks, outputType: ARSUB_CONST.output }
				});
			}
		}
	});
}
