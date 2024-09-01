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
    props.use.form('overtime_approve_card')
    const {form, overtime, cardPagination} = props;

    return (
        <Layout
            className="employing-add-page"
        >
            <div className="bill-bg">
            <Header
                showOrgRefer={false}
                showButtons={false}
            >
                <div className="approve_title">{overtime.language['approve-00004']}{/* 加班单审批 */}</div>
            </Header>
            <Content>
                {form.createForm('overtime_approve_card', {})}
            </Content>
            </div>
        </Layout>
    );
});

export default connect(Wrapper);