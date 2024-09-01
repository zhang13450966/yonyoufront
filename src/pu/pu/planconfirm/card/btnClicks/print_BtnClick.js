/*
 * @Author: mikey.zhangchqf 
 * @Date: 2018-07-04 15:06:44 
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-05-11 16:51:12
 */

import { AREA, FIELD, URL } from '../../constance';
import getParentURlParme from './getParentURlParme';
import poc from 'uap/common/components/printOnClient';
const { printPreview } = poc;
export default function buttonClick(props) {
	// 获取选中行

	let pk = props.form.getFormItemsValue(AREA.head, FIELD.hid).value;
	let pks = [];
	pks.push(pk);
	let parentURL = getParentURlParme(AREA.pageMsgType);
	let nodekey = '400401400';
	if (parentURL) {
		nodekey = '400401404';
	}
	// 组装上送参数（这组参数和之前打印上送的参数是一样的，拿出来是为了添加审批中心时需要添加的属性）
	let printParams = {
		appcode: props.getAppCode(),
		nodekey: nodekey,
		oids: pks,
		printType: true,
		realData: true,
		controlPrintNum: false,
		billtype: '2C'
	};

	/**
	 * appcode 单据的应用编码（一般不用传，方法内部自己抓取，如果需要打印的模板和当前appcode不同，需要业务组自己传一下）
	 * nodekey 模板节点标识
	 * oids 单据主键
	 * printType 传true表示根据打印次数设置走插件打印，传false直接走pdf打印
	 * realData 传true表示打印真数据，传false表示打印假数据
	 * controlPrintNum 加了这个参数前端才会走打印次数查询，默认不走次数查询
	 * transactiontype 交易类型编码
	 * billtype 单据类型
	 */
	printPreview(props, URL.print, printParams);
}
