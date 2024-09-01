/*
 * @Author: 刘奇 
 * @PageInfo: 费用冲抵  
 * @Date: 2019-03-15 14:15:02 
 * @Last Modified by: zhaoqiangq
 * @Last Modified time: 2022-04-18 16:02:40
 */

import { ajax } from 'nc-lightapp-front';
import { ARSUB_CONST, ArsubHeadItem } from '../../const';
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import CasharsubDetailDlg from '../../detail/index';
export default function buttonClick(props) {
	// 点击表头钮
	let seldatas = props.table.getCheckedRows(ARSUB_CONST.formId);
	if (seldatas == null || seldatas.length == 0) {
		showErrorInfo(null, getLangByResId(this, '4006ARSUB-000018')); /* 国际化处理： 请选择要操作的单据！*/
		return;
	}
	let corigcurrencyid = seldatas[0].data.values[ArsubHeadItem.corigcurrencyid].value;
	let pks = [ seldatas[0].data.values[ArsubHeadItem.carsubid].value ];
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
					),
					noFooter: true
				});
			}
		}
	});
}
