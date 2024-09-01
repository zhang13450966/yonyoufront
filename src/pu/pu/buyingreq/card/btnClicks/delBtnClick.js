/*
 * @Author: zhangchangqing 
 * @PageInfo: 删除按钮事件
 * @Date: 2018-04-19 10:36:58 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 17:19:26
 */
import { BUYINGREQ_CARD, BUYINGREQ_LIST, ATTRCODE } from '../../siconst';
import { ajax, toast } from 'nc-lightapp-front';
import { getNextId, deleteCacheData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { showWarningDialog, showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import pageInfoClick from './pageInfoClick';
export default function clickDelBtn(props) {
	showWarningDialog(getLangByResId(this, '4004PRAYBILL-000057'), getLangByResId(this, '4004PRAYBILL-000037'), {
		/* 国际化处理： 确认要删除吗？*/
		beSureBtnClick: backtotransfer.bind(this, props)
	});
}

function backtotransfer(props) {
	//自己的逻辑
	let _this = this;
	let pk = this.props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.pk_praybill).value;
	let ts = this.props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.ts).value;
	let rows = this.props.cardTable.getAllRows(BUYINGREQ_CARD.tableId);
	let bodys = [];
	rows.forEach((row) => {
		bodys.push({
			id: row.values[BUYINGREQ_CARD.config.bodyPKfield].value,
			ts: row.values[ATTRCODE.ts].value
		});
	});
	ajax({
		url: BUYINGREQ_CARD.deleteURL,
		data: {
			id: pk,
			ts: ts,
			bodys: bodys
		},
		success: function(res) {
			let { success, data } = res;
			if (success) {
				let channelType = _this.props.getUrlParam(BUYINGREQ_CARD.channelType);
				let transfer = _this.props.getUrlParam(BUYINGREQ_CARD.type);
				let nextId = getNextId(props, pk, BUYINGREQ_LIST.dataSource);
				deleteCacheData(props, 'pk_praybill', pk, BUYINGREQ_LIST.dataSource);
				props.form.setFormStatus(BUYINGREQ_CARD.formId, BUYINGREQ_CARD.browse);
				if (transfer || channelType) {
					if (props.transferTable.getTransformFormAmount('leftarea') == 1) {
						_this.props.pushTo(_this.state.returnURL, {
							type: _this.state.returnType,
							appcode: _this.state.appcode,
							pagecode: BUYINGREQ_LIST.transferList
						});
					} else {
						_this.indexstatus = {};
						props.transferTable.setTransformFormStatus('leftarea', {
							status: false,
							onChange: (current, next, currentIndex) => {
								// toast({
								// 	color: 'success',
								// 	content: getLangByResId(_this, '4004PRAYBILL-000015') /* 国际化处理： 删除成功！*/
								// });
								showSuccessInfo(getLangByResId(_this, '4004PRAYBILL-000015'));
							}
						});
					}
				} else {
					props.pushTo(BUYINGREQ_CARD.cardUrl, {
						status: BUYINGREQ_CARD.browse,
						id: nextId,
						pagecode: BUYINGREQ_CARD.cardpageid
					});
					pageInfoClick.bind(_this)();
					showSuccessInfo(getLangByResId(_this, '4004PRAYBILL-000015'));
				}
			}
		}
	});
}
