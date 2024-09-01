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

    const {outside} = props;

    return (
        <div>
            <AddPage
                {...props}
            />

            {outside.fileManagerModalVisible && <FileManager
                language={outside.language}
                billId={outside.fileManagerBillId}
                onClose={action.mainAct.hideFileUploader}
            />}
        </div>
    );
})

export default createPage({})(HomePage);