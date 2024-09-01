/*
 * @Author: zhangchangqing
 * @PageInfo: 保存按钮事件
 * @Date: 2018-04-19 10:35:13
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-07-23 14:13:55
 */
import { TARGETADJ_CARD, TARGETADJ_LIST, ATTRCODES, ATTRCODE } from '../../siconst';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { ajax } from 'nc-lightapp-front';
import { addCacheData, updateCacheData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { showSaveAndCommitInfo, showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { setBtnShow } from './pageInfoClick';
import { buttonController } from '../viewControl';

let tableId = TARGETADJ_CARD.tableId;
let formId = TARGETADJ_CARD.formId;
let cardpageid = TARGETADJ_CARD.cardpageid;

export default function saveAndCommit(skipCodes, assign) {
	//过滤表格空行
	let props = this.props;
	props.cardTable.filterEmptyRows(tableId, [ ATTRCODES.ccustomerid ], 'include');
	if (!props.cardTable.getAllRows(tableId).length) {
		showErrorInfo(null, getLangByResId(this, '4001TARGETADJ-000021')); /* 国际化处理： 表体为空*/
		return;
	}
	let flag = props.validatePageToToast([
		{ name: TARGETADJ_CARD.formId, type: 'form' },
		{ name: TARGETADJ_CARD.tableId, type: 'cardTable' }
	]);
	if (!flag.allPassed) {
		return;
	}
	backtotransfer.call(this, skipCodes, assign);
}
function backtotransfer(skipCodes, assign) {
	let _this = this;
	let props = _this.props;
	let cmarsetid = this.props.form.getFormItemsValue(TARGETADJ_CARD.headf, ATTRCODE.cmarsetid);
	if (cmarsetid && cmarsetid.value) {
		this.props.form.setFormItemsValue(TARGETADJ_CARD.formId, {
			cmarsetid: { value: cmarsetid.value, display: cmarsetid.display }
		});
	}
	let vperiod = this.props.form.getFormItemsValue(TARGETADJ_CARD.headf, ATTRCODE.vperiod);
	if (vperiod && vperiod.value) {
		this.props.form.setFormItemsValue(TARGETADJ_CARD.formId, {
			vperiod: { value: vperiod.value, display: vperiod.display }
		});
	}
	let ctargetid = this.props.form.getFormItemsValue(TARGETADJ_CARD.headf, ATTRCODE.ctargetid);
	this.props.form.setFormItemsValue(TARGETADJ_CARD.formId, {
		ctargetid: { value: ctargetid.value, display: ctargetid.display }
	});
	//自己的逻辑
	let data = props.createMasterChildDataSimple(cardpageid, formId, tableId);
	let rows = [];
	data.body.card_body.rows.map((item, index) => {
		item.values.pseudocolumn.value = index + '';
		let sta = item.status;
		if (sta == 2) {
			item.values.pk_targetadj.value = null;
			item.values.pk_targetadj_b.value = null;
		}
		if (sta != 3) {
			rows.push(item);
		}
	});
	data.pageid = cardpageid;
	data.templetid = this.state.templetid;
	let status = props.getUrlParam(TARGETADJ_CARD.status);

	//判断单据的表头pk是否存在，不存在是为新增
	let pk_targetadj = data.head.card_head.rows[0].values.pk_targetadj.value;
	if (pk_targetadj) {
	} else {
		data.body.card_body.rows = rows;
	}
	if (assign) {
		data['assign'] = JSON.stringify(assign);
	}
	this.props.cardTable.selectAllRows(TARGETADJ_CARD.tableId, false);
	this.props.validateToSave(data, () => {
		ajax({
			url: TARGETADJ_CARD.saveandcommit,
			data: data,
			success: (res) => {
				props.beforeUpdatePage();
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(res.formulamsg);
				}
				let pk_targetadj = null;
				if (res.success) {
					if (
						res.data &&
						res.data.workflow &&
						(res.data.workflow == 'approveflow' || res.data.workflow == 'workflow')
					) {
						_this.skipCodes = data['skipCodes'];
						_this.setState({
							compositedata: res.data,
							compositedisplay: true,
							saveAndCommit: true
						});
						return;
					}
					if (res.data) {
						//如果是转单，设置转单的缓存
						let dataSource = TARGETADJ_LIST.dataSource;

						if (res.data.data.body && res.data.data.body[TARGETADJ_CARD.tableId]) {
							let fullTableData = props.cardTable.updateDataByRowId(
								TARGETADJ_CARD.tableId,
								res.data.data.body[TARGETADJ_CARD.tableId],
								true
							);
							res.data.data.body[TARGETADJ_CARD.tableId] = fullTableData;
							props.cardTable.setStatus(TARGETADJ_CARD.tableId, TARGETADJ_CARD.browse);
						}
						if (res.data.data.head && res.data.data.head[formId]) {
							props.form.setAllFormValue({ [formId]: res.data.data.head[formId] });
							pk_targetadj = this.props.form.getFormItemsValue(formId, 'pk_targetadj').value;

							let vbillcode = this.props.form.getFormItemsValue(formId, 'vbillcode').value;
							//订单编号
							_this.setState({
								vbillcode: vbillcode,
								billId: pk_targetadj
							});
							if (status == TARGETADJ_CARD.add) {
								//加入到缓存中
								addCacheData(
									props,
									'pk_targetadj',
									pk_targetadj,
									res.data.data,
									TARGETADJ_CARD.formId,
									dataSource
								);
								// 更新翻页组件当前pk值
								props.cardPagination.setCardPaginationId({
									id: pk_targetadj,
									status: 1
								});
							} else if (status == TARGETADJ_CARD.edit) {
								updateCacheData(
									props,
									'pk_targetadj',
									pk_targetadj,
									res.data.data,
									TARGETADJ_CARD.formId,
									dataSource
								);
							}
						}

						props.setUrlParam({ status: TARGETADJ_CARD.browse, id: pk_targetadj });
						let fstatusflag = res.data.data.head[formId].rows[0].values.fstatusflag.value;
						//设置按钮显示
						setBtnShow(_this, fstatusflag);
						buttonController.setBackButtonVisiable.call(_this, props);
						buttonController.lineSelected.call(_this, props);
						_this.skipCodes = [];
						showSaveAndCommitInfo();
					}
				}
				props.updatePage(formId, TARGETADJ_CARD.tableId);
			}
		});
	});
}
