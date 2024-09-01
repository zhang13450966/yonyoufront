/*
 * @Author: xiahui
 * @PageInfo: 采购合同交易类型
 * @Date: 2019-02-19 15:36:10
 * @Last Modified by: sunxxf
 * @Last Modified time: 2021-01-11 10:58:57
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax } from 'nc-lightapp-front';
import { initTemplate } from './init';
import { ARSUB_CONST, FIELDS } from './const';
import { headAfterEvent } from './afterEvents';

//状态常量
const STATE = {
	ADD: 'add',
	EDIT: 'edit',
	CANCEL: 'cancel',
	BROWSE: 'browse'
};

const PAYMENTFLAG_ENABLE_RELATION = {
	'1': {
		[FIELDS.BOFFSETORDERFLAG]: false,
		[FIELDS.BOFFSETINVOICEFLAG]: false,
		[FIELDS.BSUBINVCUSTFLAG]: false,
		[FIELDS.BSUBSALEORGFLAG]: false,
		[FIELDS.BAUTOGATHERINGFLAG]: true,
		[FIELDS.BAUTOVOUCHERFLAG]: true
	},
	'2': {
		[FIELDS.BOFFSETORDERFLAG]: true,
		[FIELDS.BOFFSETINVOICEFLAG]: true,
		[FIELDS.BSUBINVCUSTFLAG]: true,
		[FIELDS.BSUBSALEORGFLAG]: true,
		[FIELDS.BAUTOGATHERINGFLAG]: true,
		[FIELDS.BAUTOVOUCHERFLAG]: false
	},
	'3': {
		[FIELDS.BOFFSETORDERFLAG]: true,
		[FIELDS.BOFFSETINVOICEFLAG]: true,
		[FIELDS.BSUBINVCUSTFLAG]: true,
		[FIELDS.BSUBSALEORGFLAG]: true,
		[FIELDS.BAUTOGATHERINGFLAG]: false,
		[FIELDS.BAUTOVOUCHERFLAG]: false
	},
	'4': {
		[FIELDS.BOFFSETORDERFLAG]: true,
		[FIELDS.BOFFSETINVOICEFLAG]: true,
		[FIELDS.BSUBINVCUSTFLAG]: false,
		[FIELDS.BSUBSALEORGFLAG]: false,
		[FIELDS.BAUTOGATHERINGFLAG]: true,
		[FIELDS.BAUTOVOUCHERFLAG]: true
	}
};

const PAYMENTFLAG_DEFAULTVALUE_RELATION = {
	'1': {
		[FIELDS.BOFFSETORDERFLAG]: { value: true },
		[FIELDS.BOFFSETINVOICEFLAG]: { value: true },
		[FIELDS.BSUBINVCUSTFLAG]: { value: false },
		[FIELDS.BSUBSALEORGFLAG]: { value: false },
		[FIELDS.BAUTOGATHERINGFLAG]: { value: false },
		[FIELDS.BAUTOVOUCHERFLAG]: { value: false }
	},
	'2': {
		[FIELDS.BOFFSETORDERFLAG]: { value: false },
		[FIELDS.BOFFSETINVOICEFLAG]: { value: false },
		[FIELDS.BSUBINVCUSTFLAG]: { value: false },
		[FIELDS.BSUBSALEORGFLAG]: { value: false },
		[FIELDS.BAUTOGATHERINGFLAG]: { value: false },
		[FIELDS.BAUTOVOUCHERFLAG]: { value: false }
	},
	'3': {
		[FIELDS.BOFFSETORDERFLAG]: { value: false },
		[FIELDS.BOFFSETINVOICEFLAG]: { value: false },
		[FIELDS.BSUBINVCUSTFLAG]: { value: false },
		[FIELDS.BSUBSALEORGFLAG]: { value: false },
		[FIELDS.BAUTOGATHERINGFLAG]: { value: false },
		[FIELDS.BAUTOVOUCHERFLAG]: { value: false }
	},
	'4': {
		[FIELDS.BOFFSETORDERFLAG]: { value: false },
		[FIELDS.BOFFSETINVOICEFLAG]: { value: false },
		[FIELDS.BSUBINVCUSTFLAG]: { value: false },
		[FIELDS.BSUBSALEORGFLAG]: { value: false },
		[FIELDS.BAUTOGATHERINGFLAG]: { value: false },
		[FIELDS.BAUTOVOUCHERFLAG]: { value: false }
	}
};

class PurdailyExtendAttribute extends Component {
	constructor(props) {
		super(props);
		props.use.form(ARSUB_CONST.extendAttribute);
		initTemplate.call(this, this.props);
	}

	/********componentDidMount是固定的********** */
	componentDidMount() {
		if (document.getElementById('extInfo').onclick != null) {
			document.getElementById('extInfo').onclick(this.showData);
		}
		if (document.getElementById('extInfo').method != null) {
			document.getElementById('extInfo').method(this.props.form.getAllFormValue);
		}
	}

	/********setExtendPaneStat是固定********** */
	setExtendPaneStat() {
		let extendStat = document.getElementById('extInfo').getAttribute('extendStat');
		return extendStat;
	}

	/********getExtendData是固定********** */
	getExtendData(extendAttribute) {
		let obj = this.props.form.getAllFormValue(ARSUB_CONST.extendAttribute);
		return obj;
	}

	//请求列表数据
	showData = (pk_billtypeid) => {
		//状态 add, edit,cancel,browse 其中 add edit cancel分别对应动作 新增 修改 取消
		//pk_billtypeid 为单机类型编码
		let stat = this.setExtendPaneStat();
		if (pk_billtypeid instanceof Event) {
			this.props.form.EmptyAllFormValue(ARSUB_CONST.extendAttribute);
			return;
		}
		switch (stat) {
			case STATE.ADD:
				this.props.form.setFormStatus(ARSUB_CONST.extendAttribute, STATE.ADD);
				this.setDefaultValue();
				this.setItemEnabled();
				break;
			case STATE.EDIT:
				this.props.form.setFormStatus(ARSUB_CONST.extendAttribute, STATE.EDIT);
				this.setItemEnabled('NotSet');
				break;
			case STATE.CANCEL:
				this.props.form.cancel(ARSUB_CONST.extendAttribute);
				break;
			case STATE.BROWSE:
				this.props.form.setFormStatus(ARSUB_CONST.extendAttribute, STATE.BROWSE);
				if (pk_billtypeid) {
					this.queryData(pk_billtypeid);
				} else {
					this.props.form.EmptyAllFormValue(ARSUB_CONST.extendAttribute);
				}
				break;
			default:
				break;
		}
	};

	//设置默认值
	setDefaultValue = () => {
		this.props.form.EmptyAllFormValue(ARSUB_CONST.extendAttribute);
		this.props.form.setFormItemsValue(ARSUB_CONST.extendAttribute, {
			[FIELDS.BADDMANUALFLAG]: { value: 'Y' },
			[FIELDS.FPAYMENTFLAG]: { value: '1' },
			[FIELDS.BOFFSETORDERFLAG]: { value: 'Y' },
			[FIELDS.BOFFSETINVOICEFLAG]: { value: 'Y' }
		});
	};

	setItemEnabled = (needSetValue) => {
		let paymentflag = this.props.form.getFormItemsValue(ARSUB_CONST.extendAttribute, FIELDS.FPAYMENTFLAG).value;
		this.props.form.setFormItemsDisabled(ARSUB_CONST.extendAttribute, PAYMENTFLAG_ENABLE_RELATION[paymentflag]);
		if (!needSetValue) {
			this.props.form.setFormItemsValue(
				ARSUB_CONST.extendAttribute,
				PAYMENTFLAG_DEFAULTVALUE_RELATION[paymentflag]
			);
		}
	};

	//查询数据
	queryData = (pk_billtypeid) => {
		let meta = this.props.meta.getMeta();
		ajax({
			url: ARSUB_CONST.queryTranstype,
			data: {
				conditions: {
					pk_billtypeid: pk_billtypeid,
					templateid: meta.pageid
				}
			},
			success: (res) => {
				let { success, data } = res;
				if (success && data) {
					this.props.form.setAllFormValue({
						[ARSUB_CONST.extendAttribute]: data[ARSUB_CONST.extendAttribute]
					});
				} else {
					this.props.form.EmptyAllFormValue(ARSUB_CONST.extendAttribute);
				}
			}
		});
	};

	render() {
		let { form } = this.props;
		const { createForm } = form;
		return (
			<div id="finance-reva-pobdoc-list">
				<div className="title-button-area">
					<div className="title-area">{}</div>
				</div>
				<div className="table-area">
					{createForm(ARSUB_CONST.extendAttribute, {
						onAfterEvent: headAfterEvent.bind(this)
					})}
				</div>
			</div>
		);
	}
}

PurdailyExtendAttribute = createPage({})(PurdailyExtendAttribute);

/*********渲染位置#transtypebusi是固定的************************ */
ReactDOM.render(<PurdailyExtendAttribute />, document.querySelector('#transtypebusi'));
