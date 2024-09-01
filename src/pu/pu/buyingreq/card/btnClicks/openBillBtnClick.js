/*
 * @Author: zhangchangqing 
 * @PageInfo: 整单打开按钮事件
 * @Date: 2018-04-19 10:36:58 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-11-11 15:28:14
 */
import { BUYINGREQ_CARD, BUYINGREQ_LIST, ATTRCODE } from '../../siconst';
import { ajax, toast } from 'nc-lightapp-front';
import { updateCacheData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
//import { cachedata } from '../afterEvents/headAfterEvent';
import { setBtnShow } from './pageInfoClick';
let formId = BUYINGREQ_CARD.formId; //'head';
let tableId = BUYINGREQ_CARD.tableId;

export default function clickBtn(props) {
	// 获取选中行

	let _this = this;
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
	// 执行打开或者关闭操作
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
		pageid: BUYINGREQ_CARD.cardpageid
	};
	// 发送请求
	ajax({
		url: BUYINGREQ_CARD.openBillForCardURL,
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
				if (res.data.head) {
					this.props.form.setAllFormValue({ [formId]: res.data.head[formId] });
					this.setState({
						lineShowType: [],
						vbillcode: res.data.head[formId].rows[0].values.vbillcode.value,
						billId: res.data.head[formId].rows[0].values.pk_praybill.value,
						billtype: res.data.head[formId].rows[0].values.vtrantypecode.value
					});
					let fbillstatus = res.data.head[formId].rows[0].values.fbillstatus.value;
					//设置按钮显示
					setBtnShow(_this, fbillstatus);
				}
				let pkid = res.data.head[formId].rows[0].values.pk_praybill.value;
				updateCacheData(this.props, ATTRCODE.pk_praybill, pkid, res.data, formId, BUYINGREQ_LIST.dataSource);
				if (res.data.body) {
					this.props.cardTable.setTableData(tableId, res.data.body[tableId]);
				}
				//更新缓存
				//cachedata.call(this, tableId);
				showSuccessInfo(getLangByResId(this, '4004PRAYBILL-000053')); /* 国际化处理： 整单打开成功！*/
			}
		}
	});
}
