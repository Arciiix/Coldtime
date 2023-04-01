import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Image,
  useColorMode,
} from "@chakra-ui/react";
import updateSettings from "@renderer/fetch/settings/updateSettings";
import settingsState from "@renderer/state/settings/settings";
import { Language } from "@renderer/types/settings";
import { useEffect, useState } from "react";
import { MdNightlight } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

const WelcomePage = () => {
  const navigate = useNavigate();

  const [settings, setSettings] = useRecoilState(settingsState);

  const [textIndex, setTextIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);
  const [isLoading, setIsLoading] = useState(false);

  const handleLanguageClick = async (lang: Language) => {
    setIsLoading(true);
    const newSettings = await updateSettings({ language: lang });

    setSettings(newSettings);
    navigate("/");
  };

  useEffect(() => {
    const TYPED_TEXTS = ["Welcome to Coldtime!", "Witamy w Coldtime!"];
    const handleTyping = () => {
      const currentText = TYPED_TEXTS[textIndex];

      if (isDeleting) {
        setText(currentText.substring(0, text.length - 1));
      } else {
        setText(currentText.substring(0, text.length + 1));
      }

      if (!isDeleting && text === currentText) {
        setTimeout(() => {
          setIsDeleting(true);
          setTypingSpeed(50);
        }, 1000);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setTextIndex((textIndex + 1) % TYPED_TEXTS.length);
        setTypingSpeed(100);
      }
    };

    const typingInterval = setTimeout(handleTyping, typingSpeed);

    return () => clearTimeout(typingInterval);
  }, [text, textIndex, isDeleting, typingSpeed]);

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
        {text}
      </Heading>
      <Flex mb={8} px={2} direction={{ base: "column", sm: "row" }} gap={2}>
        <Button
          disabled={isLoading}
          onClick={() => handleLanguageClick("pl")}
          mr={4}
          leftIcon={
            <Image
              src="/src/assets/poland.svg"
              alt="Polski"
              w={"30px"}
              h={"30px"}
            />
          }
        >
          Polski
        </Button>

        <Button
          disabled={isLoading}
          onClick={() => handleLanguageClick("en")}
          mr={4}
          leftIcon={
            <Image
              src="/src/assets/usa.svg"
              alt="English"
              w={"30px"}
              h={"30px"}
            />
          }
        >
          English
        </Button>
      </Flex>
    </Flex>
  );
};

export default WelcomePage;
