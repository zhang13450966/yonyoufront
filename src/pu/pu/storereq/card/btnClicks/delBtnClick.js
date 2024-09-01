/*
 * @Author: zhangchangqing 
 * @PageInfo: 删除按钮事件
 * @Date: 2018-04-19 10:36:58 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-11 22:27:37
 */
import { STOREREQ_CARD, ATTRCODE, STOREREQ_LIST } from '../../siconst';
import { ajax } from 'nc-lightapp-front';
import { getNextId, deleteCacheData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { showWarningDialog, showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import pageInfoClick from './pageInfoClick';
export default function clickDelBtn(props) {
	showWarningDialog(getLangByResId(this, '4004STOREREQ-000046'), getLangByResId(this, '4004STOREREQ-000028'), {
		/* 国际化处理： 确认要删除吗？*/
		beSureBtnClick: backtotransfer.bind(this, props)
	});
}
function backtotransfer(props) {
	//自己的逻辑
	let _this = this;
	let pk = this.props.form.getFormItemsValue(STOREREQ_CARD.formId, ATTRCODE.pk_storereq).value;
	let ts = this.props.form.getFormItemsValue(STOREREQ_CARD.formId, ATTRCODE.ts).value;
	let rows = props.cardTable.getAllRows(STOREREQ_CARD.tableId);
	let bodys = [];
	rows.forEach((row) => {
		bodys.push({
			id: row.values[STOREREQ_CARD.config.bodyPKfield].value,
			ts: row.values[ATTRCODE.ts].value
		});
	});
	ajax({
		url: STOREREQ_CARD.deleteURL,
		data: {
			id: pk,
			ts: ts,
			bodys: bodys
		},
		success: function(res) {
			let { success, data } = res;
			if (success) {
				let transfer = _this.props.getUrlParam(STOREREQ_CARD.type);
				//props.form.setFormStatus(STOREREQ_CARD.formId, STOREREQ_CARD.browse);
				let nextId = getNextId(props, pk, STOREREQ_LIST.dataSource);
				deleteCacheData(props, ATTRCODE.pk_storereq, pk, STOREREQ_LIST.dataSource);
				if (transfer) {
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
								showSuccessInfo(getLangByResId(_this, '4004STOREREQ-000037'));
							}
						});
					}
				} else {
					props.pushTo(STOREREQ_CARD.cardUrl, {
						status: STOREREQ_CARD.browse,
						id: nextId,
						pagecode: STOREREQ_CARD.cardpageid
					});
					pageInfoClick.bind(_this)();
					showSuccessInfo(getLangByResId(_this, '4004STOREREQ-000037')); /* 国际化处理： 删除成功！*/
				}
			}
		}
	});
}
