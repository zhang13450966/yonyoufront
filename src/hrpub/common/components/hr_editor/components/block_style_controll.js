import React, { Component } from 'react';
import StyleButton from './style_button';
import { Menu, Dropdown } from 'antd';
import 'antd/dist/antd.css';
const { Item } = Menu;
export default class BlockStyleControls extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { editorState, BLOCK_TYPES } = this.props;
		const selection = editorState.getSelection();
		const blockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();
		let headerClassName = 'hrEditor-styleButton';
		if (/^header/.test(blockType)) {
			headerClassName += ' hrEditor-activeButton';
		}
		const groupItems = BLOCK_TYPES.map((type) => {
			if (type.subitems && type.subitems.length) {
				return (
					<Dropdown
						overlay={() => {
							return (
								<Menu>
									{type.subitems.map((item) => {
										return (
											<Item key={item.key} title={item.title}>
												<StyleButton
													iconClassName={item.iconClassName}
													key={item.key}
													active={item.styleName === blockType}
													label={item.label}
													onToggle={this.props.onToggle}
													style={item.styleName}
												/>
											</Item>
										);
									})}
								</Menu>
							);
						}}
					>
						<span className={headerClassName}>{type.label}</span>
					</Dropdown>
				);
			} else {
				return (
					<StyleButton
						iconClassName={type.iconClassName}
						key={type.key}
						active={type.styleName === blockType}
						label={type.label}
						onToggle={this.props.onToggle}
						style={type.styleName}
					/>
				);
			}
		});
		return <div className="hrEditor-controls">{groupItems}</div>;
	}
}
