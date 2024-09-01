/*
 * @Author: yechd5 
 * @PageInfo: 采购岗物料设置刷新按钮点击实现 
 * @Date: 2018-04-12 09:41:12 
 * @Last Modified by: yechd5
 * @Last Modified time: 2018-10-25 20:30:57
 */
import { ajax } from 'nc-lightapp-front';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { BUYPOSITION_CONST } from '../const';
import buttonController from '../../list/viewController/buttonController'

export default function refreshBtn(props) {
	let org = this.state.pk_org.value
	let _this = this;
	let req = {
		pk_org: org,
		pageId: BUYPOSITION_CONST.PAGEID,
		nodecode: BUYPOSITION_CONST.NODECODE
	};
	ajax({
		url: BUYPOSITION_CONST.QUERYURL,
		data: req,
		success: (res) => {
			if (res.success) {
				if (res.data && res.data[BUYPOSITION_CONST.TABLEID]) {
					props.editTable.setTableData(BUYPOSITION_CONST.TABLEID, res.data[BUYPOSITION_CONST.TABLEID]);
				} else {
					props.editTable.setTableData(BUYPOSITION_CONST.TABLEID, { rows: [] });
				}
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(
						res.formulamsg 
					);
				}
				props.editTable.selectAllRows(BUYPOSITION_CONST.TABLEID, false);
				buttonController.call(_this, props, org, BUYPOSITION_CONST.BROWSE);
				showSuccessInfo(getLangByResId(_this, '4004BUYPOSITION-000022')); /* 国际化处理： 刷新成功！*/
			}
		}
	});
}
