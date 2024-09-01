/* * @Author: lichaoah  
* @PageInfo:销售指标设置按钮   
* @Date: 2020-02-19 09:33:29  
 * @Last Modified by: qishy
 * @Last Modified time: 2021-03-29 17:48:47
*/
import { TARGET_CARD, TARGET_LIST } from '../../siconst';
import { getCurrentLastId, changeUrlParam } from '../../../../../scmpub/scmpub/pub/cache';
import viewController from '../viewControl/viewController';
import { showCancelDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { queryByPk } from '../dataManange/dataManange';
import { clearPageData } from '../dataManange/cardPageDataManange';
import { setBlankPageButtons } from '../viewControl/buttonController';
export default function(props) {
	showCancelDialog({
		beSureBtnClick: () => {
			props.form.cancel(TARGET_CARD.formId);
			props.cardTable.resetTableData(TARGET_CARD.target_org);
			props.cardTable.resetTableData(TARGET_CARD.target_period);
			props.cardTable.resetTableData(TARGET_CARD.target_mar);
			props.cardTable.resetTableData(TARGET_CARD.target_item);
			props.cardTable.resetTableData(TARGET_CARD.target_ratio);
			let pk_target = props.getUrlParam('id');
			if (!pk_target) {
				pk_target = getCurrentLastId(TARGET_LIST.dataSource);
			}
			changeUrlParam(props, { id: pk_target });
			// 将页面状态置为浏览态
			viewController.call(this, props, TARGET_CARD.browse);
			if (pk_target) {
				queryByPk.call(this, props, pk_target);
			} else {
				clearPageData(props);
				setBlankPageButtons(props);
			}
			//隐藏指标项页签
			this.setState({ showTargetRatio: false });
		}
	});
}
