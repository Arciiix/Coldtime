import { useTranslation } from "react-i18next";
import { PacmanLoader } from "react-spinners";
import { LoaderSizeMarginProps } from "react-spinners/helpers/props";

interface ILoadingProps {
  isLoading: boolean;
  loaderProps?: LoaderSizeMarginProps;
}

export default function Loading(props: ILoadingProps) {
  const { t } = useTranslation();
  return props.isLoading ? (
    // TODO
    <div>
      <PacmanLoader size={32} color={"white"} {...props.loaderProps} />
      <span>{t("loading")}</span>
    </div>
  ) : null;
}
