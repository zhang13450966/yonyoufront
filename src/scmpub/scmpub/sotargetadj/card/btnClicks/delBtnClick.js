/*
 * @Author: zhangchangqing 
 * @PageInfo: 删除按钮事件
 * @Date: 2018-04-19 10:36:58 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-09-08 14:59:39
 */
import { TARGETADJ_CARD, TARGETADJ_LIST, ATTRCODE } from '../../siconst';
import { ajax } from 'nc-lightapp-front';
import { getNextId, deleteCacheData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { showWarningDialog, showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import pageInfoClick from './pageInfoClick';
export default function clickDelBtn(props) {
	showWarningDialog(getLangByResId(this, '4001TARGETADJ-000057'), getLangByResId(this, '4001TARGETADJ-000037'), {
		/* 国际化处理： 确认要删除吗？*/
		beSureBtnClick: backtotransfer.bind(this, props)
	});
}

function backtotransfer(props) {
	//自己的逻辑
	let _this = this;
	let pk = this.props.form.getFormItemsValue(TARGETADJ_CARD.formId, ATTRCODE.pk_targetadj).value;
	let ts = this.props.form.getFormItemsValue(TARGETADJ_CARD.formId, ATTRCODE.ts).value;
	ajax({
		url: TARGETADJ_CARD.deleteURL,
		data: {
			id: pk,
			ts: ts
		},
		success: function(res) {
			let { success, data } = res;
			if (success) {
				let channelType = _this.props.getUrlParam(TARGETADJ_CARD.channelType);
				let transfer = _this.props.getUrlParam(TARGETADJ_CARD.type);
				let nextId = getNextId(props, pk, TARGETADJ_LIST.dataSource);
				deleteCacheData(props, ATTRCODE.pk_targetadj, pk, TARGETADJ_LIST.dataSource);
				props.form.setFormStatus(TARGETADJ_CARD.formId, TARGETADJ_CARD.browse);
				if (transfer || channelType) {
					if (props.transferTable.getTransformFormAmount('leftarea') == 1) {
						_this.props.pushTo(_this.state.returnURL, {
							type: _this.state.returnType,
							appcode: _this.state.appcode
						});
					} else {
						_this.indexstatus = {};
						props.transferTable.setTransformFormStatus('leftarea', {
							status: false,
							onChange: (current, next, currentIndex) => {
								showSuccessInfo(getLangByResId(_this, '4001TARGETADJ-000015'));
							}
						});
					}
				} else {
					showSuccessInfo(getLangByResId(_this, '4001TARGETADJ-000015'));
					props.pushTo(TARGETADJ_CARD.cardUrl, {
						status: TARGETADJ_CARD.browse,
						id: nextId,
						pagecode: TARGETADJ_CARD.cardpageid
					});
					pageInfoClick.bind(_this)();
				}
			}
		}
	});
}
