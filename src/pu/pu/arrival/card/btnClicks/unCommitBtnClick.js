/*
 * @Author: zhangshqb 
 * @PageInfo: 收回  
 * @Date: 2018-04-28 10:17:14 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-11-11 16:04:18
 */
import { ajax } from 'nc-lightapp-front';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { URL, COMMON, AREA, PAGECODE, ALLBUTTONS, FREEBUTTONS } from '../../constance';
import { updateDtaForCompareByPk } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/compareUtils';
import { updateCacheData } from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import buttonController from '../viewControl/buttonController';
export default function() {
	let _this = this;
	let rows = this.props.cardTable.getAllRows(AREA.body);
	let bodys = [];
	rows.forEach((row) => {
		bodys.push({
			pk: row.values['pk_arriveorder_b'].value,
			ts: row.values['ts'].value
		});
	});
	ajax({
		method: 'post',
		url: URL.uncommit,
		data: {
			pageid: PAGECODE.card,
			pkTsParams: [
				{
					pk: _this.props.form.getFormItemsValue(AREA.head, 'pk_arriveorder').value,
					ts: _this.props.form.getFormItemsValue(AREA.head, 'ts').value,
					bodys: bodys
				}
			]
		},
		success: function(res) {
			if (res && res.data && res.data.head && res.data.body) {
				let config = {
					headAreaId: AREA.head,
					bodyAreaId: AREA.body,
					bodyPKfield: 'pk_arriveorder_b'
				};
				updateDtaForCompareByPk(_this.props, res.data, config);
			}

			// props.setPageStatus('browse', props.location.search.id);
			updateCacheData(
				_this.props,
				'pk_arriveorder',
				_this.props.form.getFormItemsValue(AREA.head, 'pk_arriveorder').value,
				res.data,
				AREA.head,
				COMMON.arrivalCacheKey
			);
			_this.props.cardTable.setStatus(AREA.body, 'browse');
			if (_this.props.getUrlParam('type')) {
				_this.props.transferTable.updateTransferListValueByIndex(AREA.leftarea, res.data, _this.state.index);
			}
			showSuccessInfo(getLangByResId(_this, '4004ARRIVAL-000006')); /* 国际化处理： 收回成功*/
			buttonController.call(_this);
		}
	});
}
