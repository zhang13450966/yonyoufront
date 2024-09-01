/*
 * @Author: tianzhyw 
 * @PageInfo: 卡片页面收回按钮
 * @Date: 2021-06-03 10:41:44 
 * @Last Modified by: tianzhyw 
 * @Last Modified time: 2021-06-03 10:41:44 
 */
import { BUYINGREQ_CARD, BUYINGREQ_LIST, ATTRCODE } from '../../siconst';
import { ajax } from 'nc-lightapp-front';
import { updateCacheData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { updateDtaForCompareByPk } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/compareUtils';
import { buttonController } from '../viewControl';
export default function unCommitBtnClick() {
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
	// 组装数据
	let delRows = [];
	let dataS = {
		id: pk,
		ts: ts,
		bodys: bodys
	};
	delRows.push(dataS);
	// 拼装json
	let data = {
		deleteInfos: delRows,
		pageid: BUYINGREQ_CARD.cardpageid,
		iscard: 'card'
	};
	// 发送请求
	ajax({
		url: BUYINGREQ_CARD.uncommitURL,
		data: data,
		success: (res) => {
			if (res.success) {
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
						vbillcode: '',
						billId: ''
					});
					return;
				}
				//渲染数据前先清空值，
				let pkid;
				let fbillstatus;
				if (res.data.data.head && res.data.data.body) {
					//差异更新
					updateDtaForCompareByPk(this.props, res.data.data, BUYINGREQ_CARD.config);
					pkid = res.data.data.head[BUYINGREQ_CARD.formId].rows[0].values.pk_praybill.value;
					let billId = pkid;
					let pk_srcpraybill = res.data.data.head[BUYINGREQ_CARD.formId].rows[0].values.pk_srcpraybill.value;
					// 上传附件时,不论版本,单据状态如何变化,保证附件关联的是原始主键
					if (pk_srcpraybill) {
						billId = pk_srcpraybill;
					}
					this.setState({
						lineShowType: [],
						vbillcode: res.data.data.head[BUYINGREQ_CARD.formId].rows[0].values.vbillcode.value,
						billId: billId,
						billtype: res.data.data.head[BUYINGREQ_CARD.formId].rows[0].values.vtrantypecode.value
					});
					fbillstatus = res.data.data.head[BUYINGREQ_CARD.formId].rows[0].values.fbillstatus.value;
				}
				updateCacheData(
					this.props,
					ATTRCODE.pk_praybill,
					pkid,
					res.data.data,
					BUYINGREQ_CARD.formId,
					BUYINGREQ_LIST.dataSource
				);
				//设置按钮显示
				buttonController.setButtonByStatus.call(this, this.props, fbillstatus);
				this.toggleShow();
				showSuccessInfo(getLangByResId(this, '4004PRAYBILLR-000034')); /* 国际化处理： 收回成功！*/
				buttonController.lineSelected.call(this);
			}
		}
	});
}
