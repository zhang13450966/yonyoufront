/*
 * @Author: yechd5 
 * @PageInfo: 计划岗物料设置刷新按钮点击实现 
 * @Date: 2018-04-12 09:41:12 
 * @Last Modified by: yechd5
 * @Last Modified time: 2018-10-25 20:32:38
 */
import { ajax } from 'nc-lightapp-front';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { PLANPOSITION_CONST } from '../const';
import buttonController from '../../list/viewController/buttonController'

export default function refreshBtn(props) {
	let org = this.state.pk_org.value
	let _this = this;
	let req = {
		pk_org: org,
		pageId: PLANPOSITION_CONST.PAGEID,
		nodecode: PLANPOSITION_CONST.NODECODE
	};
	ajax({
		url: PLANPOSITION_CONST.QUERYURL,
		data: req,
		success: (res) => {
			if (res.success) {
				if (res.data && res.data[PLANPOSITION_CONST.TABLEID]) {
					props.editTable.setTableData(PLANPOSITION_CONST.TABLEID, res.data[PLANPOSITION_CONST.TABLEID]);
				} else {
					props.editTable.setTableData(PLANPOSITION_CONST.TABLEID, { rows: [] });
				}

				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(
						res.formulamsg 
					);
				}
				props.editTable.selectAllRows(PLANPOSITION_CONST.TABLEID, false);
				buttonController.call(_this, props, org, PLANPOSITION_CONST.BROWSE);
				showSuccessInfo(getLangByResId(_this, '4004PLANPOSITION-000024')); /* 国际化处理： 刷新成功！*/
			}
		}
	});
}
