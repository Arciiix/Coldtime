import {
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { formatDateToTimestamp } from "@renderer/utils/formatDate";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { MdClear } from "react-icons/md";
import DatePicker, { DateObject } from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";

interface IRangeDatePicker {
  value: [DateObject | null, DateObject | null];
  onChange: (dates: [DateObject | null, DateObject | null]) => void;
  onSubmit: () => void;
  disabled: boolean;
}
export default function RangeDatePicker({
  value,
  onChange,
  onSubmit,
  disabled,
}: IRangeDatePicker) {
  const [first, setFirst] = useState(value[0]);
  const [second, setSecond] = useState(value[1]);

  useEffect(() => {
    onChange([first, second]);
  }, [first, second]);

  return (
    <Flex
      w="full"
      justifyContent="center"
      alignItems="center"
      gap={3}
      px={3}
      m={3}
    >
      <DatePicker
        className="bg-dark"
        format="YYYY-MM-DD HH:mm"
        render={(value, openCalendar) => {
          return (
            <InputGroup>
              <Input
                value={
                  value
                    ? `${formatDateToTimestamp(new Date(value))
                        /* Without seconds */
                        .slice(0, -3)}`
                    : t("noDateSet").toString()
                }
                readOnly
                onClick={(e) => {
                  e.preventDefault();
                  openCalendar();
                }}
              />
              <InputRightElement>
                <IconButton
                  aria-label={t("clear")}
                  rounded="full"
                  variant={"ghost"}
                  colorScheme="red"
                  onClick={() => {
                    setFirst(null);
                    onSubmit();
                  }}
                >
                  <MdClear />
                </IconButton>
              </InputRightElement>
            </InputGroup>
          );
        }}
        value={first}
        maxDate={second ?? undefined}
        onChange={(e) => {
          // If tries to be bigger than the second date
          if (
            second &&
            (e as DateObject).toDate().getTime() >= second.toDate().getTime()
          )
            return;

          setFirst(e as DateObject);
        }}
        onClose={onSubmit}
        disabled={disabled}
        plugins={[<TimePicker hideSeconds position="bottom" />]}
      />

      <Text>-</Text>
      <DatePicker
        className="bg-dark"
        format="YYYY-MM-DD HH:mm"
        render={(value, openCalendar) => {
          return (
            <InputGroup>
              <Input
                value={
                  value
                    ? `${formatDateToTimestamp(new Date(value))
                        /* Without seconds */
                        .slice(0, -3)}`
                    : t("noDateSet").toString()
                }
                readOnly
                onClick={(e) => {
                  e.preventDefault();
                  openCalendar();
                }}
              />
              <InputRightElement>
                <IconButton
                  aria-label={t("clear")}
                  rounded="full"
                  variant={"ghost"}
                  colorScheme="red"
                  onClick={() => {
                    setSecond(null);
                    onSubmit();
                  }}
                >
                  <MdClear />
                </IconButton>
              </InputRightElement>
            </InputGroup>
          );
        }}
        value={second}
        minDate={first ?? undefined}
        onChange={(e) => {
          // If tries to be lower than the second date
          if (
            first &&
            (e as DateObject).toDate().getTime() <= first.toDate().getTime()
          )
            return;

          setSecond(e as DateObject);
        }}
        onClose={onSubmit}
        disabled={disabled}
        plugins={[<TimePicker hideSeconds position="bottom" />]}
      />
    </Flex>
  );
}
