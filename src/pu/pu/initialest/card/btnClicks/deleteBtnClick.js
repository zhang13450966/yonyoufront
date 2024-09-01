/*
 * @Author: zhaochyu
 * @PageInfo: 卡片删除功能
 * @Date: 2018-05-03 10:56:49
 * @Last Modified by: zhr
 * @Last Modified time: 2021-10-21 11:43:05
 */
import { ajax, toast } from 'nc-lightapp-front';
import { FIELD, URL, AREA, DATASOURCE, PAGECODE, UISTATE, BODY_FIELD } from '../../constance';
import { getNextId, deleteCacheData, getCacheDataByPk, changeUrlParam } from '../../../../../scmpub/scmpub/pub/cache';
import { showWarningDialog, showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonController } from '../viewControl/';
export default function(props, record) {
	// 执行删除操作提示
	showWarningDialog(getLangByResId(this, '4004INITIALEST-000007'), getLangByResId(this, '4004INITIALEST-000008'), {
		/* 国际化处理： 删除,确定要删除吗？*/
		beSureBtnClick: deleteFunction.bind(this, {
			props: props
		})
	});
}
//执行删除操作
function deleteFunction(params) {
	let { props } = params;
	let rows = props.cardTable.getAllRows(AREA.cardTableArea);
	let bodys = [];
	rows.forEach((row) => {
		bodys.push({
			id: row.values[BODY_FIELD.pk_initialest_b].value,
			ts: row.values[FIELD.ts].value
		});
	});
	let data = {
		delRows: [
			{
				pk: props.form.getFormItemsValue(AREA.cardFormArea, FIELD.pk_initialest).value,
				ts: props.form.getFormItemsValue(AREA.cardFormArea, FIELD.ts).value,
				bodys: bodys
			}
		]
	};
	let pk = this.props.form.getFormItemsValue(AREA.cardFormArea, FIELD.pk_initialest).value;
	ajax({
		url: URL.delete,
		data: data,
		success: (res) => {
			if (res.success) {
				let transfer = this.props.getUrlParam(FIELD.cardStatus) === FIELD.transfer;
				let nextId = getNextId(props, pk, DATASOURCE.dataSource);
				deleteCacheData(props, FIELD.pk_initialest, pk, DATASOURCE.dataSource);

				if (transfer) {
					if (props.transferTable.getTransformFormAmount(AREA.leftarea) == 1) {
						props.pushTo(URL.gotoTransfer, {
							status: UISTATE.transfer,
							pagecdoe: PAGECODE.transferlist
						});
					} else {
						this.indexstatus = {};
						props.transferTable.setTransformFormStatus(AREA.leftarea, {
							status: false,
							onChange: (current, next) => {
								let ddd = current;
								let aaa = next;
								// showSuccessInfo(
								//   getLangByResId(this, "4004INITIALEST-000009")
								// ); /* 国际化处理： 删除成功*/
							}
						});
					}
					showSuccessInfo(getLangByResId(this, '4004INITIALEST-000009')); /* 国际化处理： 删除成功*/
				} else {
					//删除当前缓冲中的数据
					if (nextId == null) {
						buttonController.setBlankPageButtons.call(this);
						this.props.form.EmptyAllFormValue(FIELD.formArea);
						this.props.cardTable.setTableData(FIELD.cardTable, {
							rows: []
						});
						this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false); //设置翻页不显示
						this.props.BillHeadInfo.setBillHeadInfoVisible({
							showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
							showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
							billCode: '' //修改单据号---非必传
						});
						changeUrlParam(props, {
							status: UISTATE.browse,
							id: nextId
						});
						showSuccessInfo(getLangByResId(this, '4004INITIALEST-000009')); /* 国际化处理： 删除成功*/
					} else {
						changeUrlParam(props, {
							status: UISTATE.browse,
							id: nextId
						});
						//获取缓冲中的数据
						let cardData = getCacheDataByPk(props, DATASOURCE.dataSource, nextId);
						if (cardData) {
							this.props.form.setAllFormValue({
								[FIELD.formArea]: cardData.head[FIELD.formArea]
							});
							this.props.cardTable.setTableData(FIELD.cardTable, cardData.body[FIELD.cardTable]);
							let billcodee = cardData.head.card_head.rows[0].values.vbillcode.value;
							let fbillstatus = cardData.head.card_head.rows[0].values.fbillstatus.value;
							this.props.BillHeadInfo.setBillHeadInfoVisible({
								showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
								showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
								billCode: billcodee //修改单据号---非必传
							});
							this.toggleShow(UISTATE.browse, fbillstatus);
							showSuccessInfo(getLangByResId(this, '4004INITIALEST-000009')); /* 国际化处理： 删除成功*/
						} else {
							let data = { id: nextId, pagecode: PAGECODE.cardpagecode };
							let billcode = '';
							ajax({
								url: URL.cardQuery,
								data: data,
								method: 'post',
								success: (res) => {
									if (res.success) {
										if (res.data.head) {
											this.props.form.setAllFormValue({
												[PAGECODE.cardhead]: res.data.head[PAGECODE.cardhead]
											});
										}
										let billStatus =
											res.data.head[PAGECODE.cardhead].rows[0].values.fbillstatus.value;
										billcode = res.data.head[PAGECODE.cardhead].rows[0].values.vbillcode.value;
										props.pushTo(URL.cardurl, {
											status: UISTATE.browse,
											id: nextId,
											billStatus: billStatus,
											pagecode: PAGECODE.cardpagecode
										});
										if (res.data.body) {
											this.props.cardTable.setTableData(
												PAGECODE.cardbody,
												res.data.body[PAGECODE.cardbody]
											);
										}
									}
									this.props.BillHeadInfo.setBillHeadInfoVisible({
										//showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
										showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
										billCode: billcode //修改单据号---非必传
									});
									this.setState({
										status: UISTATE.browse
									});
									showSuccessInfo(getLangByResId(this, '4004INITIALEST-000009')); /* 国际化处理： 删除成功*/
								},
								error: (err) => {}
							});
						}
					}
				}
			} else {
				toast({
					color: 'warning',
					content: getLangByResId(this, '4004INITIALEST-000010')
				}); /* 国际化处理： 删除失败！*/
			}
		}
	});
}
