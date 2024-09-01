/*
 * @Author: 刘奇 
 * @PageInfo: 生成红字应收  
 * @Date: 2019-04-15 16:31:13 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-05-07 10:56:14
 */

import { ARSUB_CONST, ArsubHeadItem } from '../../const';
import { ajax, cacheTools } from 'nc-lightapp-front';
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil.js';
import getSelectedOperaDatas from './listPageData';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function buttonClick(props) {
	let seldatas = getSelectedOperaDatas(props);
	if (seldatas == null || seldatas.index == undefined) {
		showErrorInfo(null, getLangByResId(this, '4006ARSUB-000018')); /* 国际化处理： 请选择要操作的单据！*/
		return;
	}
	let pks = [ seldatas.pks[0] ];
	let ctrantypeid = props.table.getCheckedRows(ARSUB_CONST.formId)[0].data.values[ArsubHeadItem.ctrantypeid].value;
	ajax({
		url: ARSUB_CONST.pushcheck,
		data: { pks: pks, destbillType: 'F0', ctrantypeid: ctrantypeid },
		success: (res) => {
			if (res.success) {
				let pushdata = res.data[0];
				cacheTools.set('arsubToF0Pks', pks);
				props.openTo(null, {
					pagecode: pushdata.pagecode,
					appcode: pushdata.appcode,
					srcbilltype: '35',
					status: 'add'
				});
			}
		}
	});
}
