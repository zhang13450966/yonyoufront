/*
 * @Author: zhangchangqing 
 * @PageInfo: 卡片初始化模板
 * @Date: 2018-04-19 10:34:51 
 * @Last Modified by: qishy
 * @Last Modified time: 2021-02-05 11:25:54
 */
import { getParentURlParme, pageInfoClick } from '../btnClicks';
import { TARGETADJ_CARD, ATTRCODE, ATTRCODES, TARGETADJ_CARD_BUTTON, TARGETADJ_LIST } from '../../siconst';
import { getUrlParam } from '../../../../../scmpub/scmpub/pub/tool/getParentURlParme';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { setDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { transtypeUtils, deepClone } from '../../../../../scmpub/scmpub/pub/tool';
import { buttonController, btnClickController } from '../viewControl';
import { afterEvent } from '../afterEvents';
import { columnSortUtils } from '../../../../../scmpub/scmpub/pub/tool/columnSortUtils';
export default function(props) {
	//通过获取url参数来判断是否走审批
	let param = getUrlParam(TARGETADJ_CARD.pageMsgType);
	if (param) {
		this.props.createUIDom(
			{
				pagecode: TARGETADJ_CARD.cardpageid //卡片页面编码
			},
			(templedata) => {
				transtypeUtils.init.call(this, templedata.context);
				if (templedata.template) {
					let meta = templedata.template;
					this.setState({
						templetid: templedata.template.pageid
					});
					meta = modifierMeta.call(this, this.props, meta);
					this.meta = deepClone(meta);
					let status = this.props.getUrlParam(TARGETADJ_CARD.status);
					if (status == TARGETADJ_CARD.add) {
						this.props.meta.setMeta(meta, () => {});
						this.props.initMetaByPkorg(ATTRCODE.pk_org);
					} else {
						this.props.meta.setMeta(meta, () => {});
					}
				}
				if (templedata.button) {
					let button = templedata.button;
					this.props.button.hideButtonsByAreas([ TARGETADJ_CARD.formId ]);
					this.props.button.setButtons(button);
					pageInfoClick.bind(this, this.props)();
				}
			}
		);
	} else {
		this.props.createUIDom(
			{
				pagecode: TARGETADJ_CARD.cardpageid //卡片页面编码
			},
			(templedata) => {
				if (templedata.template) {
					let meta = templedata.template;
					this.setState({
						templetid: templedata.template.pageid
					});
					meta = modifierMeta.call(this, this.props, meta);
					this.meta = deepClone(meta);
					let status = this.props.getUrlParam(TARGETADJ_CARD.status);
					if (status == TARGETADJ_CARD.add) {
						this.props.meta.setMeta(meta, toggleShow.bind(this, templedata));
						this.props.initMetaByPkorg(ATTRCODE.pk_org);
					} else {
						this.props.meta.setMeta(meta, addDataSource.bind(this, templedata));
					}
				}
				if (templedata.button) {
					let button = templedata.button;
					this.props.button.hideButtonsByAreas([ TARGETADJ_CARD.formId ]);
					this.props.button.setButtons(button);
					pageInfoClick.bind(this, this.props)();
				}
			}
		);
	}
}

function addDataSource(data) {
	// 缓存为了处理卡片的自制
	setDefData(TARGETADJ_LIST.dataSource, ATTRCODE.pk_org, data.context.pk_org);
	setDefData(TARGETADJ_LIST.dataSource, 'pk_org_name', data.context.org_Name);
}
function toggleShow(data) {
	let status = this.props.getUrlParam(TARGETADJ_CARD.status);
	let copy = this.props.getUrlParam(TARGETADJ_CARD.copy);
	let type = this.props.getUrlParam(TARGETADJ_CARD.type);
	let channelType = this.props.getUrlParam(TARGETADJ_CARD.channelType);
	if (status == TARGETADJ_CARD.add && !copy && !type && !channelType) {
		// 新增
		let pk_org = data.context.pk_org;
		let org_Name = data.context.org_Name;
		// 缓存为了处理卡片的自制
		addDataSource(data);
		if (pk_org && org_Name) {
			afterEvent.call(
				this,
				this.props,
				TARGETADJ_CARD.formId,
				ATTRCODE.pk_org,
				{ value: pk_org, display: org_Name },
				null,
				{
					refpk: pk_org,
					refname: org_Name
				}
			);
			this.props.form.setFormItemsDisabled(TARGETADJ_CARD.headf, { pk_org: false });
		} else {
			this.props.form.setFormItemsValue(TARGETADJ_CARD.formId, {
				[ATTRCODE.pk_org]: { value: null, display: null }
			});
		}
	}
}
function modifierMeta(props, meta) {
	let status = props.getUrlParam(TARGETADJ_CARD.status);
	meta[TARGETADJ_CARD.formId].status = status;
	meta[TARGETADJ_CARD.tableId].status = status;

	meta[TARGETADJ_CARD.headf].items.map((item) => {
		//主组织过滤
		if (item.attrcode == ATTRCODE.pk_org) {
			item.queryCondition = () => {
				return { TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		} else if (item.attrcode == ATTRCODE.ctargetid) {
			//销售指标表
			item.queryCondition = () => {
				let data = props.form.getFormItemsValue(TARGETADJ_CARD.headf, TARGETADJ_CARD.pk_org).value;
				return { pk_org: data, fmaintainflag: '1' };
			};
		} else {
			// 根据pk_org过滤其他字段
			item.queryCondition = () => {
				let data = props.form.getFormItemsValue(TARGETADJ_CARD.headf, TARGETADJ_CARD.pk_org).value; // 调用相应组件的取值API
				return { pk_org: data }; // 根据pk_org过滤
			};
		}
	});
	meta[TARGETADJ_CARD.formId].items.map((item) => {
		//主组织过滤
		if (item.attrcode == ATTRCODE.pk_org) {
			item.queryCondition = () => {
				return { TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		} else {
			// 根据pk_org过滤其他字段
			item.queryCondition = () => {
				let data = props.form.getFormItemsValue(TARGETADJ_CARD.formId, TARGETADJ_CARD.pk_org).value; // 调用相应组件的取值API
				return { pk_org: data }; // 根据pk_org过滤
			};
		}
	});
	meta[TARGETADJ_CARD.tableId].items.find(
		(item) => item.attrcode == ATTRCODES.ccustomerid
	).isMultiSelectedEnabled = true;

	let porCol = {
		label: getLangByResId(this, '4001TARGETADJ-000028') /* 国际化处理： 操作*/,
		attrcode: 'opr',
		itemtype: 'customer', //默认必输
		fixed: 'right', //锁定操作列
		visible: true,
		width: '200px',
		render: (text, record, index) => {
			let param = getParentURlParme(TARGETADJ_CARD.pageMsgType);
			let buttonAry = buttonController.setRowButtons.call(this, props, record, param, index);
			return props.button.createOprationButton(buttonAry, {
				area: TARGETADJ_CARD_BUTTON.card_body_inner,
				buttonLimit: 3,
				onButtonClick: (props, key) => btnClickController.call(this, props, key, text, record, index)
			});
		}
	};
	meta[TARGETADJ_CARD.tableId].items.push(porCol);
	// 行号排序处理
	columnSortUtils.numberSort(meta, TARGETADJ_CARD.tableId, ATTRCODES.crowno);
	return meta;
}
