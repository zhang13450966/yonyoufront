import React, { Component } from 'react';
import StyleButton from './style_button';
import { Menu, Dropdown } from 'antd';
const { Item } = Menu;
export default class ColorControls extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectionClassName: 'hrEditor-styleButton'
		};
	}
	changeClassName = (currentStyle) => {
		const { COLOR_STYLES } = this.props;
		const itemObj = COLOR_STYLES.find((type) => {
			return currentStyle.has(type.styleName);
		});
		return itemObj ? 'hrEditor-styleButton hrEditor-activeButton ' + itemObj.styleName : 'hrEditor-styleButton';
	};
	render() {
		const { COLOR_STYLES, editorState } = this.props;
		const currentStyle = editorState.getCurrentInlineStyle();
		// console.log(currentStyle.toJS());
		const selectionClassName = this.changeClassName(currentStyle);
		return (
			<div className="hrEditor-controls">
				<Dropdown
					overlay={() => {
						return (
							<Menu>
								{COLOR_STYLES.map((type) => {
									return (
										<Item key={type.key} title={type.title} styleName={type.styleName}>
											<StyleButton
												iconClassName={type.iconClassName}
												key={type.key}
												active={currentStyle.has(type.styleName)}
												label={type.label}
												onToggle={this.props.onToggle}
												style={type.styleName}
											/>
										</Item>
									);
								})}
							</Menu>
						);
					}}
				>
					<span className={selectionClassName}>T</span>
				</Dropdown>
			</div>
		);
	}
}
