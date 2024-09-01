/*
 * @Author: CongKe
 * @PageInfo: 冻结/解冻
 * @Date: 2018-05-22 16:54:44
 * @Last Modified by: CongKe
 * @Last Modified time: 2020-03-24 09:27:00
 */
import { ajax, toast, base } from 'nc-lightapp-front';
import { URL, PAGECODE, FIELD, LIST_BUTTON } from '../../constance';
import { updateCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache';
import { showBatchOprMessage } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { FreezeReason } from '../../freezeReason/index';
import { buttonController } from '../viewController/index';
const { NCInput, NCTextArea } = base;
let reason = '';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import ScriptActionDlg from '../../../pub/ScriptActionDlg';

export default function freezeBtn(props, record, _url, contents) {
	let _this = this;
	let rows = props.table.getCheckedRows(PAGECODE.tableId);
	// 如果没有选中行，则提示并返回，不进行任何操作
	if (rows.length <= 0) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4004POORDER-000070') /* 国际化处理： 请至少选择一行数据！*/,
		});
		return;
	}
	// 获取待表格行的行号
	let indexs = rows.map(item => {
		return item.index;
	});
	let delRows = [];
	let rowindex = [];
	rows.map(item => {
		let data = {
			pks: item.data.values.pk_order.value,
			ts: item.data.values.ts.value,
		};
		delRows.push(data);
		rowindex.push(item.index);
	}); // 拼装json
	let data = {
		closedto: delRows,
		pagecode: PAGECODE.listcode,
		extstr: reason,
	};
	if (contents == getLangByResId(this, '4004POORDER-000023')) {
		/* 国际化处理： 冻结*/
		let getFreezeReason = val => {
			reason = val;
		};

		this.props.modal.show('MessageDlg', {
			title: getLangByResId(this, '4004POORDER-000044') /* 国际化处理： 冻结原因*/,
			content: (
				<ScriptActionDlg
					changeData={value => {
						reason = value;
					}}
					title={getLangByResId(this, '4004POORDER-000130')}
				/>
			),
			size: 'sm',
			beSureBtnClick: beSureBtnClick.bind(this, this.props, _url, data, contents, rowindex),
			// beSureBtnClick: beSureBtnClick.bind(this, this.props, _url, data, contents), //点击确定按钮事件
			cancelBtnClick: () => this.props.modal.close('MessageDlg'),
			closeModalEve: () => this.props.modal.close('MessageDlg'),
		});
	} else {
		freezeBills.call(this, this.props, _url, data, contents, rowindex);
	}
}

// 弹出框点击确定事件
function beSureBtnClick(props, _url, data, contents, rowindex) {
	reason = reason == '' ? null : reason;
	data.extstr = reason;
	freezeBills.call(this, props, _url, data, contents);
}

function freezeBills(props, _url, data, contents, rowindex) {
	ajax({
		url: _url,
		data: data,
		method: 'POST',
		success: res => {
			updateCacheDataForList(props, PAGECODE.tableId, FIELD.pk_order, res.data, null);
			buttonController.initButtons.call(this, this.props);
			showBatchOprMessage(contents, res.data, {}, contents);
		},
	});
}
