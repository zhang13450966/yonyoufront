import { URL, AREA, UISTATE, FIELD, DATASOURCE, DATASOURCECACHE } from '../../constance';
import { ajax } from 'nc-lightapp-front';
import { constructCardQueryParam } from '../../utils/dataUtils';
import { updateCacheData, getDefData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { buttonControl } from '../viewControl/buttonControl';

/*
 * @PageInfo: 初始化数据
 * @Author: guozhq
 * @Date: 2019-03-19 14:11:07
 * @Last Modified by: zhanghrh
 * @Last Modified time: 2019-08-08 18:21:55
 */
export default function(showMessage) {
	let id = this.props.getUrlParam('id');
	let status = this.props.getUrlParam('status');
	let isConfirm = getDefData(DATASOURCECACHE.dataSourceListCacheKey, FIELD.CONFIRM);
	if (status == UISTATE.edit || status == UISTATE.browse) {
		if (!id) {
			this.props.form.EmptyAllFormValue(AREA.CARD_FORM);
			this.props.cardTable.setTableData(AREA.CARD_TABLE, { rows: [] });
		} else {
			ajax({
				url: URL.CARDQUERY,
				data: constructCardQueryParam.call(this, id),
				success: (res) => {
					// 处理显示公式结果
					if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
						this.props.dealFormulamsg(res.formulamsg);
					}
					if (res.data) {
						let length = res.data.body.body.rows.length;
						this.props.form.setAllFormValue({ [AREA.CARD_FORM]: res.data.head[AREA.CARD_FORM] });
						this.props.cardTable.setTableData(AREA.CARD_TABLE, res.data.body[AREA.CARD_TABLE]);
						for (let i = 0; i < length; i++) {
							this.props.cardTable.setValByKeyAndIndex(AREA.CARD_TABLE, i, 'bconfirmflag', {
								value: isConfirm,
								display: null,
								scale: '-1'
							});
						}
						buttonControl.call(this, this.props);
						// 更新缓存
						updateCacheData(
							this.props,
							FIELD.PK_ORDER,
							id,
							{ head: res.data },
							AREA.CARD_FORM,
							DATASOURCE.LIST
						);
						if (showMessage) {
							showMessage.call(this);
						}
					}
				}
			});
		}
	}
}
