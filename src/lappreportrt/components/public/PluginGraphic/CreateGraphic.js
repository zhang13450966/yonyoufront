/**
 * 侧边栏图形组件
 * 根据pk_storyboard 分析参数analysis_params  行数据reportRowData 进行刷新
 */

import React from "react";
import GraphicReport from "@components/Graphic";

function CreateGraphic({ params = {} }) {
    //根据props.params.webDrillType 渲染不同的

    return <GraphicReport params={params} />;
}

function areEqual(prevProps, nextProps) {
    const prevParams = prevProps.params || {};
    const nextParams = nextProps.params || {};
    if (
        prevParams.ts === nextParams.ts &&
        prevParams.pk_storyboard === nextParams.pk_storyboard &&
        JSON.stringify(prevParams.analysis_params) ===
            JSON.stringify(nextParams.analysis_params) &&
        prevParams.reportRowData === nextParams.reportRowData
    ) {
        console.log("graphic不刷新");
        return true;
    } else {
        console.log("graphic刷新");
        return false;
    }
}

export default React.memo(CreateGraphic, areEqual);
