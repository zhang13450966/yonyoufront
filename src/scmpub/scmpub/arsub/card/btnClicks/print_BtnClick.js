/*
 * @Author: 王龙华 
 * @PageInfo: 卡片下打印按钮 
 * @Date: 2018-06-25 09:21:31 
 * @Last Modified by: songyt13
 * @Last Modified time: 2021-08-16 10:16:12
 */
import { print, ajax } from 'nc-lightapp-front';
import { ARSUB_CONST, ArsubHeadItem } from '../../const';
import poc from 'uap/common/components/printOnClient';
const { printPreview } = poc;

export default function buttonClick(props) {
	let billids = [];
	let carsubid = props.form.getFormItemsValue(ARSUB_CONST.formId, ArsubHeadItem.carsubid).value;
	billids.push(carsubid);
	ajax({
		url: ARSUB_CONST.printdatapermission,
		data: billids,
		success: (res) => {
			if (res.success) {
				let printParams = {
					appcode: props.getAppCode(),
					nodekey: null,
					oids: billids,
					printType: true,
					realData: true,
					controlPrintNum: true
				};
				// 审批场景再传这个参数（transactiontype-交易类型编码， billtype-单据类型，这两个参数每次只能传一个）
				if (ARSUB_CONST.approvesce == props.getUrlParam(ARSUB_CONST.scene)) {
					// 其他情况，需要根据单据类型找维护应用
					printParams.billtype = ARSUB_CONST.billtype;
				}

				/**
				 * appcode 单据的应用编码（一般不用传，方法内部自己抓取，如果需要打印的模板和当前appcode不同，需要业务组自己传一下）
				 * nodekey 模板节点标识
				 * oids 单据主键
				 * printType 传true表示根据打印次数设置走插件打印，传false直接走pdf打印
				 * realData 传true表示打印真数据，传false表示打印假数据
				 * controlPrintNum 加了这个参数前端才会走打印次数查询，默认不走次数查询
				 */
				printPreview(props, ARSUB_CONST.printUrl, printParams);
			}
		}
	});
}
