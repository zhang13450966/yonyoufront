/*
 * @Author: zhngzh 
 * @Date: 2019-04-22 16:00:57 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-08-04 09:33:36
 */
import { ajax } from 'nc-lightapp-front';
import { URL, UISTATE, PAGECODE, PAGEAREA, FIELDS } from '../constance';
import { viewController, setButtonsEnable } from '../viewController';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import {
	getChangedRows,
	updateEditTableRows
} from '../../../../../scmpub/scmpub/pub/tool/editTableTools/getChangedRows';

export default function(props) {
	if (this.state.status && this.state.status == UISTATE.edit) {
		//过滤空行
		props.editTable.filterEmptyRows(PAGEAREA.list, [ FIELDS.pk_org, FIELDS.pk_group ]);
		let rows = this.props.editTable.getAllRows(PAGEAREA.list, true);
		let flag = this.props.editTable.checkRequired(PAGEAREA.list, rows);
		if (!flag) {
			return;
		}
		let changedRows = getChangedRows(props, PAGEAREA.list);
		//let allData = props.editTable.getAllRows(PAGEAREA.list);
		// let changesData = allData.filter((item) => {
		// 	//现在表格的setValue方法没有触发status变化
		// 	// if (item.status && item.status != 0) {
		// 	// 	item.values.pk_group = this.state.pk_group;
		// 	// 	return item;
		// 	// }
		// });
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
				method: 'post',
				data: {
					pageid: PAGECODE,
					model: {
						areaType: 'table',
						areacode: PAGEAREA.list,
						PageInfo: {},
						rows: changedRows
					}
				},
				success: (res) => {
					if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
						props.dealFormulamsg(
							res.formulamsg //参数一：返回的公式对象
						);
					}
					if (res && res.success) {
						this.setState(
							{
								status: UISTATE.browse
							},
							() => {
								viewController.call(this, this.props, UISTATE.browse);
								setButtonsEnable.call(this, this.props, true);
								if (res.data) {
									updateEditTableRows(props, PAGEAREA.list, res.data[PAGEAREA.list].rows);
								}
								props.setUrlParam({ status: UISTATE.browse });
							}
						);
						showSuccessInfo(getLangByResId(this, '4001BACKREASON-000008')); /* 国际化处理： 保存成功！*/
					}
				}
			});
		});
	} else {
		return false;
	}
}
