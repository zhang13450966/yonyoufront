/*
 * @Author: qishy 
  * @PageInfo: 业务对账单初始化模板
 * @Date: 2019-04-28 11:16:43 
 * @Last Modified by: qishy
 * @Last Modified time: 2019-06-04 14:50:14
 */
import { ajax } from 'nc-lightapp-front';
import {
	AREA,
	PAGECODE,
	REQUESTURL,
	CACHDATASOURCE,
	CACHKEY,
	FIELDS,
	BUTTONID,
	BUTTONAREA,
	OPTIONS
} from '../../constance';
import { buttonClick } from '../btnClicks';
import transtypeUtils from '../../../../../scmpub/scmpub/pub/tool/transtypeUtils';
const { init } = transtypeUtils;
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonControl } from '../viewControl/buttonControl';
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { updateCacheData, setDefData, getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { columnSortUtils } from '../../../../../scmpub/scmpub/pub/tool/columnSortUtils';
import headRefFilter from '../events/headRefFilter';

export default function(props) {
	props.createUIDom(
		{
			pagecode: PAGECODE.cardPagecode //页面id
		},
		(data) => {
			if (data) {
				if (data.button) {
					let button = data.button;
					props.button.hideButtonsByAreas([ BUTTONAREA.card_head, BUTTONAREA.card_body ]);
					props.button.setOprationBtnsRenderStatus([ BUTTONAREA.card_body_inner ], false);
					props.button.setButtons(button);
				}
				if (data.template) {
					let meta = data.template;
					modifierMeta.call(this, props, meta);
					props.meta.setMeta(meta, () => {
						// 设置数据
						setData.call(this, props, data);
					});
				}
			}
		}
	);
}

function setData(props, templateData) {
	let status = props.getUrlParam('status');
	let option = props.getUrlParam('option');

	let scene = props.getUrlParam('scene');
	setDefData(CACHDATASOURCE.dataSourceList, CACHKEY.Dlinksce, scene);

	if (option && option == OPTIONS.transfer) {
		let transferIds = props.transferTable.getTransferTableSelectedId(AREA.cardFormId);
		let data = {
			data: transferIds,
			pagecode: PAGECODE.cardPagecode
		};

		let url = REQUESTURL.ref45Transfer;
		if (props.getUrlParam('transferFrom') == OPTIONS.from21) {
			url = REQUESTURL.ref21Transfer;
		}

		ajax({
			url: url,
			data: data,
			success: (res) => {
				if (res && res.data) {
					let queryInfo = getDefData(CACHDATASOURCE.dataSourceTransfer, CACHKEY.transferSearchCach);
					let dstartdate = queryInfo.querycondition.conditions[1].value.firstvalue;
					let denddate = queryInfo.querycondition.conditions[1].value.secondvalue;
					//多条记录的日期赋值
					res.data.forEach((data) => {
						data.head.head.rows[0].values.dstartdate.value = dstartdate;
						data.head.head.rows[0].values.denddate.value = denddate;
					});
					props.transferTable.setTransferListValue(AREA.leftarea, res.data);
				}
			}
		});
	} else if (status == 'add') {
		// 新增
		buttonControl.call(this, props);
	} else {
		// 非新增
		let url = REQUESTURL.queryCard;
		ajax({
			url: url,
			data: { pks: [ props.getUrlParam('id') ], pageid: PAGECODE.cardPagecode },
			success: (res) => {
				if (res.data) {
					// 效率优化开启
					props.beforeUpdatePage();

					if (res.data.head) {
						props.form.EmptyAllFormValue(AREA.cardFormId);
						props.form.setAllFormValue({ [AREA.cardFormId]: res.data.head[AREA.cardFormId] });
					}
					if (res.data.body) {
						props.cardTable.setTableData(AREA.cardTableId, res.data.body[AREA.cardTableId]);
					}
					//缓存数据
					updateCacheData(
						props,
						FIELDS.pk_comparebill,
						res.data.head.head.rows[0].values.pk_comparebill.value,
						res.data,
						AREA.cardFormId,
						CACHDATASOURCE.dataSourceList
					);
					buttonControl.call(
						this,
						props,
						res.data.head[AREA.cardFormId].rows[0].values[FIELDS.forderstatus].value,
						null,
						res.data.head[AREA.cardFormId].rows[0].values[FIELDS.ncollectnum].value
					);
					// 效率优化开关关闭
					props.updatePage(AREA.cardFormId, AREA.cardTableId);
				}
			},
			error: (res) => {
				showErrorInfo(null, res.message);
				props.setUrlParam({ status: 'browse', id: '' });
				buttonControl.call(this, props);
			}
		});
	}
}

function modifierMeta(props, meta) {
	let status = props.getUrlParam('status');
	meta[AREA.cardFormId].status = status;
	meta[AREA.cardTableId].status = status;
	// 操作列
	meta[AREA.cardTableId].items.push({
		label: getLangByResId(this, '4004comarebill-000017') /* 国际化处理： 操作*/,
		itemtype: 'customer',
		attrcode: 'opr',
		width: '160px',
		visible: true,
		fixed: 'right',
		render: (text, record, index) => {
			// 复制按钮点击时，设置操作列按钮可见性
			let buttonAry;
			if (props.getUrlParam('status') === 'browse') {
				let forderstatus = props.form.getFormItemsValue(AREA.cardFormId, FIELDS.forderstatus).value;
				buttonAry = [ BUTTONID.openbrowse ];
			} else {
				buttonAry = [ BUTTONID.openedit, BUTTONID.DeleteLine ];
			}
			return props.button.createOprationButton(buttonAry, {
				area: BUTTONAREA.card_body_inner,
				buttonLimit: 3,
				onButtonClick: (props, key) => buttonClick.call(this, props, key, text, record, index)
			});
		}
	});

	// 添加表头参照过滤
	headRefFilter.call(this, props, meta);

	// 行号排序处理
	columnSortUtils.numberSort(meta, AREA.cardTableId, FIELDS.crowno);

	return meta;
}
