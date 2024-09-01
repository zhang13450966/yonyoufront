/*
 * @Author: jiangfw 
 * @PageInfo: 粘贴至末行事件
 * @Date: 2018-04-25 20:47:18 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-28 15:34:09
 */
import { RownoUtils, rowCopyPasteUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';
import { FIELD, AREA, BUTTONID } from '../../constance';
import { cacheData } from '../utils/cacheData';
let tableId = AREA.card_body;

export default function clickPasteToTailBtn(props) {
	//开关开始
	props.beforeUpdatePage();
	rowCopyPasteUtils.pasteRowsToTail.call(this, props, tableId, BUTTONID.ShoulderInitBtn, BUTTONID.CardPastBtn, [
		FIELD.pk_invoice_b,
		FIELD.crowno
	]);
	// 设置行号
	RownoUtils.resetRowNo(props, tableId, FIELD.crowno);
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
	// 效率优化开关关闭
	props.updatePage(AREA.card_head, AREA.card_body);
	// 更新缓存
	cacheData.call(this, tableId);
}
