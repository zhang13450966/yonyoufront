/*
 * @Author: zhangchangqing
 * @PageInfo: 提交按钮事件
 * @Date: 2018-04-19 10:36:58
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-03-04 14:23:40
 */
import { AREA, URL, FIELD, PAGECODE } from '../../constance';
import { ajax, toast } from 'nc-lightapp-front';
import { updateCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo, showBatchOperateInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { buttonController } from '../viewController';

export default function clickDelBtn(props, assign) {
	// 获取选中行
	let formId = AREA.head; //'head';
	let _this = this;
	let rows = props.table.getCheckedRows(formId);
	// 保存页面提交数据的数组，用于提交之后比对（通过主键），然后将对应的单据状态修改为最新的状态，数组中每个对象只存id和index即可
	let map = new Map();
	// 如果没有选中行，则提示并返回，不进行任何操作
	if (rows.length <= 0) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4004planconfirm-000024') /* 国际化处理： 请选择需要提交的数据！*/
		});
		return;
	}

	let indexs = rows.map((item) => {
		return item.index;
	});
	// 执行删除操作
	let delRows = [];
	rows.map((item) => {
		let data = {
			pk: item.data.values.pk_planconfirm.value,
			ts: item.data.values.ts.value
		};
		delRows.push(data);
		map.set(item.data.values.pk_planconfirm.value, item.index);
	});
	// 拼装json
	let data = {
		billInfo: delRows,
		pagecode: PAGECODE.list
	};
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
				//缓存当前数据
				_this.commitInfo = {
					isBatch: true,
					record: null,
					index: null
				};
				_this.setState({
					compositedata: res.data,
					compositedisplay: true
				});
				return;
			}
			if (res.success) {
				if (res.data && res.data.data && res.data.data[AREA.head] && res.data.data[AREA.head].rows) {
					let resultRows = res.data.data[AREA.head].rows;
					// 提交之后比对（通过主键），然后将对应的单据状态修改为最新的状态
					resultRows.map((item, index) => {
						// 获取对应下标
						let changeIndex = map.get(item.values.pk_planconfirm.value);
						// 获取单据状态
						let ts = item.values.ts;
						let billflagData = item.values.fbillstatus;
						// 修改列表态表格的单据状态字段的值
						props.table.setValByKeyAndIndex(AREA.head, changeIndex, FIELD.fbillstatus, billflagData);
						props.table.setValByKeyAndIndex(AREA.head, changeIndex, FIELD.ts, ts);
						props.table.selectTableRows(AREA.head, changeIndex, false);
					});
				}
				let errorArray = [];
				let errorMsg = res.data.errorMessageMap;
				for (let key in errorMsg) {
					errorArray.push(parseInt(key));
				}
				let contentMsg =
					getLangByResId(this, '4004planconfirm-000033') +
					(res.data.sucessNum ? res.data.sucessNum : '0'); /* 国际化处理： */ /* 国际化处理： 成功条数：*/

				if (res.data.errorMessage) {
					// 错误提示
					contentMsg =
						contentMsg +
						getLangByResId(this, '4004planconfirm-000034') /* 国际化处理： </br>失败条数：*/ +
						(data.billInfo.length - (res.data.sucessNum ? res.data.sucessNum : '0'));
					let errorMessages = [];
					for (let k in res.data.errorMessageMap) {
						errorMessages.push(
							getLangByResId(this, '4004planconfirm-000035') +
								(parseInt(k) + 1) +
								getLangByResId(this, '4004planconfirm-000036') +
								res.data.errorMessageMap[k] /* 国际化处理： 第,,条数据操作失败。失败原因：*/
						); /* 国际处理： 第,条数据操作失败。失败原因：*/
					}
					/**
						 * 处理提示信息
						 * sucNum 成功条数
						 * failNum 失败条数
						 * toastMsg 提示信息
						 */
					let sucNum = Number.parseInt(res.data.sucessNum ? res.data.sucessNum : '0');
					let failNum = Number.parseInt(
						data.billInfo.length - (res.data.sucessNum ? res.data.sucessNum : '0')
					);
					let toastMsg = { totalNum: sucNum + failNum };
					let langID = '4004planconfirm-000037';
					if (sucNum && sucNum <= 0) {
						langID = '4004planconfirm-000037';
						toastMsg = { totalNum: sucNum + failNum, failNum };
					} else {
						langID = '4004planconfirm-000038';
						toastMsg = { totalNum: sucNum + failNum, sucNum, failNum };
					}

					showBatchOperateInfo(
						getLangByResId(this, '4004planconfirm-000040') /* 国际化处理： 出错啦*/,
						getLangByResId(this, langID, toastMsg),
						errorMessages
					);
				} else {
					/* 国际化处理： 提交成功！,处理成功,条*/
					showSuccessInfo(
						getLangByResId(this, '4004planconfirm-000006'),
						getLangByResId(this, '4004planconfirm-000039', {
							sucNum: res.data.sucessNum ? res.data.sucessNum : '0'
						})
					); /* 国际化处理： 提交成功！,处理成功,条*/
				}
				//更新列表上的数据
				updateCacheDataForList(props, AREA.head, FIELD.hid, res.data);
				buttonController.call(this, this.props);
			} else {
			}
		}
	});
}
