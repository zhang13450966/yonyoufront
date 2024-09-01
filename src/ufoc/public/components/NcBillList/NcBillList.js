export class NcBillList extends React.Component{
    static defaultProps = {
        pageConfig: {},
    };
    constructor(props){
        super(props);
    };

    render() {
        const {pageConfig} = this.props;
        const NCTabsControl = $nccPlatform.base.NCTabsControl;
        let {clickFun, Search, title, Buttons,SimpleTable,SimpleTableId} = pageConfig;

        return (
            <div className="nc-bill-list">
                <div className="nc-bill-header-area">
                    <div className="header-title-search-area">
                        {/*页面大图标*/}
                        {$nccPlatform.createPageIcon()}
                        <h2 className="title-search-detail">{title}</h2>
                    </div>
                    <div className="header-button-area">
                        {/*<Buttons />*/}
                        {Buttons instanceof Function ? Buttons() : Buttons}
                    </div>
                </div>
                <div className="nc-bill-search-area">
                    {/*<Search />*/}
                    {Search instanceof Function ? Search() : Search}

                </div>
                <div className="tab-definInfo-area">
                    <NCTabsControl defaultKey={0}>
                        <div key={0} clickFun={clickFun && clickFun[0]}>
                            {$appRoot.state.json['public_lang-000133']}{/* 国际化处理： 已审批*/}
                        </div>
                        <div key={1} clickFun={clickFun && clickFun[1]}>
                            {$appRoot.state.json['public_lang-000134']}{/* 国际化处理： 已完成*/}
                        </div>
                        <div key={2} clickFun={clickFun && clickFun[2]}>
                            {$appRoot.state.json['public_lang-000135']}{/* 国际化处理： 未审批*/}
                        </div>
                    </NCTabsControl>
                </div>
                <div className="nc-bill-table-area">
                    {/*<SimpleTable />*/}
                    {/*{SimpleTable instanceof Function ? SimpleTable() : SimpleTable}*/}
                    {$appRoot.props.table.createSimpleTable(SimpleTableId, {adaptionHeight: true})}
                </div>
            </div>
        );
    }
}
