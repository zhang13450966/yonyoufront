import React, { Component } from 'react';
import { high } from 'nc-lightapp-front';
import { initLang, getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { FIELDS } from '../../constance';
let { Transfer } = high;
class ShowSetting extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			targetKeys: null
		};
		initLang(this, [ '4004milestoneboard' ], 'pu', () => {
			FIELDS.forEach((item) => (item.title = getLangByResId(this, item.title)));
			this.setState({ dataSource: FIELDS });
		});
	}

	beSureBtnClick = () => {
		this.props.setDisplayFields(this.state.targetKeys);
	};

	cancelEvent = () => {
		this.setState({ targetKeys: [ ...this.props.displayFields ] });
	};

	onTargetKeysChange = (targetKeys) => {
		this.setState({ targetKeys });
	};

	render() {
		let { createModal, displayFields } = this.props;
		const { dataSource, targetKeys } = this.state;
		const transferProps = {
			dataSource,
			targetKeys: targetKeys || displayFields,
			onTargetKeysChange: this.onTargetKeysChange,
			className: 'setting-panel-transfer',
			showMoveBtn: true,
			// titles: [
			// 	getLangByResId(this, '4004MILESTONEBOARD-000004'),
			// 	getLangByResId(this, '4004MILESTONEBOARD-000005')
			// ] /* 国际化处理： 待选,已选*/,
			lazy: { container: 'modal' }
		};
		return createModal('setting', {
			title: getLangByResId(this, '4004MILESTONEBOARD-000003') /* 国际化处理：显示设置 */,
			content: <Transfer {...transferProps} />,
			beSureBtnClick: this.beSureBtnClick,
			cancelBtnClick: this.cancelEvent,
			closeModalEve: this.cancelEvent,
			className: 'combine'
		});
	}
}

export default ShowSetting;
