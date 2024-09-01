/*
 * @Author: zhangjyp
 * @PageInfo: 影像查看
 * @Date: 2018-04-19 10:37:17
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-01-13 15:15:42
 */
import { SCMImageScan } from 'scmpub/scmpub/components/Image';
import { COMMON, FIELD, PAGECODE, AREA } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function clickImageScanBtn(props, type, index) {
	let openbillid = props.getUrlParam(FIELD.id);
	let billdata = props.createMasterChildData(PAGECODE.invoiceCard, AREA.card_head, AREA.card_body);
	let data = {};
	data.billId = openbillid;
	data.billType = billdata.head.card_head.rows[0].values.vtrantypecode.value;
	data.tranTypeId = billdata.head.card_head.rows[0].values.vtrantypecode.value;
	data.pk_org = billdata.head.card_head.rows[0].values.pk_org.value;
	data.pk_org_name = billdata.head.card_head.rows[0].values.pk_org.display;
	//影像所需 FieldMap
	data.pk_billtype = COMMON.billCode;
	data.billDate = billdata.head.card_head.rows[0].values.dbilldate.value;
	data.vbillcode = billdata.head.card_head.rows[0].values.vbillcode.value;
	data.cash = billdata.head.card_head.rows[0].values.ntotalorigmny.value;
	data.imageDisableHint = getLangByResId(this, '4004PUINVOICE-000084'); //"影像管理模块没有启用！" add by congke
	SCMImageScan.call(this, props, data);
}
