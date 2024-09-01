import React from 'react';
import './index.less';

import config from './config';

const {
    actions,
    methods: {
        render,
        connect
    },
    components: {
        Layout
    }
} = config;

const {Header,Content} = Layout;

const Wrapper = render({
    actions: actions
})(({props, action, state}) => {
    props.use.form('leave_approve_card')
    const {form, leave, cardPagination, button} = props;
    const { btnAct } = action

    return (
        <Layout
            className="employing-add-page"
        >
           <div className="bill-bg">
           <Header
                showOrgRefer={false}
                showButtons={true}
                button={button}
                buttonOptions={{
                    area: 'head', //如果页面中的有多个区域有按钮，这里的area当做筛选条件，只渲染按钮的后台数据中area字段为这里指定值的按钮；
                    onButtonClick: (props, btncode) => {
                        btnAct.fileManager()
                    }// 按钮的点击事件
                }}
            >
                <div className="approve_title">{leave.language['approve-00003']}{/* 休假单审批 */}</div>
            </Header>
            <Content>
                {form.createForm('leave_approve_card', {})}
            </Content>
           </div>
        </Layout>
    );
});

export default connect(Wrapper);