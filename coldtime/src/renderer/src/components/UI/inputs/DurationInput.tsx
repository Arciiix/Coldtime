import {
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface IDurationInput {
  value: number;
  onChange: (numberOfSeconds: number) => void;
  title: string;
  helperText?: string;
  setIsError?: (isError: boolean) => void;
}
export default function DurationInput({
  value,
  onChange,
  title,
  helperText,
  setIsError,
}: IDurationInput) {
  const { t } = useTranslation();

  const { register, formState, watch, setValue, setError } = useForm({
    mode: "onChange",
  });

  const minutes = watch("minutes");
  const seconds = watch("seconds");

  const { errors } = formState;

  useEffect(() => {
    // There was some problem with react-hook-form library (even if there was an error, the error variable would notice it after second render)
    // Therefore I decided to just make a simple debounce, to avoid flooding
    const debounce = setTimeout(() => {
      if (
        !!errors.minutes ||
        !!errors.seconds ||
        isNaN(minutes) ||
        isNaN(seconds)
      )
        return;

      if (parseInt(minutes) * 60 + parseInt(seconds) < 1) {
        setError("seconds", { message: "Time must be greater than 0" });
        return;
      }

      onChange(parseInt(minutes) * 60 + parseInt(seconds));
    }, 100);

    return () => clearTimeout(debounce);
  }, [errors, minutes, seconds, value, onChange]);

  useEffect(() => {
    if (isNaN(value)) return;
    if (
      minutes === Math.floor(value / 60) &&
      seconds === Math.floor(value % 60)
    )
      return;

    setValue("minutes", Math.floor(value / 60));
    setValue("seconds", Math.floor(value % 60));
  }, [value]);

  useEffect(() => {
    setIsError?.(formState.isDirty ? !formState.isValid : false);
  }, [formState]);

  return (
    <Box my={4}>
      <FormLabel fontSize={21}>{title}</FormLabel>
      <Text color="gray.300" mt={-2} mb={3}>
        {helperText}
      </Text>
      <InputGroup
        display="flex"
        gap={3}
        alignItems="center"
        justifyContent={"center"}
      >
        <FormControl w="50%" isInvalid={!!errors.minutes}>
          <FormLabel fontSize={14}>{t("duration.minutes")}</FormLabel>
          <Input
            type="number"
            min={0}
            max={59}
            mr={2}
            {...register("minutes", { min: 0, max: 59 })}
          />
        </FormControl>

        <Text
          mt={8} // It has to be centered to the inputs, excluding the labels (which are about 8 units of Chakra's)
        >
          :
        </Text>

        <FormControl w="50%" isInvalid={!!errors.seconds}>
          <FormLabel fontSize={14}>{t("duration.seconds")}</FormLabel>
          <Input
            type="number"
            min={0}
            max={59}
            {...register("seconds", { min: 0, max: 59 })}
          />
        </FormControl>
      </InputGroup>
    </Box>
  );
}
