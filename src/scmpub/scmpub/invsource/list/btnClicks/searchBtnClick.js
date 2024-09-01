/*
 * @Author: 王龙华 
 * @PageInfo:查询按钮点击事件
 * @Date: 2018-04-11 15:44:59 
 * @Last Modified by: yangls7
 * @Last Modified time: 2019-07-24 09:49:44
 */
import { INVSOURCE_CONST } from '../../const';
import { ajax } from 'nc-lightapp-front';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showWarningInfo, showSuccessInfo, showRefreshInfo } from '../../../pub/tool/messageUtil';
import buttonController from '../../list/viewController/buttonController';

//点击查询，获取查询区数据  flag=2时，代表是刷新，查询条件用的是缓存中查询条件
export default function searchBtnClick(flag, props, searchVal) {
	let queryInfo = flag == 2 ? searchVal : props.search.getQueryInfo(INVSOURCE_CONST.SEARCHID);
	ajax({
		url: INVSOURCE_CONST.QUERY_URL,
		data: queryInfo,
		success: (res) => {
			if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				props.dealFormulamsg(res.formulamsg);
			}
			if (flag == 2) {
				showRefreshInfo();
			} else if (res.data === undefined || !res.data) {
				props.editTable.setTableData(INVSOURCE_CONST.TABLEID, { rows: [] });
				showWarningInfo(null, getLangByResId(this, '4001INVSOURCE-000020')); /* 国际化处理： 未查询出符合条件的数据*/
			} else {
				props.editTable.setTableData(INVSOURCE_CONST.TABLEID, res.data[INVSOURCE_CONST.TABLEID]);
				let len = props.editTable.getNumberOfRows(INVSOURCE_CONST.TABLEID);
				showSuccessInfo(
					null,
					'' +
						getLangByResId(this, '4001INVSOURCE-000021') +
						len +
						getLangByResId(this, '4001INVSOURCE-000022')
				); /* 国际化处理： 查询成功*/
			}
			this.isSearched = true;
			this.oldSearchVal = queryInfo;
			// 控制按钮状态
			buttonController.call(this, props, INVSOURCE_CONST.BROWSER_STATUS);
		}
	});
}
