import { IconButton, Tooltip } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { MdArrowBack } from "react-icons/md";

const { ipcRenderer } = window.require("electron");

export default function BackButton() {
  const { t } = useTranslation();

  const goBack = () => {
    ipcRenderer.invoke("BROWSER_GO_BACK");
  };

  return (
    <div className="m-2">
      <Tooltip title={t("goBack") as string}>
        <IconButton aria-label={t("goBack")} onClick={goBack}>
          <MdArrowBack />
        </IconButton>
      </Tooltip>
    </div>
  );
}
