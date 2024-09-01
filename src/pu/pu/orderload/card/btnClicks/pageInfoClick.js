/*
 * @Author: CongKe
 * @PageInfo: 卡片态翻页
 * @Date: 2019-04-17 09:38:21
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-08-05 14:05:08
 */
import { ajax } from 'nc-lightapp-front';
import { PAGECODE, AREA, URL, FIELDS, DATASOURCECACHE } from '../../constance';
import { getCacheDataByPk, updateCacheData } from 'src/scmpub/scmpub/pub/cache';
import { showRefreshInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import buttonController from '../viewControl/buttonController';

export default function(props, pk, isRefresh) {
	// 考虑删除页时，下一页为null的情况
	if (!pk) {
		pk = this.props.getUrlParam('id');
		if (!pk || pk == 'null') {
			//清空页面
			this.props.form.EmptyAllFormValue(AREA.card_head); //订单
			//执行跳出堆栈
			this.props.cardTable.setTableData(AREA.card_body, { rows: [] }); //物料
			this.props.initMetaByPkorg('pk_org_v');
			buttonController.togglePageShow.call(this, this.props);
			return;
		}
	}
	let isLoad = getDefData(DATASOURCECACHE.dataSourceListCacheKey, FIELDS.bisload);
	let templetid = getDefData(DATASOURCECACHE.dataSourceCardCacheKey, PAGECODE.TEMPLATEID);
	let userObject = new Map();
	userObject.set('isLoad', isLoad);
	let data = {
		pks: [ pk ],
		pageid: PAGECODE.CARDPAGECODE,
		templateid: templetid,
		userobject: userObject
	};

	ajax({
		url: URL.cardquery,
		data: data,
		success: (res) => {
			if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				this.props.dealFormulamsg(
					res.formulamsg //参数一：返回的公式对象
				);
			}
			if (res.success && res.data) {
				if (isRefresh == true) {
					showRefreshInfo();
				}
				setCardData.call(this, res.data, pk);
				// 更新缓存
				updateCacheData(
					this.props,
					FIELDS.cbillid,
					pk,
					res.data,
					AREA.cardFormId,
					DATASOURCECACHE.dataSourceCacheKey
				);
			} else {
				this.props.form.setAllFormValue({ [AREA.cardFormId]: { rows: [] } });
				this.props.cardTable.setTableData(AREA.cardTableId, { rows: [] });
			}
			buttonController.togglePageShow.call(this, this.props);
		}
	});
}

function setCardData(data, pk) {
	this.props.beforeUpdatePage();
	if (data.head && data.head.head) {
		this.props.form.EmptyAllFormValue(AREA.cardFormId);
		this.props.form.setAllFormValue({ [AREA.cardFormId]: data.head.head });
		this.props.setUrlParam(pk); //动态修改地址栏中的id的值
	}
	if (data.body) {
		this.props.cardTable.setTableData(AREA.cardTableId, data.body[AREA.cardTableId], null, true, true);
	}
	this.props.updatePage(AREA.cardFormId, AREA.cardTableId);
}
