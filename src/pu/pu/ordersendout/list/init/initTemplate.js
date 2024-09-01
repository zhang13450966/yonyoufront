/*
 * @Author: xiahui 
 * @PageInfo: 采购合同维护列表态模板 
 * @Date: 2019-01-10 17:03:20 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 20:50:21
 */
import { AREA, PAGECODE, URL, FIELDS, BUTTONID, DATASOURCECACHE, DEFCACHEKEY } from '../../constance';
import { buttonControl } from '../viewControl/buttonControl';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { searchRefFilter } from '../../../orderonwaypub/listinit';

export default function(props) {
	props.createUIDom(
		{
			pagecode: PAGECODE.listPagecode
		},
		(data) => {
			if (data) {
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
				if (data.template) {
					let meta = data.template;
					modifierMeta.call(this, props, meta);
					props.meta.setMeta(meta);
				}
				setDefaultData.call(this, props);
			}
		}
	);
}

function modifierMeta(props, meta) {
	//修改列渲染样式
	meta[AREA.listTableId].items = meta[AREA.listTableId].items.map((item, key) => {
		if (item.attrcode == FIELDS.vbillcode) {
			item.render = (text, record, index) => {
				if (record && record.vbillcode) {
					return (
						<a
							style={{ cursor: 'pointer' }}
							onClick={() => {
								props.pushTo(URL.card, {
									sendout: this.isSendout.toString(),
									id: record[FIELDS.pk_order].value,
									pagecode: PAGECODE.cardPagecode
								});
							}}
						>
							{record[FIELDS.vbillcode].value}
						</a>
					);
				}
			};
		}
		return item;
	});

	searchRefFilter.call(this, props, meta, AREA.searchId);

	return meta;
}

function setDefaultData(props) {
	let queryInfo = getDefData(DATASOURCECACHE.dataSourceListCacheKey, DEFCACHEKEY.queryCacheKey);
	if (queryInfo) {
		props.button.setDisabled(BUTTONID.Refresh, false);
		queryInfo.querycondition.conditions.some((condition) => {
			if (condition.field == FIELDS.bissendout) {
				this.isSendout = condition.value.firstvalue;
				return true;
			}
		});
	} else {
		props.button.setDisabled(BUTTONID.Refresh, true);
	}

	buttonControl(props);
}
