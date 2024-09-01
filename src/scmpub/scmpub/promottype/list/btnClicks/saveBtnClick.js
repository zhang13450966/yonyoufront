/*
 * @Author: liangzhyf 
 * @Date: 2019-04-15 18:46:08 
 * @Last Modified by: zhaoqiang
 * @Last Modified time: 2021-08-12 18:49:13
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, URL, UISTATE, PAGECODE } from '../constance';
import { viewController, setButtonsEnable } from '../viewController';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { getChangedRows, updateEditTableRows } from '../../../../../scmpub/scmpub/pub/tool/editTableTools';
export default function(props) {
	if (this.state.status && this.state.status == UISTATE.edit) {
		props.editTable.filterEmptyRows(AREA.tableArea, []);
		//必输项校验
		let flag = props.validatePageToToast([
			{
				name: AREA.tableArea,
				type: 'editTable'
			}
		]);
		if (!flag.allPassed) {
			return;
		}

		let changesData = getChangedRows(props, AREA.tableArea, false);
		let data = {
			pageid: PAGECODE,
			model: {
				areaType: 'table',
				areacode: AREA.tableArea,
				PageInfo: {},
				rows: changesData
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
						areacode: AREA.tableArea,
						PageInfo: {},
						rows: changesData
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
							}
						);
						if (res.data) {
							//更新数据
							updateEditTableRows(props, AREA.tableArea, res.data[AREA.tableArea].rows);
						}
						showSuccessInfo(getLangByResId(this, '4001PROMOTTYPE-000003')); /* 国际化处理： 保存成功！*/
					}
				}
			});
		});
	} else {
		return false;
	}
}
