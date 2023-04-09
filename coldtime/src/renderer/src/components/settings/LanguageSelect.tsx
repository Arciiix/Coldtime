import { Button, Flex, Image } from "@chakra-ui/react";
import { Language } from "@renderer/types/settings";

interface ILanguageSelectProps {
  isLoading: boolean;
  handleLanguageClick: (lang: Language) => void;
}

export default function LanguageSelect({
  isLoading,
  handleLanguageClick,
}: ILanguageSelectProps) {
  return (
    <>
      <Flex mb={8} px={2} direction={{ base: "column", sm: "row" }} gap={2}>
        <Button
          isDisabled={isLoading}
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
          isDisabled={isLoading}
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
    </>
  );
}
