import { ajax } from 'nc-lightapp-front';
import { URL, PAGEAREA } from '../constance';
import { viewController } from '../viewController';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

/**
 * 查询，刷新
 * @param {*} props 
 * @param {*} isrefresh 是否是刷新
 */
export default function(props, isrefresh) {
	ajax({
		url: URL.query,
		//data: data,
		method: 'POST',
		success: (res) => {
			let { success, data } = res;
			if (success) {
				if (data == null) {
					props.editTable.setTableData(PAGEAREA.list, { rows: [] });
				} else {
					let rowsData = { rows: [] };
					rowsData = data[PAGEAREA.list];
					props.editTable.setTableData(PAGEAREA.list, rowsData);
				}
				//判断是否是刷新
				if (isrefresh) {
					showSuccessInfo(getLangByResId(this, '4001BACKREASON-000002')); /* 国际化处理： 刷新成功*/
				}
				//更新页面状态
				viewController.call(this, props);
			}
		}
	});
}
