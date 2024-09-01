import React, { Component } from 'react';
import Immutable from 'immutable';
import Draft from 'draft-js';
const BLOCK_TYPES = [
	{
		key: 1,
		label: 'H',
		styleName: 'header-one',
		title: 'H',
		iconClassName: '',
		subitems: [
			{ key: '1 - 1', label: 'H1', styleName: 'header-one', title: 'H1', iconClassName: '', group: true },
			{ key: '1 - 2', label: 'H2', styleName: 'header-two', title: 'H2', iconClassName: '', group: true },
			{ key: '1 - 3', label: 'H3', styleName: 'header-three', title: 'H3', iconClassName: '', group: true },
			{ key: '1 - 4', label: 'H4', styleName: 'header-four', title: 'H4', iconClassName: '', group: true },
			{ key: '1 - 5', label: 'H5', styleName: 'header-five', title: 'H5', iconClassName: '', group: true },
			{ key: '1 - 6', label: 'H6', styleName: 'header-six', title: 'H6', iconClassName: '', group: true }
		]
	},
	{ key: 2, label: '“”', styleName: 'blockquote', title: '块引用', iconClassName: '' },
	{ key: 3, label: 'UI', styleName: 'unordered-list-item', title: '无序列表', iconClassName: '' },
	{ key: 4, label: 'OL', styleName: 'ordered-list-item', title: '有序列表', iconClassName: '' },
	{ key: 5, label: '</>', styleName: 'code-block', title: '代码块', iconClassName: '' }
];
function getBlockStyle(block) {
	const type = block.getType();
	// console.log(type);
	if (type === 'unstyled') {
		return null;
	} else {
		let _type_ = type.split(',');
		// console.log(_type_);
		let res_type = _type_.reduce((acc, cur) => `${acc} ` + `hrEditor-${cur}`, 'hrEditor-');
		let arr_type = res_type.split(' ');
		arr_type.shift();
		// console.log(arr_type);
		return arr_type.join(' ');
	}
}
class MyCustomBlock extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className={this.props.className}>
				{/* here, this.props.children contains a <section> container, as that was the matching element */}
				{this.props.children}
			</div>
		);
	}
}
function blockRenderMap() {
	const blockRenderMap = Immutable.Map({
		'uf-align-leftss': {
			// element is used during paste or html conversion to auto match your component;
			// it is also retained as part of this.props.children and not stripped out
			element: 'section',
			wrapper: <MyCustomBlock className="uf-align-left" />
		}
	});

	// keep support for other draft default block types and add our myCustomBlock type
	const _blockRenderMap_ = Draft.DefaultDraftBlockRenderMap.merge(blockRenderMap);
	return _blockRenderMap_;
}
export { BLOCK_TYPES, getBlockStyle, blockRenderMap };
