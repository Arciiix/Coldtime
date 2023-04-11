import { Box, Flex, Heading, Image } from "@chakra-ui/react";
import updateSettings from "@renderer/fetch/settings/updateSettings";
import settingsState from "@renderer/state/settings/settings";
import { Language } from "@renderer/types/settings";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import LanguageSelect from "../settings/LanguageSelect";
import MadeWithHeart from "../UI/MadeWithHeart";
import TypingTextAnim from "../UI/TypingTextAnim";

const WelcomePage = () => {
  const navigate = useNavigate();

  const [_, setSettings] = useRecoilState(settingsState);

  const [isLoading, setIsLoading] = useState(false);

  const handleLanguageClick = async (lang: Language) => {
    setIsLoading(true);
    const newSettings = await updateSettings({ language: lang });

    setSettings(newSettings);
    navigate("/");
  };

  return (
    <Flex
      minHeight="100vh"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      bgGradient={"linear(to-b, blue.700, purple.700)"}
    >
      <Box
        w={{ base: "150px", md: "200px" }}
        h={{ base: "150px", md: "200px" }}
        mb={8}
        borderRadius="full"
        bg="white"
        boxShadow="md"
      >
        <Image
          src="/src/assets/logo.png"
          alt="Coldtime logo"
          borderRadius="full"
          w={{ base: "150px", md: "200px" }}
          h={{ base: "150px", md: "200px" }}
        />
      </Box>

      <Heading
        mb={6}
        fontSize={{ base: "3xl", sm: "4xl", md: "5xl" }}
        fontWeight="bold"
        color="white"
        textAlign={"center"}
      >
        <TypingTextAnim
          texts={["Welcome to Coldtime!", "Witamy w Coldtime!"]}
        />
      </Heading>
      <LanguageSelect
        handleLanguageClick={handleLanguageClick}
        isLoading={isLoading}
      />
      <MadeWithHeart />
    </Flex>
  );
};

export default WelcomePage;
