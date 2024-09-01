/*
 * @Author: zhaochyu 
 * @PageInfo: 打印
 * @Date: 2018-07-06 11:28:51 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-01-08 17:03:21
 */
//import React, { Component } from "react";
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { toast, print } from 'nc-lightapp-front';
import { PAGECODE, URL } from '../../constance';
export default function(props) {
	//获取选中行
	let row = props.table.getCheckedRows(PAGECODE.tableId);
	// 如果没有选中行，则提示并返回，不进行任何操作
	if (row.length <= 0) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4004INITIALEST-000027')
		}); /* 国际化处理： 请选择要打印的订单！*/
		return;
	}
	let pks = [];
	row.map((item) => {
		pks.push(item.data.values.pk_initialest.value);
	});
	print(
		'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
		URL.print,
		{
			// billtype: "4T", //单据类型
			// funcode: "40041600", //功能节点编码，即模板编码
			nodekey: null,
			oids: pks // 功能节点的数据主键
		}
	);
}
