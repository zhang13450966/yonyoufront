/*
 * @Author: mikey.zhangchqf 
 * @Date: 2018-06-26 15:36:13 
 * @Last Modified by: qishy
 * @Last Modified time: 2021-02-05 11:19:50
 */

import { ajax } from 'nc-lightapp-front';
import { TARGETADJ_CARD, TARGETADJ_LIST, ATTRCODE } from '../../siconst';
import getParentURlParme from './getParentURlParme';
import { deepClone } from '../../../../../scmpub/scmpub/pub/tool/index';
import {
	changeUrlParam,
	getCacheDataByPk,
	updateCacheData,
	getDefData
} from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { showSuccessInfo, showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil.js';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import targetBillTableHeadUtil from '../../utils/targetBillTableHeadUtil';
import { processBillCardHeadEditResult } from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';
import { afterEvent } from '../afterEvents';
import { buttonController } from '../viewControl';
let formId = TARGETADJ_CARD.formId; //'head';
let headf = TARGETADJ_CARD.headf; //'headf';
let tableId = TARGETADJ_CARD.tableId; //'body';
export default function(props, pk, refresh) {
	//获取从父页面中的URL获取参数，控制页面按钮的显示（能取到值说明是审批中心连接过来的，没有就是正常的卡片页面的按钮）
	let parentURL = getParentURlParme(TARGETADJ_CARD.pageMsgType);
	if (this.props.getUrlParam('status') == TARGETADJ_CARD.browse) {
		this.props.form.setFormItemsDisabled(headf, {
			[ATTRCODE.pk_org]: true,
			[ATTRCODE.ctargetid]: true
		});
		let _this = this;
		if (pk) {
			changeUrlParam(this.props, pk); //动态修改地址栏中的id的值(路径中一定要是id，否则会导致切换下一条的时候，pk取不到)
		}
		//非新增页面获取对应数据
		pk = this.props.getUrlParam(TARGETADJ_CARD.id);
		//如果没有pk,清空数据，只显示新增按钮
		if (pk == undefined) {
			commonShow.call(this, pk);
		} else {
			let data = { keyword: pk, pageid: this.pageId };
			if (data.keyword === 'undefined') {
				this.setState({
					vbillcode: ''
				});
				return;
			}
			if (parentURL) {
				//如果是从审批进入，不显示翻页
				buttonController.setCardPaginationVisible(this.props, false); //设置翻页不显示
			} else {
				buttonController.setCardPaginationVisible(this.props, true); //设置翻页显示
			}
			//查看缓存，如果存在缓存则不需要重新查询数据
			let cardData = getCacheDataByPk(this.props, TARGETADJ_LIST.dataSource, pk);
			if (cardData && !refresh) {
				this.props.form.setAllFormValue({ [headf]: cardData.head[formId] });
				this.props.form.setAllFormValue({ [formId]: cardData.head[formId] });
				this.props.cardTable.setTableData(tableId, cardData.body[tableId], null, true, true);
				//设置按钮显示
				let fstatusflag = this.props.form.getFormItemsValue(formId, ATTRCODE.fstatusflag);
				let vbillcode = this.props.form.getFormItemsValue(formId, ATTRCODE.vbillcode);
				this.ctargetvalue = this.props.form.getFormItemsValue(formId, ATTRCODE.ctargetid);
				let billId = this.props.form.getFormItemsValue(formId, ATTRCODE.pk_targetadj);
				//如果取缓存数据，需要将控制行按钮显示的数组重置
				this.setState(
					{
						lineShowType: [],
						vbillcode: vbillcode.value,
						billId: billId.value
					},
					() => {
						buttonController.setBackButtonVisiable.call(this, this.props, parentURL);
						buttonController.lineSelected.call(this);
					}
				);
				//跳转卡片弹出提示框
				setBtnShow(_this, fstatusflag.value);
			} else {
				ajax({
					url: TARGETADJ_CARD.queryCardInfoURL,
					data: data,
					async: false,
					success: (res) => {
						if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
							props.dealFormulamsg(res.formulamsg);
						}
						if (res.data && res.data.userObject && res.data.userObject.retmap) {
							let multiData = {
								type: 'targetadj',
								formId: TARGETADJ_CARD.headf,
								tableId: tableId,
								bodyDownCloumsYear: res.data.userObject.retmap.bodyDownCloumsYear,
								bodyDownCloumsOther: res.data.userObject.retmap.bodyDownCloumsOther,
								bodyUpCloumsOther: res.data.userObject.retmap.bodyUpCloumsOther,
								bodyUpCloumsYear: res.data.userObject.retmap.bodyUpCloumsYear,
								fheadshowflag: res.data.userObject.retmap.fheadshowflag,
								fcyclesetflag: res.data.userObject.retmap.fcyclesetflag,
								headCloum: res.data.userObject.retmap.headCloum
							};
							targetBillTableHeadUtil.call(this, this.props, multiData);
						}

						if (res.data) {
							//渲染数据前先清空值，
							if (res.data.billCard.head) {
								this.props.form.setAllFormValue({ [headf]: res.data.billCard.head[formId] });
								this.props.form.setAllFormValue({ [formId]: res.data.billCard.head[formId] });
								this.ctargetvalue = this.props.form.getFormItemsValue(formId, ATTRCODE.ctargetid);
								this.setState(
									{
										lineShowType: [],
										vbillcode: res.data.billCard.head[formId].rows[0].values.vbillcode.value,
										billId: res.data.billCard.head[formId].rows[0].values.pk_targetadj.value
									},
									() => {
										buttonController.setBackButtonVisiable.call(this, this.props, parentURL);
										buttonController.lineSelected.call(this);
									}
								);
								let fstatusflag = res.data.billCard.head[formId].rows[0].values.fstatusflag.value;
								if (parentURL) {
									this.toggleShow();
								} else {
									//设置按钮显示
									setBtnShow(_this, fstatusflag);
								}
							}
							let pkid = res.data.billCard.head[formId].rows[0].values.pk_targetadj.value;
							updateCacheData(
								this.props,
								ATTRCODE.pk_targetadj,
								pkid,
								res.data.billCard,
								formId,
								TARGETADJ_LIST.dataSource
							);
							if (res.data.billCard.body) {
								this.props.cardTable.setTableData(
									tableId,
									res.data.billCard.body[tableId],
									null,
									true,
									true
								);
							}
							buttonController.setUIState.call(this, this.props, TARGETADJ_CARD.browse);
							//跳转卡片弹出提示框
							if (refresh) {
								showSuccessInfo(getLangByResId(this, '4001TARGETADJ-000051')); /* 国际化处理： 刷新成功！*/
							}
						} else {
							if (refresh) {
								showErrorInfo(getLangByResId(this, '4001TARGETADJ-000062')); /* 国际化处理： 刷新失败！*/
							}
						}
					},
					error: (res) => {
						showErrorInfo(res.message);
						commonShow.call(this, pk);
					}
				});
			}
		}
	} else if (this.props.getUrlParam(TARGETADJ_CARD.status) == TARGETADJ_CARD.edit) {
		let data = { keyword: this.props.getUrlParam(TARGETADJ_CARD.id), pageid: this.pageId };
		ajax({
			url: TARGETADJ_CARD.editCardInfoURL,
			data: data,
			success: (res) => {
				buttonController.setCardPaginationVisible(this.props, false); //设置翻页不显示

				if (data === undefined) {
					//订单编号
					this.setState({
						vbillcode: '',
						billId: ''
					});
					return;
				}
				if (res.data) {
					if (res.data.userObject && res.data.userObject.retmap) {
						let multiData = {
							type: 'targetadj',
							formId: TARGETADJ_CARD.headf,
							tableId: tableId,
							bodyDownCloumsYear: res.data.userObject.retmap.bodyDownCloumsYear,
							bodyDownCloumsOther: res.data.userObject.retmap.bodyDownCloumsOther,
							bodyUpCloumsOther: res.data.userObject.retmap.bodyUpCloumsOther,
							bodyUpCloumsYear: res.data.userObject.retmap.bodyUpCloumsYear,
							fheadshowflag: res.data.userObject.retmap.fheadshowflag,
							fcyclesetflag: res.data.userObject.retmap.fcyclesetflag,
							headCloum: res.data.userObject.retmap.headCloum
						};
						targetBillTableHeadUtil.call(this, this.props, multiData);
						this.fcyclesetflag = res.data.userObject.retmap.fcyclesetflag;
					}
					if (res.data.billCard) {
						processBillCardHeadEditResult(this.props, formId, tableId, res.data.billCard);
						if (res.data.billCard.head) {
							this.props.form.setAllFormValue({ [headf]: res.data.billCard.head[formId] });
							this.props.form.setAllFormValue({ [formId]: res.data.billCard.head[formId] });
							this.setState({
								vbillcode: res.data.billCard.head[formId].rows[0].values.vbillcode.value,
								billId: res.data.billCard.head[formId].rows[0].values.pk_targetadj.value
							});
						}
						if (res.data.billCard.body) {
							this.props.cardTable.setTableData(tableId, res.data.billCard.body[tableId]);
						}
					}
					//修改组织的可编辑状态
					this.props.form.setFormItemsDisabled(headf, {
						[ATTRCODE.pk_org]: false,
						[ATTRCODE.ctargetid]: false
					});
					this.toggleShow();
				}
			}
		});
	} else {
		//新增
		let comeType = this.props.getUrlParam(TARGETADJ_CARD.comeType); //判断是否是从浏览页面点击按钮的新增
		let meta = deepClone(this.meta);
		this.props.meta.setMeta(meta);
		if (comeType != undefined && comeType) {
			//丛浏览态点击新增，清空数据
			this.props.form.EmptyAllFormValue(formId);
			this.props.form.EmptyAllFormValue(headf);
			//订单编号
			this.state.vbillcode = '';
			this.state.billCode = '';

			let pk_org = getDefData(TARGETADJ_LIST.dataSource, ATTRCODE.pk_org);
			let org_Name = getDefData(TARGETADJ_LIST.dataSource, 'pk_org_name');
			if (pk_org && org_Name) {
				afterEvent.call(this, this.props, headf, ATTRCODE.pk_org, { value: pk_org, display: org_Name }, null, {
					refpk: pk_org,
					refname: org_Name
				});
				this.props.form.setFormItemsDisabled(headf, {
					[ATTRCODE.pk_org]: false,
					[ATTRCODE.ctargetid]: false
				});
			} else {
				this.state.copy_billId = this.props.getUrlParam(TARGETADJ_CARD.id);
				this.props.cardTable.setTableData(tableId, { rows: [] });
				this.props.form.setFormItemsValue(formId, {
					[ATTRCODE.pk_org]: { value: null, display: null }
				});
			}
			//修改组织的可编辑状态
			this.props.form.setFormItemsDisabled(formId, { [TARGETADJ_CARD.pk_org]: false });
			this.props.form.setFormItemsDisabled(headf, { [TARGETADJ_CARD.pk_org]: false });
			this.props.initMetaByPkorg(TARGETADJ_CARD.pk_org);
			this.toggleShow();
		} else {
			//修改组织的可编辑状态
			this.props.form.setFormItemsDisabled(headf, {
				[ATTRCODE.pk_org]: false,
				[ATTRCODE.ctargetid]: false
			});
			//自制新增
			this.toggleShow();
		}
	}
}

function setBtnShow(_this, fstatusflag) {
	buttonController.setUIState.call(_this, _this.props, TARGETADJ_CARD.browse);
	buttonController.setCardPaginationVisible(_this.props, true); //设置翻页显示
	buttonController.setBrowseButtonByStatus.call(_this, _this.props, fstatusflag);
}
//空白页面控制使用   状态为浏览态  只显示返回按钮，新增按钮
function commonShow(pk) {
	this.setState(
		{
			vbillcode: '',
			copy_billId: ''
		},
		() => {
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: false, //控制显示单据号：true为显示,false为隐藏 ---非必传
				billCode: this.state.vbillcode //修改单据号---非必传
			});
		}
	);
	buttonController.setUIState.call(this, this.props, TARGETADJ_CARD.browse);
	//设置空白页面的按钮
	this.props.meta.setMeta(this.meta);
	buttonController.setBlankPageButtons.call(this);
	this.props.form.EmptyAllFormValue(formId);
	this.props.form.EmptyAllFormValue(headf);
	this.props.cardTable.setTableData(tableId, { rows: [] });
	buttonController.setCardPaginationVisible(this.props, false); //设置翻页不显示
}
export { setBtnShow };
