/*
 * @Author: zhangchangqing 
 * @PageInfo: 收回按钮事件
 * @Date: 2018-04-19 10:36:58 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-11-11 15:28:43
 */
import { BUYINGREQ_CARD, FBILLSTATUS, BUYINGREQ_LIST, ATTRCODE } from '../../siconst';
import { ajax, toast } from 'nc-lightapp-front';
import { updateCacheData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo, showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { updateDtaForCompareByPk } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/compareUtils';
import { setBtnShow } from './pageInfoClick';
import { buttonController } from '../viewControl';
//import { cachedata } from '../afterEvents/headAfterEvent';
let formId = BUYINGREQ_CARD.formId; //'head';
let tableId = BUYINGREQ_CARD.tableId;
export default function clickBtn(props) {
	// 获取选中行

	let _this = this;
	this.props.cardTable.selectAllRows(tableId, false);
	let pk = this.props.form.getFormItemsValue(formId, ATTRCODE.pk_praybill).value;
	let ts = this.props.form.getFormItemsValue(formId, ATTRCODE.ts).value;
	let rows = this.props.cardTable.getAllRows(tableId);
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
				if (res.data.data.head && res.data.data.body) {
					updateDtaForCompareByPk(this.props, res.data.data, BUYINGREQ_CARD.config);
					pkid = res.data.data.head[formId].rows[0].values.pk_praybill.value;
					this.setState({
						lineShowType: [],
						vbillcode: res.data.data.head[formId].rows[0].values.vbillcode.value,
						billId: pkid,
						billtype: res.data.data.head[formId].rows[0].values.vtrantypecode.value
					});
					let fbillstatus = res.data.data.head[formId].rows[0].values.fbillstatus.value;
					//设置按钮显示
					setBtnShow(_this, fbillstatus);
				}
				updateCacheData(
					this.props,
					ATTRCODE.pk_praybill,
					pkid,
					res.data.data,
					formId,
					BUYINGREQ_LIST.dataSource
				);
				//cachedata.call(this, tableId);
				//成功之后重新查询数据
				showSuccessInfo(getLangByResId(this, '4004PRAYBILL-000050')); /* 国际化处理： 收回成功！*/
				buttonController.lineSelected.call(this);
			}
		}
	});
}
