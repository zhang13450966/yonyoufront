/*
 * @Author: xiahui 
 * @PageInfo: 删除匹配结果
 * @Date: 2019-05-20 09:48:30 
 * @Last Modified by: xiahui
 * @Last Modified time: 2019-07-11 09:44:37
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, URL } from '../../constance';
import { showSuccessInfo, showWarningInfo, showDeleteDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getEntireCheckedMatchedData } from '../utils/matchUtil';
import { buttonControl } from '../viewControl/buttonControl';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function(props) {
	showDeleteDialog({
		beSureBtnClick: () => {
			let { matchedPks, matchedIndex } = getEntireCheckedMatchedData(props);
			if (!matchedPks || matchedPks.size == 0) {
				showWarningInfo(getLangByResId(this, '4004MATCH-000000')); /* 国际化处理： 所选发票数据没有选全！*/
				return;
			}

			ajax({
				url: URL.delete,
				data: matchedPks,
				success: (res) => {
					if (res.success) {
						showSuccessInfo(getLangByResId(this, '4004MATCH-000002')); /* 国际化处理： 删除匹配结果成功*/
						props.editTable.deleteTableRowsByIndex(AREA.matchedId, matchedIndex);
						buttonControl.call(this, props);
					}
				}
			});
		}
	});
}
