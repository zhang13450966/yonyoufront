import React, { useRef, useEffect } from "react";
import "./index.less";

const PopContainer = ({ event, onClose, children, hbTab }) => {
    const Ref = useRef();
    useEffect(() => {
        document.addEventListener("click", _clickHandler);
        //document.addEventListener('scroll', this._handleScroll);
        return () => {
            document.removeEventListener("click", _clickHandler);
            Ref.current.removeEventListener("click", refClick);
        };
    }, []);
    const _clickHandler = (e) => {
        onClose && onClose(e);
    };
    useEffect(() => {
        setTimeout(() => {
            if (event) {
                const clickX = event.clientX;
                const clickY = event.clientY;
                const screenW = window.innerWidth;
                const screenH = window.innerHeight;
                const rootW = Ref.current.offsetWidth;
                const rootH = Ref.current.offsetHeight;
                Ref.current.style.left = `${clickX - rootW}px`;
                Ref.current.style.top = `${clickY + 10}px`;
            }
        });
    }, [event]);
    const refClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div
            className="pop-container"
            ref={(ref) => {
                if (ref) {
                    Ref.current = ref;
                    Ref.current.addEventListener("click", refClick);
                }
            }}
        >
            {children}
        </div>
    );
};
export default PopContainer;
