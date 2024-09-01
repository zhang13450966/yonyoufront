/*
 * @Author: 王龙华 
 * @PageInfo: 车型定义参照 
 * @Date: 2018-06-06 14:47:25 
 * @Last Modified by: zhangbfk
 * @Last Modified time: 2020-02-19 15:23:19
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
		refType: 'grid',
		refName: 'REFER-000049' /* 国际化处理： 车型定义*/,
		refCode: 'scmpub.ref.VehicleTypeGridRefer',
		queryGridUrl: '/nccloud/scmpub/refer/VehicleTypeGridRefer.do',
		columnConfig: [
			{
				name: [ 'REFER-000050', 'REFER-000051' ] /* 国际化处理： 车型定义编码,车型定义名称*/,
				code: [ 'vvhcltypecode', 'vvhcltypename' ]
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
		}
	};

	return <Refer {...Object.assign(conf, props)} />;
}
