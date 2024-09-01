import { ajax, toast } from 'nc-lightapp-front';
import { URL, ARRIVEPLAN, STATUS } from '../../constance';
import { buttonController } from '../viewController/index';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo, showRefreshInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

export default function searchBtnClick(props, pk_order, isRefresh) {
	if (pk_order) {
		ajax({
			url: URL.arriveplanquery,
			data: {
				pks: [ pk_order ],
				pageid: ARRIVEPLAN.PAGECODE
			},
			success: (res) => {
				let { success, data } = res;
				let rowsData = { rows: [] };
				if (data) {
					rowsData = data[ARRIVEPLAN.TABLEID];
				}
				rowsData.rows.forEach((row) => {
					row.values.crownobb1.display = row.values.crownobb1.value;
				});
				props.editTable.setTableData(ARRIVEPLAN.TABLEID, rowsData);
				buttonController.togglePageShow.call(this, props, STATUS.browse);
				// toast({color: 'success',content: getLangByResId(this, '4004POORDER-000006')});
				/* 国际化处理： 查询成功！*/
				isRefresh == true ? showRefreshInfo() : showSuccessInfo(getLangByResId(this, '4004POORDER-000006'));
			}
		});
	} else {
		let empty = { rows: [] };
		props.editTable.setTableData(ARRIVEPLAN.TABLEID, empty);
	}
}
