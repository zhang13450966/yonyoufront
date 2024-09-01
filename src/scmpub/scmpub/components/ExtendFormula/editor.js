/*
 * @Author: hufei 
 * @PageInfo: 扩展平台的公式编辑器组件  
 * @Date: 2018-12-21 09:40:13 
 * @Last Modified by: hufeim
 * @Last Modified time: 2022-06-29 10:26:12
 */
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { base, high, ajax, toast } from 'nc-lightapp-front';
const { FormulaEditor } = high;
let { NCButton: Button } = base;
import './editor.less';
const isFunction = (fn) => {
	return Object.prototype.toString.call(fn) === '[object Function]';
};
export default class ExtendFormulaEditor extends FormulaEditor {
	constructor(props) {
		super(props);
		initLang(this, [ '4001extendformula' ], 'scmpub');
	}
	validate = () => {
		const { showData } = this.state;
		const { validateUrl } = this.props;
		return new Promise((resolve, reject) => {
			ajax({
				url: validateUrl,
				loading: false,
				data: { formulastr: showData },
				success: (res) => resolve(res),
				error: (e) => reject(e.message)
			});
		});
	};

	handleValidate = () => {
		const { showData, json } = this.state;
		this.validate()
			.then((res) => {
				if (res.data.status === 'Y') {
					toast({ color: 'success', content: `${json['formula0013']}` });
				} else if (res.data.status === 'N') {
					toast({
						color: 'danger',
						content: res.data.error ? res.data.error : `${json['formula0014']}`
					});
				}
			})
			.catch((err) => {
				toast({ color: 'danger', content: err });
			});
	};

	handleOk = () => {
		const { onOk, isValidateOnOK = true } = this.props;
		const { showData, json } = this.state;
		if (isValidateOnOK) {
			//判断确定的时候是否需要校验
			this.validate()
				.then((res) => {
					if (res.data.status === 'Y') {
						if (onOk && isFunction(onOk)) {
							onOk(showData, res.data);
						}
					} else if (res.data.status === 'N') {
						toast({
							color: 'danger',
							content: res.data.error ? res.data.error : `${json['formula0014']}`
						});
					}
				})
				.catch((err) => {
					toast({ color: 'danger', content: err });
				});
		} else {
			if (onOk && isFunction(onOK)) {
				onOk(showData);
			}
		}
	};

	_createKeyBoard = () => {
		const { optBtnsConfig, computedBtnconfig } = this.state;
		let { extendBtns } = this.props;
		// 扩展的 如果，否则，则，并且，或者 五个按钮
		let extendBtnsConfig = Object.keys(extendBtns).map((item) => {
			return { key: item, name: extendBtns[item], onClick: () => this.handlePushStr(` ${extendBtns[item]} `) };
		});
		// 判断是不是中文语种环境
		let notChinese = getLangByResId(this, '4014ExtendFormula-000001') !== '数字';
		return (
			<div className={`keyboard-area${notChinese ? ' not-chinese' : ''}`}>
				<div className="editor-opt-btns">
					{/* 国际化处理： 数字*/}
					<span className="editor-opt-title">{getLangByResId(this, '4014ExtendFormula-000001')}</span>
					{this._createOptBtns(optBtnsConfig)}
				</div>
				<div className="editor-comp-btns">
					{/* 国际化处理： 运算符*/}
					<span className="editor-comp-title">{getLangByResId(this, '4014ExtendFormula-000002')}</span>
					{this._createOptBtns(computedBtnconfig)}
				</div>
				<div className="editor-comp-close">
					<span onClick={this.closeKeyBoard}>
						<i className="iconfont icon-guanbi" />
					</span>
				</div>
				<div className="editor-opt-btns editor-extend-btns">
					{/* 国际化处理： 逻辑*/}
					<span className="editor-opt-title">{getLangByResId(this, '4014ExtendFormula-000003')}</span>
					{this._createOptBtns(extendBtnsConfig)}
				</div>
			</div>
		);
	};
}
