export class NcBillTreeCard extends React.Component{
    static defaultProps = {
        pageConfig: {},
    };
    constructor(props){
        super(props);
    };

    render() {
        const {pageConfig} = this.props;
        const {DragWidthCom} =$appRoot.props;
        let {LeftDom, RightDom, defLeftWid, title, Buttons} = pageConfig;

        return (
            <div className="nc-bill-tree-card">
                {/* 头部 header*/}
                <div className="header">
                    {/*页面大图标*/}
                    {$nccPlatform.createPageIcon()}
                    {/* 标题 title*/}
                    <div className="title">{title}</div>
                    {/* 按钮组 btn-group*/}
                    <div className=" btn-group">
                        {/*<Buttons />*/}
                        {Buttons instanceof Function ? Buttons() : Buttons}
                    </div>
                </div>
                {/* 树卡区域 */}
                <div className="tree-card">
                    <DragWidthCom
                        // leftDom={leftDom}
                        // rightDom={rightDom}
                        // defLeftWid='20%'
                        leftDom={LeftDom instanceof Function ? LeftDom() : LeftDom}     //左侧区域dom
                        rightDom={RightDom instanceof Function ? RightDom() : RightDom}     //右侧区域dom
                        defLeftWid={defLeftWid}      // 默认左侧区域宽度，px/百分百
                    />
                </div>
            </div>
        );
    }
}
