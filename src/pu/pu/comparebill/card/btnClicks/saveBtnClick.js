import { ajax } from 'nc-lightapp-front';
import { AREA, PAGECODE, REQUESTURL, CACHDATASOURCE, FIELDS, BILLSTATUS } from '../../constance';
import { showSuccessInfo, showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import {
	addCacheData,
	updateCacheData,
	changeUrlParam,
	rewriteTransferSrcBids
} from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonControl } from '../viewControl/buttonControl';

/*
 * @Author: qishy 
  * @PageInfo: 业务对账单保存
 * @Date: 2019-04-28 13:26:05 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-07-23 10:01:45
 */

export default function saveBtnClick(props, callback) {
	let flag = props.validatePageToToast([
		{
			// creteForm 使用的areaCode
			name: [ AREA.cardFormId ],
			type: 'form'
		},
		{
			// createCardTable的areaCode，多页签区域填主表就行
			name: AREA.cardTableId,
			type: 'cardTable'
		}
	]);
	if (!flag.allPassed) {
		return;
	}
	//表体为空不允许保存
	let numberOfRows = props.cardTable.getNumberOfRows(AREA.cardTableId);
	if (numberOfRows < 1) {
		showErrorInfo('', getLangByResId(this, '4004comarebill-000022')); /* 国际化处理： 表体数据为空，不允许保存。*/
		return;
	}
	let transfer = props.getUrlParam('option');
	let status = props.getUrlParam('status');
	let pk = props.getUrlParam('id');
	//创建主子表
	let data = props.createMasterChildDataSimple(PAGECODE.cardPagecode, AREA.cardFormId, AREA.cardTableId);
	// 新增保存，需要把删除的行剔除掉
	if (data.head.head.rows[0].status == '2') {
		let newRows = [];
		data.body.body.rows.forEach((row) => {
			if (row.status != '3') {
				newRows.push(row);
			}
		});
		data.body.body.rows = newRows;
	}

	let rows = data.body.body.rows;
	rows.forEach((row, index) => {
		// 设置pseudocolumn字段值，用于前后台合并
		row.values.pseudocolumn.value = index + '';
	});

	this.props.validateToSave(data, () => {
		ajax({
			url: REQUESTURL.save,
			data: data,
			success: (res) => {
				{
					let pk_comparebill = res.data.head.head.rows[0].values.pk_comparebill.value;
					if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
						props.dealFormulamsg(res.formulamsg);
					}
					if (res.success && res.data) {
						// 效率优化开启
						props.beforeUpdatePage();
						//取消选中行
						props.cardTable.selectAllRows(AREA.cardTableId, false);
						// 更新页面数据
						if (res.data.head && res.data.head.head) {
							props.form.setAllFormValue({ [AREA.cardFormId]: res.data.head.head });
						}
						//根据rowId更新被修改的数据行
						if (res.data.body && res.data.body.body) {
							let fullTableData = props.cardTable.updateDataByRowId(
								AREA.cardTableId,
								res.data.body.body,
								true
							);
							res.data.body.body = fullTableData;
						}

						showSuccessInfo(getLangByResId(this, '4004comarebill-000023')); /* 国际化处理： 保存成功*/

						// 缓存操作
						if (pk) {
							updateCacheData(
								props,
								FIELDS.pk_comparebill,
								pk_comparebill,
								res.data,
								AREA.cardFormId,
								CACHDATASOURCE.dataSourceList
							);
						} else {
							addCacheData(
								props,
								FIELDS.pk_comparebill,
								pk_comparebill,
								res.data,
								AREA.cardFormId,
								CACHDATASOURCE.dataSourceList
							);
						}
						// 更新翻页组件当前pk值
						props.cardPagination.setCardPaginationId({ id: pk_comparebill, status: 1 });
						//更新url中pk的值
						changeUrlParam(props, { id: pk_comparebill, status: 'browse' });
						//转单
						if (transfer) {
							//通知上游转单界面处理了哪些来源id
							rewriteTransferSrcBids(props, FIELDS.csrcbid, res.data.body.body.rows);

							props.transferTable.setTransformFormStatus(AREA.leftarea, {
								status: true,
								onChange: (current, next, currentIndex) => {}
							});
						} else {
							buttonControl.call(this, props, BILLSTATUS.free);
						}
						// 效率优化开关关闭
						props.updatePage(AREA.cardFormId, AREA.cardTableId);
					}
				}
			}
		});
	});
}
