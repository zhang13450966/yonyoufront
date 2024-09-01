import React, {Component} from 'react';

import './index.less';

import HROrgReger from '../../../../../hrpub/common/components/referSearch/org';
/**
 * 
 * 
 * showOrgRefer = true,// 现实组织人力资源组织参照，默认显示
 * orgReferOptions, // 人力资源组织的配置详细
 * button,// button对象
 * showButtons = true, 现实按钮
 * buttonOptions, 创建按钮的参数
 * customButton, 用户自定义按钮，放在createButtonApp后面
 * 
 */
class Header extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            showOrgRefer = true,
            orgReferOptions,
            button,
            showButtons = true,
            buttonOptions,
            children,
            className,
            style,
            customButton
        } = this.props;

        return (
            <div 
                className={`layout-header-content header ${className || ''}`}
                style={style || {}}
            >
                <div className="layout-header-org-wrapper">
                    {
                        showOrgRefer && 
                        <HROrgReger 
                            {...orgReferOptions}
                        />
                    }
                </div>
                <div className="layout-header-customer-content">
                    {children}
                </div>
                <div className="layout-header-button-wrapper btn-group">
                    {showButtons && button.createButtonApp(buttonOptions)}
                    {customButton && React.isValidElement(customButton) && customButton}
                </div>
            </div>
        );
    }
}

export default Header;