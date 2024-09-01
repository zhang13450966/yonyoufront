import React, { Component } from 'react';
import StyleButton from './style_button';
import { base } from 'nc-lightapp-front';
import { Map } from 'immutable';
import decorator from '../config/decorator';
import {
	RichUtils,
	SelectionState,
	CompositeDecorator,
	ContentState,
	convertFromRaw,
	EditorState,
	convertFromHTML,
	convertToRaw,
	Modifier,
	CharacterMetadata
} from 'draft-js';
const { NCIcon, NCModal, NCButton, NCTabs, NCUpload, NCFormControl } = base;
// import { INLINE_STYLES } from '../config/inline_type';
export default class AlignControls extends Component {
	constructor(props) {
		super(props);
	}
	setAlign = (type) => {
		const { editorState } = this.props;
		const TYPES = [ 'uf-align-left', 'uf-align-justify', 'uf-align-center', 'uf-align-right' ];
		let selectionState = editorState.getSelection(); //选择字段对象,focus or selected
		let anchorKey = selectionState.getAnchorKey(); // 获取block element key
		let currentContent = editorState.getCurrentContent();
		let currentContentBlock = currentContent.getBlockForKey(anchorKey);
		let curType = currentContentBlock.getType(),
			blockType = [];
		if (curType !== 'unstyled') {
			let arrType = curType.split(',');
			blockType = arrType.filter((item) => {
				return !TYPES.find((_item_) => _item_ === item);
			});
		}
		let TYPE = [ type ].concat(blockType);
		this.props.onChange(RichUtils.toggleBlockType(editorState, TYPE.join(',')));
	};
	render() {
		const { editorState } = this.props;
		const blockType = editorState
			.getCurrentContent()
			.getBlockForKey(editorState.getSelection().getStartKey())
			.getType();
		let disabled = blockType === 'unordered-list-item' || blockType === 'ordered-list-item' ? true : false;
		return (
			<div className="hrEditor-controls">
				{/* <StyleButton
					iconClassName={''}
					key={''}
					active={'uf-align-justify' === blockType}
					label={''}
					onToggle={this.setAlign}
					style={'uf-align-justify'}
				>
					<NCIcon type="uf-align-justify" />
                </StyleButton> */}
				<StyleButton
					iconClassName={''}
					key={''}
					disabled={disabled}
					active={'uf-align-left' === blockType}
					label={''}
					onToggle={this.setAlign}
					style={'uf-align-left'}
				>
					<NCIcon type="uf-align-left" />
				</StyleButton>
				<StyleButton
					iconClassName={''}
					key={''}
					disabled={disabled}
					active={'uf-align-center' === blockType}
					label={''}
					onToggle={this.setAlign}
					style={'uf-align-center'}
				>
					<NCIcon type="uf-align-center" />
				</StyleButton>
				<StyleButton
					iconClassName={''}
					key={''}
					disabled={disabled}
					active={'uf-align-right' === blockType}
					label={''}
					onToggle={this.setAlign}
					style={'uf-align-right'}
				>
					<NCIcon type="uf-align-right" />
				</StyleButton>
			</div>
		);
	}
}
