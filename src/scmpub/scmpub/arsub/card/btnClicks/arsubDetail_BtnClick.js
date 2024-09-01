/*
 * @Author: 刘奇 
 * @PageInfo: 费用冲抵  
 * @Date: 2019-03-15 14:15:02 
 * @Last Modified by: zhangllb
 * @Last Modified time: 2022-05-19 14:23:27
 */

import { ajax } from 'nc-lightapp-front';
import { ARSUB_CONST, ArsubHeadItem } from '../../const';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import CasharsubDetailDlg from '../../detail/index';
export default function buttonClick(props) {
	let corigcurrencyid = props.form.getFormItemsValue(ARSUB_CONST.formId, ArsubHeadItem.corigcurrencyid).value;
	let pks = [ props.form.getFormItemsValue(ARSUB_CONST.formId, ArsubHeadItem.carsubid).value ];
	ajax({
		url: ARSUB_CONST.queryDetailUrl,
		data: { pks: pks, pageid: ARSUB_CONST.detailPageId, corigcurrencyid: corigcurrencyid },
		success: (res) => {
			if (res.success) {
				let scale = 8;
				props.modal.show('modal', {
					size: 'xlg',
					title: getLangByResId(this, '4006ARSUB-000025') /* 国际化处理： 费用冲抵情况*/,
					content: (
						<div class="flex-container" style={{ height: '100%' }}>
							<CasharsubDetailDlg billQueryPara={res.data} props={this.props} decimaldigit={scale} />
						</div>
					)
				});
			}
		}
	});
}
