/*
 * @Author: zhaochyu
 * @PageInfo: 司机定义打印
 * @Date: 2020-02-11 10:13:38
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-11-03 15:09:43
 */
import { AREA, URL, HEADFILED } from '../../constance';
import { print, output } from 'nc-lightapp-front';
export default function printBtnClick(props, isOutput = false) {
	let pks = [];
	let ccarrierid = props.form.getFormItemsValue(AREA.card_head, HEADFILED.ccarrierid).value;
	pks.push(ccarrierid);
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
