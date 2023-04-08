import { useState, useEffect, useCallback } from "react";
import {
  Box,
  MenuItem,
  MenuList,
  Menu,
  MenuButton,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";

type Option = {
  label: string;
  prefix?: JSX.Element;
  handler: () => void;
};

type Options = Option[];

function useContextMenu(options: Options) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleOptionClick = useCallback(
    (handler: () => void) => {
      handleClose();
      handler();
    },
    [handleClose]
  );

  const menu = (
    <Box position="absolute" left={position.x} top={position.y}>
      <Menu onClose={handleClose} isOpen={isOpen} placement="bottom-end">
        <MenuList>
          {options.map(({ prefix, label, handler }) => (
            <MenuItem key={label} onClick={() => handleOptionClick(handler)}>
              <Flex gap={3} alignItems={"center"}>
                {prefix}
                {label}
              </Flex>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );

  const onContextMenu = useCallback((e: React.MouseEvent) => {
    setIsOpen(true);
    setPosition({ x: e.pageX, y: e.pageY });
  }, []);

  return { isOpen, menu, onContextMenu };
}

export default useContextMenu;
