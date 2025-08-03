import { colors } from "@/app/styles/colors";
import { BodySmallSemiBold } from "@/app/styles/textStyles";
import { useState } from "react";
import styled from "styled-components";

type DateTimeInputProps = {
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  dateLabel?: string;
  timeLabel?: string;
  dateValue?: string;
  timeValue?: string;
  required?: boolean;
  className?: string;
};

export const DateTimeInput = (props: DateTimeInputProps) => {
  const {
    onDateChange,
    onTimeChange,
    dateLabel,
    timeLabel,
    dateValue,
    timeValue,
    required,
    className,
  } = props;
  const [date, setDate] = useState(dateValue || "");
  const [time, setTime] = useState(timeValue || "");

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setDate(newDate);
    onDateChange(newDate);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);
    onTimeChange(newTime);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <Container className={className}>
      <DateInputWrapper>
        {dateLabel && (
          <Label>
            {dateLabel}
            {required && <Astrix> *</Astrix>}
          </Label>
        )}
        <DateInput
          type="date"
          value={date}
          onChange={handleDateChange}
          min={today}
          required={required}
        />
      </DateInputWrapper>
      <TimeInputWrapper>
        {timeLabel && (
          <Label>
            {timeLabel}
            {required && <Astrix> *</Astrix>}
          </Label>
        )}
        <TimeInput
          type="time"
          value={time}
          onChange={handleTimeChange}
          required={required}
        />
      </TimeInputWrapper>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  > :first-child {
    width: calc(75% - 24px); /* Adjusted to account for gap */
  }
  > :last-child {
    width: calc(25% - 24px); /* Fixed width for time input */
  }
`;

const DateInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TimeInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DateInput = styled.input`
  width: 100%;
  height: 40px;
  background-color: ${colors.white};
  padding: 8px 16px;
  border: 1px solid ${colors.dark6};
  border-radius: 4px;
  font-family: inherit;
  font-size: 14px;
  color: ${colors.dark2};

  &:focus {
    outline: none;
    border-color: ${colors.dark4};
  }

  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
    filter: invert(0.5);
  }
`;

const TimeInput = styled.input`
  width: 100%;
  height: 40px;
  background-color: ${colors.white};
  padding: 8px 16px;
  border: 1px solid ${colors.dark6};
  border-radius: 4px;
  font-family: inherit;
  font-size: 14px;
  color: ${colors.dark2};

  &:focus {
    outline: none;
    border-color: ${colors.dark4};
  }

  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
    filter: invert(0.5);
  }
`;

const Label = styled(BodySmallSemiBold)`
  color: ${colors.dark2};
`;

const Astrix = styled.span`
  color: ${colors.red};
`;
