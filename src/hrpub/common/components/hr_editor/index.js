import React, { Component } from 'react';
import { toast, getMultiLang } from 'nc-lightapp-front';
import PropTypes from 'prop-types';
import { Modal, Button, Input } from 'antd';
import Immutable from 'immutable';
import {
	RichUtils,
	SelectionState,
	CompositeDecorator,
	ContentState,
	convertFromRaw,
	EditorState,
	convertFromHTML,
	convertToRaw,
	Modifier
} from 'draft-js';
import { stateToHTML } from './components/convertToHTML';
// components
import BlockStyleControls from './components/block_style_controll';
import InlineStyleControls from './components/inline_style_controll';
import ColorControls from './components/color_controll';
import LinkControls from './components/link_controll';
import UndoRedoControls from './components/undo_redo_controll';
import ImageControls from './components/image_controll';
import AlignControls from './components/align_controll';
import HREditor from './components/hreditor';
// config file
import { INLINE_STYLES, InlineStyleMap } from './config/inline_type';
import { COLOR_STYLES, ColorStyleMap } from './config/color_type';
import { BLOCK_TYPES } from './config/block_type';
import decorator from './config/decorator';
import './index.less';
import { getColor, isBlackBg } from '../../utils/utils';
class HrEditor extends Component {
	static defaultProps = {
		BLOCK_TYPES,
		INLINE_STYLES,
		COLOR_STYLES,
		styleMap: Object.assign({}, InlineStyleMap, ColorStyleMap),
		defaultContent: ''
	};
	constructor(props) {
		super(props);
		this.state = {
			editorState: EditorState.createEmpty(decorator),
			showModal4Link: false,
			showModal4Image: false,
			showAddLinkInput: false,
			linkurl: '',
			lang: {}
		};
	}
	componentDidMount() {
		const { defaultContent, mode } = this.props;
		let hasDef = !defaultContent ? false : true;
		// console.log(
		getMultiLang({
			moduleId: 'hrpub',
			domainName: 'hrpub',
			callback: (json, status, init) => {
				this.setState({
					lang: json
				});
			}
		});
		// );
		// console.log(this.state.lang);
		// this.setValueByHtml('<div style="text-align:center;padding:20px;color:#f00;"><b>块级元素对齐方式调试</b></div>');
		if (hasDef) {
			let content = JSON.parse(defaultContent).map;
			this.setState({
				editorState: EditorState.moveSelectionToEnd(
					EditorState.createWithContent(convertFromRaw(content), decorator)
				)
			});
		}
		if (isBlackBg()) {
			let head = document.getElementsByTagName('head')[0],
				style = document.createElement('style');
			let bg = getColor().bgColor;
			let borderColor = '#39393f';
			let css = `.hrEditor-root{
                    background: ${bg};
                    border: 1px solid ${borderColor};
				}
				.hrEditor-editor {
	                border-top: 1px solid ${borderColor};}`;
			style.type = 'text/css';
			if (style.styleSheet) {
				style.styleSheet.cssText = css;
			} else {
				style.appendChild(document.createTextNode(css));
			}
			head.appendChild(style);
		}
	}
	componentDidUpdate(prevProps, prevState, span) {
		const { defaultContent } = this.props;
		if (defaultContent !== prevProps.defaultContent) {
			try {
				let content = JSON.parse(defaultContent).map;
				content.blocks.forEach((item) => {
					item.text = decodeURIComponent(item.text);
				});
				this.setState({
					editorState: EditorState.moveSelectionToEnd(
						EditorState.createWithContent(convertFromRaw(content), decorator)
					)
				});
			} catch (e) {}
		}
	}
	// change event
	onChange = (editorState) => {
		// console.log(editorState.getCurrentContent().getEntity(1));
		this.setState({ editorState });
	};
	// 控制block Element buttons
	toggleBlockType = (type) => {
		const { editorState } = this.state;
		const TYPES = [
			'header-one',
			'header-two',
			'header-three',
			'header-four',
			'header-five',
			'header-six',
			'paragraph',
			'unordered-list-item',
			'ordered-list-item',
			'blockquote',
			'code-block'
			// 'atomic'
		];
		let selectionState = editorState.getSelection(); //选择字段对象,focus or selected
		let anchorKey = selectionState.getAnchorKey(); // 获取block element key
		let currentContent = editorState.getCurrentContent();
		let currentContentBlock = currentContent.getBlockForKey(anchorKey);
		let curType = currentContentBlock.getType(),
			blockType = [];
		if (curType !== 'unstyled') {
			let arrType = curType.split(',');
			let _blockType = arrType.filter((item) => {
				return !TYPES.find((_item_) => _item_ === item);
			});
			blockType = _blockType.filter((_block) => {
				return type !== _block;
			});
		}
		let TYPE = [ type ].concat(blockType);
		this.onChange(RichUtils.toggleBlockType(this.state.editorState, TYPE.join(',')));
	};
	// 控制inline Element buttons
	toggleInlineStyle = (inlineStyle) => {
		this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle));
	};
	// 控制文字颜色
	toggleColor = (toggledColor) => {
		const { editorState } = this.state;
		// let contentState = editorState.getCurrentContent();
		const selection = editorState.getSelection();

		// Let's just allow one color at a time. Turn off all active colors.
		const nextContentState = Object.keys(ColorStyleMap).reduce((contentState, color) => {
			return Modifier.removeInlineStyle(contentState, selection, color);
		}, editorState.getCurrentContent());

		let nextEditorState = EditorState.push(editorState, nextContentState, 'change-inline-style');

		const currentStyle = editorState.getCurrentInlineStyle();

		// Unset style override for current color.
		if (selection.isCollapsed()) {
			nextEditorState = currentStyle.reduce((state, color) => {
				return RichUtils.toggleInlineStyle(state, color);
			}, nextEditorState);
		}

		// If the color is being toggled on, apply it.
		if (!currentStyle.has(toggledColor)) {
			nextEditorState = RichUtils.toggleInlineStyle(nextEditorState, toggledColor);
		}
		this.onChange(nextEditorState);
	};
	// 初始化addlink弹窗数据
	toggleLink = () => {
		const { editorState, lang } = this.state;
		const selection = editorState.getSelection();
		if (!selection.isCollapsed()) {
			const contentState = editorState.getCurrentContent();
			const startKey = editorState.getSelection().getStartKey();
			const startOffset = editorState.getSelection().getStartOffset();
			const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
			const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);
			let linkurl = '';
			if (linkKey) {
				const linkInstance = contentState.getEntity(linkKey);
				linkurl = linkInstance.getData().url;
			}
			const { showModal4Link } = this.state;
			this.setState({
				showModal4Link: !showModal4Link,
				linkurl
			});
		} else {
			toast({
				color: 'worning',
				content: lang['hrpub-000139']
			});
		}
	};
	// 切换输入框视图
	showAddInput = () => {
		this.setState(
			{
				showAddLinkInput: true
			},
			() => {
				this.refs.linkinput.focus();
			}
		);
	};
	confirmLink = (e) => {
		e.preventDefault();
		const { editorState, linkurl } = this.state;
		const contentState = editorState.getCurrentContent();
		const contentStateWithEntity = contentState.createEntity('LINK', 'MUTABLE', { url: linkurl });
		const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
		const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
		const state = RichUtils.toggleLink(newEditorState, newEditorState.getSelection(), entityKey);
		this.setState(
			{
				editorState: state
			},
			() => {
				this.closeModal4Link();
			}
		);
	};
	onLinkInputKeyDown = (e) => {
		if (e.which === 13) {
			this.confirmLink(e);
		}
	};
	linkurlChange = (e) => {
		this.setState({
			linkurl: e.target.value
		});
	};
	removeLink = (e) => {
		e.preventDefault();
		const { editorState } = this.state;
		const selection = editorState.getSelection();
		if (!selection.isCollapsed()) {
			const contentState = editorState.getCurrentContent();
			const startKey = editorState.getSelection().getStartKey();
			const startOffset = editorState.getSelection().getStartOffset();
			const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
			const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);
			if (linkKey) {
				this.closeModal4Link();
			} else {
				this.setState(
					{
						editorState: RichUtils.toggleLink(editorState, selection, null)
					},
					() => {
						this.closeModal4Link();
					}
				);
			}
		}
	};
	closeModal4Link = () => {
		const { editorState } = this.state;
		this.setState({
			editorState: EditorState.forceSelection(editorState, editorState.getSelection()),
			showModal4Link: false,
			linkurl: '',
			showAddLinkInput: false
		});
	};
	undoRedo = (type) => {
		const { editorState } = this.state;
		let newState = '';
		if (type === 'undo') {
			if (editorState.getUndoStack().size === 0) {
				return;
			}
			newState = EditorState.undo(editorState);
		}
		if (type === 'redo') {
			if (editorState.getRedoStack().size === 0) {
				return;
			}
			newState = EditorState.redo(editorState);
		}
		this.setState({
			editorState: newState
		});
	};
	// 增加字符串方法
	addText = (text) => {
		if (!text) return;
		const { editorState } = this.state;
		// const { content } = this.props;
		let selectionState = editorState.getSelection(); //选择字段对象,focus or selected
		let anchorKey = selectionState.getAnchorKey(); // 获取block element key
		let currentContent = editorState.getCurrentContent();
		let currentContentBlock = currentContent.getBlockForKey(anchorKey); // 定位block element
		let focusOffset = selectionState.getFocusOffset();
		let curTxt = currentContentBlock.getText();
		let newTxt = curTxt.slice(0, focusOffset) + text + curTxt.slice(focusOffset);
		let newContent = currentContent.setIn([ 'blockMap', anchorKey, 'text' ], newTxt); //setIn可以数组形式的层级关系直接设值|setIn是Immutable.js方法
		// state无法直接修改,所以通过merge方式修改并赋值给新的变量
		let upselectionState = selectionState.merge({
			focusOffset: selectionState.getFocusOffset() + text.length,
			anchorOffset: selectionState.getAnchorOffset() + text.length
		});
		// 更新selectionState数据,此处合并了变更的editorState和selectionState
		let state = EditorState.forceSelection(
			EditorState.createWithContent(convertFromRaw(convertToRaw(newContent))),
			upselectionState
		);
		this.setState({
			editorState: state
		});
	};
	// 获取editor value
	getValues = () => {
		const { editorState } = this.state;
		const styleMap = this.props.styleMap;
		const options = {
			inlineStyles: {
				BOLD: {
					element: 'strong',
					style: styleMap['BOLD']
				},
				DELETE: {
					element: 'span',
					style: styleMap['DELETE']
				},
				ITALIC: {
					element: 'em',
					style: styleMap['ITALIC']
				},
				UNDERLINE: {
					element: 'span',
					style: styleMap['UNDERLINE']
				}
			},
			inlineStyleFn: (styles) => {
				let key = 'color-';
				let color = styles.filter((value) => value.startsWith(key)).first();
				if (color) {
					return {
						element: 'span',
						style: this.props.styleMap[color]
					};
				}
			},
			// blockRenderers: {
			// 	atomic: (block) => {
			// 		let data = block.getData();
			// 		if (data.get('foo') === 'bar') {
			// 			return '<div>' + escape(block.getText()) + '</div>';
			// 		}
			// 	}
			// },
			// blockRenderMap: Immutable.Map({
			// 	'header-two': {
			// 		element: 'h2',
			// 		data: {
			// 			style: {
			// 				fontSize: 24
			// 			}
			// 		}
			// 	}
			// }),
			defaultBlockTag: 'div',
			blockStyleFn: (block) => {
				if (block.getData().get('color')) {
					return {
						style: {
							color: block.getData().get('color')
						}
					};
				}
			}
		};
		// console.log(editorState.getCurrentContent().getBlocksAsArray());
		let mapData = convertToRaw(editorState.getCurrentContent());
		// text encoding
		mapData.blocks.forEach((item) => {
			item.text = encodeURIComponent(item.text);
		});
		let res = {
			html: stateToHTML(editorState.getCurrentContent(), options),
			// map: convertToRaw(editorState.getCurrentContent())
			map: mapData
		};
		return JSON.stringify(res);
	};

	/**
     * 设置editor value

     html=  '<b>Bold text</b>, <i>Italic text</i><br/ ><br />' +
     '<a href="http://www.facebook.com">Example link</a><br /><br/ >' +
     '<img src="image.png" height="112" width="200" />'

     */
	setValueByHtml = (html) => {
		const blocksFromHTML = convertFromHTML(html);
		const state = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
		this.setState({
			editorState: EditorState.createWithContent(state, decorator)
		});
	};

	/**
     * 有内容返回 true 无内容返回 false
     * @returns {*|boolean}
     */
	isCheck = () => {
		const { editorState } = this.state;
		let { blocks, entityMap } = convertToRaw(editorState.getCurrentContent());
		let blockContent = blocks.some((item) => {
			let text = item.text.trim();
			return text.length > 0;
		});
		let imgBlock = Object.keys(entityMap).some((key) => {
			let item = entityMap[key];
			return item.type === 'image';
		});
		return blockContent || imgBlock;
	};

	// 清空editor value
	clearEditor = () => {
		this.setState({
			editorState: EditorState.moveSelectionToEnd(EditorState.createEmpty())
		});
	};

	render() {
		const { editorState, lang } = this.state;
		const { mode } = this.props;
		let className = mode && mode === 'view' ? 'hrEditor-root hrEditor-preview' : 'hrEditor-root hrEditor-edit';
		return (
			<div className={className} style={{ height: this.props.height }}>
				<header style={{ display: mode === 'view' ? 'none' : 'flex' }}>
					<InlineStyleControls editorState={editorState} onToggle={this.toggleInlineStyle} {...this.props} />
					<BlockStyleControls editorState={editorState} onToggle={this.toggleBlockType} {...this.props} />
					<AlignControls editorState={editorState} onChange={this.onChange} />
					<ColorControls editorState={editorState} onToggle={this.toggleColor} {...this.props} />
					<LinkControls editorState={editorState} onToggle={this.toggleLink} {...this.props} />
					{/* {<ImageControls editorState={editorState} {...this.props} lang={lang} />} */}
					<UndoRedoControls editorState={editorState} {...this.props} onToggle={this.undoRedo} />
				</header>
				<div className="hrEditor-editor">
					<HREditor editorState={editorState} onChange={this.onChange} {...this.props} mode={mode} />
				</div>
				<div className="hr-modals">
					<Modal
						title={`${lang['hrpub-000141']}${lang['hrpub-000077']}${lang['hrpub-000142']}`}
						centered
						visible={this.state.showModal4Link}
						cancelText={lang['hrpub-000047']}
						okText={lang['hrpub-000055']}
						onOk={this.confirmLink}
						onCancel={this.closeModal4Link}
					>
						<div style={{ display: !this.state.showAddLinkInput ? 'block' : 'none' }}>
							<Button type="primary" onClick={this.showAddInput}>
								{`${lang['hrpub-000141']}${lang['hrpub-000142']}`}
							</Button>
							<Button style={{ marginLeft: '20px' }} type="danger" onClick={this.removeLink}>
								{`${lang['hrpub-000077']}${lang['hrpub-000142']}`}
							</Button>
						</div>
						<div style={{ display: this.state.showAddLinkInput ? 'block' : 'none' }}>
							<Input
								ref="linkinput"
								value={this.state.linkurl}
								onKeyDown={this.onLinkInputKeyDown}
								onChange={this.linkurlChange}
							/>
						</div>
					</Modal>
				</div>
			</div>
		);
	}
}
HrEditor.propTypes = {
	BLOCK_TYPES: PropTypes.object,
	INLINE_STYLES: PropTypes.object,
	COLOR_STYLES: PropTypes.object,
	styleMap: PropTypes.object,
	defaultContent: PropTypes.string
};
export default HrEditor;
