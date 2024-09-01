/*
 * @Author: zhaochyu
 * @PageInfo: 卡片态保存按钮操作
 * @Date: 2018-05-03 11:10:50
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 20:23:52
 */
import { ajax, toast } from 'nc-lightapp-front';
import { PAGECODE, FIELD, URL, UISTATE, DATASOURCE, AREA, BODY_FIELD, HEAD_FIELD } from '../../constance';
import {
	addCacheData,
	rewriteTransferSrcBids,
	setDefData,
	getCacheDataByPk,
	updateCacheData,
	getNextId,
	changeUrlParam
} from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { showResumeModal } from 'scmpub/scmpub/components/ResumeModal';
import { cachedata } from '../afterEvents/bodyAfterEvent';
import { updateDtaForCompareByPk } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/compareUtils';
export default function clickSaveBtn(props, skipCodes) {
	let rows = [];
	let { addCacheId } = this.props.table;
	let status = this.props.getUrlParam(FIELD.cardStatus);
	// 拼接主子表json方法，参数分别为：pageid（模板id），form区id，table区id，调用此方法即可自动拼接向后台传的json（data）
	//过滤表体空行
	props.cardTable.filterEmptyRows(PAGECODE.cardbody, [ BODY_FIELD.pk_material ], 'include');
	let flag = props.validatePageToToast([
		{
			// creteForm 使用的areaCode
			name: [ PAGECODE.cardhead ],
			type: 'form'
		},
		{
			// createCardTable的areaCode，多页签区域填主表就行
			name: PAGECODE.cardbody,
			type: 'cardTable'
		}
	]);
	if (!flag.allPassed) {
		return;
	}
	let data = props.createMasterChildDataSimple(PAGECODE.cardpagecode, FIELD.formArea, FIELD.cardTable);
	data.transfer = status;
	skipCodes = skipCodes ? skipCodes : new Array();
	data['skipCodes'] = skipCodes;
	// 设置pseudocolumn字段值，用于前后台合并
	let rowss = data.body.card_body.rows;
	rowss.forEach((row, index) => {
		row.values.pseudocolumn.value = index + '';
		let sta = row.status;
		if (sta == 2) {
			row.values.pk_initialest.value = null;
			row.values.pk_initialest_b.value = null;
		}
		if (sta != 3) {
			rows.push(row);
		}
	});
	let pk_initialest = data.head.card_head.rows[0].values.pk_initialest;
	if (pk_initialest == undefined || pk_initialest.value == null) {
		data.head.card_head.rows[0].status = '2';
	}
	let url = null;
	if (pk_initialest.value != null) {
		url = URL.cardUpadate;
	} else {
		url = URL.cardSave;
		data.body.card_body.rows = rows;
	}
	let rowsflag = rowsCheckedNumber(data);
	if (!rowsflag) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4004INITIALEST-000012') /* 国际化处理： 表体行号不允许重复*/
		});
		return;
	}
	this.props.validateToSave(data, () => {
		//原来的 ajax 请求
		ajax({
			method: 'post',
			data: data,
			url: url,
			success: (res) => {
				this.props.beforeUpdatePage();
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(
						res.formulamsg //参数一：返回的公式对象
					);
				}
				if (res.data.isResume && res.data.isResume == true) {
					showResumeModal.call(
						this,
						this.props,
						'MessageDlg',
						skipCodes,
						res.data,
						clickSaveBtn.bind(this, props, skipCodes),
						props
					);
					return;
				}
				let flag = this.props.getUrlParam(FIELD.cardStatus) == UISTATE.transfer;
				if (flag) {
					// 转单编辑界面保存
					if (res.data.head && res.data.body) {
						let config = {
							headAreaId: PAGECODE.cardhead,
							bodyAreaId: PAGECODE.cardbody,
							bodyPKfield: BODY_FIELD.pk_initialest_b
						};
						updateDtaForCompareByPk(this.props, res.data, config);
						pk_initialest = props.form.getFormItemsValue(PAGECODE.cardhead, HEAD_FIELD.pk_initialest).value;
					}
					//判断缓冲中是否有该pk对应的数据
					let cachedataa = getCacheDataByPk(this.props, DATASOURCE.dataSource, pk_initialest);
					if (cachedataa) {
						updateCacheData(
							this.props,
							FIELD.pk_initialest,
							pk_initialest,
							res.data,
							FIELD.formArea,
							DATASOURCE.dataSource
						);
					} else {
						addCacheData(
							props,
							FIELD.pk_initialest,
							pk_initialest,
							res.data,
							FIELD.formArea,
							DATASOURCE.dataSource
						);
					}
					//将保存后的数据标志存到缓冲中
					setDefData(DATASOURCE.transferdataSource, pk_initialest, UISTATE.browse);
					this.indexstatus[this.curindex] = UISTATE.browse;
					changeUrlParam(props, {
						id: pk_initialest
					});
					this.props.transferTable.setTransformFormStatus(AREA.leftarea, {
						status: true,
						onChange: (current, next, currentIndex) => {
							// 提示
							showSuccessInfo(getLangByResId(this, '4004INITIALEST-000013')); /* 国际化处理： 保存成功！*/
							this.props.transferTable.setTransferListValueByIndex(AREA.leftarea, res.data, currentIndex);
							let cacheData = this.props.transferTable.updateTransferListValueByIndex(
								AREA.leftarea,
								res.data,
								currentIndex
							);
							this.indexstatus[currentIndex] = UISTATE.browse;
							rewriteTransferSrcBids(props, BODY_FIELD.csourcebid, cacheData.body[FIELD.cardTable].rows); //来源单据明细
							//cachedata.call(this, PAGECODE.cardbody);
							//cachedata.call(this, PAGECODE.cardhead);
						}
					});
				}
				if (!flag) {
					if (res.data.head && res.data.body) {
						let config = {
							headAreaId: PAGECODE.cardhead,
							bodyAreaId: PAGECODE.cardbody,
							bodyPKfield: BODY_FIELD.pk_initialest_b
						};
						updateDtaForCompareByPk(this.props, res.data, config);
						let pk = res.data.head[AREA.cardFormArea].rows[0].values.pk_initialest.value;
						let billcode = props.form.getFormItemsValue(PAGECODE.cardhead, HEAD_FIELD.vbillcode).value;
						if (status == UISTATE.add) {
							//将新增数据放入缓冲中
							addCacheData(
								props,
								FIELD.pk_initialest,
								pk,
								res.data,
								FIELD.formArea,
								DATASOURCE.dataSource
							);
							//将保存后的pk放到列表缓冲中
							// addCacheId(PAGECODE.tableId, pk);
							props.cardPagination.setCardPaginationId({
								id: pk,
								status: 1
							});
						}
						if (status == UISTATE.edit) {
							updateCacheData(
								this.props,
								FIELD.pk_initialest,
								pk,
								res.data,
								FIELD.formArea,
								DATASOURCE.dataSource
							);
						}
						props.pushTo(URL.cardurl, {
							status: UISTATE.browse,
							id: pk,
							billStatus: '0',
							pagecode: PAGECODE.cardpagecode
						});
						this.props.setUrlParam(pk);
						this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true); //设置翻页不显示
						this.props.BillHeadInfo.setBillHeadInfoVisible({
							showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
							showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
							billCode: billcode //修改单据号---非必传
						});
						this.toggleShow();
					}
					// 提示
					showSuccessInfo(getLangByResId(this, '4004INITIALEST-000013')); /* 国际化处理： 保存成功！*/
				}
				this.props.cardTable.selectAllRows(PAGECODE.cardbody, false);
				this.props.updatePage(PAGECODE.cardhead, PAGECODE.cardbody);
			}
		});
	});
}
//行号校验方法
function rowsCheckedNumber(data) {
	let arr = [];
	for (let i = 0; i < data.body.card_body.rows.length; i++) {
		let row = data.body.card_body.rows[i];
		if (row.status != 3) {
			let rownumber = data.body.card_body.rows[i].values.crowno.value;
			arr.push(rownumber);
		}
	}
	let oldlength = arr.length;
	let newLength = [ ...new Set(arr) ].length;
	if (oldlength != newLength) {
		return false;
	}
	return true;
}
