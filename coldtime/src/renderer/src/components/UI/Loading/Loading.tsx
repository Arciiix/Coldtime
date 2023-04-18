import { Button, Flex, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { PacmanLoader } from "react-spinners";
import { LoaderSizeMarginProps } from "react-spinners/helpers/props";

export interface ILoadingProps {
  isLoading: boolean;
  loaderProps?: LoaderSizeMarginProps;
  description?: string;
  showGoToHomepage?: boolean;
}

export default function Loading(props: ILoadingProps) {
  const { t } = useTranslation();
  return props.isLoading ? (
    <Flex flexDir="column" gap={3} justifyContent="center" alignItems="center">
      <PacmanLoader size={32} color={"white"} {...props.loaderProps} />
      <Text className="loading" fontSize={"2xl"}>
        {t("loading")}
      </Text>
      <Text textAlign="center">{props.description}</Text>
      {props.showGoToHomepage ? (
        <Button as={Link} to="/" colorScheme={"red"}>
          {t("goToHomepage")}
        </Button>
      ) : null}
    </Flex>
  ) : null;
}
