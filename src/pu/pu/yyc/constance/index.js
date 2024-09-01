/*
 * 友云采扩展按钮常量类
 * @Author: guozhq 
 * @Date: 2019-05-16 16:47:13 
 * @Last Modified by: guozhq
 * @Last Modified time: 2022-04-08 12:20:38
 */

// 按钮
const YYC_BUTTON_ID = {
	SendToYC: 'SendToYC', // 发布至云采
	CancelSendToYC: 'CancelSendToYC', // 取消发布至云采
	LookYCQtInfo: 'LookYCQtInfo', // 查看报价信息
	LookYCSchedule: 'LookYCSchedule' // 云采处理进度
};

// 模块号
const YYC_PARAM = {
	DATASOURCE: 'YYC_DATASOURCE',
	YCPO001: '4080'
};

const YYC_BUTTON_ARRAY = [
	YYC_BUTTON_ID.SendToYC,
	YYC_BUTTON_ID.CancelSendToYC,
	YYC_BUTTON_ID.LookYCQtInfo,
	YYC_BUTTON_ID.LookYCSchedule
];

// 请购地址
const Req_URL = {
	SendToYC: '/nccloud/pu/buyingreq/send2yyc.do',
	CancelSendToYC: '/nccloud/pu/buyingreq/cancel2yyc.do',
	LookYCQtInfo: '/nccloud/pu/buyingreq/yycviewqt.do',
	LookYCSchedule: '/nccloud/pu/buyingreq/yycschedule.do'
};
// 订单地址
const Order_URL = {
	SendToYC: '/nccloud/pu/poorder/poorderyycpubaction.do',
	CancelSendToYC: '/nccloud/pu/poorder/poorderyyccancelpubaction.do'
};

export { YYC_BUTTON_ID, YYC_PARAM, YYC_BUTTON_ARRAY, Req_URL, Order_URL };
