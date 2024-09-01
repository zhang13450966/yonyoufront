/*
 * @Author: yechd5 
 * @PageInfo: 协同设置列表删除按钮实现 
 * @Date: 2018-04-16 13:30:22 
 * @Last Modified by: yechd5
 * @Last Modified time: 2018-11-02 11:00:59
 */
import { ajax,cacheTools } from 'nc-lightapp-front';
import { showErrorInfo, showSuccessInfo, showDeleteDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { updatePksCache } from '../../pub/updatePksCache'
import { COOPSETUP_CONST } from '../../const';
import buttonController from '../viewController/buttonController'

export default function delBtnClick(props, index) {
	let selectedData = props.table.getCheckedRows(COOPSETUP_CONST.LIST_DATAAREAID);
	if (selectedData.length == 0) {
		showErrorInfo(null, getLangByResId(this, '4001COOPSETUP-000021')); /* 国际化处理： 请选择要删除的单据！*/
		return;
	}

	showDeleteDialog({
		beSureBtnClick: () => {
			let _this = this;
			let indexArr = [];
			let data = [];

			if (selectedData.length == 0) {
				return;
			}
			let delpks = new Array();
			selectedData.forEach((val) => {
				let delObj = {
					ts: val.data.values.ts.value,
					pk: val.data.values.pk_coopsetup.value
				};

				data.push(delObj);
				indexArr.push(val.index);
				delpks.push(val.data.values.pk_coopsetup.value);
			});

			ajax({
				url: COOPSETUP_CONST.DELLISTURL,
				data,
				success: function(res) {
					if (res.success) {
						props.table.deleteTableRowsByIndex(COOPSETUP_CONST.LIST_DATAAREAID, indexArr);
						showSuccessInfo(getLangByResId(_this, '4001COOPSETUP-000000')); /* 国际化处理： 删除成功！*/
						buttonController.call(this, props);
						// 更新缓存
						let remains = updatePksCache(cacheTools.get(COOPSETUP_CONST.CACHEPKS_KEY), null, delpks);
						cacheTools.set(COOPSETUP_CONST.CACHEPKS_KEY, remains);
					}
				}
			});
		}
	});
}
