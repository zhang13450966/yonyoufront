/**
 * Created by wanghongxiang on 2018/5/21.
 */
 import { high } from 'nc-lightapp-front';

 const { Refer } = high;
 
 export default function (props = {}) {
	 var conf = { multiLang: {  domainName: 'hrpub', currentLocale: 'zh-CN',  moduleId: 'hrpub'},
		 refType: 'tree',
		 refName: '统计条件分类',/* 国际化处理： 统计条件分类*/
		 placeholder: '统计条件分类',/* 国际化处理： 统计条件分类*/
		 refCode: 'hrpub.refer.pub.HRStatCondSortTreeRef',
		 queryTreeUrl: '/nccloud/hrpub/pub/HRStatCondSortTreeRef.do',
		 rootNode: { refname: '统计条件分类', refpk: 'root' ,isleaf: false},/* 国际化处理： 统计条件分类*/
		 columnConfig: [{name: ['hrpub-000006' ],code: [ 'refname' ]}],/* 国际化处理： 名称*/
		 isMultiSelectedEnabled: false,
	 };
 
	 return <Refer {...Object.assign(conf, props)} />
 }
 