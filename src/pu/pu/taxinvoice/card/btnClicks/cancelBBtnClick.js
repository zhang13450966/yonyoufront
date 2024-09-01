/*
 * @Author: chaiwx 
 * @PageInfo: 表体取消 
 * @Date: 2018-04-11 17:49:47 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2018-07-06 13:17:03
 */
import { AREA, COPYPASTEBTNS } from '../../constance';
import { rowCopyPasteUtils } from 'src/scmpub/scmpub/pub/tool/cardTableTools/rowCopyPasteUtils';

export default function(props) {
	rowCopyPasteUtils.cancel.call(this, props, AREA.cardTableId, COPYPASTEBTNS.initBtns, COPYPASTEBTNS.pasteBtns);
}
