/*
 * @Author: zhangchangqing 
 * @PageInfo: 收回按钮事件
 * @Date: 2018-04-19 10:36:58 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-11-11 13:53:50
 */
import { STOREREQ_CARD, ATTRCODE, STOREREQ_LIST } from '../../siconst';
import { ajax } from 'nc-lightapp-front';
import { updateCacheData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { setBtnShow } from './pageInfoClick';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo, showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { updateDtaForCompareByPk } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/compareUtils';
let formId = STOREREQ_CARD.formId; //'head';
let tableId = STOREREQ_CARD.tableId;
export default function clickBtn(props) {
	// 获取选中行
	let _this = this;
	this.props.cardTable.selectAllRows(tableId, false);
	let pk = this.props.form.getFormItemsValue(formId, ATTRCODE.pk_storereq).value;
	let ts = this.props.form.getFormItemsValue(formId, ATTRCODE.ts).value;
	let bdata = props.cardTable.getAllRows(STOREREQ_CARD.tableId);
	let flag = false;
	let bodys = [];
	bdata.forEach((item) => {
		//如果是维修计划推过来的单据，不允许收回
		if (
			'4B32' == item.values.csourcetypecode.value ||
			'1001Z900000000002213' == item.values.csourcetypecode.value
		) {
			flag = true;
		}
		bodys.push({
			id: item.values[STOREREQ_CARD.config.bodyPKfield].value,
			ts: item.values[ATTRCODE.ts].value
		});
	});
	if (flag) {
		showWarningInfo(null, getLangByResId(this, '4004STOREREQ-000058')); /* 维修计划生成的申请单不允许收回*/
		return;
	}
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
		pageid: STOREREQ_CARD.cardpageid,
		iscard: 'card'
	};
	// 发送请求
	ajax({
		url: STOREREQ_CARD.uncommitURL,
		data: data,
		success: (res) => {
			if (res.success) {
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
						_this.setState({
							vbillcode: '',
							billId: ''
						});
						return;
					}
					//渲染数据，
					let pkid;
					if (res.data.data.head && res.data.data.body) {
						updateDtaForCompareByPk(_this.props, res.data.data, STOREREQ_CARD.config);
						pkid = res.data.data.head[formId].rows[0].values.pk_storereq.value;
						_this.setState({
							lineShowType: [],
							vbillcode: res.data.data.head[formId].rows[0].values.vbillcode.value,
							billId: pkid,
							billtype: res.data.data.head[formId].rows[0].values.vtrantypecode.value
						});
						let fbillstatus = res.data.data.head[formId].rows[0].values.fbillstatus.value;
						// 设置按钮可用性
						setBtnShow(_this, fbillstatus);
					}

					updateCacheData(
						_this.props,
						ATTRCODE.pk_storereq,
						pkid,
						res.data.data,
						formId,
						STOREREQ_LIST.dataSource
					);
					showSuccessInfo(getLangByResId(_this, '4004STOREREQ-000038')); /* 国际化处理： 收回成功！*/
				}
			}
		}
	});
}
