/*
 * @Author: zhangchangqing 
 * @PageInfo: 删除按钮事件
 * @Date: 2018-04-19 10:36:58 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-11-11 13:53:32
 */
import { STOREREQ_CARD, FBILLSTATUS, ATTRCODE, STOREREQ_LIST } from '../../siconst';
import { ajax, toast } from 'nc-lightapp-front';
import pageInfoClick from './pageInfoClick';
import { updateCacheData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo, showErrorInfo, showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { updateDtaForCompareByPk } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/compareUtils';
import { setBtnShow } from './pageInfoClick';
let formId = STOREREQ_CARD.formId; //'head';
let tableId = STOREREQ_CARD.tableId;
export default function clickBtn(props, assign) {
	// 获取选中行
	let _this = this;
	let fbillstatus = this.props.form.getFormItemsValue(formId, ATTRCODE.fbillstatus).value;
	if (fbillstatus != FBILLSTATUS.free && fbillstatus != FBILLSTATUS.unapproved) {
		showWarningInfo(getLangByResId(_this, '4004STOREREQ-000010')); /* 国际化处理： 请选择状态为自由的数据！*/
		return;
	}
	this.props.cardTable.selectAllRows(tableId, false);
	let transfer = this.props.getUrlParam(STOREREQ_CARD.type);
	let pk = this.props.form.getFormItemsValue(formId, ATTRCODE.pk_storereq).value;
	let ts = this.props.form.getFormItemsValue(formId, ATTRCODE.ts).value;

	let rows = this.props.cardTable.getAllRows(tableId);
	let bodys = [];
	rows.forEach((row) => {
		bodys.push({
			id: row.values[STOREREQ_CARD.config.bodyPKfield].value,
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
		pageid: STOREREQ_CARD.cardpageid,
		iscard: 'card'
	};
	if (assign) {
		data['assign'] = JSON.stringify(assign);
	}
	// 发送请求
	ajax({
		url: STOREREQ_CARD.commitURL,
		data: data,
		success: (res) => {
			if (
				res.data &&
				res.data.workflow &&
				(res.data.workflow == 'approveflow' || res.data.workflow == 'workflow')
			) {
				//缓存当前数据
				// this.commitInfo = {
				// 	record: record,
				// 	index: index
				// };
				_this.setState({
					compositedata: res.data,
					compositedisplay: true
				});
				return;
			}
			if (res.success) {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(res.formulamsg);
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
					pkid = _this.props.form.getFormItemsValue(formId, ATTRCODE.pk_storereq).value;
					let fbillstatus = res.data.data.head[formId].rows[0].values.fbillstatus.value;
					_this.setState({
						lineShowType: [],
						vbillcode: res.data.data.head[formId].rows[0].values.vbillcode.value,
						billId: pkid,
						billtype: res.data.data.head[formId].rows[0].values.vtrantypecode.value
					});
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
				if (transfer) {
					//转单
					_this.props.transferTable.setTransformFormStatus(STOREREQ_CARD.leftarea, {
						status: true,
						onChange: (current, next, currentIndex) => {
							this.indexstatus[currentIndex] = STOREREQ_CARD.browse;
						}
					});
				}
				showSuccessInfo(getLangByResId(_this, '4004STOREREQ-000020')); /* 国际化处理： 提交成功！*/
			}
		}
	});
}
