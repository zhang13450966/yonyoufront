import React, { Component } from 'react';
// from nc
import { base, high } from 'nc-lightapp-front';
// css
import './index.less';
// components

let { NCBackBtn } = base;

export default class extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        props.use.form(props.cardId)
    }

    render() {
        const {
            props,
            props: {
                lang,
                cardId,
                onBeforeEvent,
                onAfterEvent,
                onBack,
                onButtonClick,
                cancelPSwitch = true,
                button: { createButtonApp },
                form: { createForm },
                customButton,
                buttonArea
            }
        } = this;

        return (
            <div className="form-wrap">
                <div className="header">
                    <h2 className="title">
                        <NCBackBtn onClick={onBack} />
                        {props.title}
                    </h2>
                    {   customButton ? <div className="btn-group">
                            {createButtonApp({
                                area: buttonArea, //如果页面中的有多个区域有按钮，这里的area当做筛选条件，只渲染按钮的后台数据中area字段为这里指定值的按钮；
                                onButtonClick: (props, btncode) => {
                                    onButtonClick(props, btncode)
                                }// 按钮的点击事件
                            })}
                        </div> : ''}
                </div>

                {createForm(cardId, {
                    // 编辑前事件
                    onBeforeEvent: onBeforeEvent,
                    //编辑后事件
                    onAfterEvent: onAfterEvent,
                    // 取消 switch_browse 组件气泡提示
                    cancelPSwitch,
                    setVisibleByForm:true
                })}
            </div>
        );
    }
}
