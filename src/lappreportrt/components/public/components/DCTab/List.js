export const List = ({ data = [], onClick, active, model = "unStatus" }) => {
    return (
        <div className="report-list-container">
            {data.map((item) => (
                <p
                    className="list-item"
                    onMouseDown={(e) => {
                        onClick(item);
                    }}
                >
                    {model == "status" ? (
                        <span
                            className={`${
                                active == item.key
                                    ? "icon iconfont icon-liucheng1"
                                    : ""
                            } list-icon`}
                        ></span>
                    ) : null}
                    {item.label}
                </p>
            ))}
        </div>
    );
};
