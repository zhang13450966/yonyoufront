import { ajax, print, output } from 'nc-lightapp-front';
import { URL, AREA, PAGECODE, COMMON } from '../../constance';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import searchBtnClick from '../btnClicks/searchBtnClick';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo, showWarningInfo, showWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import btnController from './btnController';

function check() {
	let selectRows = this.props.editTable.getCheckedRows(AREA.list);
	let selectRowIndexs = getSelectRowIndex(selectRows);
	let idTs = [];
	if (this.isQcEnable) {
		idTs = getIdTs(selectRows);
	}

	ajax({
		url: URL.qualityCheck,
		data: {
			grid: {
				pageid: PAGECODE.list,
				model: {
					areaType: 'table',
					areacode: AREA.list,
					pageInfo: {},
					rows: selectRows.map((row) => {
						return row.data;
					})
				}
			},
			idTs: idTs,
			isQcEnable: this.isQcEnable,
			pk_org: this.pk_org,
			isCheck: this.isCheck
		},
		success: (res) => {
			// if (res && res.data) {
			// 	let successIds = res.data;
			// 	let toDelIndex = [];
			// 	for (let row of selectRows) {
			// 		let pk_arriveorder_b = row.data.values['pk_arriveorder_b'].value;
			// 		if (successIds.includes(pk_arriveorder_b)) {
			// 			toDelIndex.push(row.index);
			// 		}
			// 	}
			// 	this.props.editTable.deleteTableRowsByIndex(AREA.list, toDelIndex, true);
			// 	btnController.call(this, this.props);
			// 	showSuccessInfo(getLangByResId(this, '4004ARRIVALQC-000000' /* 国际化处理：  检验成功*/));
			// }
			if (res) {
				this.props.editTable.deleteTableRowsByIndex(AREA.list, selectRowIndexs, true);
				btnController.call(this, this.props);
				showSuccessInfo(getLangByResId(this, '4004ARRIVALQC-000000' /* 国际化处理：  检验成功*/));
			}
		}
	});
}

function getIdTs(selectRows) {
	let idTs = [];
	for (let row of selectRows) {
		let bill = {
			id: row.data.values['pk_arriveorder_b'].value,
			ts: row.data.values['ts'].value
		};
		idTs.push(bill);
	}
	return idTs;
}

function getSelectRowIndex(selectRows) {
	let selectRowIndexs = [];
	for (let row of selectRows) {
		selectRowIndexs.push(row.index);
	}
	return selectRowIndexs;
}

export default function(props, id) {
	switch (id) {
		case 'QualityCheck':
			{
				if (!this.pk_org) {
					showWarningInfo(null, getLangByResId(this, '4004ARRIVALQC-000001') /* 国际化处理： 主组织不能为空！*/);
					return;
				}
				let rows = props.editTable.getCheckedRows(AREA.list);
				if (rows.length < 1) {
					showWarningInfo(null, getLangByResId(this, '4004ARRIVALQC-000002') /* 国际化处理： 请先选择数据！*/);
					break;
				}
				// props.modal.show('confirmCheck');
				let __this = this;
				showWarningDialog(
					getLangByResId(__this, '4004ARRIVALQC-000011'),
					getLangByResId(__this, '4004ARRIVALQC-000012'),
					{
						beSureBtnClick: () => {
							check.call(__this);
						},
						cancelBtnClick: () => {}
					}
				);
			}
			break;
		case 'AntiQC':
			{
				let rows = props.editTable.getCheckedRows(AREA.list);
				if (rows.length == 0) {
					showWarningInfo(null, getLangByResId(this, '4004ARRIVALQC-000002') /* 国际化处理： 请先选择数据！*/);
					break;
				}
				let selectRowIndexs = getSelectRowIndex(rows);
				ajax({
					url: URL.antiQualityCheck,
					data: {
						idTs: getIdTs(rows)
					},
					success: (res) => {
						// if (res && res.data) {
						// 	let successIds = res.data;
						// 	let toDelIndex = [];
						// 	for (let row of rows) {
						// 		let pk_arriveorder_b = row.data.values['pk_arriveorder_b'].value;
						// 		if (successIds.includes(pk_arriveorder_b)) {
						// 			toDelIndex.push(row.index);
						// 		}
						// 	}
						// 	this.props.editTable.deleteTableRowsByIndex(AREA.list, toDelIndex, true);
						// 	btnController.call(this, this.props);
						// 	showSuccessInfo(getLangByResId(this, '4004ARRIVALQC-000003' /* 国际化处理：  反检成功！*/));
						// }
						if (res) {
							this.props.editTable.deleteTableRowsByIndex(AREA.list, selectRowIndexs, true);
							btnController.call(this, this.props);
							showSuccessInfo(getLangByResId(this, '4004ARRIVALQC-000003' /* 国际化处理：  反检成功！*/));
						}
					}
				});
			}
			break;
		case 'Print':
			{
				let rows = this.props.editTable.getCheckedRows(AREA.list);
				if (rows.length == 0) {
					showWarningInfo(null, getLangByResId(this, '4004ARRIVALQC-000002') /* 国际化处理： 请先选择数据！*/);
					break;
				}
				let ids = rows.map((row) => {
					return row.data.values.pk_arriveorder_b.value;
				});
				print(
					'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
					URL.print, //后台服务url
					{
						// billtype:'23',  //单据类型
						funcode: COMMON.appcode, //功能节点编码，即模板编码
						// nodekey: null, //模板节点标识
						oids: ids // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
						// 打印按钮不用传该参数,输出按钮(文件下载)需加参数outputType,值为output。
					}
				);
			}
			break;
		case 'OutPrint':
			{
				let rows = this.props.editTable.getCheckedRows(AREA.list);
				if (rows.length == 0) {
					showWarningInfo(null, getLangByResId(this, '4004ARRIVALQC-000002') /* 国际化处理： 请先选择数据！*/);
					break;
				}
				let ids = rows.map((row) => {
					return row.data.values.pk_arriveorder_b.value;
				});
				output({
					// 'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
					url: URL.print, //后台服务url
					data: {
						funcode: COMMON.appcode, //功能节点编码，即模板编码
						oids: ids, // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印
						outputType: 'output'
					}
				});
			}
			break;
		case 'Refresh':
			searchBtnClick.call(this, getDefData(COMMON.ArrivalqcCacheKey, AREA.searchArea), true); // 调用查询方法
			btnController.call(this, this.props);
			break;
		case 'QueryAboutBusiness':
			let rows = this.props.editTable.getCheckedRows(AREA.list);
			if (rows && rows.length > 0) {
				let pk = rows[0].data.values.pk_arriveorder.value;
				this.setState({
					pk: pk,
					showTrack: true
				});
			}
			break;
		default:
			break;
	}
}
export { check };
