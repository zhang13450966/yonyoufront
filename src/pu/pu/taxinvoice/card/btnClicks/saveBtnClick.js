/*
 * @Author: chaiwx 
 * @PageInfo: 保存  
 * @Date: 2018-04-11 17:50:22 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-07-23 10:04:15
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, PAGECODE, REQUESTURL, OPTIONS, CACHDATASOURCE, FIELDS, BILLSTATUS } from '../../constance';
import { showSuccessInfo, showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { addCacheData, updateCacheData } from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonControl } from '../viewControl/buttonControl';

export default function saveBtnClick(props, callback) {
	let _this = this;

	// 表头必输项校验

	//过滤表中空行
	props.cardTable.filterEmptyRows(AREA.cardTableId, [ 'ntaxrate' ], 'include');

	// 表体必输项校验
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

	let numberOfRows = props.cardTable.getNumberOfRows(AREA.cardTableId);
	if (numberOfRows < 1) {
		showErrorInfo('', getLangByResId(this, '4004Taxinvoice-000013')); /* 国际化处理： 表体数据为空，不允许保存。*/
		return;
	}

	let option = props.getUrlParam('option');

	let data = props.createMasterChildDataSimple(PAGECODE.cardPagecode, AREA.cardFormId, AREA.cardTableId);

	if (option == OPTIONS.copy && !data.head.head.rows[0].values.pk_taxinvoice.value) {
		// 复制时，设置表头为新增状态
		data.head.head.rows[0].status = '2';
	}

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
	// rows.forEach((row, index) => {
	// 	// 设置pseudocolumn字段值，用于前后台合并
	// 	row.values.pseudocolumn.value = index + '';
	// });

	let save = () => {
		ajax({
			url: REQUESTURL.save,
			data: data,
			success: (res) => {
				let pk_taxinvoice = null;
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(res.formulamsg);
				}
				if (res.success && res.data) {
					// 效率优化开启
					props.beforeUpdatePage();

					props.cardTable.selectAllRows(AREA.cardTableId, false);

					// 更新页面数据
					if (res.data.head && res.data.head.head) {
						pk_taxinvoice = res.data.head.head.rows[0].values.pk_taxinvoice.value;
						props.form.setAllFormValue({ [AREA.cardFormId]: res.data.head.head });
					}
					if (res.data.body && res.data.body.body) {
						let fullTableData = props.cardTable.updateDataByRowId(
							AREA.cardTableId,
							res.data.body.body,
							true
						);
						res.data.body.body = fullTableData;
					}

					// 提示
					showSuccessInfo(getLangByResId(this, '4004Taxinvoice-000014')); /* 国际化处理： 保存成功*/

					// 缓存操作
					if (props.getUrlParam('status') == 'add' || option == OPTIONS.copy) {
						addCacheData(
							props,
							FIELDS.pk_taxinvoice,
							pk_taxinvoice,
							res.data,
							AREA.cardFormId,
							CACHDATASOURCE.dataSourceList
						);
					} else {
						updateCacheData(
							props,
							FIELDS.pk_taxinvoice,
							pk_taxinvoice,
							res.data,
							AREA.cardFormId,
							CACHDATASOURCE.dataSourceList
						);
					}

					props.setUrlParam({ status: 'browse', id: pk_taxinvoice });

					// 更新翻页组件当前pk值
					props.cardPagination.setCardPaginationId({ id: pk_taxinvoice, status: 1 });

					buttonControl.call(_this, props, BILLSTATUS.free);

					//处理保存及提交场景
					if (callback) {
						callback.call(this, props);
					}

					// 效率优化开关关闭
					props.updatePage(AREA.cardFormId, AREA.cardTableId);
				}
			}
		});
	};

	props.validateToSave(data, save);
}
