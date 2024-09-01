/*
 * @Author: fangmj7 
 * @PageInfo:卡片表头编辑后事件
 * 所有字段的主组织过滤均在init中统一加入一次
 * @Date: 2022-02-05 10:02:28 
 * @Last Modified by: fangmj7
 */
import { FIELD, PAGECODE, AREA, URL } from '../../constance';
import remoteRequest from './remoteRequest';
import vbillcodeBeforeEvent from './vbillcodeBeforeEvent';
// import vtrantypecode from './vtrantypecode';
import {
	canRateDateModify,
	canRateModify,
	isBillSelfMake
} from '../../../../../scmpub/scmpub/pub/tool/currencyRateUtil';

export default async function(props, moduleId, key, value) {
	let _this = this;
	let flag = true;
	let constance = {};
	let meta = this.props.meta.getMeta();
	let tailinfo = [
		'billmaker',
		'dmakedate',
		'approver',
		'taudittime',
		'crevisepsn',
		'trevisiontime',
		'pk_freezepsndoc',
		'tfreezetime',
		'iprintcount',
		'creator',
		'creationtime',
		'modifier',
		'modifiedtime'
	];
	if (key == FIELD.vbillcode) {
		constance = {
			key: FIELD.vbillcode,
			formareaid: PAGECODE.head,
			pk_org_key: FIELD.pk_org,
			billtype: PAGECODE.billType
		};
		flag = await vbillcodeBeforeEvent.call(this, props, constance);
	} else if (key == FIELD.cconfirmpsnid) {
		// 原nc的业务员的编辑前事件是根据采购组织和采购部门参照过滤的
		flag = true;
	} else if (key == FIELD.cconfirmdeptvid) {
		// 原nc的采购部门编辑前事件根据采购组织和采购部门oid过滤
		flag = true;
	} else if (key == FIELD.cconfirmdeptid) {
		// 原nc的采购部门编辑前事件根据采购组织和采购部门oid过滤
		flag = true;
		// else if (key == FIELD.ctranstypeid) {
		// 	// 交易类型
		// 	flag = await vtrantypecode.call(this);
		// 	let fbillstatus = this.props.form.getFormItemsValue(AREA.head, 'fbillstatus'); //单据状态
		// 	fbillstatus = fbillstatus && fbillstatus.value;
		// 	flag = fbillstatus == FIELD.approve ? false : flag;
		// }
	} else if (key == FIELD.corigcurrencyid) {
		flag = true;
	} else if (key == 'vmemo') {
		flag = true;
	} else if (tailinfo.includes(key)) {
		//表尾信息
		flag = false;
	} else if (key == FIELD.nexchangerate) {
		// 折本汇率
		// 1.原币为空不让编辑
		// 2.原币、本币相同不允许编辑
		let ccurrencyid = this.props.form.getFormItemsValue(AREA.head, FIELD.ccurrencyid).value; //本币
		let corigcurrencyid = props.form.getFormItemsValue(AREA.head, FIELD.corigcurrencyid).value; //原币
		let fratecategory = props.form.getFormItemsValue(AREA.head, FIELD.fratecategory).value; //// 获取汇率类别

		if (!corigcurrencyid || ccurrencyid == corigcurrencyid) {
			return false;
		} else {
			return canRateModify.call(
				this,
				fratecategory,
				isBillSelfMake.call(this, fratecategory, AREA.body, 'vsrctype', [ '21P' ])
			);
		}
	} else if (key == 'nglobalexchgrate') {
		// 全局本位币汇率
		flag = true;
		let corigcurrencyid = _this.props.form.getFormItemsValue(AREA.head, 'corigcurrencyid').value;
		let ccurrencyid = _this.props.form.getFormItemsValue(AREA.head, 'ccurrencyid').value;
		constance.key = key;
		constance.params = {
			corigcurrencyid: corigcurrencyid,
			ccurrencyid: ccurrencyid
		};
		flag = await remoteRequest(URL.cardHeadBeforeEvent, constance);
	} else if (key == 'ngroupexchgrate') {
		// 集团本位币汇率
		flag = true;
		let pk_group = _this.props.form.getFormItemsValue(AREA.head, 'pk_group').value;
		let corigcurrencyid = _this.props.form.getFormItemsValue(AREA.head, 'corigcurrencyid').value;
		let ccurrencyid = _this.props.form.getFormItemsValue(AREA.head, 'ccurrencyid').value;
		constance.key = key;
		constance.params = {
			pk_group: pk_group,
			corigcurrencyid: corigcurrencyid,
			ccurrencyid: ccurrencyid
		};
		flag = await remoteRequest(URL.cardHeadBeforeEvent, constance);
	} else if (key == FIELD.cratetype) {
		//组织汇率类型
		//补充参照过滤----------------------------
		// 1.原币为空不让编辑
		// 2.原币、本币相同不允许编辑
		let ccurrencyid = props.form.getFormItemsValue(AREA.head, FIELD.ccurrencyid).value; //本币
		let corigcurrencyid = props.form.getFormItemsValue(AREA.head, FIELD.corigcurrencyid).value; //原币
		if (!corigcurrencyid || ccurrencyid == corigcurrencyid) {
			return false;
		}
	} else if (key == FIELD.dratedate) {
		let fratecategory = props.form.getFormItemsValue(AREA.head, FIELD.fratecategory).value; //// 获取汇率类型

		//组织汇率来源日期
		return canRateDateModify.call(
			this,
			fratecategory,
			isBillSelfMake.call(this, fratecategory, AREA.body, 'vsrctype', [ '2C' ])
		);
	}

	return flag;
}
