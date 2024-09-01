/*
 * @Author: zhaochyu
 * @PageInfo: 启用
 * @Date: 2020-02-10 18:39:55
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-12-29 14:01:29
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, PAGEID, URL, HEADFILED, STATUS, CARRIERDATASOURCE } from '../../constance';
import { showWarningDialog, showErrorInfo, showSuccessInfo } from '../../../pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { updateCacheData, getCacheDataByPk } from '../../../../../scmpub/scmpub/pub/cache';
export default function startuseBtnClick(props) {
	let pk_org_v = props.form.getFormItemsValue(AREA.card_head, HEADFILED.pk_org_v);
	if (!pk_org_v.value) {
		showErrorInfo(getLangByResId(this, '4001CARRIER-000011')); /* 国际化处理： 组织节点不能启用集团数据*/
		return;
	}
	// 执行删除操作提示
	showWarningDialog(getLangByResId(this, '4001CARRIER-000012'), getLangByResId(this, '4001CARRIER-000013'), {
		/* 国际化处理： 启用,确定要启用吗？*/
		beSureBtnClick: () => {
			this.props.form.setFormItemsValue(AREA.card_head, {
				[HEADFILED.bsealflag]: {
					value: false,
					display: getLangByResId(this, '4001CARRIER-000014') /* 国际化处理： 否*/
				}
			});
			let data = this.props.createMasterChildDataSimple(PAGEID.cardpagecodeorg, AREA.card_head, AREA.driver);
			let savedata = data.head;
			savedata.pageid = PAGEID.cardpagecodeorg;
			savedata.templetid = data.templetid;
			savedata.card_head.rows[0].status = '1';
			ajax({
				method: 'post',
				data: savedata,
				url: URL.carduse,
				success: (res) => {
					if (res.data && res.data.card_head) {
						this.props.form.setAllFormValue({
							[AREA.card_head]: res.data.card_head
						});
						updateCache.call(
							this,
							res.data.card_head.rows[0].values.ccarrierid.value,
							res.data.card_head.rows[0].values.bsealflag
						);
						showSuccessInfo(getLangByResId(this, '4001CARRIER-000015')); /* 国际化处理： 启用成功!*/
						this.toggleShow(STATUS.browse);
					}
				}
			});
		}
	});
}

function updateCache(pk, bsealflag) {
	let cardData = getCacheDataByPk(this.props, CARRIERDATASOURCE.carrierdatasource, pk);
	if (cardData && cardData.carrier && bsealflag) {
		cardData.carrier.list_head.rows[0].values.bsealflag = bsealflag;
	}
	updateCacheData(
		this.props,
		HEADFILED.ccarrierid,
		pk,
		cardData,
		AREA.card_head,
		CARRIERDATASOURCE.carrierdatasource
	);
}
