/*
 * @Author: jiangfw
 * @PageInfo: 初始化全部页签拉单界面
 * @Date: 2018-06-25 14:38:14
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-07-17 14:57:54
 */
import { ajax, getBusinessInfo } from 'nc-lightapp-front';
import { APPCODE, PAGECODE, URL } from '../../constance';
import refScAllFilter from '../../refFilter/refScAllFilter';
import ref61Filter from '../../refFilter/ref61Filter';
import ref47Filter from '../../refFilter/ref47Filter';
//import addRefresh from '../../utils/addRefresh';

export default function(props) {
    props.createUIDom(
        {
            appcode: APPCODE.invoiceScAll, //应用编码
            pagecode: PAGECODE.invoiceScAll //页面编码
        },
        templedata => {
            if (templedata) {
                if (templedata.template) {
                    let meta = templedata.template;
                    // 添加参照过滤
                    refScAllFilter.call(this, props, meta);
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
            { appcode: APPCODE.puinvoice, pagecode: PAGECODE.ref61_list }, //委外订单
            { appcode: APPCODE.subcontIn, pagecode: PAGECODE.ref47_list } //委托加工入库单
        ],
        success: res => {
            if (res && res.data) {
                let templateInfos = res.data;
                for (let templateInfo of templateInfos) {
                    let pagecode = templateInfo.pagecode;
                    if (pagecode == PAGECODE.ref61_list) {
                        this.templetid_61 = templateInfo.templateid; //委外订单模板id
                        this.qTempletid_61 = templateInfo.oid; //委外订单查询模板id
                    } else {
                        this.templetid_47 = templateInfo.templateid; //委托加工入库单模板id
                        this.qTempletid_47 = templateInfo.oid; //委托加工入库单查询模板id
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
    // 			rqJson: `{ pagecode:${PAGECODE.invoiceScAll}, appcode: ${APPCODE.invoiceScAll}}`,
    // 			rqCode: 'all'
    // 		},
    // 		{
    // 			rqUrl: URL.querypage, //委外订单
    // 			rqJson: `{ pagecode:${PAGECODE.ref61_list} , appcode: ${APPCODE.puinvoice} }`,
    // 			rqCode: 'scorder'
    // 		},
    // 		{
    // 			rqUrl: URL.querypage, //委托加工入库单
    // 			rqJson: `{ pagecode:${PAGECODE.ref47_list} , appcode: ${APPCODE.subcontIn}}`,
    // 			rqCode: 'subcontIn'
    // 		},
    // 		{
    // 			rqUrl: '/platform/appregister/queryappcontext.do',
    // 			rqJson: `{ appcode: '400401608'}`,
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
    // 				templetid_61: res.data.scorder.pageid, //委外订单模板id
    // 				qTempletid_61: res.data.scorder.search61.oid, //委外订单查询模板id
    // 				templetid_47: res.data.subcontIn.pageid, //委托加工入库单模板id
    // 				qTempletid_47: res.data.subcontIn.search47.oid, //委托加工入库单模板id
    // 				context_q: context
    // 			});
    // 			let nmeta = res.data;
    // 			let allMeta = nmeta.all;
    // 			let scorderMeta = nmeta.scorder;
    // 			let subcontInMeta = nmeta.subcontIn;
    // 			// 添加参照过滤
    // 			refScAllFilter.call(_this, props, allMeta);
    // 			ref61Filter.call(_this, props, scorderMeta);
    // 			ref47Filter.call(_this, props, subcontInMeta);
    // 			// 这个顺序
    // 			meta.setMeta(allMeta);
    // 			meta.addMeta(scorderMeta);
    // 			meta.addMeta(subcontInMeta);
    // 			_this.context_q = context;
    // 		}
    // 	}
    // });
    // // 添加刷新按钮
    // addRefresh(props);
}
