/*
 * @Author: mikey.zhangchqf 
 * @Date: 2018-07-04 15:06:44 
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-05-11 16:56:43
 */

import { toast } from 'nc-lightapp-front';
import { AREA, URL } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import poc from 'uap/common/components/printOnClient';
const { printPreview } = poc;

export default function buttonClick(props) {
	// 获取选中行

	let seldatas = props.table.getCheckedRows(AREA.head);
	// 如果没有选中行，则提示并返回，不进行任何操作
	if (seldatas.length <= 0) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4004planconfirm-000031') /* 国际化处理： 请选择要打印的进度确认单！*/
		});
		return;
	}
	let pks = [];
	seldatas.map((item) => {
		pks.push(item.data.values.pk_planconfirm.value);
	});

	printPreview(props, URL.print, {
		appcode: props.getAppCode(),
		nodekey: '400401400',
		oids: pks,
		printType: true,
		realData: true,
		controlPrintNum: false,
		billtype: '2C'
	});
}
