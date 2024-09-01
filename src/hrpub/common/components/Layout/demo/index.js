import React, {Component} from 'react';

import Layout from '../index';

const {Header, Left, Content} = Layout;

class Demo extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Layout>
                <Header
                    {...this.props}
                    showOrgRefer={true}
                    showButtons={true}
                >
                    <div>自定义内容</div>
                </Header>
                <Left>
                    我是左侧内容
                </Left>
                <Content>
                    我是正文内容
                </Content>
            </Layout>
        );
    }
}

export default Demo;