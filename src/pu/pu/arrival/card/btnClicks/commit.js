import { URL, FIELD, PAGECODE, AREA, ALLBUTTONS, COMMON } from '../../constance';
import { initLang, getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo, showWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { updateDtaForCompareByPk } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/compareUtils';
import { ajax, toast } from 'nc-lightapp-front';
import {
	updateCacheData,
	changeUrlParam,
	rewriteTransferSrcBids,
	addCacheData
} from '../../../../../scmpub/scmpub/pub/cache';
import buttonController from '../viewControl/buttonController';

export default function commit(props, record, index, assign) {
	// 获取选中行
	// 执行提交操作
	let _this = this;
	let rows = this.props.cardTable.getAllRows(AREA.body);
	let bodys = [];
	rows.forEach((row) => {
		bodys.push({
			pk: row.values['pk_arriveorder_b'].value,
			ts: row.values['ts'].value
		});
	});
	// 拼装json
	let data = {
		pageid: PAGECODE.card,
		pkTsParams: [
			{
				pk: _this.props.form.getFormItemsValue(AREA.head, 'pk_arriveorder').value,
				ts: _this.props.form.getFormItemsValue(AREA.head, 'ts').value,
				bodys: bodys
			}
		]
	};
	//指派
	if (assign) {
		data['assign'] = JSON.stringify(assign);
	}
	// 发送请求
	ajax({
		url: URL.commit,
		data: data,
		success: (res) => {
			if (
				res.data &&
				res.data.workflow &&
				(res.data.workflow == 'approveflow' || res.data.workflow == 'workflow')
			) {
				_this.commitInfo = {
					index: index,
					record: record
				};
				_this.setState({
					compositedata: res.data,
					compositedisplay: true
				});
				return;
			}
			let config = {
				headAreaId: AREA.head,
				bodyAreaId: AREA.body,
				bodyPKfield: 'pk_arriveorder_b'
			};
			updateDtaForCompareByPk(this.props, res.data, config);
			let type = this.props.getUrlParam('type');
			if (type) {
				let bill = res.data;
				rewriteTransferSrcBids(_this.props, 'csourcebid', bill.body[AREA.body].rows);

				// 转单编辑界面保存
				updateCacheData(
					_this.props,
					'pk_arriveorder',
					_this.props.form.getFormItemsValue(AREA.head, 'pk_arriveorder').value,
					res.data,
					AREA.head,
					COMMON.arrivalCacheKey
				);
				_this.props.transferTable.setTransformFormStatus(AREA.leftarea, {
					status: true,
					onChange: (current, next, currentIndex) => {
						_this.props.transferTable.setTransferListValueByIndex(AREA.leftarea, res.data, currentIndex);
						// showSuccessInfo(getLangByResId(_this, '4004ARRIVAL-000000')); /* 国际化处理： 保存成功*/
						showSuccessInfo(getLangByResId(_this, '4004ARRIVAL-000017')); /* 国际化处理： 提交成功*/
						_this.indexstatus[currentIndex] = 'browse';
					}
				});

				if (_this.props.transferTable.getTransformFormAmount(AREA.leftarea) == 1) {
					let vbillcode = bill.head[AREA.form].rows[0].values.vbillcode.value;
					_this.setState({ vbillcode: vbillcode });
					this.props.BillHeadInfo.setBillHeadInfoVisible({
						billCode: vbillcode
					});
				}
				buttonController.call(this);
			} else {
				changeUrlParam(_this.props, { status: 'browse' });
				updateCacheData(
					_this.props,
					'pk_arriveorder',
					_this.props.form.getFormItemsValue(AREA.head, 'pk_arriveorder').value,
					res.data,
					AREA.head,
					COMMON.arrivalCacheKey
				);
				// _this.toggleShow(fbillstatus);
				buttonController.call(this);
				showSuccessInfo(getLangByResId(this, '4004ARRIVAL-000017')); /* 国际化处理： 提交成功*/
			}
		}
	});
}
