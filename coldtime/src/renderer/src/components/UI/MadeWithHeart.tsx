import { Flex, Image, Link, Text } from "@chakra-ui/react";

export default function MadeWithHeart() {
  return (
    <Flex
      position="absolute"
      bottom="5"
      left="50%"
      transform="translateX(-50%)"
      alignItems={"center"}
      gap={2}
    >
      <Image
        src="/src/assets/logo.png"
        alt="Coldtime logo"
        borderRadius="full"
        h={"10"}
      />
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
