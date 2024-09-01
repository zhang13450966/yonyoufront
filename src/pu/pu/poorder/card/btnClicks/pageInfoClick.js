/*
 * @Author: CongKe
 * @PageInfo: 采购订单卡片通用查询信息
 * @Date: 2018-04-19 10:09:24
 * @Last Modified by: guoylei
 * @Last Modified time: 2022-06-29 12:11:36
 */
import { ajax, promptBox } from 'nc-lightapp-front';
import {
	URL,
	PAGECODE,
	FIELD,
	STATUS,
	BUTTON,
	TRANSFER20,
	TRANSFERZ2,
	TRANSFER30TO21,
	TRANSFER30TO21COOP,
	TRANSFERMULTI,
	TRANSFER,
	OrderCache,
	TRANSFER49,
	PUSHCONST
} from '../../constance';
import { PK } from '../../transfer23_45/const';
import { copyAddBtn, backButton } from './index';
import { changeUrlParam, getDefData, updateCacheData } from '../../../../../scmpub/scmpub/pub/cache';
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { relationCT } from '../afterEvents';
import { buttonController } from '../viewController/index';
import { createExtBillHeadAfterEventData } from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';
import { showSagaErrorToasts } from '../../../pub/utils/sagaMsgUtils';

export default function(props, pk) {
	let _this = this;
	props = this.props;
	let status = this.props.getUrlParam(STATUS.status);
	let channelType = this.props.getUrlParam(TRANSFER.channelType);
	let srcpk = this.props.getUrlParam(FIELD.pk);
	if (srcpk) {
		let srcStatus = this.props.getUrlParam(STATUS.status);
		pk = srcpk;
		status = srcStatus;
	}
	let transfer = this.props.getUrlParam(TRANSFER.transfer);
	// 需求（刘兰娇）变更为不处理
	this.props.cardTable.toggleCardTable(PAGECODE.head_payment, false);
	if (channelType) {
		// 推单
		arrange(_this, channelType);
	} else if (transfer) {
		// 拉单
		getTransferValue(_this, _this.props, transfer);
	} else if (status == BUTTON.Copy.toLowerCase()) {
		// 复制
		copyAddBtn.call(this);
	} else {
		if (status == 'add') {
			pk = null;
			emptyEditPage.call(this);
		}
		if (pk) {
			//动态修改地址栏中的id的值(路径中一定要是id，否则会导致切换下一条的时候，pk取不到)
			changeUrlParam(_this.props, { id: pk });
		}
		//非新增页面获取对应数据
		pk = this.props.getUrlParam(FIELD.id);
		pk = pk == '' || pk == 'undefined' || pk == 'null' ? null : pk;
		if (pk) {
			let conditionData = {
				pks: [ pk ],
				pageid: PAGECODE.cardcode,
				status: _this.getPageParam(STATUS.status)
			};
			ajax({
				url: URL.getCard,
				data: conditionData,
				method: 'POST',
				success: (res) => {
					if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
						this.props.dealFormulamsg(
							res.formulamsg //参数一：返回的公式对象
						);
					}
					if (res.data) {
						this.props.beforeUpdatePage();
						let data = res.data;
						if (data.head) {
							this.props.form.setAllFormValue({ [PAGECODE.cardhead]: data.head[PAGECODE.cardhead] });
							//订单状态
							let forderstatus = data.head[PAGECODE.cardhead].rows[0].values.forderstatus;
							//冻结原因
							let vfrozenreason = data.head[PAGECODE.cardhead].rows[0].values.vfrozenreason;
							vfrozenreason = vfrozenreason && vfrozenreason.value;
							forderstatus && forderstatus.value
								? this.setState({ forderstatus: forderstatus.value, vfrozenreason: vfrozenreason })
								: '';
							updateCacheData(
								props,
								'pk_order',
								data.head[PAGECODE.cardhead].rows[0].values.pk_order.value,
								data,
								PAGECODE.cardhead,
								OrderCache.OrderCacheKey
							);
						}
						let cards = data.bodys;
						if (cards && cards[PAGECODE.head_payment]) {
							this.props.cardTable.setTableData(
								PAGECODE.head_payment,
								cards[PAGECODE.head_payment],
								null,
								true,
								true
							);
						} else {
							this.props.cardTable.setTableData(PAGECODE.head_payment, { rows: [] });
						}
						if (cards && cards[PAGECODE.cardbody]) {
							//解决NCCLOUD-94561：表体分页时点击翻页
							this.props.cardTable.setTableData(
								PAGECODE.cardbody,
								cards[PAGECODE.cardbody],
								null,
								true,
								true
							);
						}
						this.props.cardTable.setStatus(PAGECODE.cardbody, STATUS.edit);
						this.props.cardTable.setStatus(PAGECODE.head_payment, STATUS.edit);
						this.props.form.setFormStatus(PAGECODE.cardhead, STATUS.edit);
						this.props.updatePage(PAGECODE.cardhead, [ PAGECODE.head_payment, PAGECODE.cardbody ]);

						buttonController.togglePageShow.call(this, this.props, null);
						showSagaErrorToasts(props, PAGECODE.cardhead, FIELD.pk_order);
					}
				},
				error: (error) => {
					buttonController.showEmptyBrowsePage.call(this);
					showErrorInfo(getLangByResId(_this, '4004POORDER-000039'), error.message); /* 国际化处理： 注意*/
				}
			});
		}
	}
}

function emptyEditPage() {
	changeUrlParam(this.props, { status: STATUS.edit });
	this.props.form.setFormItemsValue(PAGECODE.cardhead, { [FIELD.pk_order]: { value: null, display: null } });
	this.props.form.EmptyAllFormValue(PAGECODE.cardhead); //订单
	//执行跳出堆栈
	this.props.cardTable.setTableData(PAGECODE.head_payment, { rows: [] }); //付款
	this.props.cardTable.setTableData(PAGECODE.cardbody, { rows: [] }); //物料
	this.props.initMetaByPkorg(FIELD.pk_org_v);
	this.props.form.setFormItemsValue(PAGECODE.cardhead, {
		[FIELD.forderstatus]: {
			value: '0',
			display: getLangByResId(this, '4004POORDER-000020')
		} /* 国际化处理： 自由*/
	});
	buttonController.togglePageShow.call(this, this.props, null);
}

function getTransferValue(_this, props, transfer) {
	let ids = _this.props.transferTable.getTransferTableSelectedId(PAGECODE.cardhead);
	if (transfer == 'MULTI') {
		ids = props.transferTable.getTransferTableMultiSelectedId();
		if (ids) {
			ids.map((v) => {
				v.bodys.map((body) => {
					if (body[PK.body23]) {
						body['pk'] = body[PK.body23];
						body['ts'] = body.ts;
						body['vo'] = PK.body23;
					}
					if (body[PK.body45]) {
						body['pk'] = body[PK.body45];
						body['ts'] = body.ts;
						body['vo'] = PK.body45;
					}
				});
				if (v.head[PK.head23]) {
					v.head['pk'] = v.head[PK.head23];
					v.head['ts'] = v.head.ts;
					v.head['vo'] = PK.head23;
				}
				if (v.head[PK.head45]) {
					v.head['pk'] = v.head[PK.head45];
					v.head['ts'] = v.head.ts;
					v.head['vo'] = PK.head45;
				}
			});
		}
	}
	let map = new Map();
	map.set('TRANSFER20', TRANSFER20);
	map.set('TRANSFERZ2', TRANSFERZ2);
	map.set('TRANSFER30TO21', TRANSFER30TO21);
	map.set('TRANSFER30TO21COOP', TRANSFER30TO21COOP);
	map.set('TRANSFERMULTI', TRANSFERMULTI);
	map.set('TRANSFER49', TRANSFER49);
	let org = null;
	let ref20data = null;
	if (
		transfer == TRANSFER30TO21.CSOURCETYPECODE ||
		transfer == TRANSFER30TO21COOP.CSOURCETYPECODE ||
		transfer == TRANSFERZ2.CSOURCETYPECODE
	) {
		org = props.getUrlParam('org');
	} else if (transfer == TRANSFER20.CSOURCETYPECODE) {
		ref20data = getDefData(OrderCache.OrderTransferCache, '20to21');
	}
	let TRANSFER = map.get('TRANSFER' + transfer);
	let queryAreaCode = TRANSFER.SEARCHID;
	let oid = org;
	let userObject = { pk_org: org };
	let key = TRANSFER.KEY;
	let _url = TRANSFER.TRANSFERXTO21ACTION;
	let templetid = getDefData(OrderCache.OrderTransferCache, 'templetid');
	if (ids) {
		// let id = new Set();
		// ids.map((v) => {
		// 	v.bodys.map((body) => {
		// 		id.add(body.pk);
		// 	});
		// });
		ids = transfer == '20' ? ref20data : ids;
		let data = {
			pagecode: PAGECODE.cardcode,
			templetid: templetid,
			queryAreaCode: queryAreaCode,
			oid: oid,
			userObject: userObject,
			queryType: PAGECODE.tree,
			key: key,
			data: ids
		};
		_this.refsourcdata = data;
		ajax({
			method: 'POST',
			url: _url,
			data: data,
			success: (res) => {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(
						res.formulamsg //参数一：返回的公式对象
					);
				}
				props.beforeUpdatePage();
				if (res && res.data) {
					let array = new Array();
					res.data.extBillCards.map((o) => {
						if (!o.bodys[PAGECODE.head_payment]) {
							o.bodys[PAGECODE.head_payment] = { areacode: PAGECODE.head_payment, rows: [] };
						}
						let datass = {};
						datass.head = o.head;
						datass.body = o.bodys;
						datass.pageid = o.pageid;
						array.push(datass);
					});
					props.transferTable.setTransferListValue(PAGECODE.leftarea, array);
					props.form.setFormStatus(PAGECODE.cardhead, STATUS.edit);
				}
				if (res.data && res.data.userObject.relateCTVO && transfer != 'MULTI') {
					if (res.data.userObject.relateCTVO.pk_ct_pu.rows.length > 0) {
						let bodyids = [ PAGECODE.cardbody, PAGECODE.head_payment ];
						let moduleId = PAGECODE.cardbody;
						let key = 'dbilldate';
						let value = props.form.getFormItemsValue(PAGECODE.cardhead, key);
						let aggvo = createExtBillHeadAfterEventData(
							props,
							PAGECODE.cardcode,
							PAGECODE.cardhead,
							bodyids,
							moduleId,
							key,
							value
						);
						promptBox({
							color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
							title: getLangByResId(_this, '4004POORDER-000139'), // 弹框表头信息/* 国际化处理： 关联合同*/
							content: getLangByResId(_this, '4004POORDER-000140'), //弹框内容，可以是字符串或dom/* 国际化处理： 确定要关联合同吗？*/
							leftBtnName: getLangByResId(_this, '4004POORDER-000018') /* 国际化处理： 确定*/,
							rightBtnName: getLangByResId(_this, '4004POORDER-000019') /* 国际化处理： 取消*/,
							beSureBtnClick: relationCT.relateCTOKBtnClick.bind(
								_this,
								_this.props,
								res.data.userObject,
								aggvo
							), //点击确定按钮事件
							cancelBtnClick: relationCT.relateCTCancelBtnClick.bind(
								_this,
								_this.props,
								res.data.userObject
							)
						});
					}
				}
				props.updatePage(PAGECODE.cardhead, [ PAGECODE.head_payment, PAGECODE.cardbody ]);
			},
			error: (error) => {
				backButton.call(_this, error);
				showErrorInfo(getLangByResId(_this, '4004POORDER-000039'), error.message); /* 国际化处理： 注意*/
			}
		});
	} else {
		props.transferTable.setTransferListValue(PAGECODE.leftarea, []);
	}
}

function arrange(_this, channelType) {
	let ids;
	let appcode = _this.props.getUrlParam(PUSHCONST.vsrcAppcode);
	if (channelType == TRANSFER.replenishmentarrange) {
		// 补货
		// ids = getDefData('scm.so.replenishmentarrange.main', 'replenishmentArrangeIds');
		ids = JSON.parse(_this.props.getUrlParam('replenishmentArrangeIds'));
	} else if (channelType == TRANSFER.directarrange) {
		// 直运
		// ids = getDefData('scm.so.directarrange.main', 'directArrangeIds');directArrangeIds
		ids = JSON.parse(_this.props.getUrlParam('directArrangeIds'));
	} else if (channelType == 'priceaudit') {
		// 价格审批单
		// ids = getDefData('purp.pp.priceaudit.pushDataSource', 'pushId');
		ids = JSON.parse(_this.props.getUrlParam(PUSHCONST.pushId));
	} else if (channelType == 'poplan') {
		ids = JSON.parse(_this.props.getUrlParam(PUSHCONST.pushId));
	}
	let orgid = _this.props.getUrlParam('orgid');
	let vsrctype = _this.props.getUrlParam('vsrctype'); //上游单据类型，用来判断调用哪个接口
	let url = _this.props.getUrlParam('channelAddress');
	_this.setState({
		returnURL: '/' + url,
		appcode: appcode,
		returnType: ''
	});
	if (ids) {
		let data = {
			pks: ids,
			pagecode: PAGECODE.cardcode,
			pk_org: orgid,
			vsrctype: vsrctype,
			channelType: channelType
		};
		ajax({
			method: 'POST',
			url: URL.sotoorder,
			data: data,
			success: (res) => {
				_this.props.beforeUpdatePage();
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					_this.props.dealFormulamsg(
						res.formulamsg //参数一：返回的公式对象
					);
				}
				if (res.data) {
					let array = new Array();
					res.data.extBillCards.map((o) => {
						let datass = {};
						if (!o.bodys[PAGECODE.head_payment]) {
							o.bodys[PAGECODE.head_payment] = { areacode: PAGECODE.head_payment, rows: [] };
						}
						datass.head = o.head;
						datass.body = o.bodys;
						datass.pageid = o.pageid;
						array.push(datass);
					});
					_this.props.transferTable.setTransferListValue(PAGECODE.leftarea, array);
					_this.props.cardTable.setStatus(PAGECODE.cardbody, STATUS.edit);
					_this.props.cardTable.setStatus(PAGECODE.head_payment, STATUS.edit);
					_this.props.form.setFormStatus(PAGECODE.cardhead, STATUS.edit);
					_this.setState({ listdata: array });
					if (res.data && res.data.userObject.relateCTVO && res.data.userObject.relateCTVO.pk_ct_pu) {
						if (res.data.userObject.relateCTVO.pk_ct_pu.rows.length > 0) {
							let bodyids = [ PAGECODE.cardbody, PAGECODE.head_payment ];
							let moduleId = PAGECODE.cardbody;
							let key = 'dbilldate';
							let value = _this.props.form.getFormItemsValue(PAGECODE.cardhead, key);
							let aggvo = createExtBillHeadAfterEventData(
								_this.props,
								PAGECODE.cardcode,
								PAGECODE.cardhead,
								bodyids,
								moduleId,
								key,
								value
							);
							promptBox({
								color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
								title: getLangByResId(_this, '4004POORDER-000139'), // 弹框表头信息/* 国际化处理： 提示*/
								content: getLangByResId(_this, '4004POORDER-000140'), //弹框内容，可以是字符串或dom/* 国际化处理： 是否关联合同？*/
								leftBtnName: getLangByResId(_this, '4004POORDER-000015') /* 国际化处理： 是*/,
								rightBtnName: getLangByResId(_this, '4004POORDER-000016') /* 国际化处理： 否*/,
								beSureBtnClick: relationCT.relateCTOKBtnClick.bind(
									_this,
									_this.props,
									res.data.userObject,
									aggvo
								), //点击确定按钮事件
								cancelBtnClick: relationCT.relateCTCancelBtnClick.bind(
									_this,
									_this.props,
									res.data.userObject
								)
							});
						}
					}
				}
				_this.props.updatePage(PAGECODE.cardhead, [ PAGECODE.head_payment, PAGECODE.cardbody ]);
			}
		});
	} else {
		_this.props.transferTable.setTransferListValue(PAGECODE.leftarea, []);
	}
}
