//导出树表界面结构布局
export class NcBillTreeTable extends React.Component {
    static defaultProps = {
		pageConfig: {},
	}
    constructor(props){
        super(props);
    }
    render() {
        const { pageConfig } = this.props
        console.log('pageConfig',pageConfig)
        let {LeftDom, RightDom, defLeftWid, title, Buttons, modals} = pageConfig
        return (
            <div className="nc-bill-tree-table">
                {/* 头部 header*/}
                <div className="header">
                    {/*页面大图标*/}
                    {$nccPlatform.createPageIcon()}
                    {/* 标题 title*/}
                    <div className="title">{title}</div>
                    {/* 按钮组 btn-group*/}
                    <div className=" btn-group">
                        {Buttons instanceof Function ? Buttons() : Buttons}
                    </div>
                </div>
                {/* 树表区域 tree-table*/}
                <div className="tree-table">
                    <$appRoot.props.DragWidthCom
                        leftDom={LeftDom instanceof Function ? LeftDom() : LeftDom}     //左侧区域dom
                        rightDom={RightDom instanceof Function ? RightDom() : RightDom}     //右侧区域dom
                        defLeftWid={defLeftWid}      // 默认左侧区域宽度，px/百分百
                    />
                </div>
                {
                    modals instanceof Function ? modals() : modals
                }
            </div>
    
        )
    }
}
