/*
 * @Author: CongKe
 * @PageInfo: 订单装运状态维护
 * @Date: 2019-04-17 09:07:53
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 20:32:36
 */
import { AREA, PAGECODE, URL, BUTTONID, DATASOURCECACHE, FIELDS } from '../../constance';
import { searchRefFilter } from '../../../orderonwaypub/listinit/index';
import BillCodeHyperLink from 'scmpub/scmpub/components/BillCodeStyle';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';

export default function(props) {
	props.createUIDom(
		{
			pagecode: PAGECODE.LISTPAGECODE
		},
		(data) => {
			if (data && data.template) {
				let meta = data.template;
				modifierMeta.call(this, props, meta, AREA.listTableId, AREA.searchId, URL.card);
				props.meta.setMeta(meta);
			}
			if (data && data.button) {
				let button = data.button;
				props.button.setButtons(button);
			}
			setTimeout(() => {
				initBtnStatus.call(this, props);
			}, 0);
		}
	);
}

function initBtnStatus(props) {
	let isLoad = getDefData(DATASOURCECACHE.dataSourceListCacheKey, FIELDS.bisload);
	let rows = props.table.getCheckedRows(AREA.listTableId);
	let noEdit = true;
	noEdit = rows.length > 0 ? false : noEdit;
	let isrefresh = true;
	isrefresh = isLoad && isLoad != undefined ? false : isrefresh;
	let disableArr = {
		[BUTTONID.Print]: noEdit,
		[BUTTONID.Refresh]: isrefresh
	};
	props.button.setDisabled(disableArr);
}

function modifierMeta(props, meta, listTableId, searchId, cardUrl) {
	//修改列渲染样式
	meta[listTableId].items = meta[listTableId].items.map((item, key) => {
		if (item.attrcode == 'vbillcode') {
			item.render = (text, record, index) => {
				if (record && record.vbillcode) {
					return (
						<BillCodeHyperLink
							value={record && record.vbillcode && record.vbillcode.value}
							onClick={() => {
								props.pushTo(cardUrl, {
									id: record.pk_order.value,
									status: 'edit',
									pagecode: PAGECODE.CARDPAGECODE
								});
							}}
						/>
					);
				}
			};
		}
		return item;
	});
	searchRefFilter.call(this, props, meta, searchId);
	return meta;
}
