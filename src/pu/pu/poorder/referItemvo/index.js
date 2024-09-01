/*
 * @Author: CongKe 
 * @PageInfo: 到货计划参照订单行 
 * @Date: 2019-02-20 11:18:42 
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-02-20 11:31:33
 */
import React, { Component } from 'react';
import { high } from 'nc-lightapp-front';
const { Refer } = high;

export default function(props = {}) {
	var conf = {
		multiLang: {
			domainName: 'pu', //模块
			currentLocale: 'zh-CN',
			moduleId: '4004poorder' //多语文件名
		},
		refType: 'grid',
		// refCode:{'vmiRuleRefer'},
		placeholder: '',
		refName: '4004POORDER-000001' /* 国际化处理： 订单行号参照（可多选）*/,
		isMultiSelectedEnabled: true,
		isShowDisabledData: false,
		columnConfig: [
			{
				name: [
					'4004POORDER-000078',
					'4004POORDER-000079',
					'4004POORDER-000080',
					'4004POORDER-000081',
					'4004POORDER-000082'
				],
				/* 国际化处理： 订单行号,物料编码,物料名称,规格,型号*/
				code: [
					'po_order_b.crowno',
					'bd_material.code',
					'bd_material.name',
					'bd_material.materialspec',
					'bd_material.materialtype'
				]
			}
		],
		queryGridUrl: '/nccloud/pu/poorder/porprownomodel.do'
	};

	return <Refer {...Object.assign(conf, props)} />;
}
