import React, { useState } from "react";
import DCTab from "../../public/components/DCTab";

function ReportTab({ tabMap, onTabClick }) {
    if (!tabMap.tabs || tabMap.tabs.length < 2) return null;

    const { activeKey, tabs } = tabMap;

    const [key, setKey] = useState(activeKey);

    function tabOnClick(key) {
        setKey(key);
        onTabClick(key);
    }

    return (
        <div className="report-tab-container">
            <DCTab
                tabOnClick={tabOnClick}
                defaultActive={key}
                tab={tabs}
                showTool={true}
                toolOnClick={(e, item, data) => tabOnClick(data.key)}
            ></DCTab>
        </div>
    );
}

function areEqual(prevProps, nextProps) {
    const prevTab = prevProps.tabMap || {};
    const nextTab = nextProps.tabMap || {};
    if (prevTab.activeKey === nextTab.activeKey) {
        return true;
    } else {
        return false;
    }
}

export default React.memo(ReportTab, areEqual);
