/*
 * @Descripttion: 
 * @Author: huanggqk
 * @Date: 2021-06-07 17:20:42
 * @LastEditTime: 2021-08-05 14:06:37
 */
import {high,toast} from 'nc-lightapp-front';
const {Refer} = high;
import _ from 'lodash';
import moment from 'moment';

@Refer.MultiLangWrapper
class AccPeriodUFOERefRefer extends Refer.PopRefer {
    constructor(props) {
        super(props);
        window._irefer = this;

        let _show = this.show;
        this.show = async (...args) => {
            console.log($appRoot.state.json['public_lang-000000'],this.props);/* 国际化处理： 参照打开*/
            let {queryCondition} = this.props;
            let stop = false;
            let queryConditions;
            if(typeof queryCondition === "function"){
                queryConditions = queryCondition();
            }else{
                queryConditions = queryCondition;
            }
            if(!queryConditions.pk_accperiodscheme){
                $nccPlatform.toast({
                    color: 'warning',
                    content: $appRoot.state.json['public_lang-000001'],/* 国际化处理： 必须先选择会计期间方案*/
                })
                return ()=>{}
            }
            
            let { refType, rootNode, pageSize, isMultiSelectedEnabled, isTreelazyLoad } = this.props;
            let param = this.__getParam({
                pid: isTreelazyLoad ? rootNode.refpk : '',
                pageInfo: {
                    pageSize,
                    pageIndex: -1,
                },
                keyword: '',
            });

            let refname
            try {
                refname = this.getTrueValue().refname;
            } catch (e) {}

            let res = await this.loadTreeData(param);
            let rows = _.get(res, 'rows') || [];

            if (refname) {
                let year = moment(refname).format('YYYY')
                let node = rows.find(it => _.get(it, 'values.periodyear.value') === year);
                if (node) {
                    let pk = _.get(node, 'refpk');
                    await this.setState({selectedKeys: [pk]});
                }
            }

            return _show(...args);
        }
    }
}
export{AccPeriodUFOERefRefer}