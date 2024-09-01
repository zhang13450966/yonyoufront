/*
 * @Author: yechd5 
 * @PageInfo: 协同设置"行"删除处理 
 * @Date: 2018-05-31 09:56:46 
 * @Last Modified by: yechd5
 * @Last Modified time: 2018-11-02 10:45:52
 */
import { ajax, cacheTools } from 'nc-lightapp-front';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { updatePksCache } from '../../pub/updatePksCache'
import { COOPSETUP_CONST } from '../../const';
import buttonController from '../viewController/buttonController'

export function browseDel(props, record, index) {
	let req = [
		{
			ts: record.ts.value,
			pk: record.pk_coopsetup.value
		}
	];
	let delpks = new Array();
	delpks.push(record.pk_coopsetup.value);

	ajax({
		url: COOPSETUP_CONST.DELLISTURL,
		data: req,
		success: (res) => {
			if (res.success) {
				props.table.deleteTableRowsByIndex(COOPSETUP_CONST.LIST_DATAAREAID, index);
				showSuccessInfo(getLangByResId(this, '4001COOPSETUP-000000')); /* 国际化处理： 删除成功！*/
				buttonController.call(this, props);
				// 更新缓存
				let remains = updatePksCache(cacheTools.get(COOPSETUP_CONST.CACHEPKS_KEY), null, delpks);
				cacheTools.set(COOPSETUP_CONST.CACHEPKS_KEY, remains);
			}
		}
	});
}
