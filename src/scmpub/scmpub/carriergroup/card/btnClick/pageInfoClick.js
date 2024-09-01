/*
 * @Author: zhaochyu
 * @PageInfo:承运商定义集团卡片通用查询信息
 * @Date: 2018-05-30 16:35:29
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-02-21 14:15:43
 */
import { ajax } from 'nc-lightapp-front';
import { updateCacheData, changeUrlParam } from '../../../../../scmpub/scmpub/pub/cache';
import { FILED, STATUS, URL, CARRIERDATASOURCE, AREA, PAGEID, HEADFILED } from '../../constance';
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { setDefData } from '../../../pub/cache';
import { cardButtonDisabled } from '../viewController/buttonController';
import { setUIState } from '../viewController/buttonController';
import {
	removeAllTableData,
	setAllTableData,
	setHeadCsupplierField,
	removeHeadCsupplierField
} from './setAllTableData';
export default function(props, pk) {
	let cardStatus = this.props.getUrlParam(FILED.cardStatus);
	let from = this.props.getUrlParam('from');
	if (pk == null) {
		pk = this.props.getUrlParam(FILED.cardId);
	}
	if (cardStatus != STATUS.add && cardStatus != STATUS.edit) {
		let _this = this;
		if (pk) {
			_this.props.setUrlParam(pk); //动态修改地址栏中的id的值(路径中一定要是id，否则会导致切换下一条的时候，pk取不到)
		}
		cacheAndQueryData.call(this, props, pk, cardStatus);
	} else if (cardStatus === STATUS.edit && from === 'list') {
		cacheAndQueryData.call(this, this.props, pk, cardStatus);
		this.toggleShow(STATUS.edit);
	} else if (cardStatus === STATUS.add && from === 'list') {
		//光标自动聚焦
		//this.props.initMetaByPkorg(HEADFILED.pk_org_v);
		this.props.executeAutoFocus();
		this.toggleShow(STATUS.add);
	}
}
function cacheAndQueryData(props, pk, cardStatus) {
	let data = {};
	//表示是编辑或查看进入，有id（否则就是新增进入）
	data = { id: pk, pagecode: PAGEID.cardpagecodegroup };
	if (data.id === 'undefined') {
		this.props.form.setAllFormValue(AREA.card_head, { rows: [ {} ] });
		removeHeadCsupplierField.call(this);
		removeAllTableData.call(this);
		return;
	}
	ajax({
		url: URL.cardQuery,
		data: data,
		method: 'post',
		success: (res) => {
			if (res.data === undefined) {
				this.props.form.EmptyAllFormValue(AREA.card_head);
				removeHeadCsupplierField.call(this);
				removeAllTableData.call(this);
				return;
			}
			//将查询出来的数据放到缓冲里边
			let pk = null;
			if (res.data && res.data.carrier) {
				this.props.form.setAllFormValue({
					[AREA.card_head]: res.data.carrier[AREA.listTable]
				});
				if (res.data.supplier) {
					setHeadCsupplierField.call(this, res.data.supplier[AREA.listTable]);
				}
				pk = res.data.carrier[AREA.listTable].rows[0].values.ccarrierid.value;
				if (cardStatus == STATUS.browse) {
					cardButtonDisabled.call(this, this.props);
				}
				setDefData(CARRIERDATASOURCE.carrierdatasource, pk, res.data);
				//更新缓冲里边的数据
				updateCacheData(
					this.props,
					HEADFILED.ccarrierid,
					pk,
					res.data,
					AREA.card_head,
					CARRIERDATASOURCE.carrierdatasource
				);
			}
			setAllTableData.call(this, res.data);
			//	bodyTabChangeClick.call(this, this.props, null, this.tabkey);
		},
		error: (err) => {
			showErrorInfo(err.message);
			setUIState.call(this, this.props, STATUS.browse);
			this.props.form.EmptyAllFormValue(AREA.card_head);
			removeHeadCsupplierField.call(this);
			removeAllTableData.call(this);
			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false); //设置翻页不显示
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
				billCode: '' //修改单据号---非必传
			});
			changeUrlParam(this.props, {
				err: true
			});
			// buttonController.setCardBlankButtonVisiable.call(this, this.props);
		}
	});
}
