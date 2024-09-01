/*
 * @Author: jiangphk
 * @PageInfo: 联查预算
 * @Date: 2018-06-25 09:56:26 
 * @Last Modified by: jiangphk
 * @Last Modified time: 2019-03-25 15:48:35
 */
import { FIELDS, REQUESTURL, AREA } from '../../constance';
import { ajax } from 'nc-lightapp-front';
import { showWarningInfo } from 'src/scmpub/scmpub/pub/tool/messageUtil.js';
import { getLangByResId } from 'src/scmpub/scmpub/pub/tool/multiLangUtil';

export default function(props) {
	let pk_taxinvoice = props.form.getFormItemsValue(AREA.cardFormId, FIELDS.pk_taxinvoice).value;
	ajax({
		url: REQUESTURL.linkQueryBudget,
		data: { pk: pk_taxinvoice },
		success: (res) => {
			if (res.data) {
				this.setState({
					inspectionSourceData: res.data,
					showInspection: true
				});
			}
		}
	});
}
