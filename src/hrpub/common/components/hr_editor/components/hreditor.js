import React, { Component } from 'react';
import { Editor, RichUtils } from 'draft-js';
import { getBlockStyle, blockRenderMap } from '../config/block_type';
class HREditor extends Component {
	constructor(props) {
		super(props);
	}
	// ref 绑定
	setEditor = (editor) => {
		this.editor = editor;
	};
	// 相对固定的写法
	handleKeyCommand = (command, editorState) => {
		const newState = RichUtils.handleKeyCommand(editorState, command);
		if (newState) {
			this.onChange(newState);
			return 'handled';
		}
		return 'not-handled';
	};
	render() {
		const { editorState, onChange, styleMap, onBlur, mode } = this.props;
		const readOnly = mode === 'view' ? true : false;
		return (
			<Editor
				ref={this.setEditor}
				editorState={editorState}
				customStyleMap={styleMap}
				blockStyleFn={getBlockStyle}
				blockRenderMap={blockRenderMap()}
				onChange={onChange}
				onBlur={onBlur}
				handleKeyCommand={this.handleKeyCommand}
				spellCheck={true}
				readOnly={readOnly}
			/>
		);
	}
}
export default HREditor;
