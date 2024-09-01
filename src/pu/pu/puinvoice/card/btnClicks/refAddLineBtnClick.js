/*
 * @Author: jiangfw
 * @PageInfo: 参照增行事件
 * @Date: 2018-04-25 20:47:18
 * @Last Modified by: zhangmi
 * @Last Modified time: 2022-05-26 12:12:07
 */
import { FIELD, BILLTYPE, MODAL_ID } from '../../constance';
import ref21AddLineComfirmBtnClick from './ref21AddLineComfirmBtnClick';
import ref21PAddLineComfirmBtnClick from './ref21PAddLineComfirmBtnClick';
import ref45AddLineComfirmBtnClick from './ref45AddLineComfirmBtnClick';
import ref47AddLineComfirmBtnClick from './ref47AddLineComfirmBtnClick';
import ref4TAddLineComfirmBtnClick from './ref4TAddLineComfirmBtnClick';
import ref50AddLineComfirmBtnClick from './ref50AddLineComfirmBtnClick';
import ref61AddLineComfirmBtnClick from './ref61AddLineComfirmBtnClick';
import Ref47Addline from '../../transfer47/ref47Addline';
import Ref45Addline from '../../transfer45/ref45Addline';
import Ref21Addline from '../../transfer21/ref21Addline';
import Ref21PAddline from '../../transfer21Pto25/ref21PAddline';
import Ref4TAddline from '../../transfer4T/ref4TAddline';
import Ref61Addline from '../../transfer61/ref61Addline';
import Ref50Addline from '../../transfer50/ref50Addline';

export default function clickRefAddLineBtn() {
	let refsourcdata = this.refsourcdata; //参照增行要过滤当前页面的数据
	let props = this.props;
	let pk_busitype = props.form.getFormItemsValue(this.formId, FIELD.pk_busitype).value;
	let billType;
	if (this.state.billTypeIndex) {
		billType = this.state.billTypeIndex.get(pk_busitype);
	}
	if (refsourcdata) {
		let key = refsourcdata.transferInfo[0].key;
		if (key == '21P') {
			billType = '21P';
		}
	}
	// if (this.billTypeIndex) {
	// 	billType = this.billTypeIndex.get(pk_busitype);
	// }
	if (!billType) {
		let bodys = props.cardTable.getAllData('card_body').rows;
		for (let i = 0; i < bodys.length; i++) {
			billType = bodys[i].values.csourcetypecode.value;
			if (billType) break;
		}
	}
	//拉单删除所有表体时，上面的方式billtype取不到，打开的参照增行查询窗口有问题，若没取到继续从下面的方法取之前缓存的数据
	if (!billType) {
		for (let i = 0; i < refsourcdata.transferInfo.length; i++) {
			billType = refsourcdata.transferInfo[i].key;
			if (billType) break;
		}
	}

	let transType = this.transType;

	// 结算财务组织
	let cfanaceorgoid = props.form.getFormItemsValue(this.formId, FIELD.pk_org);
	// 库存组织
	let pk_stockorg = props.form.getFormItemsValue(this.formId, FIELD.pk_stockorg);
	// 采购组织
	let pk_purchaseorg = props.form.getFormItemsValue(this.formId, FIELD.pk_purchaseorg);
	// 供应商
	let pk_supplier = props.form.getFormItemsValue(this.formId, FIELD.pk_supplier);

	let initData;
	let transferTable;
	if (BILLTYPE.vmiSum == billType || 'ic_vmi_sum.cvmihid' == billType) {
		initData = { cfanaceorgoid, ccalbodyid: pk_stockorg, pk_supplier };
		transferTable = (
			<Ref50Addline
				isRefAddLine={true}
				transType={transType}
				pk_busitype={pk_busitype}
				initData={initData}
				refsourcdata={refsourcdata}
				refAddLineComfirmBtnClick={ref50AddLineComfirmBtnClick.bind(this)}
			/>
		);
	} else if (BILLTYPE.purchaseIn == billType) {
		initData = { cfanaceorgoid, pk_org: pk_stockorg, pk_supplier };
		transferTable = (
			<Ref45Addline
				isRefAddLine={true}
				transType={transType}
				pk_busitype={pk_busitype}
				initData={initData}
				refsourcdata={refsourcdata}
				refAddLineComfirmBtnClick={ref45AddLineComfirmBtnClick.bind(this)}
			/>
		);
	} else if (BILLTYPE.po_order == billType) {
		initData = { cfanaceorgoid, pk_purchaseorg, pk_supplier };
		transferTable = (
			<Ref21Addline
				isRefAddLine={true}
				transType={transType}
				pk_busitype={pk_busitype}
				initData={initData}
				refsourcdata={refsourcdata}
				refAddLineComfirmBtnClick={ref21AddLineComfirmBtnClick.bind(this)}
			/>
		);
	} else if (BILLTYPE.initEstimate == billType) {
		initData = { cfanaceorgoid, pk_stockorg, pk_supplier };
		transferTable = (
			<Ref4TAddline
				isRefAddLine={true}
				transType={transType}
				pk_busitype={pk_busitype}
				initData={initData}
				refsourcdata={refsourcdata}
				refAddLineComfirmBtnClick={ref4TAddLineComfirmBtnClick.bind(this)}
			/>
		);
	} else if (BILLTYPE.subcontIn == billType) {
		initData = { cfanaceorgoid, pk_stockorg, pk_supplier };
		transferTable = (
			<Ref47Addline
				isRefAddLine={true}
				transType={transType}
				pk_busitype={pk_busitype}
				initData={initData}
				refsourcdata={refsourcdata}
				refAddLineComfirmBtnClick={ref47AddLineComfirmBtnClick.bind(this)}
			/>
		);
	} else if (BILLTYPE.sc_order == billType) {
		initData = { cfanaceorgoid, pk_purchaseorg, pk_supplier };
		transferTable = (
			<Ref61Addline
				isRefAddLine={true}
				transType={transType}
				pk_busitype={pk_busitype}
				initData={initData}
				refsourcdata={refsourcdata}
				refAddLineComfirmBtnClick={ref61AddLineComfirmBtnClick.bind(this)}
			/>
		);
	} else if (BILLTYPE.payplan_order == billType) {
		initData = { cfanaceorgoid, pk_purchaseorg, pk_supplier };
		transferTable = (
			<Ref21PAddline
				isRefAddLine={true}
				transType={transType}
				pk_busitype={pk_busitype}
				initData={initData}
				refsourcdata={refsourcdata}
				refAddLineComfirmBtnClick={ref21PAddLineComfirmBtnClick.bind(this)}
			/>
		);
	}

	// 设置模态框显示
	props.modal.show(MODAL_ID.RefAddRowModal, {
		content: transferTable,
		noFooter: true
	});
}
