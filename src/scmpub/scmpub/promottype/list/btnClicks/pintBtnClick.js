import { print, output } from 'nc-lightapp-front';
import { AREA, URL, FIELD } from '../constance/index';
/**
 * @param {*} props 
 * @param {*} isOutput 是否是输出
 */
export default function(props, isOutput = false) {
	let checkeddatas = props.editTable.getCheckedRows(AREA.tableArea);
	let pks = [];
	checkeddatas.forEach((row) => {
		let pk = row.data.values[FIELD.pk_promottype].value;
		pks.push(pk);
	});
	if (!isOutput) {
		print(
			'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
			URL.print,
			{
				oids: pks
			}
		);
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
