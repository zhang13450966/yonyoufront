/*
 * @Author: 王龙华 
 * @PageInfo: 卡片下打印按钮 
 * @Date: 2018-06-25 09:21:31 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-05-21 17:23:46
 */
import { ajax } from 'nc-lightapp-front';
import { PREPAIDINVOICE_CONST, PrepaidinvoiceHeadItem } from '../../const';
import poc from 'uap/common/components/printOnClient';
const { printPreview } = poc;

export default function buttonClick(props) {
	let billids = [];
	let hid = props.form.getFormItemsValue(PREPAIDINVOICE_CONST.formId, PrepaidinvoiceHeadItem.hid).value;
	billids.push(hid);
	ajax({
		url: PREPAIDINVOICE_CONST.printdatapermission,
		data: billids,
		success: (res) => {
			if (res.success) {
				/**
				 * appcode 单据的应用编码（一般不用传，方法内部自己抓取，如果需要打印的模板和当前appcode不同，需要业务组自己传一下）
				 * nodekey 模板节点标识
				 * oids 单据主键
				 * printType 传true表示根据打印次数设置走插件打印，传false直接走pdf打印
				 * realData 传true表示打印真数据，传false表示打印假数据
				 * controlPrintNum 加了这个参数前端才会走打印次数查询，默认不走次数查询
				 */
				printPreview(props, PREPAIDINVOICE_CONST.printUrl, {
					appcode: props.getAppCode(),
					nodekey: null,
					oids: billids,
					printType: true,
					realData: true,
					controlPrintNum: true
				});
			}
		}
	});
}
