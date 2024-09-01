/*
 * @Author: CongKe 
 * @PageInfo: 参照增行确认按钮
 * @Date: 2018-07-30 14:03:49 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-10-09 13:51:47
 */
import { ajax, toast, promptBox } from 'nc-lightapp-front';
import { PAGECODE, TRANSFER20, FIELD, OrderCache, TRANSFER } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { changeUrlParam, getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { relationCT } from '../afterEvents';
import { buttonController } from '../viewController/index';
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/RownoUtil';
import { deepClone } from '../../../../../scmpub/scmpub/pub/tool';
let materialFilterColumn = [
	'numberindex', //非元数据字段平台业务字段
	'pseudocolumn',
	'crowno',
	'dbilldate',
	'dr',
	'pk_org',
	'pk_org_v',
	'fbuysellflag',
	'casscustid',
	'btriatradeflag',
	'btransclosed',
	'bstockclose',
	'breceiveplan',
	'bpayclose',
	'blargess',
	'binvoiceclose',
	'bborrowpur',
	'barriveclose',
	'nitemdiscountrate'
];

export default function refAddLineComfirmBtnClick(array) {
	let _this = this;
	_this.props.modal.close('RefAdd20Modal');
	let transfer = this.props.getUrlParam(TRANSFER.transfer);
	let _url = TRANSFER20.TRANSFERXTO21ACTION;
	let refsourcdata = _this.refsourcdata; //参照增行要过滤当前页面的数据
	let existRefData = deepClone(refsourcdata);
	array = getDefData(OrderCache.OrderTransferCache, '20to21');
	let templetid = getDefData(OrderCache.OrderTransferCache, 'templetid');
	let org = _this.props.getUrlParam('org');
	let userObject = { pk_org: org };
	let key = TRANSFER20.KEY;
	let data = {
		pagecode: PAGECODE.cardcode,
		templetid: templetid,
		queryAreaCode: null,
		oid: null,
		userObject: userObject,
		queryType: PAGECODE.tree,
		key: key,
		data: array
	};

	if (array) {
		let cacheArray = array;
		ajax({
			url: _url,
			data: data,
			success: (res) => {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					_this.props.dealFormulamsg(
						res.formulamsg, //参数一：返回的公式对象
						{
							//参数二：界面使用的表格类型
							[PAGECODE.head_payment]: 'cardTable',
							[PAGECODE.cardbody]: 'cardTable'
						}
					);
				}
				let octrantypeid = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.ctrantypeid).value;
				let opk_supplier = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_supplier).value;
				let opk_org = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_org).value;
				octrantypeid = octrantypeid == null ? '' : octrantypeid;
				opk_supplier = opk_supplier == null ? '' : opk_supplier;
				opk_org = opk_org == null ? '' : opk_org;
				let refdata = res.data && res.data.extBillCards;
				let existDiffer = true;
				let array = new Array();
				// 先过滤再增行
				_this.props.cardTable.filterEmptyRows(PAGECODE.cardbody, materialFilterColumn);
				// 有效行
				let rows = _this.props.cardTable.getNumberOfRows(PAGECODE.cardbody, false);
				refdata &&
					refdata.map((element) => {
						let head = element.head[PAGECODE.cardhead];
						let cards = element.bodys;
						let nctrantypeid = head.rows[0].values.ctrantypeid && head.rows[0].values.ctrantypeid.value;
						let npk_supplier = head.rows[0].values.pk_supplier && head.rows[0].values.pk_supplier.value;
						let npk_org = head.rows[0].values.pk_org && head.rows[0].values.pk_org.value;
						nctrantypeid = nctrantypeid == null ? '' : nctrantypeid;
						npk_supplier = npk_supplier == null ? '' : npk_supplier;
						npk_org = npk_org == null || npk_org == '' ? null : npk_org;
						// 先判断表头的 业务交易类型、供应商、采购组织  三个是否一致 不一致不能追加
						if (octrantypeid == nctrantypeid && opk_supplier == npk_supplier && opk_org == npk_org) {
							cards[PAGECODE.cardbody].rows.map((o) => {
								o.values.crowno = { display: null, value: null };
								array.push({ index: rows++, data: o });
							});
						} else {
							//为否代表不能增行
							existDiffer = false;
						}
					});
				if (existDiffer) {
					if (refsourcdata) {
						refsourcdata.data = [ ...cacheArray, ...refsourcdata.data ];
						_this.refsourcdata = refsourcdata;
					}
					this.props.cardTable.insertDataByIndexs(PAGECODE.cardbody, array, true);
					RownoUtils.setRowNo(this.props, PAGECODE.cardbody, FIELD.crowno);
					//缓存
					buttonController.cachedata.call(this);
					relationCT.relationCT.call(this, this.props, null, existRefData);
				} else {
					// 追加信息表头字段业务类型，供应商，采购组织和当前订单表头有不相同的值，不能追加到当前表体
					/* 国际化处理： 追加信息表头字段业务类型，供应商，采购组织和当前订单表头有不相同的值，不能追加到当前表体！*/
					toast({ color: 'warning', content: getLangByResId(this, '4004POORDER-000049') });
				}
			}
		});
	}
}
