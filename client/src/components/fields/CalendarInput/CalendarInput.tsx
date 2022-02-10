import React, { useState } from "react";
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

  if (!date) {
    return (
      <>
        {show ? (
          <Container>
            <DatePicker
              selected={new Date()}
              onChange={handleChange}
              onBlur={() => setShow(false)}
              calendarContainer={Container}
            />
          </Container>
        ) : (
          <button onClick={() => setShow(true)}>Set Event Date</button>
        )}
      </>
    );
  }

  return (
    <DatePicker
      selected={date}
      onChange={handleChange}
      calendarContainer={Container}
    />
  );
};

export default CalendarInput;
