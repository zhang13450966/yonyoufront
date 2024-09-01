import ReactDOM from 'react-dom';
import {createPage, base, ajax, toast} from 'nc-lightapp-front';
import ChildDef from 'src/hrpub/defdoc/defdoc_glb/main/'
let param = {
    defdocCond : "nccloud.web.hrhi.defdoc.sqlbuilder.HRPubDefdocRefSqlBuilder",
    jsonConfig :{
        moduleId :"hrpub",
        domainName :"hrpub",
        code: 'hrpub-000101'
    }
}
ReactDOM.render(<ChildDef params={param}/>, document.querySelector('#app'));