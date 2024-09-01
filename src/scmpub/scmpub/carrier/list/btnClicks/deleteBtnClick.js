/*
 * @Author: zhaochyu
 * @PageInfo: 司机定义删除
 * @Date: 2020-02-10 12:39:35
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-12-30 16:33:41
 */
import { ajax, toast } from 'nc-lightapp-front';
import { AREA, URL } from '../../constance';
import { deleteCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache';
import { showWarningDialog, showBatchOprMessage, showErrorInfo } from '../../../pub/tool/messageUtil';
import rowDeleteBtnClick from './rowDeleteBtnClick';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export function deleteBtnClick(props, record, index) {
	//1.行内删除
	if (record) {
		rowDeleteBtnClick.call(this, props, record, index);
		return;
	}
	//获取选中的行
	let rows = this.props.table.getCheckedRows(AREA.listTable);
	//如果没有选中行，则提示并返回，不进行任何操作
	if (rows.length <= 0) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4004INITIALEST-000023') /* 国际化处理： 请选择需要删除的行！*/
		});
		return;
	}
	// 执行删除操作提示
	showWarningDialog(getLangByResId(this, '4001CARRIER-000003'), getLangByResId(this, '4001CARRIER-000004'), {
		/* 国际化处理： 删除,确定要删除吗？*/
		beSureBtnClick: deleteFunction.bind(this, {
			props: this.props,
			rows: rows
		})
	});
}
// 删除 操作
function deleteFunction(param) {
	let isTrue = true;
	param.rows.forEach((item) => {
		let pk_org = item.data.values.pk_org.value;
		let pk_group = item.data.values.pk_group.value;
		if (pk_org == pk_group) {
			showErrorInfo(getLangByResId(this, '4001CARRIER-000005')); /* 国际化处理： 组织节点不能删除集团数据！*/
			isTrue = false;
		}
	});
	if (!isTrue) {
		return;
	}

	let { props, rows } = param;
	// 获取待删除表格行的行号
	let indexs = rows.map((item) => {
		return item.index;
	});
	// 执行删除操作
	let delRows = [];
	//缓冲需要的主键
	let pks = [];
	rows.map((item) => {
		let id = item.data.values.ccarrierid.value;
		let data = {
			pk: item.data.values.ccarrierid.value,
			ts: item.data.values.ts.value
		};
		delRows.push(data);
		pks.push(id);
	});
	// 拼装json
	let data = {
		delRows: delRows
	};
	// 发送请求
	ajax({
		url: URL.delete,
		data: data,
		success: (res) => {
			if (res.success) {
				let failnums = res.data.failedNum;
				for (let b = 0; b < failnums; b++) {
					let aa = res.data.errorMessages[b].match(/\d+/)[0] - 1;
					indexs[aa] = null;
					pks[aa] = null;
				}
				indexs = indexs.filter((item) => item != null);
				pks = pks.filter((item) => item != null);
				showBatchOprMessage(getLangByResId(this, '4001CARRIER-000023'), res.data); /* 国际化处理： 删除成功！*/
				//调用缓冲方法
				deleteCacheDataForList(props, AREA.listTable, pks);
				//删除之后，刷新数据
				props.table.deleteTableRowsByIndex(AREA.listTable, indexs);
			} else {
				toast({
					color: 'warning',
					content: getLangByResId(this, '4001CARRIER-000024') /* 国际化处理： 删除失败*/
				});
			}
		}
	});
}
