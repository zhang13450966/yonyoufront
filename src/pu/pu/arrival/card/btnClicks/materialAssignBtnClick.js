import { toast, cacheTools } from 'nc-lightapp-front';
import { AREA, URL, PAGECODE, FIELD } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { ajax } from 'nc-lightapp-front';
import remoteSagasCheck from '../../../pub/remoteCall/remoteSagasCheck';

export default function(props) {
	let _this = this;
	let rows = _this.props.cardTable.getCheckedRows(AREA.table);
	if (rows.length < 1) {
		toast({ content: getLangByResId(_this, '4004ARRIVAL-000008'), color: 'warning' }); /* 国际化处理： 请选择数据*/
	}
	let pkTsParams = rows.map((row) => {
		return {
			pk: row.data.values.pk_arriveorder_b.value,
			ts: row.data.values.ts.value
		};
	});
	let vtrantypecode = (props.form.getFormItemsValue(AREA.form, 'vtrantypecode') || {}).value;
	let hpk = (props.form.getFormItemsValue(AREA.form, 'pk_arriveorder') || {}).value;
	let hts = (props.form.getFormItemsValue(AREA.form, 'ts') || {}).value;
	let cachekey = '23To4A60pks';
	ajax({
		method: 'post',
		url: URL.sagaCheck,
		data: {
			pageid: PAGECODE.card,
			pkTsParams: pkTsParams
		},
		success: function(res) {
			if (res && res.data) {
				let pks = [
					{
						bodys: res.data,
						head: {
							pk: hpk,
							ts: hts
						}
					}
				];
				cacheTools.set(cachekey, pks);

				props.openTo('/nccloud/resources/rum/assign/assign/main/index.html#/card', {
					appcode: '458001004A',
					pagecode: '458001004A_card',
					srcbilltype: '23',
					srctranstype: vtrantypecode, //传来的交易类型
					status: 'DirectAssign'
				});
			}
		}
	});
}
