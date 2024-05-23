/* eslint-disable no-unused-vars */
import { DateRange } from "react-date-range";

const Calender = (value) => {
    return (
        <DateRange 
        ranges={[value]}
        showDateDisplay={false}
        rangeColors={["#F6536D"]}
        direction="vertical"
        >

        </DateRange>
    )
};

export default Calender;