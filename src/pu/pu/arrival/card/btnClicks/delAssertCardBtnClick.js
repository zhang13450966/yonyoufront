/*
 * @Author: zhangshqb 
 * @PageInfo: 到货单卡片态按钮 删除资产卡片 
 * @Date: 2018-04-28 10:17:14 
 * @Last Modified by: zhangshqb
 * @Last Modified time: 2018-07-09 15:32:45
 */
import { ajax, toast } from 'nc-lightapp-front';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { URL, AREA, PAGECODE } from '../../constance';
import { updateDtaForCompareByPk } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/compareUtils';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function() {
	let _this = this;
	let rows = _this.props.cardTable.getCheckedRows(AREA.table);
	if (rows.length < 1) {
		toast({ content: getLangByResId(_this, '4004ARRIVAL-000008'), color: 'warning' }); /* 国际化处理： 请选择数据*/
	}
	let pkTsParams = rows.map((row) => {
		return {
			pk: row.data.values.pk_arriveorder_b.value,
			ts: row.data.values.ts.value
		};
	});
	ajax({
		method: 'post',
		url: URL.delAssertCard,
		data: {
			pageid: PAGECODE.card,
			pkTsParams: pkTsParams
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
			if (_this.props.getUrlParam('type')) {
				// let index = _this.props.transferTable.getTransferTableSelectedId();
				_this.props.transferTable.setTransferListValueByIndex(AREA.leftarea, res.data, _this.state.index);
			}

			showSuccessInfo(getLangByResId(_this, '4004ARRIVAL-000010')); /* 国际化处理： 删除设备卡片成功*/
		}
	});
}
