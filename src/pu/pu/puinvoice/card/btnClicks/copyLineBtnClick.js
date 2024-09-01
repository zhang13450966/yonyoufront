/*
 * @Author: jiangfw 
 * @PageInfo: 复制行事件 
 * @Date: 2018-04-25 20:47:18 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2019-02-21 10:06:17
 */
import { RownoUtils, rowCopyPasteUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';
import { FIELD, AREA, BUTTONID } from '../../constance';
import { cacheData } from '../utils/cacheData';

export default function clickCopyLineBtn(props) {
	props.button.setButtonVisible(
		[
			BUTTONID.ShoulderGroup1,
			BUTTONID.AddLine,
			BUTTONID.DeleteLine,
			BUTTONID.CopyLine,
			BUTTONID.Hphq,
			BUTTONID.ReRankRownum,

			BUTTONID.Unfold,
			BUTTONID.InsertLine
		],
		false
	);
	props.button.setButtonVisible(
		[ BUTTONID.ShoulderGroup2, BUTTONID.PasteToTail, BUTTONID.Cancel_b, BUTTONID.PasteHere ],
		true
	);
	rowCopyPasteUtils.copyRows.call(this, props, AREA.card_body, BUTTONID.ShoulderInitBtn, BUTTONID.CardPastBtn);
	RownoUtils.resetRowNo(props, AREA.card_body, FIELD.crowno);
	// 更新缓存
	cacheData.call(this, AREA.card_body);
}
