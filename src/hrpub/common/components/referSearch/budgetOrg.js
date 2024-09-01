import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {getBusinessInfo} from 'nc-lightapp-front'
import BudgetHROrgTreeRef from 'src/hrp/refer/hrpref/BudgetHrOrgDefModel'
import {getDefaultOrg, Maybe, getAppPageConfig} from '../../utils/utils'

const localKey = 'cacheGlobalBudgetOrg'

const propTypes = {
    onChange: PropTypes.func,
}

const defaultProps = {
    value: null,// 参照值
    // 当参照值发生改变时函数
    onChange: () => {
    },
    showorg: true,
    disabled: false,//是否禁用
    // delay: false, //是否等待模板加载出来 在调用默认值  暂时去掉，因为个别节点不在本地保存模板信息
    isMultiSelectedEnabled: false,//是否多选
    queryCondition: () => {
        return {}
    }
}

/**
 * 主组织 外部可能传来是否显示
 */
class BudgetHrOrgRefer extends Component {
    constructor(props) {
        super(props);
        this.orgChange = this.orgChange.bind(this);
        this.isEmptyObject = this.isEmptyObject.bind(this);
    }

    // 判断传入的orgVal是否为空
    isEmptyObject(data) {
        // 如果不是对象返回ture
        if(typeof data !== 'object'){
            return true
        }

        return Object.keys(data).length === 0
    }

    componentDidMount() {
        this.createCacheTmpl()
        getDefaultOrg(localKey).then(res => {
            this.manageOrgChange(res)
        })
    }

    // 初次加载控制组织变换
    manageOrgChange(res) {
        let animationId;
        // let delay = this.props.delay;
        let orgChange = () => {
            // let flag = delay || this.getPageTmplCacaheStatus()
            let refpk = Maybe.of(res.data).getValue(['pk_org'])
            let refname = Maybe.of(res.data).getValue(['org_Name'])
            this.orgChange({
                refpk, refname
            })
            /*if (flag && refpk) {

                cancelAnimationFrame(animationId)
            } else {
                animationId = requestAnimationFrame(orgChange)
            }*/
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

    orgChange(value) {
        // 设置全局pk_org Object
        localStorage.setItem(localKey, JSON.stringify(value))
        this.props.onChange(value)
    }

    render() {
        // delay 用于判断是否是延迟加载模板
        const {showorg, value, disabled, isMultiSelectedEnabled} = this.props
        return (
            <div
                className="header-refer"
            >
                {showorg && <BudgetHROrgTreeRef
                    value={value}
                    onChange={this.orgChange}
                    disabled={disabled}
                    isMultiSelectedEnabled={isMultiSelectedEnabled}
                    queryCondition={
                        () => {
                            let queryConditionObj;
                            let queryCondition = typeof this.props.queryCondition;
                            if( queryCondition === 'function'){
                                queryConditionObj = this.props.queryCondition();
                            }
                            if(queryCondition === 'object'){
                                queryConditionObj = this.props.queryCondition
                            }
                            return queryConditionObj
                        }
                    }
                />}
            </div>
        )
    }
}

BudgetHrOrgRefer.propTypes = propTypes;
BudgetHrOrgRefer.defaultProps = defaultProps;
export default BudgetHrOrgRefer
