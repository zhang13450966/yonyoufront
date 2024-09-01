/*
 * @Author: wanglzh7 
 * @PageInfo: 卡片态翻页
 * @Date: 2018-06-29 15:45:40 
 * @Last Modified by: zhanghrh
 * @Last Modified time: 2019-08-10 13:38:17
 */
import { ajax } from 'nc-lightapp-front';
import { PAGECODE, AREA, URL, FIELDS, DATASOURCE, FIELD, DATASOURCECACHE } from '../../constance';
import { getCacheDataByPk, updateCacheData } from '../../../../../scmpub/scmpub/pub/cache';
import { showRefreshInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { buttonControl, setEmptyValueDisplay } from '../viewControl/buttonControl';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';
export default function(props, pk, isRefresh = false, showTitle = false) {
	// 考虑删除页时，下一页为null的情况
	if (!pk) {
		setEmptyValueDisplay(props);
		return;
	}
	// 刷新需要重新查询数据
	if (!isRefresh) {
		let cacheData = getCacheDataByPk(props, DATASOURCE.LIST, pk);
		//判断缓存是否有数据
		if (cacheData) {
			setCardData.call(this, props, cacheData.head, pk);
			return;
		}
	}
	let confirm = getDefData(DATASOURCECACHE.dataSourceListCacheKey, FIELD.CONFIRM); //将confirm存在缓存里
	let data = {
		pks: [ pk ],
		pageid: PAGECODE.CARD,
		userobject: { isConfirm: confirm }
	};

	ajax({
		url: URL.CARDQUERY,
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
				updateCacheData(props, FIELD.PK_ORDER, pk, { head: res.data }, AREA.CARD_FORM, DATASOURCE.LIST);
			} else {
				props.form.setAllFormValue({ [AREA.CARD_FORM]: { rows: [] } });
				props.cardTable.setTableData(AREA.CARD_TABLE, { rows: [] });
			}
		}
	});
}

function setCardData(props, data, pk) {
	props.beforeUpdatePage();
	if (data.head && data.head.head) {
		props.form.EmptyAllFormValue(AREA.CARD_FORM);
		props.form.setAllFormValue({ [AREA.CARD_FORM]: data.head.head });
		props.setUrlParam(pk); //动态修改地址栏中的id的值
	}
	if (data.body) {
		props.cardTable.setTableData(AREA.CARD_TABLE, data.body[AREA.CARD_TABLE], null, true, true);
		let length = data.body.body.rows.length;
		for (let i = 0; i < length; i++) {
			this.props.cardTable.setValByKeyAndIndex(AREA.CARD_TABLE, i, 'bconfirmflag', {
				value: getDefData(DATASOURCECACHE.dataSourceListCacheKey, FIELD.CONFIRM),
				display: null,
				scale: '-1'
			});
		}
	}
	buttonControl.call(this, props);
	props.updatePage(AREA.CARD_FORM, AREA.CARD_TABLE);
}
