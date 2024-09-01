/*
 * @Author: heyfn
 * @Description: 初始化付款计划弹框界面
 * @Date: 2022-01-21 10:18:35
 * @Last Modified by: tianzhyw
 * @Last Modified time: 2022-06-09 11:02:31
 */
import { ajax } from 'nc-lightapp-front';
import { PAGECODE, URL, FIELD, TRANSTYPE, APPCODE, APPPAGECODE, STATUS } from './../../constance/index';
import BillCodeHyperLink from '../../../../../scmpub/scmpub/components/BillCodeStyle';
export default function(props) {
	props.createUIDom(
		{
			pagecode: PAGECODE.unioDetailed //页面id
		},
		(data) => {
			if (data) {
				if (data.template) {
					if (this.showFlag) {
						return;
					}
					let meta = data.template;
					let new_meta = modifierMeta.call(this, props, meta);
					props.meta.addMeta(new_meta, () => {
						//页面加载数据之前清空表格数据
						// props.table.setAllTableData(PAGECODE.itemBodyCode, { rows: [] });
						// props.table.setAllTableData(PAGECODE.itemConfirmBodyCode, { rows: [] });
						let param = {
							pk_order: props.pk_order,
							itemCode: PAGECODE.itemBodyCode,
							itemConfirmBodyCode: PAGECODE.itemConfirmBodyCode,
							[FIELD.pagecode]: PAGECODE.unioDetailed
						};
						ajax({
							url: URL.queryUnioDetailedByOrderId,
							data: param,
							success: (res) => {
								if (
									res.success &&
									res.data &&
									res.data.payPlanItemList &&
									res.data.payPlanItemList[PAGECODE.itemBodyCode] &&
									res.data.payPlanItemList[PAGECODE.itemBodyCode].rows
								) {
									// 将采购订单付款计划子表信息回填到表格
									props.table.setAllTableData(
										PAGECODE.itemBodyCode,
										res.data.payPlanItemList[PAGECODE.itemBodyCode]
									);
								} else {
									props.table.setAllTableData(PAGECODE.itemBodyCode, { rows: [] });
									// props.table.setAllTableData(PAGECODE.itemConfirmBodyCode, { rows: [] });
								}
								if (
									res.success &&
									res.data &&
									res.data.payPlanItemConfirmList &&
									res.data.payPlanItemConfirmList[PAGECODE.itemConfirmBodyCode] &&
									res.data.payPlanItemConfirmList[PAGECODE.itemConfirmBodyCode].rows
								) {
									// 将采购订单付款计划孙表信息回填到表格
									props.table.setAllTableData(
										PAGECODE.itemConfirmBodyCode,
										res.data.payPlanItemConfirmList[PAGECODE.itemConfirmBodyCode]
									);
								} else {
									props.table.setAllTableData(PAGECODE.itemConfirmBodyCode, { rows: [] });
								}
								this.setShowFlag();
							}
						});
					});
				}
			}
		}
	);
}

function modifierMeta(props, meta) {
	// 为孙表编码设置超链接
	meta[PAGECODE.itemConfirmBodyCode].items.map((item) => {
		if (item.attrcode == 'vconfirmbillcode') {
			item.render = (text, record, index) => {
				if (record && record.vconfirmbillcode) {
					let transType = record.cconfirmtranstype.value;
					let appcode = '';
					let pagecode = '';
					// 根据订单类型，获取跳转界面的appcode和pagecode
					if (transType && transType == TRANSTYPE.CONTRACT) {
						appcode = APPCODE.CONTRACT;
						pagecode = APPPAGECODE.CONTRACT;
					} else if (transType && transType == TRANSTYPE.ORDER) {
						appcode = APPCODE.ORDER;
						pagecode = APPPAGECODE.ORDER;
					} else if (transType && transType == TRANSTYPE.INVOICE) {
						appcode = APPCODE.INVOICE;
						pagecode = APPPAGECODE.INVOICE;
					} else if (transType && transType == TRANSTYPE.WAREHOUSING) {
						appcode = APPCODE.WAREHOUSING;
						pagecode = APPPAGECODE.WAREHOUSING;
					} else if (transType && transType == TRANSTYPE.ARRIVAL) {
						appcode = APPCODE.ARRIVAL;
						pagecode = APPPAGECODE.ARRIVAL;
					} else {
						appcode = APPCODE.PROGRESSCONFIRM;
						pagecode = APPPAGECODE.PROGRESSCONFIRM;
					}
					return (
						<BillCodeHyperLink
							value={record.vconfirmbillcode.value}
							onClick={() => {
								props.openTo(null, {
									appcode: appcode,
									pagecode: pagecode,
									status: STATUS.browse,
									id: record.cconfirmbillid.value
								});
							}}
						/>
					);
				}
			};
		}
	});
	return meta;
}
