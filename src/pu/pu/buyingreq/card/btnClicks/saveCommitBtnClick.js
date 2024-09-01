/*
 * @Author: zhangchangqing 
 * @PageInfo: 保存提交按钮事件
 * @Date: 2018-04-19 10:35:13 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2019-03-28 15:55:00
 */
import { BUYINGREQ_CARD, BUYINGREQ_LIST, ATTRCODES } from '../../siconst';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { ajax, toast } from 'nc-lightapp-front';
import {
	addCacheData,
	updateCacheData,
	rewriteTransferSrcBids
} from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { checkDateUtil } from '../../../pub/utils/checkDateUtil';
import { showWarningDialog, showSuccessInfo, showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { setBtnShow } from './pageInfoClick';
import saveBtn from './saveBtnClick';
import commitBtnClick from './commitBtnClick';
//import { cachedata } from '../afterEvents/headAfterEvent';
import getParentURlParme from './getParentURlParme';
import { buttonController, btnClickController } from '../viewControl';
let tableId = BUYINGREQ_CARD.tableId; //body
let formId = BUYINGREQ_CARD.formId; //head
let cardpageid = BUYINGREQ_CARD.cardpageid; //BUYINGREQ_CARD
export default function clickSaveBtn(props) {
	saveBtn.call(this, props, commitBtnClick);
}
