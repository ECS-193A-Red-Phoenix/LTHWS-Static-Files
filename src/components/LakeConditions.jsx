import CurrentChart from "./CurrentChart/CurrentChart";
import "./styles/LakeConditions.css";

function LakeConditions(props) {
  return (
    <div className="content-wrapper">
      <div className="page-title"> Lake Conditions </div>

      <div className="center-content">
        <CurrentChart width={800} height={600}/>
      </div>

      <div className="Map1">
        <img src="LTPic.png" className="Pic" />
        <img src="LTPic2.png" />
      </div>

      <div className="box">
        <p>Current Lake Conditions:</p>

        <p>Last Update:</p>
      </div>

    </div>
  )
}

export default LakeConditions;