/*
 * @Author: guoylei
 * @PageInfo: 暂存
 * @Date: 2021-07-13 14:28:09
 * @Last Modified by: guoylei
 * @Last Modified time: 2021-10-21 15:00:39
 */
import { ACTIONS } from '../../../../../scmpub/scmpub/components/TempSave';
import { setDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { PAGECODE, COMMON, AREA, UISTATE } from '../../constance';
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function temporaryStorage(props) {
	let config = {
		pagecode: PAGECODE.invoiceCard,
		formId: AREA.card_head,
		tableId: [ AREA.card_body, null ],
		type: 'card',
		area: AREA.card_body,
		param: 'pk_material'
	};

	setDefData(COMMON.tempCardCacheKey, 'tempsave', true);
	ACTIONS.SAVE.call(this, props, config, checkTempSave.bind(this));
}

//暂存保存草稿方法回调，可通过条件判断是否执行保存草稿
function checkTempSave() {
	let srcids = this.props.cardTable.getColValue(AREA.card_body, 'csourceid');
	if (!srcids || srcids.length == 0) {
		return true;
	}
	let ischeck = false;
	srcids.forEach((srcid) => {
		if (srcid.value) {
			ischeck = true;
		}
	});
	if (ischeck) {
		showErrorInfo('', getLangByResId(this, '4004PUINVOICE-000091')); /* 国际化处理： 单据存在来源，不能支持暂存！*/
		setDefData(COMMON.tempCardCacheKey, 'tempsave', false);
		return false;
	}

	let option = this.props.getUrlParam('option');
	let status = this.props.getUrlParam('status');
	if (status == 'edit' && option != 'copy') {
		showErrorInfo('', getLangByResId(this, '4004PUINVOICE-000090')); /* 国际化处理： 已保存单据不支持暂存！*/
		setDefData(COMMON.tempCardCacheKey, 'tempsave', false);
		return false;
	}

	return true;
}
