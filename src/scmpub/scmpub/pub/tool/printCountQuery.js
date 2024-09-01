/*
 * @Author: yinliangc 
 * @PageInfo: 打印次数查询
 * @Date: 2020-08-21 18:27:27 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-12-23 11:22:01
 */

import printNfig from 'uap/common/components/printlimitModal';
import { showCheckDataWarningInfo } from '../../../../scmpub/scmpub/pub/tool/messageUtil';

/**
  * 打印次数查询
  * @param {*} props 
  * @param {type, CONST, modal} printParas 参数，包含3个属性，table, CONST, modal
  * type:标识类型(1-simpleTable,2-form)，目前table只支持simpleTalbe，如果有其他需求，可以增加取数逻辑
  * CONST:常量，结构{area:'区域编码',hid:'表头主键字段名称'}
  * modal:适配打印次数查询模态框的modalID，一般是'code-config'
  * 
  * printParas参数例子：{type:1,CONST:{area:'head',hid:'cgeneralhid'},modal:'code-config'}
  */
export default function(props, printParas = { type, CONST, modal }) {
	/******************** 1、组装数据 ********************/
	let { type, CONST, modal } = printParas;
	let billids = [];
	if (type == 1) {
		// 组装列表界面(simpleTable)的打印次数查询数据
		let checkdatas = props.table.getCheckedRows(CONST.area);
		if (checkdatas && checkdatas.length > 0) {
			checkdatas.forEach((item) => {
				billids.push(item.data.values[CONST.hid].value);
			});
		}
	} else if (type == 2) {
		// 组装卡片界面(form)的打印次数查询数据
		let id = props.form.getFormItemsValue(CONST.area, CONST.hid).value;
		billids.push(id);
	}

	/******************** 2、容错提示 ********************/
	if (!billids || billids.length <= 0) {
		showCheckDataWarningInfo.call(this); // 提示选择数据
		return;
	}

	/******************** 3、执行打印次数查询 ********************/
	let params = { billids, modalName: modal };
	printNfig(props, params);
}
