/*
 * @Author: zhaochyu 
 * @PageInfo: 承运商定义保存
 * @Date: 2020-02-19 17:49:26 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-08-03 10:45:18
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, URL, PAGEID, STATUS, FILED } from '../../constance';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function saveBtnClick(props) {
	let flag = this.props.validatePageToToast([ { name: AREA.card_head, type: 'form' } ]);
	if (!flag.allPassed) {
		return;
	}
	let status = this.props.getUrlParam(FILED.cardStatus);
	let data = this.props.createMasterChildDataSimple(PAGEID.cardpagecodeorg, AREA.card_head, AREA.driver);
	let savedata = data.head;
	savedata.pageid = PAGEID.cardpagecodeorg;
	savedata.templetid = data.templetid;
	if (status == STATUS.add) {
		savedata.card_head.rows[0].status = '2';
	} else {
		savedata.card_head.rows[0].status = '1';
	}
	this.props.validateToSave(data, () => {
		ajax({
			url: URL.save,
			data: savedata,
			async: false,
			mode: 'normal',
			success: (res) => {
				if (!res.success) {
					return;
				}
				if (res.data && res.data.card_head) {
					this.props.form.setAllFormValue({ [AREA.card_head]: res.data.card_head });
					showSuccessInfo(getLangByResId(this, '4001CARRIER-000010')); /* 国际化处理： 保存成功!*/
					this.props.setUrlParam({ [FILED.cardStatus]: STATUS.browse });
					this.toggleShow(STATUS.browse);
				}
			}
		});
	});
}
