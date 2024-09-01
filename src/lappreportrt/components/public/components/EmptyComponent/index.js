import "./index.less";

export default function EmptyComponent({ message }) {
    return (
        <div className="no-data-placeholder">
            <i className="no-data" />
            <span className="no-data-title nc-theme-common-font-c">
                {message}
            </span>
        </div>
    );
}
