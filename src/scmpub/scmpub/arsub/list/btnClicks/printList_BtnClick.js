/*
 * @Author: zhengylr 
 * @PageInfo: 打印清单按钮  
 * @Date: 2021-12-28 09:36:26
 */

import { print, ajax } from 'nc-lightapp-front';
import { ARSUB_CONST, ArsubHeadItem } from '../../const';
import getSelectedOperaDatas from './listPageData';
import { showErrorInfo } from '../../../pub/tool/messageUtil';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';
import poc from 'uap/common/components/printOnClient';
const { printPreview } = poc;

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
				/**
				 * appcode 单据的应用编码（一般不用传，方法内部自己抓取，如果需要打印的模板和当前appcode不同，需要业务组自己传一下）
				 * nodekey 模板节点标识
				 * oids 单据主键
				 * printType 传true表示根据打印次数设置走插件打印，传false直接走pdf打印
				 * realData 传true表示打印真数据，传false表示打印假数据
				 * controlPrintNum 加了这个参数前端才会走打印次数查询，默认不走次数查询
				 */
				printPreview(props, ARSUB_CONST.printUrl, {
					appcode: props.getAppCode(),
					nodekey: 'listing_print',
					oids: pks,
					printType: true,
					realData: true,
					controlPrintNum: true
				});
			}
		}
	});
}
