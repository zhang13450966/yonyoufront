import {getAppPageConfig} from 'src/hrpub/common/utils/utils'
export default class MainAction {
    constructor(comp){
        this.comp = comp
        this.comp.props.use.editTable('orgprolist')
        
    }
    //获取模版
    getTemplate = ()=> {
        const {props} = this.comp
        const {createUIDom,button,meta} = props
        createUIDom(this.appConfig,(data)=>{
            meta.setMeta(data.template || [])
            button.setButtons(data.button || [])
            this.getMulitiLange()
        })
    }
    //获取多语
    getMulitiLange = () =>{
        const {props} = this.comp
        const {MultiInit,dispatch} = props
        MultiInit.getMultiLang({
            moduleId: 'orgmap',
            domainName: 'hrpub',
            callback: (json,status,init) =>{
                dispatch({
                    type: 'enterpriseGroup/update',
                    payload: {
                        json : json
                    } 
                })
                this.initMeta()
            }
        })
    }
    initMeta = () => {
        const {action, props} = this.comp
        const {enterpriseGroup, dispatch, meta} = props
        let template = meta.getMeta()
        const {json} = enterpriseGroup
        const {tableAction} = action
        let items = template.orgprolist.items
        items.push({
            attrcode: 'handleArea',
            itemtype: 'customer',
            hyperlinkflag: false,
            label: json['orgmap-000046'], // 操作
            width: '180px',
            textAlign: 'center',
            visible: true,
            fixed: 'right',
            render(text, record, index) {
                return (
                    <div>
                        {/* 编辑 */}
                        <span style={{color: '#0073E1', cursor: 'pointer',marginRight: '12px'}}
                            onClick={tableAction.editInTable.bind(this, record)}
                        >
                            {json['orgmap-000215']}
                        </span>
                        {/* 删除 */}
                        <span style={{color: '#0073E1', cursor: 'pointer',marginRight: '12px'}}
                            onClick={tableAction.deleteInTable.bind(this, record)}
                        >
                            {json['orgmap-000039']}
                        </span>
                        {/* 停用 */}
                        <span style={{color: '#0073E1', cursor: 'pointer'}}
                            onClick={tableAction.disableOrEnableInTable.bind(this, record)}
                        >
                            {/* 停用 启用 */}
                            {record.values.enablestate.value === '2' ? json['orgmap-000248'] : json['orgmap-000249']}
                        </span>
                    </div>
                )
            }
        })
        meta.setMeta(template)
        this.showTableAndData(action, dispatch, enterpriseGroup)
    }
    // 展示列表并显示数据
    showTableAndData (action, dispatch, enterpriseGroup) {
        dispatch({
            type: 'enterpriseGroup/update',
            payload: {
                shwoTable : true
            } 
        })
        action.tableAction.getMainTableData(enterpriseGroup.isApply, enterpriseGroup.pageInfo)
    }
    didMount = () => {
        if (window.location.href.match('localhost:3006')) {
            window.location.hash = '#/ifr?page=2019815105156114'
        }
        this.appConfig = getAppPageConfig()
        this.getTemplate()
        
    }
}