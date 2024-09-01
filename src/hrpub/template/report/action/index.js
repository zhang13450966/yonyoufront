import CommonAction from '../../../common/components/reportQuery/action/index';


export default class ReportQuery extends CommonAction {
    constructor(props) {
        super(props);
    }

    appConfig={
        pagecode: 'ReportPage',// ReportPage
        appcode: ''
    }

    getAppCode = () => {
        let appCode = this.getSearchParam('c');
        this.appConfig.appcode = appCode;
    }

    // 初始化页面
    init = () => {
        this.getAppCode();
        this.getLanguage();
        this.getTemplate()
            .then(() => {
                let {paramMap} = this.comp.props.reportQuery.context;
                this.selectTree([paramMap['pk_report']], false);
            });
    }
}