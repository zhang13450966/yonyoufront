/*
 * @Author: zhangchangqing 
 * @PageInfo: 删除按钮事件
 * @Date: 2018-04-19 10:36:58 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-11-11 15:23:02
 */
import { BUYINGREQ_CARD, FBILLSTATUS, BUYINGREQ_LIST, ATTRCODE } from '../../siconst';
import { ajax } from 'nc-lightapp-front';
import { updateCacheData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo, showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { updateDtaForCompareByPk } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/compareUtils';
//import { cachedata } from '../afterEvents/headAfterEvent';
import { buttonController } from '../viewControl';
import { setBtnShow } from './pageInfoClick';
import { showResumeModal } from 'scmpub/scmpub/components/ResumeModal';
let formId = BUYINGREQ_CARD.formId; //'head';
let tableId = BUYINGREQ_CARD.tableId;
export default function clickBtn(props, assign, skipCodes) {
	// 获取选中行

	let _this = this;
	this.props.cardTable.selectAllRows(tableId, false);
	let pk = this.props.form.getFormItemsValue(formId, ATTRCODE.pk_praybill).value;
	let ts = this.props.form.getFormItemsValue(formId, ATTRCODE.ts).value;
	let channelType = _this.props.getUrlParam(BUYINGREQ_CARD.channelType);
	let transfer = this.props.getUrlParam(BUYINGREQ_CARD.type);
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
		pageid: BUYINGREQ_CARD.cardpageid,
		iscard: 'card'
	};
	if (assign) {
		data['assign'] = JSON.stringify(assign);
	}
	if (skipCodes instanceof Array) {
		data['skipCodes'] = skipCodes;
	} else {
		skipCodes = skipCodes ? [ skipCodes ] : new Array();
		data['skipCodes'] = skipCodes;
	}
	// 发送请求
	ajax({
		url: BUYINGREQ_CARD.commitURL,
		data: data,
		success: (res) => {
			if (
				res.data &&
				res.data.workflow &&
				(res.data.workflow == 'approveflow' || res.data.workflow == 'workflow')
			) {
				_this.setState({
					compositedata: res.data,
					compositedisplay: true
				});
				return;
			}
			if (res.success) {
				if (res.data.isResume && res.data.isResume == true) {
					showResumeModal.bind(this)(
						props,
						'ResumeMessageDlg',
						skipCodes,
						res.data,
						clickBtn,
						props,
						assign
						// null
					);
					return false;
				}
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(res.formulamsg);
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
					//this.props.form.setAllFormValue({ [formId]: res.data.data.head[formId] });
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
				if (transfer || channelType) {
					//转单
					_this.props.transferTable.setTransformFormStatus(BUYINGREQ_CARD.leftarea, {
						status: true,
						onChange: (current, next, currentIndex) => {
							this.indexstatus[currentIndex] = BUYINGREQ_CARD.browse;
						}
					});
				}

				//更新缓存
				//cachedata.call(_this, tableId);
				showSuccessInfo(getLangByResId(this, '4004PRAYBILL-000029')); /* 国际化处理： 提交成功！*/
				buttonController.lineSelected.call(this);
			}
		}
	});
}
