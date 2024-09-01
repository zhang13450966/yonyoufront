import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {high, getBusinessInfo} from 'nc-lightapp-front'
import HROrgTreeRef from '../../../refer/uapbd/HROrgTreeRef'

let {Refer} = high
import {getDefaultOrg, Maybe, getAppPageConfig} from '../../utils/utils'

const propTypes = {
    getOrgData: PropTypes.func,
}

const defaultProps = {
    getOrgData: () => {
    },
    getGroupID: () => {
    },
    showorg: true,
    isMultiSelectedEnabled: false,
    queryCondition: () => {
        return {}
    }
}

/**
 * 主组织 外部可能传来是否显示
 */
class orgRefer extends Component {
    constructor(props) {
        super(props);
        this.orgChange = this.orgChange.bind(this);
        this.judgeValue = this.judgeValue.bind(this);
    }

    // 判断传入的orgVal是否为空, 返回false
    judgeValue() {
        const {orgVal} = this.props;

        let result = false;

        if (orgVal !== null && typeof orgVal === 'object') {
            Object.keys(orgVal).forEach((item) => {
                if (orgVal[item]) {
                    result = true;
                }
            });
        }

        return result;
    }

    componentDidMount(nextProps) {
        if (!this.props.showEmpty) {
            if (this.judgeValue() === false) {
                // this.createCacheTmpl()
                if (this.props.delay === 'undefined') {
                    this.createCacheTmpl()
                }
                getDefaultOrg().then(res => {
                    this.manageOrgChange(res)
                    this.businessInfo = getBusinessInfo() || {groupId: '0001HR100000000005M3'}
                    this.props.getGroupID(this.businessInfo)
                })
            }
        }
    }

    // 初次加载控制组织变换
    manageOrgChange(res) {
        let animationId;
        let timeStart = new Date().getTime() // 设置阈值
        let delay = this.props.delay === 'undefined' ? false : true
        let orgChange = () => {
            let flag = delay ? true : this.getPageTmplCacaheStatus
            let refpk = Maybe.of(res.data).getValue(['pk_org'])
            let refname = Maybe.of(res.data).getValue(['org_Name'])
            if (flag && refpk) {
                this.orgChange({
                    refpk, refname
                })
                cancelAnimationFrame(animationId)
            } else {
                animationId = requestAnimationFrame(orgChange)
            }
        }
        animationId = requestAnimationFrame(orgChange)
    }

    // 清空原始模板缓存信息
    createCacheTmpl() {
        const {appcode} = getAppPageConfig()
        let regexp = new RegExp(`appTempletStorage_${appcode}_[^,]+`, 'g')
        let nameArr = Object.keys(localStorage).toString().match(regexp)
        if (nameArr) {
            for (let i of nameArr) {
                localStorage.removeItem(i)
            }
        }
    }

    // 获取当前模板是否已经加载完成
    getPageTmplCacaheStatus() {
        const {appcode} = getAppPageConfig()
        let regexp = new RegExp(`appTempletStorage_${appcode}_[^,]+`, 'g')
        return regexp.test(Object.keys(localStorage).toString())
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.orgVal !== nextProps.orgVal) {
            this.businessInfo = getBusinessInfo() || {groupId: '0001HR100000000005M3'}
            this.props.getGroupID(this.businessInfo)
        }
    }

    orgChange(value) {
        // TODO: 设置全局pk_org Object
        localStorage.setItem('cacheGlobalOrg', JSON.stringify(value))
        this.props.getOrgData(value, this.businessInfo)
    }

    render() {
        const {appcode} = getAppPageConfig();
        // delay 用于判断是否是延迟加载模板
        const {showorg, orgVal, disabled, isMultiSelectedEnabled, delay = false} = this.props
        return (
            <div
                className="header-refer"
                style={{display: showorg ? '' : 'none'}}
            >
                <HROrgTreeRef
                    value={orgVal}
                    onChange={this.orgChange}
                    disabled={disabled}
                    isMultiSelectedEnabled={isMultiSelectedEnabled}
                    queryCondition={
                        () => {
                            return Object.assign({
                                "AppCode": appcode,
                                "TreeRefActionExt": "nccloud.web.hr.sqlbuilder.HRPrimaryOrgSQLBuilder"
                            }, this.props.queryCondition())
                        }
                    }
                />
            </div>
        )
    }
}

orgRefer.propTypes = propTypes;
orgRefer.defaultProps = defaultProps;
export default orgRefer