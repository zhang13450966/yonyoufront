/*
 * @Author: zhangchqf
 * @PageInfo: 请购单修订
 * @Date: 2018-04-19 10:09:24 
 * @Last Modified by: tianzhyw
 * @Last Modified time: 2021-11-13 16:47:15
 */
import { ajax } from 'nc-lightapp-front';
import { BUYINGREQ_CARD, FBILLSTATUS, BUYINGREQ_CARD_BUTTON, BUYINGREQ_LIST, ATTRCODE } from '../../siconst';
import { updateCacheData, getCacheDataByPk } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { showSuccessInfo, showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil.js';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSagaErrorToasts } from '../../../pub/utils/sagaMsgUtils';
import { buttonController } from '../viewControl';
let formId = BUYINGREQ_CARD.formId; //'head';
let tableId = BUYINGREQ_CARD.tableId; //'body';
export default function(props, pk, pk_srcpraybillf, refresh) {
	// 审批中心审批通过时,进行了主键的交换,此时点击刷新按钮需要拿到原始主键
	let pk_srcpraybill = null;
	if (refresh) {
		pk_srcpraybill = this.props.form.getFormItemsValue(formId, ATTRCODE.pk_srcpraybill).value;
	}
	// 列表页面审批中,审批中心审批通过时,跳转到卡片页面时,取到原始主键
	if (pk_srcpraybillf) {
		pk_srcpraybill = pk_srcpraybillf;
	}
	//点击翻页清空数据

	// this.props.form.EmptyAllFormValue(formId);
	//this.props.cardTable.setTableData(tableId, { rows: [] });
	let fbillstatusSrc = this.props.form.getFormItemsValue(formId, ATTRCODE.fbillstatus).value;
	if (this.props.getUrlParam(BUYINGREQ_CARD.status) == BUYINGREQ_CARD.browse) {
		let _this = this;
		if (pk) {
			_this.props.setUrlParam(pk); //动态修改地址栏中的id的值(路径中一定要是id，否则会导致切换下一条的时候，pk取不到)
		}
		//非新增页面获取对应数据
		let data = {
			keyword: this.props.getUrlParam(BUYINGREQ_CARD.id),
			keywordSrc: pk_srcpraybill,
			pageid: this.pageId
		};
		if (data.keyword === 'undefined') {
			this.setState({
				vbillcode: ''
			});
			return;
		}
		buttonController.setCardPaginationVisible(this.props, true); //设置翻页显示
		let cardData = getCacheDataByPk(this.props, BUYINGREQ_LIST.dataSource, pk);
		if (cardData && !refresh) {
			this.props.form.setAllFormValue({ [formId]: cardData.head[formId] });
			this.props.cardTable.setTableData(tableId, cardData.body[tableId], null, true, true);
			//设置按钮显示
			let fbillstatus = this.props.form.getFormItemsValue(formId, ATTRCODE.fbillstatus).value;
			let vbillcode = this.props.form.getFormItemsValue(formId, ATTRCODE.vbillcode);
			let billId;
			let pk_srcpraybill = this.props.form.getFormItemsValue(formId, ATTRCODE.pk_srcpraybill);
			// 上传附件时,不论版本,单据状态如何变化,保证附件关联的是原始主键
			if (pk_srcpraybill.value) {
				billId = pk_srcpraybill;
			} else {
				billId = this.props.form.getFormItemsValue(formId, ATTRCODE.pk_praybill);
			}
			//如果取缓存数据，需要将控制行按钮显示的数组重置
			this.setState(
				{
					lineShowType: [],
					vbillcode: vbillcode.value,
					billId: billId.value
				},
				() => {
					//跳转卡片弹出提示框
					showSagaErrorToasts(this.props, formId, ATTRCODE.pk_praybill);
					buttonController.setButtonByStatus.call(this, this.props, fbillstatus);
					//setBtnShow(_this, fbillstatus.value);
					this.toggleShow();
				}
			);
		} else {
			ajax({
				url: BUYINGREQ_CARD.queryCardInfoURL,
				data: data,
				success: (res) => {
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
							vbillcode: ''
						});
						return;
					}

					//维护和修订用后端的是用一个查询无法在后端区分，这里在前端判断下，如果单据状态为自由且版本号是1的单据，一定是在采购订单维护节点收回过的，这里提示‘当前单据已被他人修改，请返回列表重新查询’
					let nversion = res.data.head.card_head.rows[0].values.nversion.value;
					let fbillstatusB = res.data.head.card_head.rows[0].values.fbillstatus.value;
					if (nversion == '1' && (fbillstatusB == '0' || fbillstatusB == '2' || fbillstatusB == '4')) {
						this.props.form.setFormStatus(formId, BUYINGREQ_CARD.browse);
						this.props.cardTable.setStatus(tableId, BUYINGREQ_CARD.browse);
						// 设置按钮状态
						buttonController.setButtonByStatus.call(this, this.props, fbillstatusSrc);
						buttonController.setCardButtonVisiable.call(this, this.props, BUYINGREQ_CARD.browse);
						showErrorInfo(null, getLangByResId(this, '4004PRAYBILLR-000040')); /*  当前单据已被他人修改，请返回列表重新查询*/
						return;
					}

					let fbillstatus;
					if (res.data.head) {
						this.props.form.setAllFormValue({ [formId]: res.data.head[formId] });
						fbillstatus = res.data.head[formId].rows[0].values.fbillstatus.value;
						let pk_praybill = res.data.head[formId].rows[0].values.pk_praybill.value;
						let pk_srcpraybill = res.data.head[formId].rows[0].values.pk_srcpraybill.value;
						let billId = pk_praybill;
						// 上传附件时,不论版本,单据状态如何变化,保证附件关联的是原始主键
						if (pk_srcpraybill) {
							billId = pk_srcpraybill;
						}
						_this.setState({
							lineShowType: [],
							vbillcode: res.data.head[formId].rows[0].values.vbillcode.value,
							billId: billId
						});
						// 设置按钮可用性
						updateCacheData(
							this.props,
							'pk_praybill',
							pk_praybill,
							res.data,
							formId,
							BUYINGREQ_LIST.dataSource
						);
					}
					if (res.data.body) {
						this.props.cardTable.setTableData(tableId, res.data.body[tableId], null, true, true);
					}
					//跳转卡片弹出提示框
					showSagaErrorToasts(this.props, formId, ATTRCODE.pk_praybill);
					if (refresh) {
						showSuccessInfo(getLangByResId(this, '4004PRAYBILLR-000029')); /* 国际化处理： 刷新成功！*/
					}
					// 设置按钮状态
					buttonController.setButtonByStatus.call(this, this.props, fbillstatus);
					this.toggleShow();
				}
			});
		}
	} else if (this.props.getUrlParam(BUYINGREQ_CARD.status) == BUYINGREQ_CARD.edit) {
		buttonController.setCardPaginationVisible(this.props, false); //设置翻页不显示

		let data = { keyword: this.props.getUrlParam(BUYINGREQ_CARD.id), pageid: this.pageId };

		if (data.keyword === 'undefined') {
			this.setState({
				vbillcode: ''
			});
			return;
		}
		ajax({
			url: BUYINGREQ_CARD.queryCardInfoURL,
			data: data,
			success: (res) => {
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
						vbillcode: ''
					});
					return;
				}

				//维护和修订用后端的是用一个查询无法在后端区分，这里在前端判断下，如果单据状态为自由且版本号是1的单据，一定是在采购订单维护节点收回过的，这里提示‘当前单据已被他人修改，请返回列表重新查询’
				let nversion = res.data.head.card_head.rows[0].values.nversion.value;
				let fbillstatusB = res.data.head.card_head.rows[0].values.fbillstatus.value;
				if (nversion == '1' && (fbillstatusB == '0' || fbillstatusB == '2' || fbillstatusB == '4')) {
					this.props.form.setFormStatus(formId, BUYINGREQ_CARD.browse);
					this.props.cardTable.setStatus(tableId, BUYINGREQ_CARD.browse);
					// 设置按钮状态
					buttonController.setButtonByStatus.call(this, this.props, fbillstatusSrc);
					buttonController.setCardButtonVisiable.call(this, this.props, BUYINGREQ_CARD.browse);
					showErrorInfo(null, getLangByResId(this, '4004PRAYBILLR-000040')); /*  当前单据已被他人修改，请返回列表重新查询*/
					return;
				}

				let fbillstatus;
				if (res.data.head) {
					this.props.form.setAllFormValue({ [formId]: res.data.head[formId] });
					fbillstatus = res.data.head[formId].rows[0].values.fbillstatus.value;
					this.setState({
						vbillcode: res.data.head[formId].rows[0].values.vbillcode.value
					});
					// 设置按钮可用性
					//this.isActionEnable();
				}
				if (res.data.body) {
					this.props.cardTable.setTableData(tableId, res.data.body[tableId]);
				}
				//修改组织的可编辑状态
				this.props.form.setFormItemsDisabled(formId, { [BUYINGREQ_CARD.pk_org_v]: true });
				// 设置按钮状态
				buttonController.setButtonByStatus.call(this, this.props, fbillstatus);
				this.toggleShow();
			}
		});
	}
}
