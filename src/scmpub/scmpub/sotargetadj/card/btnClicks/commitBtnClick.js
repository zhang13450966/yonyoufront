/*
 * @Author: zhangchangqing 
 * @PageInfo: 删除按钮事件
 * @Date: 2018-04-19 10:36:58 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2020-03-02 14:54:16
 */
import { TARGETADJ_CARD, TARGETADJ_LIST, ATTRCODE } from '../../siconst';
import { ajax } from 'nc-lightapp-front';
import { updateCacheData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { updateDtaForCompareByPk } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/compareUtils';
import { setBtnShow } from './pageInfoClick';
let formId = TARGETADJ_CARD.formId; //'head';
let tableId = TARGETADJ_CARD.tableId;
export default function clickBtn(props, assign) {
	// 获取选中行

	let _this = this;
	this.props.cardTable.selectAllRows(tableId, false);
	let pk = this.props.form.getFormItemsValue(formId, ATTRCODE.pk_targetadj).value;
	let ts = this.props.form.getFormItemsValue(formId, ATTRCODE.ts).value;
	let channelType = _this.props.getUrlParam(TARGETADJ_CARD.channelType);
	let transfer = this.props.getUrlParam(TARGETADJ_CARD.type);
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
		pageid: TARGETADJ_CARD.cardpageid,
		iscard: 'card'
	};
	if (assign) {
		data['assign'] = JSON.stringify(assign);
	}
	// 发送请求
	ajax({
		url: TARGETADJ_CARD.commitURL,
		data: data,
		success: (res) => {
			if (
				res.data &&
				res.data.workflow &&
				(res.data.workflow == 'approveflow' || res.data.workflow == 'workflow')
			) {
				_this.setState({
					compositedata: res.data,
					compositedisplay: true
				});
				return;
			}
			if (res.success) {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(res.formulamsg);
				}
				if (data === undefined) {
					//订单编号
					this.setState({
						vbillcode: '',
						billId: ''
					});
					return;
				}
				//渲染数据前先清空值，
				let pkid;
				if (res.data.data.head && res.data.data.body) {
					updateDtaForCompareByPk(this.props, res.data.data, TARGETADJ_CARD.config);
					pkid = res.data.data.head[formId].rows[0].values.pk_targetadj.value;
					//this.props.form.setAllFormValue({ [formId]: res.data.data.head[formId] });
					this.setState({
						lineShowType: [],
						vbillcode: res.data.data.head[formId].rows[0].values.vbillcode.value,
						billId: pkid
					});
					let fstatusflag = res.data.data.head[formId].rows[0].values.fstatusflag.value;
					//设置按钮显示
					setBtnShow(_this, fstatusflag);
				}
				updateCacheData(
					this.props,
					ATTRCODE.pk_targetadj,
					pkid,
					res.data.data,
					formId,
					TARGETADJ_LIST.dataSource
				);
				if (transfer || channelType) {
					//转单
					_this.props.transferTable.setTransformFormStatus(TARGETADJ_CARD.leftarea, {
						status: true,
						onChange: (current, next, currentIndex) => {
							this.indexstatus[currentIndex] = TARGETADJ_CARD.browse;
						}
					});
				}

				//更新缓存
				showSuccessInfo(getLangByResId(this, '4001TARGETADJ-000029')); /* 国际化处理： 提交成功！*/
			}
		}
	});
}
