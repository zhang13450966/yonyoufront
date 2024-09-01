/*
 * @Author: jiangfw
 * @PageInfo: 初始化全部页签拉单界面
 * @Date: 2018-06-25 14:38:14
 * @Last Modified by: zhangmi
 * @Last Modified time: 2022-05-26 12:37:14
 */
// import { ajax, getBusinessInfo } from 'nc-lightapp-front';
import { ajax } from 'nc-lightapp-front';
import { APPCODE, PAGECODE, URL } from '../../constance';
import refAllFilter from '../../refFilter/refAllFilter';
// import ref21Filter from '../../refFilter/ref21Filter';
// import ref45Filter from '../../refFilter/ref45Filter';
// import ref4TFilter from '../../refFilter/ref4TFilter';
//import addRefresh from '../../utils/addRefresh';

export default function(props) {
	props.createUIDom(
		{
			appcode: APPCODE.invoiceAll, //应用编码
			pagecode: PAGECODE.refAll_list //页面编码
		},
		(templedata) => {
			if (templedata) {
				if (templedata.template) {
					let meta = templedata.template;
					// 添加参照过滤
					refAllFilter.call(this, props, meta);
					props.meta.addMeta(meta);
				}
				if (templedata.button) {
					let button = templedata.button;
					props.button.setButtons(button);
				}
				// 添加刷新按钮
				//addRefresh(props);
			}
		}
	);

	ajax({
		url: URL.queryTemplateIdOid,
		data: [
			{ appcode: APPCODE.poorder, pagecode: PAGECODE.ref21_list }, //采购订单拉单模板
			{ appcode: APPCODE.purchaseIn, pagecode: PAGECODE.ref45_list }, //采购入库单拉单模板
			{ appcode: APPCODE.initialest, pagecode: PAGECODE.ref4T_list } //期初暂估单拉单模板
		],
		success: (res) => {
			if (res && res.data) {
				let templateInfos = res.data;
				for (let templateInfo of templateInfos) {
					let pagecode = templateInfo.pagecode;
					if (pagecode == PAGECODE.ref21_list) {
						this.templetid_21 = templateInfo.templateid; //拉采购订单模板id
						this.qTempletid_21 = templateInfo.oid; //拉采购订单查询模板id
					} else if (pagecode == PAGECODE.ref45_list) {
						this.templetid_45 = templateInfo.templateid; //拉采购入库单模板id
						this.qTempletid_45 = templateInfo.oid; //拉采购入库单查询模板id
					} else if (pagecode == PAGECODE.ref25_list) {
						this.templetid_21P = templateInfo.templateid; //拉采购订单模板id
						this.qTempletid_21P = templateInfo.oid; //拉采购订单查询模板id
					} else {
						this.templetid_4T = templateInfo.templateid; //拉期初暂估单模板id
						this.qTempletid_4T = templateInfo.oid; //拉期初暂估单查询模板id
					}
				}
			}
		}
	});

	// const { meta } = this.props;
	// let _this = this;
	// ajax({
	// 	url: URL.mergerequest,
	// 	data: [
	// 		{
	// 			rqUrl: URL.querypage, //全部
	// 			rqJson: `{ pagecode:${PAGECODE.refAll_list}, appcode: ${APPCODE.invoiceAll} }`,
	// 			rqCode: 'all'
	// 		},
	// 		{
	// 			rqUrl: URL.querypage, //采购订单
	// 			rqJson: `{ pagecode:${PAGECODE.ref21_list} , appcode: ${APPCODE.poorder} }`,
	// 			rqCode: 'poorder'
	// 		},
	// 		{
	// 			rqUrl: URL.querypage, //采购入库单
	// 			rqJson: `{ pagecode:${PAGECODE.ref45_list} , appcode: ${APPCODE.purchaseIn}}`,
	// 			rqCode: 'purchaseIn'
	// 		},
	// 		{
	// 			rqUrl: URL.querypage, //期初暂估单
	// 			rqJson: `{ pagecode:${PAGECODE.ref4T_list} , appcode: ${APPCODE.initialest}}`,
	// 			rqCode: 'initialest'
	// 		},
	// 		{
	// 			rqUrl: '/platform/appregister/queryappcontext.do',
	// 			rqJson: `{ appcode: '400401602'}`,
	// 			rqCode: 'context'
	// 		}
	// 	],
	// 	success: (res) => {
	// 		if (res && res.success) {
	// 			let businessInfo = getBusinessInfo();
	// 			let context = res.data.context;
	// 			context.userId = businessInfo.userId;
	// 			context.userName = businessInfo.userName;
	// 			_this.setState({
	// 				templetid_21: res.data.poorder.pageid, //拉采购订单模板id
	// 				qTempletid_21: res.data.poorder.search21.oid, //拉采购订单查询模板id
	// 				templetid_45: res.data.purchaseIn.pageid, //拉采购入库单模板id
	// 				qTempletid_45: res.data.purchaseIn.search45.oid, //拉采购入库单查询模板id
	// 				templetid_4T: res.data.initialest.pageid, //拉期初暂估单模板id
	// 				qTempletid_4T: res.data.initialest.search4T.oid, //拉期初暂估单查询模板id
	// 				context_q: context
	// 			});
	// 			let nmeta = res.data;
	// 			let allMeta = nmeta.all;
	// 			let poorderMeta = nmeta.poorder;
	// 			let purchaseInMeta = nmeta.purchaseIn;
	// 			let initialestMeta = nmeta.initialest;
	// 			// 添加参照过滤
	// 			refAllFilter.call(_this, props, allMeta);
	// 			ref21Filter.call(_this, props, poorderMeta);
	// 			ref45Filter.call(_this, props, purchaseInMeta);
	// 			ref4TFilter.call(_this, props, initialestMeta);
	// 			// 这个顺序
	// 			meta.setMeta(allMeta);
	// 			meta.addMeta(poorderMeta);
	// 			meta.addMeta(purchaseInMeta);
	// 			meta.addMeta(initialestMeta);
	// 			_this.context_q = context;
	// 		}
	// 	}
	// });
	// // 添加刷新按钮
	// addRefresh(props);
}
