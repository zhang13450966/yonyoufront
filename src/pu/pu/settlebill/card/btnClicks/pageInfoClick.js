/**
 * 卡片页面数据加载
 */
import { ajax } from 'nc-lightapp-front';
import { PAGECODE, URL, COMMON, FIELD } from '../../constance';
import { hasListCache, addCacheData, updateCacheData } from '../../../../../scmpub/scmpub/pub/cache';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import togglePageShow from '../viewController/buttonController';
import { showSagaErrorToasts } from '../../../pub/utils/sagaMsgUtils';

export default function pageInfoClick(props, pk, content) {
	if (pk == null || pk == 'null') {
		pk = props.getUrlParam('id');
	}
	pk = pk == 'null' ? null : pk;
	if (!pk) {
		// 清空界面
		togglePageShow.call(this, props, null);
		return;
	}
	this.setState({ billID: pk, pk: pk });
	props.setUrlParam(pk); //动态修改地址栏中的id的值(路径中一定要是id，否则会导致切换下一条的时候，pk取不到)
	let data = { id: pk, pagecode: PAGECODE.cardcode };
	ajax({
		url: URL.getCard,
		data: data,
		method: 'POST',
		success: res => {
			if (res.data) {
				let data = res.data;
				props.beforeUpdatePage();
				if (data.head) {
					this.props.form.setAllFormValue({
						[PAGECODE.cardhead]: data.head[PAGECODE.cardhead],
					});
					pk = data.head[PAGECODE.cardhead].rows[0].values.pk_settlebill.value;
				}
				if (data.body) {
					this.props.cardTable.setTableData(PAGECODE.cardbody, data.body[PAGECODE.cardbody]);
				}
				props.updatePage(PAGECODE.cardhead, [PAGECODE.cardbody]);
				//跳转卡片弹出提示框
				showSagaErrorToasts(this.props, PAGECODE.cardhead, FIELD.pk_settlebill);
				togglePageShow.call(this, props, pk);
				if (content) {
					showSuccessInfo(content);
				}
				if (!hasListCache(this.props, COMMON.settlebillCacheKey)) {
					res.data.head[PAGECODE.cardhead].areacode = PAGECODE.tableId;
					addCacheData(
						this.props,
						'pk_settlebill',
						pk,
						res.data,
						PAGECODE.cardhead,
						COMMON.settlebillCacheKey
					);
				} else {
					res.data.head[PAGECODE.cardhead].areacode = PAGECODE.tableId;
					updateCacheData(
						this.props,
						'pk_settlebill',
						pk,
						res.data,
						PAGECODE.cardhead,
						COMMON.settlebillCacheKey
					);
				}
			}
		},
	});
}
