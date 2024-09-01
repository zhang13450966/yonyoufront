/*
 * @Author: zhangchangqing 
 * @PageInfo: 删除按钮事件
 * @Date: 2018-04-19 10:36:58 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2019-01-18 10:57:06
 */
import { STOREREQ_CARD, ATTRCODE, STOREREQ_LIST } from '../../siconst';
import { ajax, toast } from 'nc-lightapp-front';
import { updateCacheData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { setBtnShow } from './pageInfoClick';
let tableId = STOREREQ_CARD.tableId;
let formId = STOREREQ_CARD.formId; //'head';

export default function clickBtn(props) {
	// 获取选中行
	
	let _this = this;
	let pk = this.props.form.getFormItemsValue(formId, ATTRCODE.pk_storereq).value;
	let ts = this.props.form.getFormItemsValue(formId, ATTRCODE.ts).value;
	// 执行打开或者关闭操作
	let delRows = [];
	let dataS = {
		id: pk,
		ts: ts
	};
	delRows.push(dataS);
	// 拼装json
	let data = {
		deleteInfos: delRows,
		pageid: STOREREQ_CARD.cardpageid
	};
	// 发送请求
	ajax({
		url: STOREREQ_CARD.openBillForCardURL,
		data: data,
		success: (res) => {
			
			if (res.success) {
				
				//渲染数据，
				let pkid;
				if (res.data.head) {
					_this.props.form.setAllFormValue({ [formId]: res.data.head[formId] });
					pkid = res.data.head[formId].rows[0].values.pk_storereq.value;
					_this.setState({
						lineShowType: [],
						vbillcode: res.data.head[formId].rows[0].values.vbillcode.value,
						billId: pkid,
						billtype: res.data.head[formId].rows[0].values.vtrantypecode.value
					});
					let fbillstatus = res.data.head[formId].rows[0].values.fbillstatus.value;
					// 设置按钮可用性
					setBtnShow(_this, fbillstatus);
				}
				if (res.data.body) {
					_this.props.cardTable.setTableData(tableId, res.data.body[tableId]);
				}
				updateCacheData(_this.props, ATTRCODE.pk_storereq, pkid, res.data, formId, STOREREQ_LIST.dataSource);
				showSuccessInfo(getLangByResId(_this, '4004STOREREQ-000042')); /* 国际化处理： 整单打开成功！*/
			}
		}
	});
}
