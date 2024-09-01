/*
 * @Author: zhangchangqing 
 * @PageInfo: 保存按钮事件
 * @Date: 2018-04-19 10:35:13 
 * @Last Modified by: songyt13
 * @Last Modified time: 2022-06-09 14:58:42
 */
import { ajax } from 'nc-lightapp-front';
import { TARGETADJ_CARD, TARGETADJ_LIST, ATTRCODE, ATTRCODES } from '../../siconst';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { addCacheData, updateCacheData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { showWarningDialog, showSuccessInfo, showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
let tableId = TARGETADJ_CARD.tableId;
let formId = TARGETADJ_CARD.formId;
let cardpageid = TARGETADJ_CARD.cardpageid;
export default function clickSaveBtn(props, callback) {
	//过滤表格空行
	this.props.cardTable.filterEmptyRows(tableId, [ ATTRCODES.ccustomerid ], 'include');
	if (!this.props.cardTable.getVisibleRows(tableId).length) {
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
	// 增加单据日期校验
	let date = this.props.form.getFormItemsValue(TARGETADJ_CARD.formId, ATTRCODE.dbilldate);
	if (date && !date.value) {
		showErrorInfo(null, getLangByResId(this, '4001TARGETADJ-000076')); /* 国际化处理： 表体为空*/
		return;
	}
	backtotransfer.call(this, props, callback);
}
function backtotransfer(props, callback) {
	//讲headf表头的数据合并到card_head
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
	let data = this.props.createMasterChildDataSimple(cardpageid, TARGETADJ_CARD.formId, tableId);
	let pk_targetadj = data.head.card_head.rows[0].values.pk_targetadj.value;
	let rows = [];
	data.body.card_body.rows.map((item, index) => {
		item.values.pseudocolumn = { value: index + '' };
		let sta = item.status;
		if (sta == 2) {
			//当没有主键，即新增保存时再处理，修改保存不处理
			if (!pk_targetadj) {
				item.values.pk_targetadj.value = null;
				item.values.pk_targetadj_b.value = null;
			}
		}
		if (sta != 3) {
			if (cmarsetid && cmarsetid.value) {
				item.values.cmarsetid.value = cmarsetid.value;
			} else if (vperiod && vperiod.value) {
				item.values.vperiod.value = vperiod.value;
			}
			rows.push(item);
		}
	});
	data.pageid = cardpageid;
	data.templetid = this.state.templetid;

	let url = '';
	//判断单据的表头pk是否存在，不存在是为新增

	if (pk_targetadj) {
		url = TARGETADJ_CARD.saveURL;
	} else {
		url = TARGETADJ_CARD.newSaveURL;
		data.body.card_body.rows = rows;
	}

	this.props.cardTable.selectAllRows(TARGETADJ_CARD.tableId, false);
	//保存交互式处理
	let value = this.fcyclesetflag;
	if ('3' == value) {
		doSave.call(this, this.props, data, url, callback);
	} else {
		let rws = data.body.card_body.rows;
		let flag = false;
		let ccustomerid;
		for (let rw of rws) {
			let rwval = rw.values;
			let yearValue = 0;
			let monthValue = 0;
			Object.keys(rwval).forEach(function(key) {
				rwval[key].value == '' ? 0 : rwval[key].value;
				if (key.indexOf('changenewyear') != -1) {
					yearValue = parseFloat(rwval[key].value).toFixed(2);
				} else if (key.indexOf('changenew') != -1) {
					monthValue = (parseFloat(monthValue) + parseFloat(rwval[key].value)).toFixed(2);
				}
			});
			ccustomerid = rwval['ccustomerid'].value;
			if (yearValue != monthValue) {
				flag = true;

				break;
			}
		}
		if (flag) {
			let ws = this.props.cardTable.getAllRows(TARGETADJ_CARD.tableId);
			const map1 = new Map();
			for (let rw of ws) {
				map1.set(rw.values['ccustomerid'].value, rw.values['ccustomerid'].display);
			}
			showWarningDialog(
				'',
				getLangByResId(this, '4001TARGETADJ-000074') +
					map1.get(ccustomerid) +
					getLangByResId(this, '4001TARGETADJ-000075') /* 国际化处理： 客户 ,  各期间指标值之和不等于年指标值，是否保存？*/,
				{
					beSureBtnClick: () => {
						doSave.call(this, this.props, data, url, callback);
					},
					cancelBtnClick: () => {}
				}
			);
		} else {
			doSave.call(this, this.props, data, url, callback);
		}

		return;
	}
}
function doSave(props, data, url, callback) {
	this.props.validateToSave(data, () => {
		ajax({
			url: url,
			data: data,
			success: (res) => {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(res.formulamsg);
				}
				let pk_targetadj = null;
				if (res.success) {
					if (res.data && res.data.billCard) {
						this.props.beforeUpdatePage();
						let status = props.getUrlParam(TARGETADJ_CARD.status);

						//如果是转单，设置转单的缓存
						let dataSource = TARGETADJ_LIST.dataSource;
						if (res.data.billCard.body && res.data.billCard.body[TARGETADJ_CARD.tableId]) {
							props.cardTable.setTableData(
								TARGETADJ_CARD.tableId,
								res.data.billCard.body['card_body'],
								null,
								true,
								true
							);
							props.cardTable.setStatus(TARGETADJ_CARD.tableId, TARGETADJ_CARD.browse);
						}
						if (res.data.billCard.head && res.data.billCard.head[formId]) {
							props.form.setAllFormValue({ [formId]: res.data.billCard.head[formId] });
							pk_targetadj = res.data.billCard.head[formId].rows[0].values.pk_targetadj.value;
							let vbillcode = res.data.billCard.head[formId].rows[0].values.vbillcode.value;
							//订单编号
							this.setState({
								vbillcode: vbillcode,
								billId: pk_targetadj
							});
							if (status == TARGETADJ_CARD.add) {
								//加入到缓存中
								addCacheData(
									props,
									'pk_targetadj',
									pk_targetadj,
									res.data.billCard,
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
									res.data.billCard,
									TARGETADJ_CARD.formId,
									dataSource
								);
							}
						}

						// 提交回调
						if (callback) {
							callback.call(this, this.props);
						}
					}

					this.props.updatePage(TARGETADJ_CARD.formId, TARGETADJ_CARD.tableId);
					this.props.pushTo(TARGETADJ_CARD.cardUrl, {
						status: TARGETADJ_CARD.browse,
						id: pk_targetadj,
						pagecode: TARGETADJ_CARD.cardpageid
					});
					if (!callback) {
						showSuccessInfo(getLangByResId(this, '4001TARGETADJ-000049')); /* 国际化处理： 保存成功！*/
					}
				}
				this.toggleShow();
			}
		});
	});
}
