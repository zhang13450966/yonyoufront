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
    props.use.form('leaveoff_approve_card')
    const {form, leaveoff, cardPagination} = props;

    return (
        <Layout
            className="employing-add-page"
        >
            <div className="bill-bg">
            <Header
                showOrgRefer={false}
                showButtons={false}
            >
                <div className="approve_title">{leaveoff.language['approve-00007']}{/* 销假单审批 */}</div>
            </Header>
            <Content>
                {form.createForm('leaveoff_approve_card', {})}
            </Content>
            </div>
        </Layout>
    );
});

export default connect(Wrapper);