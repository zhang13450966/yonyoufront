/*
 * @Author: zhaochyu 
 * @PageInfo: 司机定义打印
 * @Date: 2020-02-11 10:13:38 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-09-30 10:10:37
 */
import { AREA, URL } from '../../constance';
import { showWarningInfo } from '../../../pub/tool/messageUtil';
import { print, output } from 'nc-lightapp-front';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export function printBtnClick(props, isOutput = false) {
	let checkeddatas = props.editTable.getCheckedRows(AREA.listTable);
	if (checkeddatas.length == 0) {
		showWarningInfo(getLangByResId(this, '4001DRIVER-000006')); /* 国际化处理： 请选择要打印的单据!*/
		return;
	}
	let pks = [];
	checkeddatas.forEach((item) => {
		let pk = item.data.values.cdriverid.value;
		pks.push(pk);
	});
	if (!isOutput) {
		print('pdf', URL.print, {
			oids: pks
		});
	} else {
		output({
			url: URL.print,
			data: {
				oids: pks,
				outputType: 'output'
			}
		});
	}
}
