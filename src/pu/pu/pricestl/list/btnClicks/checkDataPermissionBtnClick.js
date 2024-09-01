import { ajax, toast } from 'nc-lightapp-front';
import { URL, PAGECODE } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function checkDataPermissionBtnClick(record, oprcode, callBack) {
	let id = '';
	if (record) {
		id = record.pk_pricesettle.value;
	} else {
		let checkeddatas = this.props.table.getCheckedRows(PAGECODE.listcode);
		if (checkeddatas == null || checkeddatas.length == 0) {
			toast({
				color: 'warning',
				content: getLangByResId(this, '4004PRICESTL-000019')
			}); /* 国际化处理： 请选择单据！*/ /* 国际化处理： 请选择单据*/
			return;
		}
		id = checkeddatas[0].data.values.pk_pricesettle.value;
	}
	let pks = new Array();
	pks.push(id);
	let data = {
		pks: pks,
		actionCode: oprcode
	};
	ajax({
		url: URL.editdatapermission,
		data: data,
		method: 'post',
		success: (res) => {
			if (res && res.success) {
				callBack && callBack();
			}
		}
	});
}
