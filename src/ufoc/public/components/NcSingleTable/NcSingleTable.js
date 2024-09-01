/*
 * @Author: chengya
 * @Description: Modify here please
 * @Date: 2021-01-26 20:18:09
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-09-01 11:02:20
 */
import './index';
export class NcSingleTable extends React.Component {
	static defaultProps = {
		pageConfig: {},
		mounted: () => {}
	};
	static layoutType = {
		default: 'default',
		//左树右主子表
		treeAnd2Table: 'left-tree-right-double-table',
		//左树右单表
		treeAndTable: 'left-tree-right-table',
		//左树右卡 （左侧树，右上查询区或表单，右下表格）
		treeAndCard: 'left-tree-right-card',
	}
	constructor(props) {
		super(props);
	}
	componentDidMount () {
		this.props.mounted()
	}
	render() {
		const { pageConfig } = this.props;
		let {
			title,
			Buttons,
			Search,
			Box,
			CheckBox,
			Input,
			bottomArea,
			modals,
			CallBackBtnArea,
			needIcon,
			form,
			FileManage,
			className = '',
			layoutType = NcSingleTable.layoutType.default
		} = pageConfig;

		return (
			<div className={`nc-single-table ${className} ${layoutType}`}>
				{/* 头部 header */}
				<div className="nc-singleTable-header-area" fieldid="list_header_area">
					{/* 标题 title */}
					<div className="header-title-search-area">
						{CallBackBtnArea instanceof Function ? CallBackBtnArea() : CallBackBtnArea}
						{/*页面大图标*/}
						{needIcon ? $nccPlatform.createPageIcon() : null}
						<h2 fieldid={title+"_title"} className="title-search-detail">{title}</h2>
						{/*除了h2标题外，小组件都要外层嵌套一个div且className命名为title-search-detail，如下*/}
						{/* 简单搜索  search-box*/}
						{Input ? (
							<div className="title-search-detail top-refer">
								{/*<NCInput value='简单搜索'/>*/}
								{Input instanceof Function ? Input() : Input}
							</div>
						) : null}

						{/* 显示停用  showOff*/}
						{CheckBox ? (
							<div className="title-search-detail">
								<span className="showOff">
									{/* <NCCheckbox> 显示停用 </NCCheckbox> */}
									{CheckBox instanceof Function ? CheckBox() : CheckBox}
								</span>
							</div>
						) : null}
						{/* 如果加的是参照，外层className里面要再加上ref 例子如下*/}
						{Box ? (
							<div className="title-search-detail ref">
								{/*<Box text='业务参照'/>*/}
								{Box instanceof Function ? Box() : Box}
							</div>
						) : null}
					</div>
					{/* 按钮区  btn-group */}
					<div className="header-button-area">
						{/*<Buttons />*/}
						{Buttons instanceof Function ? Buttons() : Buttons}
					</div>
				</div>

				{/*查询区*/}
				{Search ? (
					<div className="nc-singleTable-search-area">
						{/*<Search />*/}
						{Search instanceof Function ? Search() : Search}
					</div>
				) : null}

				{/*查询区*/}
				{form ? (
					<div className="nc-singleTable-search-area">
						{/*<Search />*/}
						{form instanceof Function ? form() : form}
					</div>
				) : null}

				{/* 列表区 */}
				<div className="nc-singleTable-table-area">
					{/*<Table />*/}
					{bottomArea instanceof Function ? bottomArea() : bottomArea}
					{/* {$appRoot.props.editTable.createEditTable(editTableId, {adaptionHeight: true})} */}
				</div>
				{modals instanceof Function ? modals() : modals}
				{FileManage instanceof Function ? FileManage() : FileManage}
			</div>
		);
	}
}
