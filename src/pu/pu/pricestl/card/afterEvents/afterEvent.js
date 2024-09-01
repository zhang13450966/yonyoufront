import { toast } from 'nc-lightapp-front';
import { PAGECODE, FIELD } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import jscalculation from '../../../../../scmpub/scmpub/pub/tool/calculationUtils';

export default function afterEvent(props, moduleId, key, value, changedrows, index, record) {
	let ntaxprice = null;
	let ntaxrate = null;
	let ftaxtypeflag = null;
	let nprice = null;
	//为Number添加精确运算方法
	jscalculation();
	if (moduleId === PAGECODE.cardhead) {
	} else if (moduleId === PAGECODE.cardbody) {
		if (key == 'ntaxprice') {
			// 本币含税单价
			ftaxtypeflag = record.values.ftaxtypeflag.value; //扣税类别
			ntaxprice = parseFloat(record.values.ntaxprice.value); //本币含税单价
			ntaxrate = parseFloat(record.values.ntaxrate.value); //税率
			if (
				record.values.ntaxprice.value == '' ||
				record.values.ntaxprice.value < 0 ||
				record.values.ntaxprice.value == undefined
			) {
				return;
			}
			if (ntaxrate != null && ntaxrate != undefined) {
				ntaxrate = parseFloat(ntaxrate.sub(100).toFixed(8)); //处理小数点
			}
			let nprice = null;
			if ('0' == ftaxtypeflag) {
				nprice = ntaxprice.mul((1).sub(ntaxrate));
			} else {
				nprice = ntaxprice.div((1).add(ntaxrate)).toFixed(8);
			}
			props.cardTable.setValByKeyAndIndex(PAGECODE.cardbody, index, FIELD.nprice, {
				value: nprice
			});
			let ninnum = parseFloat(record.values.ninnum.value);
			let ntaxmny = ninnum.mul(ntaxprice);
			props.cardTable.setValByKeyAndIndex(PAGECODE.cardbody, index, FIELD.ntaxmny, {
				value: ntaxmny
			});
		}
		if (key == 'nprice') {
			ftaxtypeflag = record.values.ftaxtypeflag.value; //扣税类别
			nprice = parseFloat(record.values.nprice.value); //本币无税单价
			if (nprice == '' || nprice < 0 || nprice == undefined) {
				toast({
					color: 'warning',
					content: getLangByResId(this, '4004PRICESTL-000000') /* 国际化处理： 请正确修改本币无税单价！*/
				});
				return;
			}
			ntaxrate = parseFloat(record.values.ntaxrate.value); //税率
			ntaxrate = parseFloat(ntaxrate.sub(100).toFixed(8));
			if ('0' == ftaxtypeflag) {
				ntaxprice = nprice.div((1).sub(ntaxrate));
			} else {
				ntaxprice = nprice.mul((1).add(ntaxrate)).toFixed(8);
			}
			props.cardTable.setValByKeyAndIndex(PAGECODE.cardbody, index, 'ntaxprice', {
				value: ntaxprice
			});
			let ninnum = parseFloat(record.values.ninnum.value);
			let ntaxmny = ninnum.mul(ntaxprice);
			props.cardTable.setValByKeyAndIndex(PAGECODE.cardbody, index, FIELD.ntaxmny, {
				value: ntaxmny
			});
		}
	}
}
