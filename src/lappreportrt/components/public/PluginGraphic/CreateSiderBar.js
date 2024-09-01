import React from "react";
import CreateBill from "./CreateBill";
import CreateReport from "./CreateReport";
import CreateGraphic from "./CreateGraphic";
import { WEB_DRILL_TYPE } from "./constans";

function CreateSiderBar(props) {
    //根据props.params.webDrillType 渲染不同的
    const { params = {}, reportData, onPagerChange, toggleHandler, getRealCount } = props;
    switch (params.webDrillType) {
        case WEB_DRILL_TYPE.bill:
            return <CreateBill params={params} />;
        case WEB_DRILL_TYPE.report:
            return (
                <CreateReport
                    params={params}
                    reportData={reportData}
                    onPagerChange={onPagerChange}
                    toggleHandler={toggleHandler}
                    getRealCount={getRealCount}
                />
            );
        default:
            return <CreateGraphic {...props} />;
    }
}

export default CreateSiderBar;
