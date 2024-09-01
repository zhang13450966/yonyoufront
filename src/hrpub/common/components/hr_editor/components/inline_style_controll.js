import React, { Component } from 'react';
import StyleButton from './style_button';
// import { INLINE_STYLES } from '../config/inline_type';
export default class InlineStyleControls extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { INLINE_STYLES, editorState } = this.props;
		const currentStyle = editorState.getCurrentInlineStyle();
		return (
			<div className="hrEditor-controls">
				{INLINE_STYLES.map((type) => {
					return (
						<StyleButton
							iconClassName={type.iconClassName}
							key={type.key}
							active={currentStyle.has(type.styleName)}
							label={type.label}
							onToggle={this.props.onToggle}
							style={type.styleName}
						/>
					);
				})}
			</div>
		);
	}
}
