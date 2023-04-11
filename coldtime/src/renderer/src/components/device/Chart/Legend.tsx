import { Box, Flex } from "@chakra-ui/react";
import { CHART_GRAY, CHART_GREEN, CHART_RED } from "@renderer/theme";
import { useTranslation } from "react-i18next";

const Legend = () => {
  const { t } = useTranslation();
  return (
    <Flex alignItems="center" m={3} p={6} justifyContent="flex-end" w="full">
      <Box mr={2} w={5} h={5} borderRadius="full" bg={CHART_GREEN} />
      <Box as="span" fontWeight="medium" fontSize="sm">
        {t("chart.chartGreen")}
      </Box>
      <Box mx={4} w={5} h={5} borderRadius="full" bg={CHART_RED} />
      <Box as="span" fontWeight="medium" fontSize="sm">
        {t("chart.chartRed")}
      </Box>
      <Box mx={4} w={5} h={5} borderRadius="full" bg={CHART_GRAY} />
      <Box as="span" fontWeight="medium" fontSize="sm">
        {t("chart.chartGray")}
      </Box>
    </Flex>
  );
};

export default Legend;
