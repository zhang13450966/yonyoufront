import { FIELD, DATASOURCE, URL, UISTATE } from '../../constance';
import { getDefData, setDefData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { ajax } from 'nc-lightapp-front';

const LINK_TRANSTYPE_CACHE = 'LINK_TRANSTYPE_CACHE';

export default function(props, record) {
	let pk_order = record[FIELD.PK_ORDER].value;
	let confirm = this.queryInfo.querycondition.conditions.find((e) => e.field === 'confirm').value.firstvalue;
	let ctranstypeid = record[FIELD.CTRANTYPEID].value;

	let obj = getDefData(DATASOURCE.LIST, LINK_TRANSTYPE_CACHE) || {};
	if (obj.hasOwnProperty(ctranstypeid)) {
		let value = obj[ctranstypeid];
		link(props, pk_order, value ? UISTATE.edit : UISTATE.browse, confirm);
	} else {
		ajax({
			url: URL.TRANSTYPEQUERY,
			data: ctranstypeid,
			success: (res) => {
				if (res.data) {
					let value = res.data;
					obj = obj;
					obj[ctranstypeid] = value;
					setDefData(DATASOURCE.LIST, LINK_TRANSTYPE_CACHE, obj);
					link(props, pk_order, value ? UISTATE.edit : UISTATE.browse, confirm);
				}
			}
		});
	}
}

function link(props, id, status, confirm) {
	props.pushTo(URL.CARD, { id, status, confirm, pagecode: PAGECODE.CARD });
}
