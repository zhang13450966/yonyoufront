import React from 'react';

import './index.less';

// 页面配置信息配置
import pageConfig from './config';

const {
    components: {
        AddPage, 
        FileManager
    },
    actions,
    methods: {
        createPage,
        render
    }
} = pageConfig;


const HomePage = render({
    actions: actions
})(({props, action, state}) => {

    const {overtime} = props;

    return (
        <div>
            <AddPage 
                {...props}
            />
            <If condition={overtime.fileManagerModalVisible}>
                <FileManager
                    language={overtime.language}
                    billId={overtime.fileManagerBillId}
                    onClose={action.mainAct.closeModal.bind(this, 'fileManagerModalVisible')}
                />
            </If>
        </div>
    );
})

export default createPage({})(HomePage);