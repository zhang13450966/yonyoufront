/*
 * @Author: yechd5 
 * @PageInfo: 刷新按钮点击实现 
 * @Date: 2018-04-12 09:41:12 
 * @Last Modified by: yechd5
 * @Last Modified time: 2018-10-25 20:24:23
 */
import { ajax } from 'nc-lightapp-front';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { MARTRANTYPE_CONST } from '../const';
import buttonController from '../../list/viewController/buttonController'

export default function refreshBtn(props) {
	let org = this.state.pk_org.value
	let _this = this;
	let req = { pk_org: org, pageId: MARTRANTYPE_CONST.PAGEID };
	ajax({
		url: MARTRANTYPE_CONST.QUERYURL,
		data: req,
		success: (res) => {
			if (res.success) {
				if (res.data && res.data[MARTRANTYPE_CONST.TABLEID]) {
					props.editTable.setTableData(MARTRANTYPE_CONST.TABLEID, res.data[MARTRANTYPE_CONST.TABLEID]);
				} else {
					props.editTable.setTableData(MARTRANTYPE_CONST.TABLEID, { rows: [] });
				}
				// 适配公式
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(
						res.formulamsg 
					);
				}
				// 去除复选框的打钩
				props.editTable.selectAllRows(MARTRANTYPE_CONST.TABLEID, false);
				buttonController.call(_this, props, org, MARTRANTYPE_CONST.BROWSE);
				showSuccessInfo(getLangByResId(_this, '4001MARTRANTYPE-000018')); /* 国际化处理： 刷新成功！*/
			}
		}
	});
}
