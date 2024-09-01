/*
 * @Author: CongKe 
 * @PageInfo: 页面功能描述 
 * @Date: 2018-08-10 22:13:48 
 * @Last Modified by: CongKe
 * @Last Modified time: 2018-10-22 16:53:06
 */
import { toast } from 'nc-lightapp-front';
import remoteRequest from './remoteRequest';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default async function(props, moduleId, key, value, index, record) {
	let _this = this;
	if (key == 'effectmonth') {
		// 付款协议页签生效月
		let flag = true;
		let checkdata = record.values.checkdata.value;
		if (checkdata == null) {
			toast({
				color: 'warning',
				content: getLangByResId(this, '4004POORDER-000021') /* 国际化处理： 请先填写固定结账日！*/
			});
			flag = false;
		}
		return flag;
	} else if (key == 'effectaddmonth') {
		let flag = true;
		// 付款协议页签附加月
		let checkdata = record.values.checkdata.value;
		if (checkdata == null) {
			toast({
				color: 'warning',
				content: getLangByResId(this, '4004POORDER-000021') /* 国际化处理： 请先填写固定结账日！*/
			});
			flag = false;
		}
		return flag;
	} else if (
		key == 'accrate' ||
		key == 'prepayment' ||
		key == 'effectdateadddate' ||
		key == 'pk_payperiod' ||
		key == 'paymentday' ||
		key == 'accountday' ||
		key == 'checkdata' ||
		key == 'effectmonth' ||
		key == 'effectaddmonth' ||
		key == 'pk_balatype' ||
		key == 'isdeposit' ||
		key == 'pk_rate'
	) {
		//付款比例、预付款、起效日期延迟天数、起效日期、账期天数、出账日、固定结账日、生效月、附加月、结算方式、质保金、现金折扣
		return true;
	} else {
		return false;
	}
	return true;
}
