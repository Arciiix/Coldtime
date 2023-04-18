import { Button, Flex, Image } from "@chakra-ui/react";
import { Language } from "@renderer/types/settings";
import poland from "../../assets/poland.svg";
import usa from "../../assets/usa.svg";

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
          leftIcon={<Image src={poland} alt="Polski" w={"30px"} h={"30px"} />}
        >
          Polski
        </Button>

        <Button
          isDisabled={isLoading}
          onClick={() => handleLanguageClick("en")}
          mr={4}
          leftIcon={<Image src={usa} alt="English" w={"30px"} h={"30px"} />}
        >
          English
        </Button>
      </Flex>
    </>
  );
}
