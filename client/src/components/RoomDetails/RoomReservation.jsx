import PropTypes from "prop-types";
import Button from "../Shared/Button/Button";
import { useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import BookingModal from "../Modal/BookingModal";
import useAuth from "../../hooks/useAuth";
import { DateRange } from "react-date-range";
const RoomReservation = ({ room }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [dates, setDates] = useState({
    startDate: new Date(room?.from),
    endDate: new Date(room?.to),
    key: "selection",
  });

  const handleDates = (item) => {
    setDates(item.selection);
  };

  // total days * price
  const totalPrice =
    parseInt(
      differenceInCalendarDays(
        new Date(dates.endDate),
        new Date(dates.startDate - 1)
      )
    ) * parseInt(room?.price);
  const { user } = useAuth();
  const bookingInfo = {
    guest: {
      name: user?.displayName,
      email: user?.email,
      image: user?.photoURL,
    },
    host: room?.host?.email,
    location: room?.location,
    price: totalPrice,
    from: dates.startDate,
    to: dates.endDate,
    title: room?.title,
    roomId: room?._id,
    image: room?.image,
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="rounded-xl border-[1px] border-neutral-200 overflow-hidden bg-white">
      <div className="flex items-center gap-1 p-4">
        <div className="text-2xl font-semibold">$ {room?.price}</div>
        <div className="font-light text-neutral-600">/night</div>
      </div>
      <hr />
      <div className="flex justify-center">
        {/* Calender */}
        <DateRange
          showDateDisplay={false}
          rangeColors={["#F6536D"]}
          onChange={(item) => handleDates(item)}
          moveRangeOnFirstSelection={false}
          ranges={[dates]}
          minDate={new Date(room.from)}
          maxDate={new Date(room.to)}
        />
      </div>
      <hr />
      <div className="p-4">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          label={"Reserve"}
          disabled={room.host.email === user?.email || room.booked}
        />
      </div>
      <hr />
      <div className="p-4 flex items-center justify-between font-semibold text-lg">
        <div>Total</div>
        <div>${totalPrice}</div>
      </div>

      <div>
        <BookingModal
          closeModal={closeModal}
          isOpen={isOpen}
          bookingInfo={bookingInfo}
        ></BookingModal>
      </div>
    </div>
  );
};

RoomReservation.propTypes = {
  room: PropTypes.object,
};

export default RoomReservation;

//   console.log("start date-->", new Date(room.from).toLocaleDateString());
// console.log("End date-->", new Date(room.to).toLocaleDateString());
