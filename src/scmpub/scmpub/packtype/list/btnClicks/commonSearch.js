import { ajax } from 'nc-lightapp-front';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { viewController } from '../viewController';
import { URL, PAGECODE, PAGEAREA } from '../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
/**
 * 查询，刷新
 * @param {*} props 
 * @param {*} isrefresh 是否是刷新
 */
export default function(props, isrefresh) {
	if (this.state.pk_org.value) {
		let data = {
			pk_org: this.state.pk_org.value,
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
						props.editTable.setTableData(PAGEAREA.list, { rows: [] });
					} else {
						let rowsData;
						rowsData = data[PAGEAREA.list];
						props.editTable.setTableData(PAGEAREA.list, rowsData);
					}
					//判断是否是刷新
					if (isrefresh) {
						showSuccessInfo(getLangByResId(this, '4001PACKTYPE-000002')); /* 国际化处理： 刷新成功*/
					}
					//更新页面状态
					viewController.call(this, props);
				}
			}
		});
	} else {
		props.editTable.setTableData(PAGEAREA.list, { rows: [] });
		//更新页面状态
		viewController.call(this, props);
	}
}
