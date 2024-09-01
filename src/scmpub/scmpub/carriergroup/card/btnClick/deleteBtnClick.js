/*
 * @Author: zhaochyu 
 * @PageInfo: 司机定义删除
 * @Date: 2020-02-10 12:39:35 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-11-24 18:59:32
 */
import { ajax, toast } from 'nc-lightapp-front';
import { FILED, HEADFILED, URL, AREA, CARRIERDATASOURCE, PAGEID, STATUS } from '../../constance';
import { getNextId, deleteCacheData, getCacheDataByPk, changeUrlParam } from '../../../../../scmpub/scmpub/pub/cache';
import { showWarningDialog, showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { showOnlyAddButton } from '../viewController/buttonController';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import {
	removeAllTableData,
	setAllTableData,
	removeHeadCsupplierField,
	setHeadCsupplierField
} from './setAllTableData';
export default function(props, record) {
	let data = {
		delRows: [
			{
				pk: props.form.getFormItemsValue(AREA.card_head, HEADFILED.ccarrierid).value,
				ts: props.form.getFormItemsValue(AREA.card_head, HEADFILED.ts).value
			}
		]
	};
	// 执行删除操作提示
	showWarningDialog(
		getLangByResId(this, '4001CARRIERGROUP-000001'),
		getLangByResId(this, '4001CARRIERGROUP-000002'),
		{
			/* 国际化处理： 删除,确定要删除吗？*/
			beSureBtnClick: deleteFunction.bind(this, {
				props: props,
				data: data
			})
		}
	);
}
//执行删除操作
function deleteFunction(params) {
	let { props, data } = params;
	let pk = data.delRows[0].pk;
	ajax({
		url: URL.delete,
		data: data,
		success: (res) => {
			if (res.success) {
				deleteCacheData(props, HEADFILED.ccarrierid, pk, CARRIERDATASOURCE.carrierdatasource);

				let nextId = getNextId(props, pk, CARRIERDATASOURCE.carrierdatasource);
				//删除当前缓冲中的数据
				if (nextId == null) {
					this.props.form.EmptyAllFormValue(AREA.card_head);
					removeHeadCsupplierField.call(this);
					removeAllTableData.call(this);
					this.props.cardPagination.setCardPaginationVisible(FILED.cardPaginationBtn, false); //设置翻页不显示
					this.props.BillHeadInfo.setBillHeadInfoVisible({
						showBackBtn: true //控制显示返回按钮: true为显示,false为隐藏 ---非必传
					});
					showOnlyAddButton.call(this);
					changeUrlParam(props, {
						status: STATUS.browse,
						id: nextId
					});
				} else {
					changeUrlParam(props, {
						status: STATUS.browse,
						id: nextId
					});
					//获取缓冲中的数据
					let cardData = getCacheDataByPk(props, CARRIERDATASOURCE.carrierdatasource, nextId);
					if (cardData) {
						this.props.form.setAllFormValue({
							[AREA.card_head]: cardData.carrier[AREA.card_head]
						});
						if (cardData.supplier) {
							setHeadCsupplierField.call(this, cardData.supplier[AREA.listTable]);
						}
						setAllTableData.call(this, cardData);
						this.props.BillHeadInfo.setBillHeadInfoVisible({
							showBackBtn: true //控制显示返回按钮: true为显示,false为隐藏 ---非必传
						});
						this.toggleShow(STATUS.browse);
					} else {
						let data = { id: nextId, pagecode: PAGEID.cardpagecodegroup };
						ajax({
							url: URL.cardQuery,
							data: data,
							method: 'post',
							success: (res) => {
								if (res.success) {
									if (res.data.carrier) {
										this.props.form.setAllFormValue({
											[AREA.card_head]: res.data.carrier[AREA.listTable]
										});
										if (res.data.supplier) {
											setHeadCsupplierField.call(this, res.data.supplier[AREA.listTable]);
										}
									}
									props.pushTo(URL.gotoCard, {
										status: STATUS.browse,
										id: nextId
									});
									setAllTableData.call(this, res.data);
								}
							},
							error: (err) => {}
						});
					}
				}
				showSuccessInfo(getLangByResId(this, '4001CARRIERGROUP-000003')); /* 国际化处理： 删除成功!*/
			} else {
				toast({
					color: 'warning',
					content: getLangByResId(this, '4001CARRIERGROUP-000004') /* 国际化处理： 删除失败！*/
				});
			}
		}
	});
}
