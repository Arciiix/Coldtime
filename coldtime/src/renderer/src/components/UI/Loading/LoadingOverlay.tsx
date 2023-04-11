import {
  Center,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import Loading from "./Loading";

const LoadingOverlay = ({ isLoading }) => {
  return (
    <Modal isOpen={isLoading} onClose={() => null} isCentered size="full">
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent
        bg="rgba(5, 102, 230, 0.082)"
        borderRadius="20px"
        boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
        backdropFilter="blur(20px)"
        border="1px solid rgba(255, 255, 255, 0.2)"
      >
        <ModalBody
          position={"fixed"}
          left="50%"
          top="50%"
          transform="translate(-50%, -50%)"
        >
          <Center>
            <Loading isLoading={isLoading} />
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LoadingOverlay;
