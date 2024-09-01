import React, { Component } from 'react';
import StyleButton from './style_button';
import { base } from 'nc-lightapp-front';
const { NCIcon } = base;
// import { INLINE_STYLES } from '../config/inline_type';
export default class LinkControls extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="hrEditor-controls">
				<StyleButton
					iconClassName={''}
					key={''}
					active={''}
					label={''}
					onToggle={this.props.onToggle}
					style={''}
				>
					<NCIcon type="uf-link" />
				</StyleButton>
			</div>
		);
	}
}
