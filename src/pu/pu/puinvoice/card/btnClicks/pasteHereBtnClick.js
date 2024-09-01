/*
 * @Author: jiangfw 
 * @PageInfo: 粘贴至此
 * @Date: 2018-04-25 20:47:18 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2018-10-09 18:53:50
 */
import { RownoUtils, rowCopyPasteUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';
import { FIELD, AREA, BUTTONID } from '../../constance';
import { cacheData } from '../utils/cacheData';
let tableId = AREA.card_body;

export default function clickPasteHereBtn(props, index) {
	rowCopyPasteUtils.pasteRowsToIndex.call(
		this,
		props,
		tableId,
		index,
		BUTTONID.ShoulderInitBtn,
		BUTTONID.CardPastBtn,
		[ FIELD.pk_invoice_b, FIELD.crowno ]
	);
	// 设置行号
	RownoUtils.setRowNo(props, tableId, FIELD.crowno);
	props.button.setButtonVisible(
		[
			BUTTONID.ShoulderGroup1,
			BUTTONID.AddLine,
			BUTTONID.DeleteLine,
			BUTTONID.CopyLine,
			BUTTONID.Hphq,
			BUTTONID.ReRankRownum,

			BUTTONID.Unfold,
			BUTTONID.DeleteLine_i,
			BUTTONID.InsertLine
		],
		true
	);
	props.button.setButtonVisible(
		[ BUTTONID.ShoulderGroup2, BUTTONID.PasteToTail, BUTTONID.Cancel_b, BUTTONID.PasteHere ],
		false
	);
	// 更新缓存
	cacheData.call(this, tableId);
}
