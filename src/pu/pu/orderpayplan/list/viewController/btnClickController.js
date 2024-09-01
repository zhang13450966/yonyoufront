/*
 * @Author: CongKe 
 * @PageInfo: 付款计划按钮功能
 * @Date: 2018-05-09 11:29:02 
 * @Last Modified by: guoylei
 * @Last Modified time: 2022-05-18 15:34:25
 */
import { toast } from 'nc-lightapp-front';
import { BUTTON, PAGECODE, FIELD, URL, STATUS, PAYPLANDATASOURCE } from '../../constance';
import {
	searchBtnClick,
	cancelButton,
	saveButton,
	print_BtnClick,
	remoteRequestCheck,
	unionQueryClick
} from '../btnClicks/index';
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/editTableTools';
import { showWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonController } from '../viewController/index';
import { deepClone } from '../../../../../scmpub/scmpub/pub/tool';

export default function(props, key, text, record, index) {
	let pk;
	let _url = '';
	let pks = new Array();
	let rowindex = new Array();
	let rowsdata = new Array();
	let checkdata = {};
	let rows = props.editTable.getCheckedRows(PAGECODE.tableId);
	if (rows.length > 0) {
		rows.map((item) => {
			let data = {
				[FIELD.pks]: item.data.values.pk_order_payplan.value,
				[FIELD.ts]: item.data.values.ts.value
			};
			pks.push(data.pks);
			rowsdata.push(data);
			rowindex.push(item.index);
		});
	}
	// pk = rows && rows[0] && rows[0].rows && rows[0].rows.values.pk_order.value;
	//modify by zhaoypm@2018-09-18 for jira NCCLOUD-58688 该问题中的现象无法重现，不过依然报错抛异常，经查后台action获取bill_PK为null
	pk = rows && rows[0] && rows[0].data && rows[0].data.values.pk_order.value;
	switch (key) {
		case BUTTON.Edit: // 修改
			//当点击修改按钮后，把查询区隐藏
			this.setState({ status: STATUS.edit });
			// 卡片界面，在浏览态时勾选行，点修改后去掉勾选
			this.props.editTable.selectAllRows(PAGECODE.tableId, false);
			buttonController.togglePageShow.call(this, this.props, STATUS.edit);
			break;
		case BUTTON.GeneratePaymentApplication: // 生成付款申请
			checkdata = {
				closedto: rowsdata,
				[FIELD.pagecode]: PAGECODE.listcode
			};
			remoteRequestCheck.call(this, this.props, URL.payreqcheck, checkdata, PAYPLANDATASOURCE.payreqkey, pks);
			break;
		case BUTTON.Payment: // 付款
			if (rows && rows.length <= 0) {
				toast({
					color: 'warning',
					content: getLangByResId(this, '4004OPAYPLAN-000007') /* 国际化处理： 请选择行*/
				});
			} else {
				checkdata = {
					closedto: rowsdata,
					[FIELD.pagecode]: PAGECODE.listcode
				};
				remoteRequestCheck.call(this, this.props, URL.paycheck, checkdata, PAYPLANDATASOURCE.paykey, pks);
			}
			break;
		case BUTTON.QueryAboutBusiness: // 单据追溯
			if (rows && rows.length <= 0) {
				toast({
					color: 'warning',
					content: getLangByResId(this, '4004OPAYPLAN-000007') /* 国际化处理： 请选择行*/
				});
			} else {
				this.setState({ pk_order: pk, showTrack: true });
			}
			break;
		case BUTTON.UnionQueryDetailed: // 联查明细
			if (rows && rows.length <= 0) {
				toast({
					color: 'warning',
					content: getLangByResId(this, '4004OPAYPLAN-000007') /* 国际化处理： 请选择行*/
				});
			} else {
				unionQueryClick.call(this, pk);
			}
			break;
		case BUTTON.Print: // 打印
			print_BtnClick.call(this, this.props);
			break;
		case BUTTON.Refresh: //刷新
			searchBtnClick.call(this, this.props, true);
			break;
		case BUTTON.Add: //新增
			insertRowAtIndex.call(this, this.props);
			break;
		case BUTTON.Delete: //删除
			if (rows && rows.length <= 0) {
				toast({
					color: 'warning',
					content: getLangByResId(this, '4004OPAYPLAN-000007') /* 国际化处理： 请选择行*/
				});
			} else {
				if (rowindex && rowindex.length > 0) {
					this.props.button.setDisabled([ BUTTON.Delete ], true);
					props.editTable.deleteTableRowsByIndex(PAGECODE.tableId, rowindex);
				}
			}
			break;
		case BUTTON.Save: //保存
			saveButton.call(this, props);
			break;
		case BUTTON.Cancel: //取消
			showWarningDialog(
				getLangByResId(this, '4004OPAYPLAN-000019'),
				getLangByResId(this, '4004OPAYPLAN-000008'),
				{
					/* 国际化处理： 确定要取消吗？*/
					beSureBtnClick: () => {
						this.setState({ status: STATUS.browse });
						cancelButton.call(this);
					}
				}
			);
			break;
		case BUTTON.List_Inner_Insert: //插行
			index = index == 0 ? 0 : index;
			// modify by zhaoypm @2018-09-19 for jira NCCLOUD-60529 原逻辑用pasterow，部分字段的复制可能存在问题，所以按照nc逻辑重写一下
			insertRowAtIndex.call(this, props, index, index);
			break;
		case BUTTON.List_Inner_Delete: //删行
			// modify by zhaoypm @2018-09-17 for jira NCCLOUD-60526
			let naccumpayapporgmny = props.editTable.getValByKeyAndRowId(
				PAGECODE.tableId,
				record.rowid,
				FIELD.naccumpayapporgmny
			).value;
			let naccumpayorgmny = props.editTable.getValByKeyAndRowId(
				PAGECODE.tableId,
				record.rowid,
				FIELD.naccumpayorgmny
			).value;
			if (naccumpayapporgmny || naccumpayorgmny) {
				toast({
					color: 'warning',
					content: getLangByResId(this, '4004OPAYPLAN-000009') /* 国际化处理： 已经生成后续单据，不能删除*/
				});
			} else {
				props.editTable.deleteTableRowsByRowId(PAGECODE.tableId, record.rowid);
			}
			let flag = true;
			//需要重新取一下勾选数据，避免删除的是勾选的数据
			rows = props.editTable.getCheckedRows(PAGECODE.tableId);
			if (rows && rows.length > 0) {
				flag = false;
			}
			props.button.setDisabled([ BUTTON.Delete ], flag);
			break;
		case BUTTON.List_Inner_Copy: //复制行
			let newrecord = deepClone(record);
			if (newrecord.values.dbegindate) {
				newrecord.values.dbegindate.value = '';
				newrecord.values.dbegindate._display_ = '';
			}
			if (newrecord.values.denddate) {
				newrecord.values.denddate.value = '';
				newrecord.values.denddate._display_ = '';
			}
			props.editTable.pasteRow(PAGECODE.tableId, newrecord, index);
			setPKempty(props, index + 1);
			break;
		default:
			break;
	}
}
//新增和插入行的时候需要复制的数据，从NC复制而来，其中前3个（pk_org_v，nrate，norigmny）是后加的添加，其余全部为NC中原来就存在的 add by zhaoypm@2018-09-19
//采购订单付款计划 中vbillcode，dbilldate，pk_supplier，hts，forderstatus字段都已不存在，替换成新的200220312
const copyItems = [
	'pk_org_v',
	'pk_org',
	'nrate',
	'norigmny',
	'vordercode', //'vbillcode',//
	'vorderbilldate', //'dbilldate', //
	'cvendorid', //'pk_supplier',//
	'cvendorvid',
	'corigcurrencyid',
	'ccurrencyid',
	'nexchangerate',
	'pk_financeorg',
	'pk_order',
	'pk_financeorg_v',
	'ts', //'hts',//
	'forderstatus', //
	'ntotalorigmny',
	'pk_group',
	'cratetype',
	'fratecategory',
	'dratedate',
	'vordertrantype',
	'iaccounttermno'
];
/**
 * 在指定位置插入行数据
 * @param {*} props 
 * @param {*} currentIndex 当前行index
 * @param {*} insertIndex 要插入的行index
 */
function insertRowAtIndex(props, currentIndex, insertIndex) {
	let allRows = props.editTable.getAllRows(PAGECODE.tableId);
	// add by zhaoypm@2018-09-19 for jira NCCLOUD-58207 原方法是pasterow，有问题
	// currentIndex 不存在表示新增行,数据来源行指向最后一行
	if (!currentIndex && currentIndex != 0) {
		currentIndex = allRows.length - 1;
	}
	let rowData = allRows[currentIndex];
	let newRowData = { values: {} };
	//构造新行的数据
	for (let key in rowData.values) {
		if (copyItems.includes(key)) {
			if ('iaccounttermno' == key) {
				newRowData.values[key] = rowData.values[key];
				newRowData.values[key].value =
					rowData.values[key].value == null
						? parseInt(0).toString()
						: (parseInt(rowData.values[key].value) + 1).toString();
				newRowData.values[key].display =
					rowData.values[key].value == null
						? parseInt(0).toString()
						: (parseInt(rowData.values[key].display) + 1).toString();
			} else {
				newRowData.values[key] = rowData.values[key];
			}
		}
	}

	if (allRows.length > 0) {
		const mapVordercode = new Map();
		const setVordercode = new Set();
		let errorMessage = '';
		// 冻结状态校验,如果单据被冻结不能新增行
		for (let key in newRowData.values) {
			if (FIELD.vordercode == key) {
				mapVordercode.set(newRowData.values[key].value, newRowData.values[key].value);
			}
		}

		allRows.forEach((item, index) => {
			if (item.values[FIELD.saga_frozen].value == '1') {
				const vsrccode = mapVordercode.get(item.values[FIELD.vordercode].value);
				if (vsrccode) {
					setVordercode.add(vsrccode);
				}
			}
		});
		if (setVordercode.size > 0) {
			setVordercode.forEach((item, index) => {
				errorMessage =
					errorMessage +
					getLangByResId(this, '4004OPAYPLAN-000022') +
					item +
					getLangByResId(this, '4004OPAYPLAN-000023'); /* 国际化处理： 单据,已被冻结不能新增行\n*/
			});
		}
		if (errorMessage.length > 0) {
			toast({
				color: 'warning',
				content: errorMessage
			});
			return;
		}
	}

	props.editTable.addRow(PAGECODE.tableId, insertIndex, false, newRowData.values);
	RownoUtils.setRowNo(props, PAGECODE.tableId, 'crowno');
}

function setPKempty(props, index) {
	let clearBodyItems = [
		'naccumpayorgmny',
		'naccumpaymny',
		'naccumpayapporgmny',
		'naccumpayappmny',
		'pk_order_payplan'
	];
	let empty = {
		value: null,
		display: null,
		scale: '-1'
	};
	for (let bodyItem of clearBodyItems) {
		props.editTable.setValByKeyAndIndex(PAGECODE.tableId, index, bodyItem, empty);
	}
}
