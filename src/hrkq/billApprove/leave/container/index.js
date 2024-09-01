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

    const {leave} = props;

    return (
        <div>
            <AddPage 
                {...props}
            />
            {
                leave.fileManagerModalVisible && <FileManager
                language={leave.language}
                billId={leave.fileManagerBillId}
                onClose={action.mainAct.hideFileUploader}
            />
            }
        </div>
    );
})

export default createPage({})(HomePage);