import { ajax } from 'nc-lightapp-front';
import { PAGEAREA, PAGECODE, FIELDS, URL, UISTATE } from '../constance';
import { viewController } from '../viewController';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import {
	getChangedRows,
	updateEditTableRows
} from '../../../../../scmpub/scmpub/pub/tool/editTableTools/getChangedRows';

export default function(props) {
	//过滤空行
	props.editTable.filterEmptyRows(PAGEAREA.list, [ 'defpackage', 'pk_org', 'pk_group', 'pseudocolumn' ]);
	//获取变化行信息
	let changedRows = getChangedRows(props, PAGEAREA.list);
	if (!changedRows || changedRows.length == 0) {
		//更新页面状态
		this.state.status = UISTATE.browse;
		viewController.call(this, props);
		return;
	}
	let flag = props.editTable.checkRequired(PAGEAREA.list, changedRows);
	if (!flag) {
		return;
	}
	let data = {
		pageid: PAGECODE,
		model: {
			areaType: 'table',
			areacode: PAGEAREA.list,
			PageInfo: {},
			rows: changedRows
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
					updateEditTableRows(props, PAGEAREA.list, res.data[PAGEAREA.list].rows);
					props.setUrlParam({ status: UISTATE.browse });
					//更新页面状态
					viewController.call(this, props);
					this.state.status = UISTATE.browse;
					showSuccessInfo(getLangByResId(this, '4001WHOLEPACK-000008'));/* 国际化处理： 保存成功！*/
				}
			}
		});
	});
}
