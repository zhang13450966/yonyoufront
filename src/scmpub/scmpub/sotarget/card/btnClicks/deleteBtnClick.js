/* * @Author: lichaoah  
* @PageInfo:销售指标设置按钮   
* @Date: 2020-02-19 09:33:29  
 * @Last Modified by: lichaoah
 * @Last Modified time: 2020-03-19 10:33:01
*/
import { ajax } from 'nc-lightapp-front';
import { changeUrlParam, deleteCacheData, getNextId } from '../../../../../scmpub/scmpub/pub/cache';
import { clearPageData } from '../dataManange/cardPageDataManange';
import { queryByPk } from '../dataManange/dataManange';
import { showSuccessInfo, showSingleDeleteDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { TARGET_CARD, TARGET_LIST } from '../../siconst';
import { setBlankPageButtons } from '../viewControl/buttonController';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function (props) {
	showSingleDeleteDialog({
		/* 国际化处理： 删除,确定要删除吗？*/
		beSureBtnClick: doDelete.bind(this, props)
	});
}
function doDelete(props) {
	let pk_target = props.form.getFormItemsValue(TARGET_CARD.formId, TARGET_CARD.pk_target).value;
	let ts = props.form.getFormItemsValue(TARGET_CARD.formId, TARGET_CARD.ts).value;
	let deleteInfo = { ts: ts, id: pk_target };
	ajax({
		url: TARGET_CARD.deleteUrl,
		data: deleteInfo,
		success: (res) => {
			showSuccessInfo(getLangByResId(this, '4001TARGET-000026'));/* 国际化处理： 删除成功*/
			let nextId = getNextId(props, pk_target, TARGET_LIST.dataSource);
			//清除缓存
			deleteCacheData(props, TARGET_CARD.pk_target, pk_target, TARGET_LIST.dataSource);
			changeUrlParam(props, { status: TARGET_CARD.browse, id: nextId });
			if (!nextId) {
				clearPageData(props);
				setBlankPageButtons(props);
			} else {
				queryByPk.call(this, props, nextId);
			}
		}
	});
}
