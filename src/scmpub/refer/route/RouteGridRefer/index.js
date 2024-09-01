/*
 * @Author: 王龙华 
 * @PageInfo: 运输路线 
 * @Date: 2018-06-26 20:34:39 
 * @Last Modified by: 王龙华
 * @Last Modified time: 2018-10-31 11:17:18
 */

import React, { Component } from 'react';
import { high } from 'nc-lightapp-front';
const { Refer } = high;

export default function(props = {}) {
	var conf = {
		multiLang: {
			domainName: 'scmpub',
			currentLocale: 'zh-CN',
			moduleId: 'refer'
		},
		placeholder: 'REFER-000042' /* 国际化处理： 运输路线档案*/,
		refName: 'REFER-000043' /* 国际化处理： 运输路线参照*/,
		refCode: 'scmpub.ref.RouteGridRefer',
		refType: 'grid',
		queryGridUrl: '/nccloud/scmpub/refer/RouteGridRefer.do',
		columnConfig: [
			{
				name: [ 'REFER-000044', 'REFER-000045' ] /* 国际化处理： 运输路线编码,运输路线名称*/,
				code: [ 'vroutecode', 'vroutename' ]
			}
		],
		isMultiSelectedEnabled: false,
		unitProps: {
			multiLang: {
				domainName: 'scmpub',
				currentLocale: 'zh-CN',
				moduleId: 'refer'
			},
			refName: 'REFER-000025' /* 国际化处理： 物流组织*/,
			placeholder: 'REFER-000025' /* 国际化处理： 物流组织*/,
			refCode: 'uapbd.refer.org.TrafficOrgGridRef',
			queryGridUrl: '/nccloud/uapbd/org/TrafficOrgGridRef.do',
			isMultiSelectedEnabled: false,
			refType: 'grid',
			key: 'pk_trafficorg',
			columnConfig: [
				{ name: [ 'REFER-000001', 'REFER-000002' ], code: [ 'refcode', 'refname' ] }
			] /* 国际化处理： 编码,名称*/
		},
		isHasDisabledData: false
	};

	return <Refer {...Object.assign(conf, props)} />;
}
