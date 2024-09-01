/*
 * @Author: jiangfw 
 * @PageInfo: 表肩取消按钮
 * @Date: 2018-08-14 00:21:49 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2019-02-21 10:28:44
 */
import { AREA, BUTTONID } from '../../constance';
import { rowCopyPasteUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/rowCopyPasteUtils';

export default function clickCancel_bBtn(props) {
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
		true
	);
	props.button.setButtonVisible(
		[ BUTTONID.ShoulderGroup2, BUTTONID.PasteToTail, BUTTONID.Cancel_b, BUTTONID.PasteHere ],
		false
	);
	rowCopyPasteUtils.cancel.call(this, props, AREA.card_body, BUTTONID.ShoulderInitBtn, BUTTONID.CardPastBtn);
}
