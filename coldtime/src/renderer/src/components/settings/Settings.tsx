import { Box, Flex, Heading, IconButton } from "@chakra-ui/react";
import updateSettings from "@renderer/fetch/settings/updateSettings";
import settingsState from "@renderer/state/settings/settings";
import { Language } from "@renderer/types/settings";
import { useEffect, useState } from "react";
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

  const [settings, setSettings] = useRecoilState(settingsState);

  const [checkInterval, setCheckInterval] = useState(0);
  const [saveInterval, setSaveInterval] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaveIntervalError, setIsSaveIntervalError] = useState(false);
  const [isCheckIntervalError, setIsCheckIntervalError] = useState(false);

  const isError = isSaveIntervalError || isCheckIntervalError;

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
    });

    setSettings(newSettings);
    setIsLoading(false);

    navigate("/");
  };

  useEffect(() => {
    if (!settings) return;
    setCheckInterval(parseInt(settings.checkInterval.value.toString()));
    setSaveInterval(parseInt(settings.saveInterval.value.toString()));
  }, [settings]);

  return (
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
  );
};

export default Settings;
