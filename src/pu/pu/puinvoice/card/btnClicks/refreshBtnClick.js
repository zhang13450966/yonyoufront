/*
* @Author: jiangfw 
* @PageInfo: 刷新按钮
* @Date: 2018-08-24 11:22:54 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2019-02-28 17:36:42
*/
import { getHeadValue } from '../utils/cardUtil';
import { FIELD, URL, PAGECODE, AREA, UISTATE } from '../../constance';
import pageInfoClick from './pageInfoClick';
import { ajax } from 'nc-lightapp-front';
import { showSuccessInfo, showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { cacheData } from '../utils/cacheData';
import btnController from '../viewControl/btnController';
let formId = AREA.card_head;
let tableId = AREA.card_body;

export default function clickRefreshBtn(transferFlag) {
	let props = this.props;

	let type = props.getUrlParam('type');
	let pk_invoice = getHeadValue(props, FIELD.pk_invoice).value;
	let data = { pks: [ pk_invoice ], pagecode: PAGECODE.invoiceCard };

	if (type) {
		ajax({
			url: URL.queryCard,
			data: data,
			success: (res) => {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(res.formulamsg);
				}

				if (res.data === undefined) {
					//单据号
					this.setState({
						billcode: '',
						pk_invoice: ''
					});
					this.props.form.EmptyAllFormValue(formId);
					this.props.cardTable.setTableData(tableId, { rows: [] });
					return;
				}

				if (res.data.head && res.data.body) {
					this.props.form.setAllFormValue({
						[formId]: res.data.head[formId]
					});
					this.props.cardTable.setTableData(tableId, res.data.body[tableId]);

					this.setState({
						billcode: res.data.head[formId].rows[0].values.vbillcode.value,
						pk_invoice: res.data.head[formId].rows[0].values.pk_invoice.value
					});
					// 缓存数据
					cacheData.call(this, AREA.card_body);
					// 设置按钮可用性
					btnController.call(this, UISTATE.browse);
				}
			},
			error: (res) => {
				showErrorInfo(res.message);
			}
		});
	} else {
		let refresh = true;
		pageInfoClick.call(this, this.props, pk_invoice, refresh);
	}

	if (!transferFlag) {
		showSuccessInfo(getLangByResId(this, '4004PUINVOICE-000076' /* 国际化处理： 刷新成功！*/));
	}
}
