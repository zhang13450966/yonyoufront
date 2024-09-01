/*
 * @Author: CongKe 
 * @PageInfo: 采购订单合同参照
 * @Date: 2018-08-22 09:23:47 
 * @Last Modified by: CongKe
 * @Last Modified time: 2018-10-22 16:54:06
 */
import React, { Component } from 'react';
import { high } from 'nc-lightapp-front';
const { Refer } = high;
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function(props = {}) {
	var conf = {
		refType: 'grid',
		refName: getLangByResId(this, '4004POORDER-000062') /* 国际化处理： 订单关联合同*/,
		refCode: 'pu.poorder.orderrelationct',
		queryGridUrl: '/nccloud/pu/poorder/orderrelationct.do',
		columnConfig: [
			{
				name: [
					getLangByResId(this, '4004POORDER-000063'),
					getLangByResId(this, '4004POORDER-000064')
				] /* 国际化处理： 合同编号,合同名称*/,
				code: [ 'vbillcode', 'ctname' ]
			}
		],
		isMultiSelectedEnabled: false
	};

	return <Refer {...Object.assign(conf, props)} />;
}
