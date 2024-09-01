import { saveBtnClick } from '../btnClicks';
import { showSuccessInfo, showRefreshInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { URL, PAGECODE } from '../../constance';
export default function buttonClick(props, id, skipCodes) {
	switch (id) {
		case 'Save':
			saveBtnClick.call(props, id, skipCodes);
			break;

		case 'QuickReceive':
			{
				this.setState({ vordercode: null });
				this.open();
			}
			break;
		case 'Cancel':
			// props.modal.show('MessageDlg', {
			// 	title: '确认取消', // 弹框表头信息
			// 	content: '是否确认要取消？', //弹框内容，可以是字符串或dom
			// 	leftBtnName: '是',
			// 	rightBtnName: '否',
			// 	beSureBtnClick: cancel.bind(this, props) //点击确定按钮事件
			// });
			let _this = this;
			showWarningDialog(
				getLangByResId(_this, '4004ARRIVAL-000036'),
				getLangByResId(_this, '4004ARRIVAL-000001'),
				{
					/* 国际化处理： 确认要取消吗？*/
					beSureBtnClick: () => {
						if (props.getPageStatus() != 'add') {
							if (props.getUrlParam('status') == 'return23') {
								props.pushTo(URL.list, { pagecode: PAGECODE.head });
								return;
							} else if (props.getUrlParam('status') == 'returnArrival') {
								let id = props.getUrlParam('id');
								props.setUrlParam({ status: 'browse' });
								// initTemplate.call(this);
								let data = {
									id: this.props.getUrlParam('id'),
									pageid: PAGECODE.card,
									templateid: this.templateid
								};
								let url = URL.queryCard;
								ajax({
									url: url,
									data: data,
									success: (res) => {
										if (res && res.data && res.data.head) {
											let vbillcode = res.data.head[this.formId].rows[0].values.vbillcode.value;
											this.props.form.setAllFormValue({
												[this.formId]: res.data.head[this.formId]
											});
											let billstatus = this.props.form.getFormItemsValue(AREA.head, 'fbillstatus')
												.value;
											this.setState({ billstatus: billstatus });
											this.toggleShow(billstatus);
											this.setState({ vbillcode: vbillcode });
										}
										if (res && res.data && res.data.body) {
											this.props.cardTable.setTableData(
												this.tableId,
												res.data.body[this.tableId]
											);
											let billstatus = this.props.form.getFormItemsValue(AREA.head, 'fbillstatus')
												.value;
											this.toggleShow(billstatus);
											setTimeout(() => {
												RownoUtils.resetRowNo(this.props, this.tableId, 'crowno');
											}, 0);
										}
									}
								});
							}
							props.cardTable.resetTableData(AREA.body);
							//表单返回上一次的值
							props.form.cancel(AREA.head);
							//编辑返回上一次的值
							// props.pushTo(URL.card, {  });

							props.button.setButtonVisible(ALLBUTTONS, false);
							props.button.setButtonVisible(FREEBUTTONS, true);
							props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
							this.setState({ isShowBack: true, status: 'browse', id: props.getUrlParam('id') });
						}
					}
				}
			);

			break;
		case 'Edit':
			let pk = props.getUrlParam('id');
			let data = { pk: pk };
			ajax({
				method: 'post',
				data: data,
				url: '/nccloud/pu/arrival/edit.do',
				success: (res) => {
					props.pushTo(URL.card, { status: 'edit', id: props.getUrlParam('id'), pagecode: PAGECODE.card });
					//props.setPageStatus('edit', props.getUrlParam('id'));
					let status = props.getUrlParam('status');
					let flag = status === 'browse' ? false : true;
					props.button.setButtonVisible(ALLBUTTONS, false);
					props.button.setButtonVisible(EDITBUTTONS, true);
					props.button.setButtonVisible([ 'PastToThis', 'PastToLast', 'CancelPast' ], false);
					props.button.setButtonDisabled([ 'CopyLines', 'DeleteLines' ], true);
					if (this.props.getUrlParam('scene')) {
						this.props.button.setButtonVisible([ 'Edit' ], false);
					}
					this.setState({ isShowBack: false });
					this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
					props.form.setFormStatus(AREA.head, status);
					props.cardTable.setStatus(AREA.body, status);
					props.cardTable.closeExpandedRow(AREA.body);
					props.cardTable.selectAllRows(AREA.body, false);
					// this.select();
				}
			});

			break;
		case 'Delete':
			let __this = this;
			showWarningDialog(
				getLangByResId(__this, '4004ARRIVAL-000002'),
				getLangByResId(__this, '4004ARRIVAL-000003'),
				{
					/* 国际化处理： 删除,确定要删除所选数据吗?*/
					beSureBtnClick: () => {
						ajax({
							method: 'post',
							url: URL.delete,
							data: [
								{
									id: props.getUrlParam('id'),
									ts: props.form.getFormItemsValue(AREA.head, 'ts').value
								}
							],
							success: function(res) {
								showSuccessInfo(getLangByResId(__this, '4004ARRIVAL-000004')); /* 国际化处理： 删除成功*/
								//history.go(-1);
								let nextId = getNextId(props, props.getUrlParam('id'), COMMON.arrivalCacheKey);
								deleteCacheData(
									props,
									'pk_arriveorder',
									props.getUrlParam('id'),
									COMMON.arrivalCacheKey
								);
								changeUrlParam(props, {
									status: 'browse',
									id: nextId
								});
								let data = { id: nextId, pageid: PAGECODE.card, templateid: this.templateid };
								ajax({
									url: URL.queryCard,
									data: data,
									success: (res) => {
										if (res && res.data && res.data.head) {
											let vbillcode = res.data.head[AREA.head].rows[0].values.vbillcode.value;
											props.form.setAllFormValue({ [AREA.head]: res.data.head[AREA.head] });
											let billstatus = props.form.getFormItemsValue(AREA.head, 'fbillstatus')
												.value;
											__this.setState({ billstatus: billstatus });
											__this.toggleShow(billstatus);
											__this.setState({ vbillcode: vbillcode });
										} else {
											props.form.EmptyAllFormValue(AREA.form);
											props.button.setButtonVisible(ALLBUTTONS, false);
											__this.setState({ vbillcode: '' });
											props.button.setButtonVisible(
												[
													'Receive',
													'RefOrder',
													'RefSubcont',
													'Return',
													'ReturnOrder',
													'ReturnSubcont',
													'AulixiaryFunction', //辅助功能
													'QuickReceive' //快速收货
												],
												true
											);
										}
										if (res && res.data && res.data.body) {
											__this.props.cardTable.setTableData(AREA.body, res.data.body[AREA.body]);
											// RownoUtils.resetRowNo(__this.props, AREA.body, 'crowno');
										} else {
											setTimeout(() => {
												__this.props.cardTable.setTableData(AREA.body, { rows: [] });
											}, 0);
										}
									}
								});
							}
						});
					},
					cancelBtnClick: () => {}
				}
			);
			break;
		case 'Back':
			window.location.hash = URL.list;
			break;
		case 'SaveSend':
			{
				let _this = this;
				let formIds = [ AREA.head ];
				let flag = props.form.checkRequired(formIds);
				if (flag) {
					let data = props.createMasterChildData(PAGECODE.card, AREA.form, AREA.body);
					let rows = data.body.body.rows;
					rows.forEach((row, index) => {
						row.values.pseudocolumn.value = index + '';
					});
					ajax({
						method: 'post',
						url: URL.saveSend,
						data: data,
						success: function(res) {
							if (
								res.data &&
								res.data.workflow &&
								(res.data.workflow == 'approveflow' || res.data.workflow == 'workflow')
							) {
								// _this.commitInfo = {
								// 	// index: index,
								// 	record: record
								// };
								_this.props.form.setFormItemsValue(AREA.form, { ts: { value: res.data.ts } });
								_this.setState({
									compositedata: res.data,
									compositedisplay: true
								});
								return;
							}
							props.beforeUpdatePage();
							if (res && res.data && res.data.body) {
								let fullTableData = props.cardTable.updateDataByRowId(
									AREA.body,
									res.data.body[AREA.body],
									true
								);
								res.data.body.body = fullTableData;
							}
							if (res && res.data && res.data.head) {
								props.form.setAllFormValue({ [AREA.head]: res.data.head[AREA.head] });
							}
							let arriveid = res.data.card.head[AREA.head].rows[0].values.pk_arriveorder.value;
							changeUrlParam(props, { id: arriveid, status: 'browse' });
							updateCacheData(
								props,
								'pk_arriveorder',
								arriveid,
								res.data,
								AREA.head,
								COMMON.arrivalCacheKey
							);
							props.form.setFormStatus(AREA.head, 'browse');

							props.cardTable.setStatus(AREA.body, 'browse');
							props.cardTable.selectAllRows(AREA.body, false);
							props.button.setButtonVisible(ALLBUTTONS, false);
							props.button.setButtonVisible(COMMITBUTTONS, true);
							props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
							_this.setState({ isShowBack: true });
							showSuccessInfo(getLangByResId(_this, '4004ARRIVAL-000000')); /* 国际化处理： 保存成功*/
							showSuccessInfo(getLangByResId(_this, '4004ARRIVAL-000017')); /* 国际化处理： 提交成功*/
							props.updatePage(AREA.form, AREA.body);
						}
					});
				}
			}
			break;
		case 'UnApprove':
			{
			}
			break;
		case 'Approve':
			{
			}
			break;
		case 'DirPrintBarcode':
			{
				let id = this.props.getUrlParam('id');
				print(
					'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
					'/nccloud/pu/arrival/dirprintbarcode.do', //后台服务url
					{
						billtype: '23', //单据类型
						funcode: '400401200', //功能节点编码，即模板编码
						nodekey: null, //模板节点标识
						oids: [ id ] // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
						// 打印按钮不用传该参数,输出按钮(文件下载)需加参数outputType,值为output。
					}
				);
			}
			break;
		case 'Commit':
			{
				commit.bind(this)();
			}
			break;
		case 'UnCommit':
			{
				// let data = props.createMasterChildData(PAGECODE.card, AREA.form, AREA.body);
				let _this = this;
				ajax({
					method: 'post',
					url: URL.uncommit,
					data: {
						pageid: PAGECODE.card,
						pkTsParams: [
							{
								pk: props.getUrlParam('id'),
								ts: props.form.getFormItemsValue(AREA.head, 'ts').value
							}
						]
					},
					success: function(res) {
						if (res && res.data && res.data.head && res.data.body) {
							let config = {
								headAreaId: AREA.head,
								bodyAreaId: AREA.body,
								bodyPKfield: 'pk_arriveorder_b'
							};
							updateDtaForCompareByPk(props, res.data, config);
						}

						// props.setPageStatus('browse', props.location.search.id);
						updateCacheData(
							props,
							'pk_arriveorder',
							props.form.getFormItemsValue(AREA.head, 'pk_arriveorder').value,
							res.data,
							AREA.head,
							COMMON.arrivalCacheKey
						);
						props.button.setButtonVisible(ALLBUTTONS, false);
						props.button.setButtonVisible(FREEBUTTONS, true);
						props.cardTable.setStatus(AREA.body, 'browse');
						showSuccessInfo(getLangByResId(_this, '4004ARRIVAL-000006')); /* 国际化处理： 收回成功*/
					}
				});
			}
			break;
		case 'CopyLines':
			{
				let _this = this;
				let selectedRow = props.cardTable.getCheckedRows(AREA.body);
				if (selectedRow == null || selectedRow.length == 0) {
					toast({
						color: 'warning',
						content: getLangByResId(_this, '4004ARRIVAL-000007') /* 国际化处理： 请选择数据！*/
					});
					return;
				}
				// props.button.setButtonVisible([ 'CopyLines', 'DeleteLines', 'ResetRowno' ], false);
				// props.button.setButtonVisible([ 'PastToThis', 'PastToLast', 'CancelPast' ], true);
				rowCopyPasteUtils.copyRows.call(
					this,
					props,
					AREA.body,
					[ 'CopyLines', 'DeleteLines', 'ResetRowno' ],
					[ 'PastToThis', 'PastToLast', 'CancelPast' ]
				);
				this.setState({ isCopyLine: true });
				props.button.setButtonDisabled([ 'PastToThis', 'PastToLast', 'CancelPast' ], false);
			}
			break;
		case 'PastToLast': // 物料 粘贴至末行
			{
				rowCopyPasteUtils.pasteRowsToTail.call(
					this,
					props,
					AREA.body,
					[ 'CopyLines', 'DeleteLines', 'ResetRowno' ],
					[ 'PastToThis', 'PastToLast', 'CancelPast' ],
					[ 'crowno', 'pk_arriveorder_b' ]
				);
				RownoUtils.setRowNo(props, AREA.body, 'crowno');
				// props.button.setButtonVisible([ 'CopyLines', 'DeleteLines', 'ResetRowno' ], true);
				// props.button.setButtonVisible([ 'PastToThis', 'PastToLast', 'CancelPast' ], false);
				this.setState({ isCopyLine: false });
				let selectedRow = props.cardTable.getCheckedRows(AREA.body);
				if (selectedRow == null || selectedRow.length == 0) {
					props.button.setButtonVisible([ 'PastToThis', 'PastToLast', 'CancelPast' ], false);
				}
			}
			break;
		case 'CancelPast': // 物料 复制取消
			{
				// props.button.setButtonVisible([ 'CopyLines', 'DeleteLines', 'ResetRowno' ], true);
				// props.button.setButtonVisible([ 'PastToThis', 'PastToLast', 'CancelPast' ], false);
				rowCopyPasteUtils.cancel.call(
					this,
					props,
					AREA.body,
					[ 'CopyLines', 'DeleteLines', 'ResetRowno' ],
					[ 'PastToThis', 'PastToLast', 'CancelPast' ]
				);
				this.setState({ isCopyLine: false });
				let checks = props.cardTable.getCheckedRows(AREA.body);
				if (checks == null || checks.length == 0) {
					props.button.setButtonVisible([ 'PastToThis', 'PastToLast', 'CancelPast' ], false);
				}
			}
			break;
		case 'DeleteLines':
			{
				let _this = this;
				let selectedRow = props.cardTable.getCheckedRows(AREA.body);
				if (selectedRow == null || selectedRow.length == 0) {
					toast({
						color: 'warning',
						content: getLangByResId(_this, '4004ARRIVAL-000007') /* 国际化处理： 请选择数据！*/
					});
					return;
				}
				let rowparam = [];
				selectedRow.map((item) => {
					rowparam.push(item.index);
				});
				props.cardTable.delRowsByIndex(AREA.body, rowparam);
				let checks = props.cardTable.getCheckedRows(AREA.body);
				if (!checks || checks == null || checks.length == 0) {
					props.button.setButtonDisabled([ 'CopyLines', 'DeleteLines' ], true);
				}
			}
			break;
		case 'ResetRowno':
			{
				RownoUtils.resetRowNo(props, AREA.body, 'crowno');
			}
			break;
		case 'GenAssertCard':
			{
				let _this = this;
				let rows = props.cardTable.getCheckedRows(AREA.table);
				if (rows.length < 1) {
					toast({
						content: getLangByResId(_this, '4004ARRIVAL-000008'),
						color: 'warning'
					}); /* 国际化处理： 请选择数据*/
					break;
				}
				let pkTsParams = rows.map((row) => {
					return {
						pk: row.data.values.pk_arriveorder_b.value,
						ts: row.data.values.ts.value
					};
				});
				ajax({
					method: 'post',
					url: URL.genAssertCard,
					data: {
						pageid: PAGECODE.card,
						pkTsParams: pkTsParams
					},
					success: function(res) {
						if (res && res.data && res.data.head && res.data.body) {
							let config = {
								headAreaId: AREA.head,
								bodyAreaId: AREA.body,
								bodyPKfield: 'pk_arriveorder_b'
							};
							updateDtaForCompareByPk(props, res.data, config);
						}

						showSuccessInfo(getLangByResId(_this, '4004ARRIVAL-000009')); /* 国际化处理： 生成设备卡片成功*/
					}
				});
			}
			break;
		case 'DelAssertCard':
			{
				let _this = this;
				let rows = props.cardTable.getCheckedRows(AREA.table);
				if (rows.length < 1) {
					toast({
						content: getLangByResId(_this, '4004ARRIVAL-000008'),
						color: 'warning'
					}); /* 国际化处理： 请选择数据*/
					break;
				}
				let pkTsParams = rows.map((row) => {
					return {
						pk: row.data.values.pk_arriveorder_b.value,
						ts: row.data.values.ts.value
					};
				});
				ajax({
					method: 'post',
					url: URL.delAssertCard,
					data: {
						pageid: PAGECODE.card,
						pkTsParams: pkTsParams
					},
					success: function(res) {
						if (res && res.data && res.data.head && res.data.body) {
							let config = {
								headAreaId: AREA.head,
								bodyAreaId: AREA.body,
								bodyPKfield: 'pk_arriveorder_b'
							};
							updateDtaForCompareByPk(props, res.data, config);
						}

						showSuccessInfo(getLangByResId(_this, '4004ARRIVAL-000010')); /* 国际化处理： 删除设备卡片成功*/
					}
				});
			}
			break;
		case 'GenTransAssert':
			{
				let _this = this;
				let rows = props.cardTable.getCheckedRows(AREA.table);
				if (rows.length < 1) {
					toast({
						content: getLangByResId(_this, '4004ARRIVAL-000008'),
						color: 'warning'
					}); /* 国际化处理： 请选择数据*/
					break;
				}
				let pkTsParams = rows.map((row) => {
					return {
						pk: row.data.values.pk_arriveorder_b.value,
						ts: row.data.values.ts.value
					};
				});
				ajax({
					method: 'post',
					url: URL.genHJCard,
					data: {
						pageid: PAGECODE.card,
						pkTsParams: pkTsParams
					},
					success: function(res) {
						if (res && res.data && res.data.head && res.data.body) {
							let config = {
								headAreaId: AREA.head,
								bodyAreaId: AREA.body,
								bodyPKfield: 'pk_arriveorder_b'
							};
							updateDtaForCompareByPk(props, res.data, config);
						}

						showSuccessInfo(getLangByResId(_this, '4004ARRIVAL-000011')); /* 国际化处理： 生成转固单成功*/
					}
				});
			}
			break;
		case 'DelTransAssert':
			{
				let _this = this;
				let rows = props.cardTable.getCheckedRows(AREA.table);
				if (rows.length < 1) {
					toast({
						content: getLangByResId(_this, '4004ARRIVAL-000008'),
						color: 'warning'
					}); /* 国际化处理： 请选择数据*/
					break;
				}
				let pkTsParams = rows.map((row) => {
					return {
						pk: row.data.values.pk_arriveorder_b.value,
						ts: row.data.values.ts.value
					};
				});
				ajax({
					method: 'post',
					url: URL.delHJCard,
					data: {
						pageid: PAGECODE.card,
						pkTsParams: pkTsParams
					},
					success: function(res) {
						if (res && res.data && res.data.head && res.data.body) {
							let config = {
								headAreaId: AREA.head,
								bodyAreaId: AREA.body,
								bodyPKfield: 'pk_arriveorder_b'
							};
							updateDtaForCompareByPk(props, res.data, config);
						}

						showSuccessInfo(getLangByResId(_this, '4004ARRIVAL-000012')); /* 国际化处理： 删除转固单片成功*/
					}
				});
			}
			break;
		case 'Check':
			{
				let _this = this;
				let rows = props.cardTable.getCheckedRows(AREA.table);
				if (rows.length < 1) {
					toast({
						content: getLangByResId(_this, '4004ARRIVAL-000008'),
						color: 'warning'
					}); /* 国际化处理： 请选择数据*/
					break;
				}
				let pkTsParams = rows.map((row) => {
					return {
						pk: row.data.values.pk_arriveorder_b.value,
						ts: row.data.values.ts.value
					};
				});
				ajax({
					method: 'post',
					url: URL.verify,
					data: {
						pageid: PAGECODE.card,
						pkTsParams: pkTsParams
					},
					success: function(res) {
						if (res && res.data && res.data.body) {
							props.cardTable.setTableData(AREA.body, res.data.body[AREA.body]);
						}
						if (res && res.data && res.data.head) {
							props.form.setAllFormValue({ [AREA.head]: res.data.head[AREA.head] });
						}
						showSuccessInfo(getLangByResId(_this, '4004ARRIVAL-000013')); /* 国际化处理： 报检成功*/
					}
				});
			}
			break;
		case 'RefOrder':
			{
				clearTransferCache(props, COMMON.arrivalRef21CacheKey);
				props.pushTo(URL.transfer21, { type: 'transfer21', pagecode: PAGECODE.transferOrder });
			}
			break;
		case 'RefSubcont':
			{
				let _this = this;
				ajax({
					url: '/nccloud/scmpub/pub/sysinitgroup.do',
					data: [ '4012' ],

					success: (res) => {
						if (res.success) {
							if (res.data['4012']) {
								clearTransferCache(props, COMMON.arrivalRef61CacheKey);
								props.pushTo(URL.transfer61, { type: 'ref61', pagecode: PAGECODE.transferSubcont });
							} else {
								showErrorDialog(null, getLangByResId(_this, '4004ARRIVAL-000014')); /* 国际化处理： 请启用委外模块！*/
							}
						}
					}
				});
			}
			break;
		case 'ReturnOrder':
			{
				clearTransferCache(props, COMMON.arrivalReturn21CacheKey);
				props.pushTo(URL.return21, { type: 'return21', pagecode: PAGECODE.returnOrder });
			}
			break;
		case 'ReturnSubcont':
			{
				let _this = this;
				ajax({
					url: '/nccloud/scmpub/pub/sysinitgroup.do',
					data: [ '4012' ],

					success: (res) => {
						if (res.success) {
							if (res.data['4012']) {
								clearTransferCache(props, COMMON.arrivalReturn61CacheKey);
								props.pushTo(URL.return61, { type: 'return61', pagecode: PAGECODE.returnSubcont });
							} else {
								showErrorDialog(null, getLangByResId(_this, '4004ARRIVAL-000014')); /* 国际化处理： 请启用委外模块！*/
							}
						}
					}
				});
			}
			break;
		case 'ReturnArrival':
			{
				let _this = this;
				let id = props.getUrlParam('id');
				props.setUrlParam({ status: 'returnArrival' });
				let data = { id: props.getUrlParam('id'), pageid: PAGECODE.card };
				let url = URL.return23;
				ajax({
					url: url,
					data: data,
					success: (res) => {
						if (res && res.data && res.data.head) {
							let vbillcode = res.data.head[_this.formId].rows[0].values.vbillcode.value;
							_this.props.form.setAllFormValue({ [_this.formId]: res.data.head[_this.formId] });
							let billstatus = _this.props.form.getFormItemsValue(AREA.head, 'fbillstatus').value;
							_this.setState({ billstatus: billstatus });
							_this.toggleShow(billstatus);
							_this.setState({ vbillcode: vbillcode });
						}
						if (res && res.data && res.data.body) {
							_this.props.cardTable.setTableData(_this.tableId, res.data.body[_this.tableId]);
							let billstatus = _this.props.form.getFormItemsValue(AREA.head, 'fbillstatus').value;
							_this.toggleShow(billstatus);
							setTimeout(() => {
								RownoUtils.resetRowNo(_this.props, _this.tableId, 'crowno');
							}, 0);
						}
						if (
							_this.props.getUrlParam('status') == 'return23' ||
							_this.props.getUrlParam('status') == 'returnArrival'
						) {
							_this.props.form.setFormStatus(AREA.head, 'edit');
							_this.props.cardTable.setStatus(AREA.body, 'edit');
							// setTimeout(() => {
							// 	RownoUtils.resetRowNo(this.props, this.tableId, 'crowno');
							// }, 10);
							_this.props.button.setButtonVisible(ALLBUTTONS, false);
							_this.props.button.setButtonVisible(EDITBUTTONS, true);
							_this.props.button.setButtonVisible(EDITBUTTONS, true);
							_this.props.button.setButtonVisible(
								[
									'PaseToThis', //粘贴至此
									'PastToLast', //粘贴至末行
									'CancelPast' //取消(复制)
								],
								false
							);
							_this.props.button.setButtonDisabled([ 'ResetRowno' ], false);
							_this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
							_this.props.button.setButtonVisible('Return', false);
							_this.setState({ isShowBack: false });

							// this.props.form.setFormItemsDisabled(AREA.form,{''})
						}
					}
				});
			}
			break;
		case 'QueryAboutBusiness':
			{
				let pk = this.props.getUrlParam('id');
				this.setState({
					pk: pk,
					showTrack: true
				});
			}
			break;
		case 'Print':
			{
				let id = this.props.getUrlParam('id');
				ajax({
					url: URL.printPermiss,
					data: [ id ],
					success: (res) => {
						if (res.success) {
							print(
								'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
								URL.print, //后台服务url
								{
									billtype: '23', //单据类型
									funcode: '400401200', //功能节点编码，即模板编码
									nodekey: null, //模板节点标识
									oids: [ id ] // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
									// 打印按钮不用传该参数,输出按钮(文件下载)需加参数outputType,值为output。
								}
							);
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
							print(
								'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
								URL.print, //后台服务url
								{
									billtype: '23', //单据类型
									funcode: '400401200', //功能节点编码，即模板编码
									nodekey: 'listing_print', //模板节点标识
									oids: ids // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
									// 打印按钮不用传该参数,输出按钮(文件下载)需加参数outputType,值为output。
								}
							);
						}
					}
				});
			}
			break;
		case 'OutPrint':
			{
				let id = this.props.getUrlParam('id');
				output({
					url: URL.print,
					data: {
						oids: [ id ],
						outputType: 'output',
						billtype: '23', //单据类型
						funcode: '400401200', //功能节点编码，即模板编码
						nodekey: null
					} //模板节点标识
				});
			}
			break;
		case 'AccessoryManage':
			{
				let pk = this.props.getUrlParam('id');
				this.setState({
					pk: pk,
					target: event.target,
					showUploader: !this.state.showUploader
				});
			}
			break;
		case 'ApproveInfo':
			{
				let pk = this.props.getUrlParam('id');
				let vtrantypecode = this.props.form.getFormItemsValue(AREA.form, 'vtrantypecode').value;
				this.setState({
					pk: pk,
					billtype: vtrantypecode,
					showApproveInfo: !this.state.showApproveInfo
				});
			}
			break;
		case 'SplitPrint':
			{
				splitPrintClick.call(this, this.props);
			}
			break;
		case 'CombinPrint':
			{
				combinPrintClick.call(this, this.props);
			}
			break;
		case 'Refresh':
			{
				let data = { id: this.props.getUrlParam('id'), pageid: PAGECODE.card, templateid: this.templateid };
				let url = URL.queryCard;
				ajax({
					url: url,
					data: data,
					success: (res) => {
						if (res && res.data && res.data.head) {
							this.props.form.setAllFormValue({ [AREA.head]: res.data.head.head });
							let billstatus = this.props.form.getFormItemsValue(AREA.head, 'fbillstatus').value;
							this.setState({ billstatus: billstatus, status: 'browse' });
							changeUrlParam(this.props, { status: 'browse', id: this.props.getUrlParam('id') });
							this.toggleShow(billstatus);
						}
						if (res && res.data && res.data.body) {
							this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
							RownoUtils.resetRowNo(this.props, this.tableId, 'crowno');
						}
						if (this.props.getUrlParam('status') == 'return23') {
							this.props.form.setFormStatus(AREA.head, 'edit');
							this.props.cardTable.setStatus(AREA.body, 'edit');
							setTimeout(() => {
								RownoUtils.resetRowNo(this.props, this.tableId, 'crowno');
							}, 0);
							this.props.button.setButtonVisible(ALLBUTTONS, false);
							this.props.button.setButtonVisible(EDITBUTTONS, true);
							//设置退货理由的编辑性
							// this.props.form.setFormItemsDisabled(AREA.form,{''})
						}
						// showSuccessInfo(getLangByResId(this, '4004ARRIVAL-000059'));
						showRefreshInfo();
					}
				});
			}
			break;
		default:
			break;
	}
}
