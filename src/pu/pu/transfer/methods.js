import { base } from 'nc-lightapp-front';
let { NCCheckbox, NCSelect, NCSwitch, NCFormControl } = base;
import { getLangByResId } from '../../../scmpub/scmpub/pub/tool/multiLangUtil';

export function renderForm(data, switchChangeFn, selectChangeFn) {
	return data.map((item) => {
		switch (item.itemtype) {
			case 'select':
				let options = item.options.map((cur) => {
					return { label: getLangByResId(this, cur.label), value: cur.value };
				});
				return (
					<div className="list-item select-item nc-theme-title-font-c">
						<label>{getLangByResId(this, item.label)}</label>
						<span className="colon">：</span>
						{this.state.status === 'browse' ? this.state.fields[item.code] ? (
							this.state.fields[item.code].label
						) : (
							''
						) : (
							<div style={{ width: 200 }}>
								<NCSelect
									fieldid="putransfer_select"
									labelInValue
									data={options}
									disabled={this.state.status === 'browse'}
									value={item.code ? this.state.fields[item.code] : {}}
									onChange={(opt) => {
										this.state.fields[item.code] = opt;
										this.setState({ fields: this.state.fields });
										selectChangeFn && selectChangeFn(item.code, opt);
									}}
								/>
							</div>
						)}
						{item.children && renderForm.call(this, item.children)}
					</div>
				);
			case 'switch':
				return (
					<div className="list-item switch-item nc-theme-title-font-c">
						<label>{getLangByResId(this, item.label)}</label>
						<span className="colon">：</span>
						{this.state.status === 'browse' ? this.state.fields[item.code] ? (
							getLangByResId(this, '4004transfer-000008') /* 国际化处理： 是*/
						) : (
							getLangByResId(this, '4004transfer-000009') /* 国际化处理： 否*/
						) : (
							<NCSwitch
								disabled={this.state.status === 'browse' || this.state.disabled[item.code]}
								checked={this.state.fields[item.code]}
								onBlur={() => {}}
								onChange={() => {
									this.state.fields[item.code] = !this.state.fields[item.code];
									if (item.children) {
										item.children.forEach((child) => {
											this.state.fields[child.code] = false;
										});
									}
									this.setState({
										fields: this.state.fields
									});
									switchChangeFn && switchChangeFn(item.code, this.state.fields[item.code]);
								}}
							/>
						)}
					</div>
				);
			default:
				break;
		}
	});
}

export function renderPotrantypeForm(data, checkboxChangeFn, selectChangeFn, onBlurFn) {
	return data.map((item) => {
		switch (item.itemtype) {
			case 'checkbox':
				return (
					<div className="list-item checkbox-item nc-theme-title-font-c">
						<NCCheckbox
							disabled={
								this.state.status === 'browse' ||
								(item.parentCode && !this.state.fields[item.parentCode]) ||
								this.state.disabled[item.code]
							}
							checked={this.state.fields[item.code]}
							onBlur={() => {}}
							onChange={() => {
								this.state.fields[item.code] = !this.state.fields[item.code];
								if (item.children) {
									item.children.forEach((child) => {
										this.state.fields[child.code] = false;
									});
								}
								this.setState({
									fields: this.state.fields
								});
								let confirmmodel = 'Y';
								if (!this.state.fields.bstore && !this.state.fields.barrive) {
									//入库// 到货都为否则校验
									confirmmodel = 'Y';
								} else {
									confirmmodel = 'N';
								}
								// 校验
								document.getElementById('extInfo').setAttribute('confirmmodel', confirmmodel); //是否弹出确认对话框，Y 弹出 N不弹出
								checkboxChangeFn && checkboxChangeFn(item.code, this.state.fields[item.code]);
							}}
						>
							{getLangByResId(this, item.label)}
						</NCCheckbox>
						{item.children && renderPotrantypeForm.call(this, item.children)}
					</div>
				);
			case 'select':
				let options = item.options.map((cur) => {
					return { label: getLangByResId(this, cur.label), value: cur.value };
				});
				return (
					<div className="list-item select-item nc-theme-title-font-c">
						{/* 黑暗模式下反色调整 */}
						<label>{getLangByResId(this, item.label)}</label>
						<div style={{ width: 220 }}>
							<NCSelect
								labelInValue
								data={options}
								disabled={this.state.status === 'browse'}
								value={item.code ? this.state.fields[item.code] : {}}
								onChange={(opt) => {
									this.setState({
										fields: {
											...this.state.fields,
											[item.code]: opt
										}
									});
								}}
							/>
						</div>
						{item.children && renderForm.call(this, item.children)}
					</div>
				);
			case 'number':
				// 数值型输入框
				return (
					<div className="list-item select-item nc-theme-title-font-c">
						<label>{getLangByResId(this, item.label)}</label>
						<div className="number-input">
							<NCFormControl
								type="number"
								disabled={
									this.state.status === 'browse' ||
									(item.parentCode && !this.state.fields[item.parentCode]) ||
									this.state.disabled[item.code]
								}
								value={item.code ? this.state.fields[item.code] : {}}
								onBlur={(value) => {
									this.setState({
										fields: {
											...this.state.fields,
											[item.code]: value
										}
									});
									onBlurFn && onBlurFn(item.code, value);
								}}
								onChange={(value) => {
									this.setState({
										fields: {
											...this.state.fields,
											[item.code]: value
										}
									});
									checkboxChangeFn && checkboxChangeFn(item.code, value);
								}}
							/>
						</div>
					</div>
				);
				break;
			default:
				break;
		}
	});
}
export function getValues(data) {
	let saveVal = {};
	for (let key in data) {
		if (Object.prototype.toString.call(data[key]) === '[object Object]') {
			saveVal[key] = data[key].value;
		} else {
			saveVal[key] = data[key];
		}
	}
	return saveVal;
}
