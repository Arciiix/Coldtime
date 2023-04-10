import { Input } from "@chakra-ui/react";
import { formatDate } from "@renderer/utils/formatDate";
import DatePicker, { DateObject } from "react-multi-date-picker";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";

interface IRangeDatePicker {
  value: [DateObject, DateObject];
  onChange: (dates: [DateObject, DateObject]) => void;
  onSubmit: () => void;
  disabled: boolean;
}
export default function RangeDatePicker({
  value,
  onChange,
  onSubmit,
  disabled,
}: IRangeDatePicker) {
  return (
    <DatePicker
      className="bg-dark"
      render={(value, openCalendar) => {
        if (!value[0] || !value[1]) return "";
        return (
          <Input
            value={`${formatDate(new Date(value[0]))} - ${formatDate(
              new Date(value[1])
            )}`}
            readOnly
            onClick={(e) => {
              e.preventDefault();
              openCalendar();
            }}
          />
        );
      }}
      value={value}
      onChange={onChange}
      onClose={onSubmit}
      disabled={disabled}
      range
    />
  );
}
