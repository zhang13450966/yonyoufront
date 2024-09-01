/*
 * @Author: 王龙华 
 * @PageInfo: 司机定义参照 
 * @Date: 2018-06-21 15:46:30 
 * @Last Modified by: zhangbfk
 * @Last Modified time: 2020-02-19 16:16:09
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
		refName: 'REFER-000029' /* 国际化处理： 司机定义*/,
		refCode: 'scmpub.ref.DriverGridRefer',
		queryGridUrl: '/nccloud/scmpub/refer/DriverGridRefer.do',
		columnConfig: [
			{
				name: [ 'REFER-000030', 'REFER-000031' ] /* 国际化处理： 司机定义编码,司机定义名称*/,
				code: [ 'vdrivercode', 'vdrivername' ]
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
