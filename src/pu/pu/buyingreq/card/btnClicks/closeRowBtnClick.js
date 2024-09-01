/*
 * @Author: zhangchangqing 
 * @PageInfo: 删除按钮事件
 * @Date: 2018-04-19 10:36:58 
 * @Last Modified by: zhr
 * @Last Modified time: 2020-09-18 17:11:24
 */
import { BUYINGREQ_CARD, FBILLSTATUS, BUYINGREQ_LIST, ATTRCODE, ATTRCODES } from '../../siconst';
import { ajax, toast } from 'nc-lightapp-front';
import { updateCacheData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo, showErrorInfo, showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
//import { cachedata } from '../afterEvents/headAfterEvent';
import { setBtnShow } from './pageInfoClick';
let formId = BUYINGREQ_CARD.formId; //'head';
let tableId = BUYINGREQ_CARD.tableId;

export default function closeRowBtnClick(props, text, record, index) {
	// 获取选中行  区分行操作或者是  肩上按钮
	
	let _this = this;
	if (record != undefined) {
		// 获取待删除表格行的行号
		let indexs = [ index ];
		let ts = props.form.getFormItemsValue(formId, ATTRCODE.ts).value;
		let b_ts = props.cardTable.getValByKeyAndIndex(BUYINGREQ_CARD.tableId, index, ATTRCODES.ts).value;
		// 拼装json
		let data = {
			pageid: BUYINGREQ_CARD.cardpageid,
			id: record.values.pk_praybill.value,
			selectIndex: indexs,
			ts: ts,
			bts: b_ts
		};
		// 发送请求
		ajax({
			url: BUYINGREQ_CARD.lineCloseURL,
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
					updateCacheData(
						this.props,
						ATTRCODE.pk_praybill,
						pkid,
						res.data,
						formId,
						BUYINGREQ_LIST.dataSource
					);
					if (res.data.body) {
						this.props.cardTable.setTableData(tableId, res.data.body[tableId]);
					}
					this.props.cardTable.setStatus(formId, BUYINGREQ_CARD.browse);
					//this.props.form.setFormStatus(tableId, BUYINGREQ_CARD.browse);
					//更新缓存
					//cachedata.call(this, BUYINGREQ_CARD.tableId);
					//成功之后重新查询数据
					showSuccessInfo(getLangByResId(this, '4004PRAYBILL-000011')); /* 国际化处理： 行关闭成功！*/
				} else {
					showErrorInfo(getLangByResId(this, '4004PRAYBILL-000009')); /* 国际化处理： 行关闭失败！*/
				}
			}
		});
	} else {
		let rows = props.table.getCheckedRows(formId);
		// 如果没有选中行，则提示并返回，不进行任何操作
		if (rows.length <= 0) {
			showWarningInfo(getLangByResId(this, '4004PRAYBILL-000010')); /* 国际化处理： 请选择需要操作的数据！*/
			return;
		}
		// 获取待删除表格行的行号
		let indexs = rows.map((item) => {
			return item.index;
		});

		// 拼装json
		let data = {
			id: BUYINGREQ_CARD.cardpageid,
			id: this.props.getUrlParam(BUYINGREQ_CARD.id),
			selectIndex: indexs
		};
		// 发送请求
		ajax({
			url: BUYINGREQ_CARD.lineCloseURL,
			data: data,
			success: (res) => {
				if (res.success) {
					showSuccessInfo(getLangByResId(this, '4004PRAYBILL-000011')); /* 国际化处理： 行关闭成功！*/
				} else {
					showErrorInfo(getLangByResId(this, '4004PRAYBILL-000009')); /* 国际化处理： 行关闭失败！*/
				}
			}
		});
	}
}
