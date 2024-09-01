import React, { useRef, useEffect, useCallback } from 'react';

import '../index.less';

const drag = ({ leftDom, rightDom, contentDom, type, extraLength, setResizeModalFlag }, draggleLineDom) => {
    const _ref1 = leftDom;
    const _ref2 = rightDom;
    draggleLineDom.onmousedown = (e) => {
        setResizeModalFlag && setResizeModalFlag(false);

        let _e = e;
        // const dir = 'horizontal'; // 设置好方向 可通过变量控制默认水平方向 horizontal | vertical
        const firstX = _e.clientX; // 获取第一次点击的横坐标
        const width = _ref2.offsetWidth; // 获取到元素的宽度
        const firstY = _e.clientY; // 获取第一次点击的横坐标
        const height = _ref2.offsetHeight // 获取到元素的宽度  extraLength为额外的margin或padding总长度

        // 移动过程中对左右元素宽度计算赋值
        document.onmousemove = (_event) => {
            _e = _event;
            // 可扩展上下拖动等
            switch (type) {
                case 'horizontal':
                    _ref1.style.width = `${contentDom.offsetWidth - width + (_e.clientX - firstX)}px`;
                    _ref2.style.width = `${width - (_e.clientX - firstX)}px`;
                    break;
                case 'vertical':
                    _ref1.style.height = `${contentDom.offsetHeight - height - extraLength + (_e.clientY - firstY)}px`;
                    _ref2.style.height = `${height - (_e.clientY - firstY)}px`;
                    break;
                default:
                    break;
            }
        };
        // 在左侧和右侧元素父容器上绑定松开鼠标解绑拖拽事件
        contentDom.onmouseup = () => {
            document.onmousemove = null;
        };
        return false;
    };
};
export default function DraggleLayout({ contentDom, leftDom, rightDom, type = 'vertical', extraLength = 0, setResizeModalFlag }) {
    const draggleLineRef = useRef();
    const init = useCallback(drag.bind(null, { leftDom, rightDom, contentDom, type, extraLength, setResizeModalFlag }),
        [leftDom, rightDom, contentDom, draggleLineRef.current, setResizeModalFlag]);

    useEffect(() => {
        // 初始化绑定拖拽事件
        init(draggleLineRef.current);
    }, []);

    return (<div className='draggleLine-wrapper'><div className='draggleLine nc-theme-area-split-bc' ref={draggleLineRef}></div></div>)
}
