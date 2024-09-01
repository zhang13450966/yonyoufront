import React, { Component } from 'react';
import StyleButton from './style_button';
import { base } from 'nc-lightapp-front';
const { NCIcon } = base;
// import { INLINE_STYLES } from '../config/inline_type';
export default class UndoRedoControls extends Component {
	constructor(props) {
		super(props);
	}
	undo = () => {
		this.props.onToggle('undo');
	};
	redo = () => {
		this.props.onToggle('redo');
	};
	render() {
		const { editorState } = this.props;
		let undo_stack = editorState.getUndoStack(),
			redo_stack = editorState.getRedoStack();
		return (
			<div className="hrEditor-controls">
				<StyleButton
					iconClassName={''}
					key={''}
					active={''}
					label={''}
					onToggle={this.undo}
					style={''}
					disabled={undo_stack.size ? false : true}
				>
					<NCIcon type="uf-back" />
				</StyleButton>
				<StyleButton
					iconClassName={''}
					key={''}
					active={''}
					label={''}
					onToggle={this.redo}
					style={''}
					disabled={redo_stack.size ? false : true}
				>
					<NCIcon type="uf-repeat" />
				</StyleButton>
			</div>
		);
	}
}
