/*
 * @Author: 刘奇 
 * @PageInfo: 生成收款单  
 * @Date: 2019-04-15 16:30:52 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-05-07 10:58:28
 */
import { ARSUB_CONST, ArsubHeadItem } from '../../const';
import { ajax, cacheTools } from 'nc-lightapp-front';

export default function buttonClick(props) {
	let pks = [
		props.form.getFormItemsValue(ARSUB_CONST.formId, ArsubHeadItem.carsubid).value +
			',' +
			props.form.getFormItemsValue(ARSUB_CONST.formId, ArsubHeadItem.ts).value
	];
	let ctrantypeid = props.form.getFormItemsValue(ARSUB_CONST.formId, ArsubHeadItem.ctrantypeid).value;
	ajax({
		url: ARSUB_CONST.pushcheck,
		data: { pks: pks, destbillType: 'F2', ctrantypeid: ctrantypeid },

		success: (res) => {
			if (res.success) {
				let pushdata = res.data[0];
				cacheTools.set('arsubToF2Pks', pks);
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
