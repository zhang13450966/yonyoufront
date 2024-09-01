import React, { useState } from "react";
import { base } from "nc-lightapp-front";

const { NCTooltip } = base;

export default function ToolContainer({
    overlay,
    placement = "bottomLeft",
    content,
}) {
    const [visible, changeVisible] = useState(false);

    return (
        <NCTooltip placement={placement} overlay={overlay} visible={visible}>
            <div
                onMouseOver={() => changeVisible(true)}
                onMouseOut={() => changeVisible(false)}
            >
                {content}
            </div>
        </NCTooltip>
    );
}
