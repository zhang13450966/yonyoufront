const DCTabPane = ({ tab, active, closable, onClick, key, onClose }) => {
    const _class = `dc-tab-pane ${active ? active : ""}`;
    return (
        <div className={_class}>
            <span onClick={onClick.bind(this, key)}>{tab}</span>
            {closable ? (
                <i
                    className="icon iconfont icon-guanbi"
                    onClick={onClose.bind(this, key)}
                ></i>
            ) : null}
        </div>
    );
};
export default DCTabPane;
