import TemperatureMap from "./TemperatureMap";
import { scaleLinear } from "d3";
import TemperatureLegend from "./TemperatureLegend";
import { colorFromHex, colorScale, reversed, round } from "../util";
import { parseMyDate } from "../util";
import "./TemperatureChart.css";
import "../styles/LakeConditions.css";
import { useState } from "react";
import Calendar from "./Calendar";


function average_temperature(grid) {
    let total = 0;
    let count = 0;
    for (let j = 0; j < grid.length; j++)
        for (let i = 0; i < grid[0].length; i++) {
            if (typeof grid[j][i] === 'number') {
                total += grid[j][i];
                count += 1;
            }
        }
    return total / count;
}

////////////////////////////////////
// Static Constants
////////////////////////////////////

const FRAME_DURATION = 2; // duration in hours for 1 temperature map

const DARKBLUE  = colorFromHex("#00008b");
const BLUE      = colorFromHex("#0f52ba");
const LIGHTBLUE = colorFromHex("#ace5ee");
const GREEN     = colorFromHex("#7fff00");
const YELLOW    = colorFromHex("#ffef00");
const RED       = colorFromHex("#d0312d");
const DARKRED   = colorFromHex("#710c04");

const temperature_color = colorScale(
    DARKBLUE, BLUE, LIGHTBLUE, GREEN, YELLOW, RED, DARKRED
);

const temperature_data = require('./temperature.json');
temperature_data.forEach((obj) => obj['time'] = parseMyDate(obj['time']));
temperature_data.sort((o1, o2) => o1['time'] - o2['time']);

function formatDate(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const day_of_week = days[date.getDay()];
    const hour = (date.getHours() % 12) + 1
    const minutes = String(date.getMinutes()).padStart(2, 0);
    const am_pm = (date.getHours() >= 12) ? "PM" : "AM";
    const month = months[date.getMonth()];
    const day_of_month = date.getDate();

    return `${day_of_week} ${hour}:${minutes} ${am_pm}, ${month} ${day_of_month}`;
}

function TemperaturePage() {
    const [activeIdx, setActiveIdx] = useState(0);

    const temperature_events = temperature_data.map(
        (obj) => { return { time: obj['time'], duration: FRAME_DURATION }; }
    );

    let T = temperature_data[activeIdx]['matrices'][0];
    T = reversed(T);
    const lake_height = 700;
    const [n_rows, n_cols] = [T.length, T[0].length];

    let min_T = Number.MAX_VALUE;
    let max_T = -Number.MAX_VALUE;
    for (let j = 0; j < n_rows; j++) {
        for (let i = 0; i < n_cols; i++) {
            if (typeof T[j][i] === 'number') {
                min_T = Math.min(min_T, T[j][i]);
                max_T = Math.max(max_T, T[j][i]);
            }
        }
    }

    let temperature_scale = scaleLinear().domain([min_T, max_T]).range([0, 1]);
    let temperature_color_scale = (temperature) => temperature_color(temperature_scale(temperature));

    return (
        <div className="lake-condition-container">
            <div className="lake-condition-left-column">
                <div className="lake-condition-description-container">
                    <div className="lake-condition-title"> Water Temperature </div>
                    <div className="lake-condition-description">
                        Lake Tahoe water is cold for most swimmers, with surface temperatures ranging 
                        from 42 degrees in the winter to over 70 degrees in July and August. Though refreshing 
                        on a hot day, a plunge into Lake Tahoe can literally take your breath away. Swimmers 
                        should be prepared for dangerously cold conditions.
                    </div>

                    <Calendar events={temperature_events} 
                        active_event_idx={activeIdx}
                        on_event_selected={(idx) => setActiveIdx(idx)}/>
                </div>
            </div>

            <TemperatureMap height={lake_height} T={T} color_palette={temperature_color_scale}/>
            <TemperatureLegend height={lake_height} min_T={min_T} max_T={max_T} color_palette={temperature_color}/>

        </div>
    );
}

export default TemperaturePage;