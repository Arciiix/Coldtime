import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Text,
} from "@chakra-ui/react";
import { IDevice } from "@renderer/types/device";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface IDeviceProps extends IDevice {}

export default function Device(props: IDeviceProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <Heading size="md"> {props.name}</Heading>
      </CardHeader>
      <CardBody>
        <Text>
          {props.ip}:{props.port}
        </Text>
      </CardBody>
      <CardFooter>
        <Button as={Link} to={`/device/${props.id}`}>
          {t("device.goToDevice")}
        </Button>
      </CardFooter>
    </Card>
  );
}
