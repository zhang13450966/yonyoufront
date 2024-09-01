import { initLang, getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import {SETTLTTYPE} from '../../constance'
export default function(props, id, item, index, value, record) {
    let settleType = this.state.settleType;
	let busisys = 'po';
	(this.state.selectedStock || []).forEach((row) => {
		if ('50' == row.values.cbilltypecode.value) {
			busisys = 'voi_consume';
		}
	});

    let binvoice = (record.values.binvoice || {}).value;
    let bstock = (record.values.bstock || {}).value;
    switch (item.key) {
        case 'ncurinvoicesettlenum':
        if (binvoice) {
            return true;
        } else {
            return false;
        }
        case 'ncurstocksettlenum':
        if (bstock && settleType != SETTLTTYPE.FEE){
            return true;
        } else {
            return false;
        }
        case 'nreasonwastenum':
        let canStlMny = (record.values.ncansettlemny ||{}).value;
        if (settleType == SETTLTTYPE.SAME_MATERIAL && 'po' == busisys && canStlMny > 0) {
            return  true;
        } else {
            return false;
        }
        case 'ncurseetlemny':
        if (bstock && settleType == SETTLTTYPE.WITHOUT_INVOICE) {
            return true
        } else {
            return false;
        }
        case 'nprice':
        if (bstock && settleType == SETTLTTYPE.WITHOUT_INVOICE) {
            return true
        } else {
            return false;
        }
        case 'ncurinvoicesettlemny':
        if (bstock && settleType == SETTLTTYPE.DIFFERENT_MATERIAL) {
            return true;
        } else {
            return false;
        }
        default:
        return false;
    }
}