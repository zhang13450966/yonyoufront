/*
 * @Author: wangceb
 * @PageInfo: 供应链暂存功能
 * @Date: 2019-03-19 15:01:25
 * @Last Modified by: songyt13
 * @Last Modified time: 2021-10-21 14:11:51
 */
import { URL } from '../const';
import { showSuccessInfo } from '../../../pub/tool/messageUtil';
import { ajax, getMultiLang } from 'nc-lightapp-front';

class LangContainer {
	constructor() {
		this.lang = null;
		this.inlt = null;
		// 初始化提示多语信息
		getMultiLang({
			moduleId: '4001tempsave',
			domainName: 'scmpub',
			callback: this.init.bind(this),
			needInlt: true
		});
	}

	init(lang, status, inlt) {
		if (status) {
			this.lang = lang;
			this.inlt = inlt;
		}
	}

	getLangByResId(resid, param) {
		let str = resid;
		if (param) {
			str = this.inlt.get(resid, param);
			return str ? str : resid;
		} else {
			// 如果还没有加载回来，则返回空，避免页面显示多语字符串
			if (this.lang) {
				str = this.lang[resid];
				return str ? str : resid;
			} else {
				return resid;
			}
		}
	}
}

/**
 * 实例化多语容器
 */
const lang = new LangContainer();

export default function save_btnClicks(props, config, checkFunction) {
	// 是否校验
	if (checkFunction && Object.prototype.toString.call(checkFunction).indexOf('Function') != -1) {
		// 校验通过执行暂存
		if (checkFunction.call(this)) {
			doAction.call(this, props, config);
		}
	} else {
		// 不校验 执行暂存
		doAction.call(this, props, config);
	}
}

function doAction(props, config) {
	let bill = null;
	if (config.param) {
		props.cardTable.filterEmptyRows(config.area, [ config.param ], 'include');
	}
	if (config.type === 'card') {
		if (config.tableId instanceof Array) {
			bill = props.createExtCardDataSimple(config.pagecode, config.formId, config.tableId);
		} else {
			bill = props.createMasterChildDataSimple(config.pagecode, config.formId, config.tableId);
		}
	}
	//NCC-122751 chenggangk 过滤删除的行
	if (config.filterDelRows) {
		let newRows = [];
		bill.body.body.rows.forEach((row) => {
			if (row.status != '3') {
				newRows.push(row);
			}
		});
		bill.body.body.rows = newRows;
	}
	ajax({
		url: URL.SAVE,
		data: bill,
		success: (res) => {
			if (res.success) {
				if (res.data && config.type === 'card') {
					let pk = {
						[res.data[0]]: {
							display: res.data[1],
							value: res.data[1]
						}
					};
					this.props.form.setFormItemsValue(config.formId, pk);
				}
				showSuccessInfo(lang.getLangByResId('4001TEMPSAVE-000006'));
			}
		}
	});
}
