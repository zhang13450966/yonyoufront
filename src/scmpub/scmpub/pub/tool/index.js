/*
 * @Author: wangceb
 * @PageInfo: 公共处理工具
 * @Date: 2018-06-06 14:18:48
 * @Last Modified by: guozhq
 * @Last Modified time: 2020-08-24 08:49:50
 */

import dateFormat from './dateFormat';
import transtypeUtils from './transtypeUtils';
import marAsstUtils from './materialAsstHelper';
import crossRuleUtils from './crossRuleUtils';
import { getUrlParam } from './getParentURlParme';
import vbatchcodeHelper from './vbatchcodeHelper';
//引用平台公共的拷贝，兼容业务代码以免报错
import { deepClone } from 'nc-lightapp-front';
import { setPsndocShowLeavePower, setRefShowDisabledData } from './refUtils';

export {
	deepClone,
	dateFormat,
	transtypeUtils,
	marAsstUtils,
	crossRuleUtils,
	getUrlParam,
	vbatchcodeHelper,
	setPsndocShowLeavePower,
	setRefShowDisabledData
};
