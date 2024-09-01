/*
 * @Author: xiahui 
 * @PageInfo: 手工匹配
 * @Date: 2019-05-16 09:25:38 
 * @Last Modified by: xiahui
 * @Last Modified time: 2019-07-11 09:44:43
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, URL, PAGECODE } from '../../constance';
import { showSuccessInfo, showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import matchedSearch from './matchedSearch';
import { getIVMInvoiceClickRow } from '../utils/matchUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function(props) {
	// 开票数据
	let { invoiceData, invoiceIndex } = getIVMInvoiceClickRow(props);

	// 入库单数据
	let stockinDatas = props.editTable.getCheckedRows(AREA.stockinId);
	let stockinIndex = [];
	if (!stockinDatas || stockinDatas.length < 1) {
		showWarningInfo(null, getLangByResId(this, '4004MATCH-000003')); /* 国际化处理： 未选择入库单*/
		return;
	}
	let stockinRows = [];
	stockinDatas.map((row) => {
		stockinRows.push(row.data);
		stockinIndex.push(row.index);
	});

	let invoiceGrid = {
		pageid: PAGECODE.listPagecode,
		model: {
			areaType: 'table',
			areacode: AREA.invoiceId,
			PageInfo: {},
			rows: [ invoiceData ]
		}
	};
	let stockinGrid = {
		pageid: PAGECODE.listPagecode,
		model: {
			areaType: 'table',
			areacode: AREA.stockinId,
			PageInfo: {},
			rows: stockinRows
		}
	};

	let reqData = {
		invoice: invoiceGrid,
		stockin: stockinGrid,
		selectedIndex: stockinIndex
	};

	ajax({
		url: URL.match,
		data: reqData,
		success: (res) => {
			if (res.success && res.data) {
				showSuccessInfo(getLangByResId(this, '4004MATCH-000004')); /* 国际化处理： 匹配成功*/
				props.editTable.setTableData(AREA.matchedId, res.data[AREA.matchedId], false);
				// 删除匹配成功的发票行以及入库行
				props.editTable.deleteTableRowsByIndex(AREA.invoiceId, invoiceIndex);
				props.editTable.deleteTableRowsByIndex(AREA.stockinId, stockinIndex);

				if (props.editTable.getNumberOfRows(AREA.invoiceId) == 0) {
					// 当前匹配的发票为最后一行，跳转到匹配行
					matchedSearch.call(this, props);
					this.setState({ tab: 2 });
				} else {
					// 发票行焦点默认第一行
					props.editTable.focusRowByIndex(AREA.invoiceId, 0);
				}
			}
		}
	});
}
