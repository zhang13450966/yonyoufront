/*
 * @Author: guoylei
 * @PageInfo: 暂存
 * @Date: 2021-07-13 14:28:09
 * @Last Modified by: guoylei
 * @Last Modified time: 2021-10-21 14:55:05
 */
import { ACTIONS } from '../../../../../scmpub/scmpub/components/TempSave';
import { setDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { STOREREQ_LIST, STOREREQ_CARD } from '../../siconst';
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function temporaryStorage(props) {
	let config = {
		pagecode: STOREREQ_CARD.cardpageid,
		formId: STOREREQ_CARD.formId,
		tableId: STOREREQ_CARD.tableId,
		type: 'card',
		area: STOREREQ_CARD.tableId,
		param: 'pk_material'
	};
	setDefData(STOREREQ_CARD.tempCardCacheKey, 'tempsave', true);
	ACTIONS.SAVE.call(this, props, config, checkTempSave.bind(this));
}

//暂存保存草稿方法回调，可通过条件判断是否执行保存草稿
function checkTempSave() {
	let option = this.props.getUrlParam('option');
	let status = this.props.getUrlParam('status');
	if (status == 'edit' && option != 'copy') {
		showErrorInfo('', getLangByResId(this, '4004STOREREQ-000060')); /* 国际化处理： 已保存单据不支持暂存！*/
		setDefData(STOREREQ_CARD.tempCardCacheKey, 'tempsave', false);
		return false;
	}
	let srcids = this.props.cardTable.getColValue(STOREREQ_CARD.tableId, 'csourceid');
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
		showErrorInfo('', getLangByResId(this, '4004STOREREQ-000061')); /* 国际化处理： 单据存在来源，不能支持暂存！*/
		setDefData(STOREREQ_CARD.tempCardCacheKey, 'tempsave', false);
		return false;
	}
	return true;
}
