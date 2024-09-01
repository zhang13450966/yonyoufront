import { ajax } from 'nc-lightapp-front';
import { PAGEAREA, PAGECODE, URL, UISTATE } from '../constance';
import { viewController } from '../viewController';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function(props) {
	//过滤空行
	props.editTable.filterEmptyRows(PAGEAREA.list, [ 'pk_group' ]);
	let rows = props.editTable.getAllRows(PAGEAREA.list);
	if (!rows || rows.length == 0) {
		viewController.call(this, props);
		return;
	}
	let flag = props.editTable.checkRequired(PAGEAREA.list, props.editTable.getAllRows(PAGEAREA.list));
	if (flag) {
		let data = {
			pageid: PAGECODE,
			model: {
				areaType: 'table',
				areacode: PAGEAREA.list,
				PageInfo: {},
				rows: rows
			}
		};
		props.validateToSave(data, () => {
			ajax({
				url: URL.save,
				data: data,
				success: (res) => {
					if (res && res.success) {
						if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
							props.dealFormulamsg(res.formulamsg);
						}
						if (res.data) {
							props.editTable.setTableData(PAGEAREA.list, res.data[PAGEAREA.list]);
						} else {
							props.editTable.setTableData(PAGEAREA.list, {
								rows: [],
								areacode: PAGEAREA.list
							});
						}
						showSuccessInfo(getLangByResId(this, '4001PACKINGTYPE-000008')); /* 国际化处理： 保存成功！*/
						props.setUrlParam({ status: UISTATE.browse });
						//更新页面状态
						viewController.call(this, props);
					}
				}
			});
		});
	}
}
