/*
 * @Author: zhangchangqing 
 * @PageInfo: 修改按钮事件
 * @Date: 2018-04-19 10:35:28 
 * @Last Modified by: tianzhyw
 * @Last Modified time: 2021-09-10 09:53:37
 */
import { ajax } from 'nc-lightapp-front';
import { BUYINGREQ_CARD, ATTRCODE, FBILLSTATUS } from '../../siconst';
import { buttonController } from '../viewControl';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
export default function clickEditBtn(props) {
	// 整单关闭时
	let fbillstatus = this.props.form.getFormItemsValue(BUYINGREQ_CARD.formId, 'fbillstatus').value;
	if (fbillstatus == FBILLSTATUS.other) {
		showWarningInfo(getLangByResId(this, '4004PRAYBILLR-000039') /* 国际化处理： 该订单已整单关闭，如需修订，请打开*/);
		return;
	}
	props.pushTo(BUYINGREQ_CARD.cardUrl, {
		status: BUYINGREQ_CARD.edit,
		id: this.props.getUrlParam(BUYINGREQ_CARD.id)
	});
	let data = { keyword: this.props.getUrlParam(BUYINGREQ_CARD.id), pageid: this.pageId, type: BUYINGREQ_CARD.card };
	if (data.keyword === 'undefined') {
		this.setState({
			vbillcode: ''
		});
		return;
	}
	ajax({
		url: BUYINGREQ_CARD.queryCardInfoURL,
		data: data,
		success: (res) => {
			if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				props.dealFormulamsg(
					res.formulamsg, //参数一：返回的公式对象
					{
						//参数二：界面使用的表格类型
						card_body: 'cardTable'
					}
				);
			}
			if (data === undefined) {
				//订单编号
				this.setState({
					vbillcode: ''
				});
				return;
			}
			this.setState({
				lineShowType: [],
				vbillcode: props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.vbillcode).value
			});
			// 设置按钮可用性
			//this.isActionEnable();
			buttonController.setCardPaginationVisible(this.props, false); //设置翻页不显示
			//修改组织的可编辑状态
			this.props.form.setFormItemsDisabled(BUYINGREQ_CARD.formId, { [BUYINGREQ_CARD.pk_org_v]: true });
			this.props.cardTable.selectAllRows(BUYINGREQ_CARD.tableId, false);
			this.toggleShow();
			//设置按钮显示
			// props.pushTo(BUYINGREQ_LIST.cardUrl, { status: BUYINGREQ_LIST.edit });
			buttonController.setButtonByStatus.call(this, this.props);
		}
	});
}
