/*
 * @Author: zhangchangqing 
 * @PageInfo: 取消按钮事件
 * @Date: 2018-04-19 10:37:17 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 19:37:29
 */
import { base } from 'nc-lightapp-front';
import { BUYINGREQ_CARD } from '../../siconst';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import pageInfoClick from './pageInfoClick';
import { showWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
const { NCMessage } = base;

export default function clickCancelBtn(props) {
	showWarningDialog(getLangByResId(this, '4004PRAYBILLR-000030'), getLangByResId(this, '4004PRAYBILLR-000000'), {
		/* 国际化处理： 确认要取消吗？*/
		beSureBtnClick: backtotransfer.bind(this, props)
	});
}
function backtotransfer(props) {
	//自己的逻辑
	if (
		this.props.getUrlParam(BUYINGREQ_CARD.status) != BUYINGREQ_CARD.add &&
		this.props.getUrlParam(BUYINGREQ_CARD.status) != BUYINGREQ_CARD.browse
	) {
		let pk_praybill = this.props.getUrlParam(BUYINGREQ_CARD.id);
		this.props.pushTo(BUYINGREQ_CARD.cardUrl, {
			status: BUYINGREQ_CARD.browse,
			id: pk_praybill,
			comeType: true,
			pagecode: BUYINGREQ_CARD.cardpageid
		});
		//this.togglePageShow();
		pageInfoClick.bind(this)();
		//this.toggleShow();
	} else {
		//页面回退
		history.back();
	}
	// if (
	// 	props.getUrlParam(BUYINGREQ_CARD.status) === BUYINGREQ_CARD.edit ||
	// 	props.getUrlParam(BUYINGREQ_CARD.status) === BUYINGREQ_CARD.add
	// ) {
	// 	// 表单返回上一次的值
	// 	props.form.cancel(this.formId);
	// 	// 表格返回上一次的值
	// 	props.editTable.cancelEdit(this.tableId);
	// 	props.pushTo(BUYINGREQ_CARD.listUrl);
	// 	//this.toggleShow();
	// }
}
