import { ajax } from 'nc-lightapp-front';
import { setButtonsEnable } from '../viewController';
import { PAGECODE, URL, AREA } from '../constance/index';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

/**
 * 查询，刷新
 * @param {*} props 
 * @param {*} isrefresh 
 */
export default function(props, isrefresh) {
	let data = {
		pageCode: PAGECODE //页面编码
	};
	ajax({
		url: URL.query,
		data: data,
		method: 'POST',
		success: (res) => {
			let { success, data } = res;
			if (success) {
				if (data == null) {
					props.editTable.setTableData(AREA.tableArea, { rows: [] });
				} else {
					let rowsData = { rows: [] };
					rowsData = data[AREA.tableArea];
					props.editTable.setTableData(AREA.tableArea, rowsData);
				}
				//判断是否是刷新
				if (isrefresh) {
					showSuccessInfo(getLangByResId(this, '4001PROMOTTYPE-000000')); /* 国际化处理： 刷新成功*/
				}
			}
			setButtonsEnable.call(this, this.props, true);
		}
	});
}
