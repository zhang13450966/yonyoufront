/*
 * @Author: CongKe 
 * @PageInfo: 采购订单拉请购单查询
 * @Date: 2018-06-13 14:13:15 
 * @Last Modified by: zhr
 * @Last Modified time: 2020-06-30 16:17:13
 */
import { ajax, toast } from 'nc-lightapp-front';
import { TRANSFER20, PAGECODE, URL, OrderCache, FIELD } from '../../constance';
import { clearTransferCache } from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showQueryResultInfoForNoPage, showRefreshInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { setDefData, getDefData } from '../../../../../scmpub/scmpub/pub/cache';

//点击查询，获取查询区数据
export default function(scene, isRefresh) {
	let _this = this;
	let _url = TRANSFER20.GETQUERYDATA;
	let queryInfo;
	let tododata;
	if (typeof scene == 'string') {
		queryInfo = _this.props.search.getQueryInfo(TRANSFER20.SEARCHID, false);
		if (scene == 'widget') {
			//请购下单小部件
			_url = URL.widget20to21;
			queryInfo.querycondition = null;
		} else if (scene == 'todo') {
			//待办中心
			queryInfo.querycondition = null;
			let pk = _this.props.getUrlParam(FIELD.id);
			_url = URL.flowquery20for21;
			if (pk) {
				let dataRows = new Array();
				let info = {
					pks: pk,
					ts: null
				};
				dataRows.push(info);
				tododata = {
					closedto: dataRows,
					pagecode: TRANSFER20.PAGEID,
					extstr: ''
				};
			}
		}
	} else {
		queryInfo = this.props.search.getQueryInfo(TRANSFER20.SEARCHID, true);
	}
	if (queryInfo.querycondition || typeof scene == 'string') {
		let map = new Map();
		let pks = new Array();
		if (this.refsourcdata) {
			this.refsourcdata.data.forEach((e) => {
				if (e.bodys && e.bodys.length > 0) {
					e.bodys.forEach((body) => {
						pks = map.get('pk_praybill_b');
						pks = pks == null ? new Array() : pks;
						pks.push(body.pk);
						map.set('pk_praybill_b', pks);
					});
				}
			});
		}

		// 加上采购订单发布的交易类型
		let transtype = getDefData(OrderCache.OrderCardCache, 'transtype');
		map.set('billtype_qs_key', transtype);
		let data = {
			templetid: this.state.templetid,
			queryInfo: queryInfo,
			pageCode: TRANSFER20.PAGEID, //页面编码
			userobj: map
		};
		if (scene == 'todo') {
			data = tododata;
		}
		//得到数据渲染到页面
		ajax({
			url: _url,
			data: data,
			success: (res) => {
				let backdata = [];
				let content = null; //getLangByResId(this, '4004POORDER-000098'); /* 国际化处理： 未查询出符合条件的数据*/
				this.setState({ ntotalnum: 0 });
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					_this.props.dealFormulamsg(
						res.formulamsg //参数一：返回的公式对象
					);
				}
				if (res && res.data) {
					res.data.map((item) => {
						//计算： 可订货主数量=请购单主数量-累计订货主数量
						//num=nnum-naccumulatenum
						let bodydatas = item.body[TRANSFER20.LIST_TABLE_CHILD].rows;
						bodydatas.map((m) => {
							let nnum = m.values.nnum.value;
							let scale = m.values.nnum.scale;
							let naccumulatenum =
								m.values.naccumulatenum == undefined ? 0 : m.values.naccumulatenum.value;
							let caninnum = nnum - naccumulatenum;
							m.values.num = { value: caninnum, scale: scale };
						});
					});
					let dataSources = OrderCache.OrderTransferCache;
					if (_this.isRefAddLine == true) {
						dataSources = OrderCache.OrderRefAdd20;
					}
					clearTransferCache(_this.props, dataSources);
					backdata = res.data;
					content = res.data.length; //getLangByResId(this, '4004POORDER-000006'); /* 国际化处理： 查询成功！*/
				}
				isRefresh == true ? showRefreshInfo() : showQueryResultInfoForNoPage(content);
				this.props.transferTable.setTransferTableValue(
					TRANSFER20.LIST_TABLE,
					TRANSFER20.LIST_TABLE_CHILD,
					backdata,
					'pk_praybill',
					'pk_praybill_b'
				);
			}
		});
	}
}
