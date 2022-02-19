import React, { useState, useRef } from "react";
import DatePicker, { CalendarContainer } from "react-datepicker";

import "./CalendarInput.less";

type Props = {
  value: string | undefined | null | Date;
  keyProp: string;
  handleDateInput: GenericEdit;
};

const CalendarInput: React.FC<Props> = ({
  value,
  handleDateInput,
  keyProp,
}) => {
  const pickerRef = useRef<any>(null);
  const [date, setDate] = useState(value ? new Date(value) : null);
  const [show, setShow] = useState(false);

  const handleChange = (date: Date) => {
    setDate(date);
    handleDateInput(date.toISOString(), keyProp);
  };

  const handleClear = () => {
    setDate(null);
  };

  const Container: React.FC = ({ children }) => {
    return (
      <CalendarContainer className="calendar-container">
        <div className="calendar-clear">
          <button className="btn btn-danger" onClick={handleClear}>
            Clear
          </button>
        </div>
        <div className="calendar-children"> {children}</div>
      </CalendarContainer>
    );
  };

  const handleClick = () => {
    setShow(true);
    setTimeout(() => pickerRef.current?.setFocus(), 1);
  };

  const handleBlur = () => {
    console.log(pickerRef);
    setShow(false);
  };

  return (
    <>
      {show ? (
        <Container>
          <DatePicker
            ref={pickerRef}
            selected={new Date()}
            onChange={handleChange}
            onBlur={handleBlur}
            calendarContainer={Container}
          />
        </Container>
      ) : (
        <button onClick={handleClick}>Set Event Date</button>
      )}
    </>
  );
};

export default CalendarInput;
