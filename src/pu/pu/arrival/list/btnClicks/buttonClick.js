import { ajax, base, toast, output } from 'nc-lightapp-front';
import { URL, AREA, PAGECODE, COMMON, FIELD, BUTTONAREA } from '../../constance';
import { deleteCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache';
import { updateCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache';
import { showBatchOprMessage } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { showSuccessInfo, showWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { clearTransferCache } from '../../../../../scmpub/scmpub/pub/cache';
import { showErrorDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil.js';
import { initLang, getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import commonSerach from './commonSearch';
import commit from './commit';
import urgentLetGo from './urgentLetGo';
import poc from 'uap/common/components/printOnClient';
const { printPreview } = poc;
import printCountQuery from '../../../../../scmpub/scmpub/pub/tool/printCountQuery';

export default function(props, id, text, record, index) {
	switch (id) {
		case 'RefOrder': // 批量保存
			clearTransferCache(props, COMMON.arrivalRef21CacheKey);
			props.pushTo(URL.transfer21, { type: 'transfer21', app: this.appcode, pagecode: PAGECODE.transferOrder });
			break;
		case 'RefSubcont':
			{
				ajax({
					url: '/nccloud/scmpub/pub/sysinitgroup.do',
					data: [ '4012' ],

					success: (res) => {
						if (res.success) {
							if (res.data['4012']) {
								clearTransferCache(props, COMMON.arrivalRef61CacheKey);
								props.pushTo(URL.transfer61, {
									type: 'ref61',
									app: this.appcode,
									pagecode: PAGECODE.transferSubcont
								});
							} else {
								showErrorDialog(null, getLangByResId(this, '4004ARRIVAL-000014')); /* 国际化处理： 请启用委外模块！*/
							}
						}
					}
				});
			}
			break;
		case 'Edit':
			{
				ajax({
					method: 'post',
					data: { pk: record.pk_arriveorder.value },
					url: '/nccloud/pu/arrival/edit.do',
					success: (res) => {
						props.pushTo(URL.card, {
							status: 'edit',
							id: record.pk_arriveorder.value,
							pagecode: PAGECODE.card
						});
					}
				});
			}
			break;
		case 'ApproveInfo':
			{
				let id = record.pk_arriveorder.value;
				let billtype = record.vtrantypecode.value;
				this.setState({
					pk: id,
					billtype: billtype,
					showApproveInfo: !this.state.showApproveInfo
				});
			}
			break;
		case 'ReturnOrder':
			{
				clearTransferCache(props, COMMON.arrivalReturn21CacheKey);
				props.pushTo(URL.return21, { type: 'return21', app: this.appcode, pagecode: PAGECODE.returnOrder });
			}
			break;
		case 'ReturnSubcont':
			{
				ajax({
					url: '/nccloud/scmpub/pub/sysinitgroup.do',
					data: [ '4012' ],

					success: (res) => {
						if (res.success) {
							if (res.data['4012']) {
								clearTransferCache(props, COMMON.arrivalReturn61CacheKey);
								props.pushTo(URL.return61, {
									type: 'return61',
									app: this.appcode,
									pagecode: PAGECODE.returnSubcont
								});
							} else {
								showErrorDialog(null, getLangByResId(this, '4004ARRIVAL-000014')); /* 国际化处理： 请启用委外模块！*/
							}
						}
					}
				});
			}
			break;
		case 'ReturnArrival':
			{
				let rows = props.table.getCheckedRows(AREA.head);
				let id = rows[0].data.values.pk_arriveorder.value;
				props.pushTo(URL.card, { status: 'return23', id: id, pagecode: PAGECODE.card });
			}
			break;
		case 'Delete':
			{
				if (record && record.pk_arriveorder) {
					ajax({
						method: 'post',
						url: URL.delete,
						data: [ { id: record.pk_arriveorder.value, ts: record.ts.value } ],
						success: (res) => {
							props.table.deleteTableRowsByIndex(AREA.head, index);
							showSuccessInfo(getLangByResId(this, '4004ARRIVAL-000004')); /* 国际化处理： 删除成功*/
							// buttonController.setListButtonVisiable(props, true);
							this.onSelect();
						}
					});
				} else {
					let rows = props.table.getCheckedRows(AREA.head);
					if (rows.length == 0) {
						toast({
							content: getLangByResId(this, '4004ARRIVAL-000041'),
							color: 'warning'
						}); /* 国际化处理： 请先选择数据*/
						break;
					}
					let indexs = rows.map((row) => {
						return row.data.index;
					});
					let data = rows.map((row) => {
						return { id: row.data.values.pk_arriveorder.value, ts: row.data.values.ts.value };
					});
					showWarningDialog(
						getLangByResId(this, '4004ARRIVAL-000002'),
						getLangByResId(this, '4004ARRIVAL-000042'),
						{
							/* 国际化处理： 删除,确认要删除所选数据吗?*/
							beSureBtnClick: () => {
								ajax({
									method: 'post',
									url: URL.delete,
									data: data,
									success: (res) => {
										if (JSON.stringify(res.data.errorMessageMap || {}) != '{}') {
											// 成功的index
											let sucIndex = [];
											rows.forEach((element, index) => {
												if (!res.data.errorMessageMap[index]) {
													sucIndex.push(element.index);
												}
												deleteCacheDataForList(
													props,
													AREA.head,
													element.data.values.pk_arriveorder.value
												);
											});
											props.table.deleteTableRowsByIndex(AREA.head, sucIndex);
										} else {
											//
											let succIndex = [];
											rows.forEach((element, index) => {
												deleteCacheDataForList(
													props,
													AREA.head,
													element.data.values.pk_arriveorder.value
												);
												succIndex.push(element.index);
											});
											props.table.deleteTableRowsByIndex(AREA.head, succIndex);
										}
										showBatchOprMessage(null, res.data, getLangByResId(this, '4004ARRIVAL-000061'));
										this.onSelect();
									}
								});
							}
						}
					);
				}
			}
			break;
		case 'Edit':
			{
				let rows = props.table.getCheckedRows(AREA.head);
				if (rows.length == 0) {
					toast({
						content: getLangByResId(this, '4004ARRIVAL-000041'),
						color: 'warning'
					}); /* 国际化处理： 请先选择数据*/
					break;
				}
				let id = rows[0].data.values.pk_arriveorder.value;
				ajax({
					method: 'post',
					data: { pk: id },
					url: '/nccloud/pu/arrival/edit.do',
					success: (res) => {
						props.linkTo(URL.card, { status: 'edit', id: id });
					}
				});
			}
			break;
		case 'Commit':
			{
				if (record && record.pk_arriveorder) {
					let _this = this;
					ajax({
						method: 'post',
						url: URL.commit,
						data: {
							pageid: PAGECODE.head,
							pkTsParams: [ { pk: record.pk_arriveorder.value, ts: record.ts.value } ]
						},
						success: (res) => {
							if (
								res.data &&
								res.data.workflow &&
								(res.data.workflow == 'approveflow' || res.data.workflow == 'workflow')
							) {
								this.commitInfo = {
									index: index,
									record: record
								};
								this.setState({
									compositedata: res.data,
									compositedisplay: true
								});
								return;
							}
							showSuccessInfo(getLangByResId(this, '4004ARRIVAL-000017')); /* 国际化处理： 提交成功*/
							// showBatchOprMessage(null, res.data);
							updateCacheDataForList(props, AREA.head, 'pk_arriveorder', res.data, index);
							_this.onSelect();
						}
					});
				} else {
					commit.bind(this)();
				}
			}
			break;
		case 'UnCommit':
			{
				if (record && record.pk_arriveorder) {
					ajax({
						method: 'post',
						url: URL.uncommit,
						data: {
							pageid: PAGECODE.head,
							pkTsParams: [ { pk: record.pk_arriveorder.value, ts: record.ts.value } ]
						},
						success: (res) => {
							showSuccessInfo(getLangByResId(this, '4004ARRIVAL-000006')); /* 国际化处理： 收回成功*/
							// showBatchOprMessage(null, res.data);
							updateCacheDataForList(props, AREA.head, 'pk_arriveorder', res.data, index);
							this.onSelect();
						}
					});
				} else {
					let rows = props.table.getCheckedRows(AREA.head);
					if (rows.length == 0) {
						toast({
							content: getLangByResId(this, '4004ARRIVAL-000041'),
							color: 'warning'
						}); /* 国际化处理： 请先选择数据*/
						break;
					}
					let indexs = rows.map((row) => {
						return row.index;
					});
					let data = {};
					data.pageid = PAGECODE.head;
					data.pkTsParams = rows.map((row) => {
						return { pk: row.data.values.pk_arriveorder.value, ts: row.data.values.ts.value };
					});

					ajax({
						method: 'post',
						url: URL.uncommit,
						data: data,
						success: (res) => {
							showBatchOprMessage(null, res.data, getLangByResId(this, '4004ARRIVAL-000062'));
							updateCacheDataForList(props, AREA.head, 'pk_arriveorder', res.data);
							this.onSelect();
						}
					});
				}
			}
			break;
		case 'Print':
			{
				let rows = props.table.getCheckedRows(AREA.head);
				if (rows.length == 0) {
					toast({
						content: getLangByResId(this, '4004ARRIVAL-000041'),
						color: 'warning'
					}); /* 国际化处理： 请先选择数据*/
					break;
				}
				let ids = rows.map((row) => {
					return row.data.values.pk_arriveorder.value;
				});

				ajax({
					url: URL.printPermiss,
					data: ids,
					success: (res) => {
						if (res.success) {
							/**
							 * appcode 单据的应用编码（一般不用传，方法内部自己抓取，如果需要打印的模板和当前appcode不同，需要业务组自己传一下）
							 * nodekey 模板节点标识
							 * oids 单据主键
							 * printType 传true表示根据打印次数设置走插件打印，传false直接走pdf打印
							 * realData 传true表示打印真数据，传false表示打印假数据
							 * controlPrintNum 加了这个参数前端才会走打印次数查询，默认不走次数查询
							 */
							printPreview(props, URL.print, {
								appcode: props.getAppCode(),
								nodekey: null,
								oids: ids,
								printType: true,
								realData: true,
								controlPrintNum: true
							});
						}
					}
				});
			}
			break;
		case 'Print_list':
			{
				let rows = props.table.getCheckedRows(AREA.head);
				if (rows.length == 0) {
					toast({
						content: getLangByResId(this, '4004ARRIVAL-000041'),
						color: 'warning'
					}); /* 国际化处理： 请先选择数据*/
					break;
				}
				let ids = rows.map((row) => {
					return row.data.values.pk_arriveorder.value;
				});

				ajax({
					url: URL.printPermiss,
					data: ids,
					success: (res) => {
						if (res.success) {
							/**
							 * appcode 单据的应用编码（一般不用传，方法内部自己抓取，如果需要打印的模板和当前appcode不同，需要业务组自己传一下）
							 * nodekey 模板节点标识
							 * oids 单据主键
							 * printType 传true表示根据打印次数设置走插件打印，传false直接走pdf打印
							 * realData 传true表示打印真数据，传false表示打印假数据
							 * controlPrintNum 加了这个参数前端才会走打印次数查询，默认不走次数查询
							 */
							printPreview(props, URL.print, {
								appcode: props.getAppCode(),
								nodekey: 'listing_print',
								oids: ids,
								printType: true,
								realData: true,
								controlPrintNum: true
							});
						}
					}
				});
			}
			break;
		case 'OutPrint':
			{
				let rows = props.table.getCheckedRows(AREA.head);
				if (rows.length == 0) {
					toast({
						content: getLangByResId(this, '4004ARRIVAL-000041'),
						color: 'warning'
					}); /* 国际化处理： 请先选择数据*/
					break;
				}
				let ids = rows.map((row) => {
					return row.data.values.pk_arriveorder.value;
				});
				output({
					url: URL.print, //后台服务url
					data: {
						outputType: 'output',
						billtype: '23', //单据类型
						nodekey: null, //模板节点标识
						oids: ids // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
						// 打印按钮不用传该参数,输出按钮(文件下载)需加参数outputType,值为output。
					}
				});
			}
			break;
		case 'QueryAboutBusiness':
			{
				let rows = props.table.getCheckedRows(AREA.head);
				if (rows.length == 0) {
					toast({
						content: getLangByResId(this, '4004ARRIVAL-000041'),
						color: 'warning'
					}); /* 国际化处理： 请先选择数据*/
					break;
				}
				let ids = rows.map((row) => {
					return row.data.values.pk_arriveorder.value;
				});

				this.setState({
					pk: ids[0],
					showTrack: true
				});
			}
			break;
		case 'QuickReceive':
			{
				this.setState({ vordercode: null });
				this.open();
			}
			break;
		case 'AccessoryManage':
			{
				let rows = props.table.getCheckedRows(AREA.head);
				if (rows.length == 0) {
					toast({
						content: getLangByResId(this, '4004ARRIVAL-000041'),
						color: 'warning'
					}); /* 国际化处理： 请先选择数据*/
					break;
				}
				let ids = rows.map((row) => {
					return row.data.values.pk_arriveorder.value;
				});
				let vbillcode = rows.map((row) => {
					return row.data.values.vbillcode.value;
				});
				this.setState({
					pk: ids[0],
					// target: event.target,
					showUploader: !this.state.showUploader,
					billNo: vbillcode[0]
				});
			}
			break;
		case 'ApproveInfo':
			{
				let rows = props.table.getCheckedRows(AREA.head);
				if (rows.length == 0) {
					toast({
						content: getLangByResId(this, '4004ARRIVAL-000041'),
						color: 'warning'
					}); /* 国际化处理： 请先选择数据*/
					break;
				}
				let ids = rows.map((row) => {
					return row.data.values.pk_arriveorder.value;
				});
				this.setState({
					pk: ids[0],
					showApproveInfo: !this.state.showApproveInfo
				});
			}
			break;
		case 'Refresh':
			{
				let searchVal = this.state.searchVal;
				let tabcode = this.state.currentTab;
				commonSerach.call(this, tabcode, searchVal, true, false);
			}
			break;
		case 'UrgentLetGo':
			urgentLetGo.call(this, props);
			break;
		case 'PrintCountQuery':
			let CONST = { hid: FIELD.pk_arriveorder, area: AREA.form };
			printCountQuery.call(this, props, { type: 1, CONST, modal: 'code-config' });
			break;
		default:
			break;
	}
}
