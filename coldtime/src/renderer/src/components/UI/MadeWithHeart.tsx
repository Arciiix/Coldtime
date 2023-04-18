import { Flex, Image, Link, Text } from "@chakra-ui/react";
import logo from "../../assets/logo.png";

interface IMadeWithHeart {
  isAbsolute?: boolean;
}

export default function MadeWithHeart({ isAbsolute }: IMadeWithHeart) {
  return (
    <Flex
      alignItems={"center"}
      justifyContent={"center"}
      gap={2}
      w={"100%"}
      marginX="auto"
      my={2}
      {...(isAbsolute
        ? {
            position: "absolute",
            bottom: "5",
            left: "50%",
            transform: "translateX(-50%)",
          }
        : {})}
    >
      <Image src={logo} alt="Coldtime logo" borderRadius="full" h={"10"} />
      <Text fontSize={24}>
        <b>Coldtime</b> is made with ❤️ by{" "}
        <Link
          href="https://github.com/Arciiix"
          target="_blank"
          rel="noopener noreferrer"
        >
          Artur Nowak
        </Link>
      </Text>
    </Flex>
  );
}
