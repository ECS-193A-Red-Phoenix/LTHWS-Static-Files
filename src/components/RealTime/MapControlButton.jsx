import "./RealTimeConditions.css"

function ChartTabButton(props) {
    let className = "map-control-button";
    if (props.active)
        className += " map-control-button-active";

    return (
        <div className={className} onClick={props.onClick}>
            { props.name }
        </div>
    );
}

export default ChartTabButton;