/*
 * @Author: 王龙华 
 * @PageInfo: 承运商多级表格参照 
 * @Date: 2018-06-22 10:02:55 
 * @Last Modified by: 王龙华
 * @Last Modified time: 2018-10-31 11:16:56
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
		placeholder: 'REFER-000023' /* 国际化处理： 承运商档案*/,
		refName: 'REFER-000024' /* 国际化处理： 承运商参照*/,
		refCode: 'scmpub.ref.CarrierDefaultGridRefer',
		refType: 'grid',
		queryGridUrl: '/nccloud/scmpub/refer/CarrierDefaultGridRefer.do',
		columnConfig: [
			{
				name: [ 'REFER-000021', 'REFER-000022' ] /* 国际化处理： 承运商编码,承运商名称*/,
				code: [ 'refcode', 'refname' ]
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
