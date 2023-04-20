import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Text,
} from "@chakra-ui/react";
import updateSettings from "@renderer/fetch/settings/updateSettings";
import settingsState from "@renderer/state/settings/settings";
import { Language } from "@renderer/types/settings";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FaSave } from "react-icons/fa";
import { MdSettings } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import DurationInput from "../UI/inputs/DurationInput";
import LoadingOverlay from "../UI/Loading/LoadingOverlay";
import MadeWithHeart from "../UI/MadeWithHeart";
import TypingTextAnim from "../UI/TypingTextAnim";
import LanguageSelect from "./LanguageSelect";

const Settings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    register,
    formState: { errors, isValid },

    watch,
    setValue,
  } = useForm({
    mode: "onChange",
  });

  const [settings, setSettings] = useRecoilState(settingsState);

  const [checkInterval, setCheckInterval] = useState(0);
  const [saveInterval, setSaveInterval] = useState(0);
  const maxDataPoints = watch("maxDataPoints");

  const [isLoading, setIsLoading] = useState(false);
  const [isSaveIntervalError, setIsSaveIntervalError] = useState(false);
  const [isCheckIntervalError, setIsCheckIntervalError] = useState(false);

  const isError = isSaveIntervalError || isCheckIntervalError || !isValid;

  const handleLanguageClick = async (lang: Language) => {
    setIsLoading(true);
    const newSettings = await updateSettings({ language: lang });

    setSettings(newSettings);
    setIsLoading(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    const newSettings = await updateSettings({
      checkInterval: checkInterval,
      saveInterval: saveInterval,
      maxDataPoints: maxDataPoints,
    });

    setSettings(newSettings);
    setIsLoading(false);

    navigate("/");
  };

  useEffect(() => {
    if (!settings) return;
    setCheckInterval(parseInt(settings.checkInterval.value.toString()));
    setSaveInterval(parseInt(settings.saveInterval.value.toString()));
    setValue(
      "maxDataPoints",
      parseInt(settings.maxDataPoints.value.toString())
    );
  }, [settings]);

  return (
    <Box
      h="100%"
      bgImage="radial-gradient(at 47% 33%, hsl(233.85, 59%, 13%) 0, transparent 59%), 
    radial-gradient(at 82% 65%, hsl(163.33, 40%, 9%) 0, transparent 55%),
    radial-gradient(at 22% 55%, hsl(163.33, 20%, 9%) 0, transparent 40%),
    radial-gradient(at 40% 80%, hsl(332, 58%, 13%) 0, transparent 40%);"
    >
      <Box height={"100%"} maxHeight="100%" overflowY="auto">
        <Box borderWidth="1px" m={12} borderRadius="lg" px={8}>
          <LoadingOverlay isLoading={isLoading} />
          <Flex justifyContent="center" flexDir="column" alignItems="center">
            <MdSettings size={84} />
            <Heading
              mb={6}
              fontSize={{ base: "3xl", sm: "4xl", md: "5xl" }}
              fontWeight="bold"
              color="white"
              textAlign={"center"}
            >
              {t("settings.settings")}
            </Heading>
          </Flex>
          <Heading
            mb={6}
            fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
            fontWeight="bold"
            color="white"
            textAlign={"center"}
          >
            <TypingTextAnim texts={["Select language", "Wybierz język"]} />
          </Heading>
          <Flex justifyContent="center">
            <LanguageSelect
              handleLanguageClick={handleLanguageClick}
              isLoading={isLoading}
            />
          </Flex>
          <DurationInput
            value={checkInterval}
            onChange={(val) => setCheckInterval(val)}
            title={t("settings.checkInterval")}
            helperText={t("settings.checkIntervalDesc") ?? ""}
            setIsError={setIsCheckIntervalError}
          />
          <DurationInput
            value={saveInterval}
            onChange={(val) => setSaveInterval(val)}
            title={t("settings.saveInterval")}
            helperText={t("settings.saveIntervalDesc") ?? ""}
            setIsError={setIsSaveIntervalError}
          />

          <FormControl isInvalid={!!errors.maxDataPoints}>
            <FormLabel fontSize={21}>{t("settings.maxDataPoints")}</FormLabel>
            <Text color="gray.300" mt={-2} mb={3}>
              {t("settings.maxDataPointsDesc")}
            </Text>
            <Input
              type="number"
              min={100}
              {...register("maxDataPoints", {
                min: {
                  value: 100,
                  message: t("settings.errors.maxDataPoints"),
                },
                required: {
                  value: true,
                  message: t("settings.errors.maxDataPoints"),
                },
              })}
            />
            <FormErrorMessage>
              {errors?.maxDataPoints?.message?.toString() ?? ""}
            </FormErrorMessage>
          </FormControl>

          <Flex justifyContent="end" gap={3} my={3}>
            <IconButton
              isDisabled={isError || isLoading}
              isLoading={isLoading}
              aria-label={t("save")}
              icon={<FaSave />}
              colorScheme="blue"
              variant="outline"
              mr={2}
              onClick={handleSave}
            />
          </Flex>
          <MadeWithHeart />
        </Box>
      </Box>
    </Box>
  );
};

export default Settings;
