/*
 * @Author: xiahui 
 * @PageInfo: 翻页
 * @Date: 2019-04-17 09:04:04 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-08-04 15:15:25
 */
import { ajax } from 'nc-lightapp-front';
import { PAGECODE, AREA, URL, FIELDS, DATASOURCECACHE } from '../../constance';
import { getCacheDataByPk, updateCacheData } from 'src/scmpub/scmpub/pub/cache';
import { showRefreshInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { buttonControl, setEmptyValueDisplay } from '../viewControl/buttonControl';
// import { buttonControl, setEmptyValueDisplay } from '../viewControl/buttonControl';

export default function(props, pk, isRefresh = false, showTitle = false) {
	// 考虑删除页时，下一页为null的情况
	if (!pk) {
		setEmptyValueDisplay(props);
		return;
	}
	// 刷新需要重新查询数据
	if (!isRefresh) {
		let cacheData = getCacheDataByPk(props, DATASOURCECACHE.dataSourceListCacheKey, pk);
		//判断缓存是否有数据
		if (cacheData) {
			setCardData.call(this, props, cacheData, pk);
			return;
		}
	}

	let data = {
		pks: [ pk ],
		pageid: PAGECODE.cardPagecode,
		userobject: { isSendout: props.getUrlParam('sendout') == 'false' ? false : true }
	};

	ajax({
		url: URL.cardQuery,
		data: data,
		success: (res) => {
			if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				this.props.dealFormulamsg(
					res.formulamsg //参数一：返回的公式对象
				);
			}
			if (res.success && res.data) {
				if (showTitle) {
					showRefreshInfo();
				}
				setCardData.call(this, props, res.data, pk);
				// 更新缓存
				updateCacheData(
					props,
					FIELDS.pk_order,
					pk,
					res.data,
					AREA.cardFormId,
					DATASOURCECACHE.dataSourceListCacheKey
				);
			} else {
				props.form.setAllFormValue({ [AREA.cardFormId]: { rows: [] } });
				props.cardTable.setTableData(AREA.cardTableId, { rows: [] });
			}
		}
	});
}

function setCardData(props, data, pk) {
	props.beforeUpdatePage();
	if (data.head && data.head.head) {
		props.form.EmptyAllFormValue(AREA.cardFormId);
		props.form.setAllFormValue({ [AREA.cardFormId]: data.head.head });
		props.setUrlParam(pk); //动态修改地址栏中的id的值
	}
	if (data.body) {
		props.cardTable.setTableData(AREA.cardTableId, data.body[AREA.cardTableId], null, true, true);
	}
	buttonControl.call(this, props);
	props.updatePage(AREA.cardFormId, AREA.cardTableId);
}
