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
    props.use.form('tripoff_approve_card')
    const {form, tripoff, cardPagination} = props;

    return (
        <Layout
            className="employing-add-page"
        >
            <div className="bill-bg">
            <Header
                showOrgRefer={false}
                showButtons={false}
            >
                <div className="approve_title">{tripoff.language['approve-00006']}{/* 销差单审批 */}</div>
            </Header>
            <Content>
                {form.createForm('tripoff_approve_card', {})}
            </Content>
            </div>
        </Layout>
    );
});

export default connect(Wrapper);