import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import {
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";

interface IPagination {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  setPageSize: Dispatch<SetStateAction<number>>;
}

export default function Pagination({
  currentPage,
  totalPages,
  pageSize,
  setCurrentPage,
  setPageSize,
}: IPagination) {
  const { t } = useTranslation();

  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === totalPages;

  const handlePreviousPage = () => {
    if (!isFirstPage) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (!isLastPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleFirstPage = () => {
    setCurrentPage(0);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages - 1);
  };

  const renderPageButton = (pageNumber) => (
    <Button
      rounded="full"
      key={pageNumber}
      isActive={pageNumber === currentPage}
      onClick={() => setCurrentPage(pageNumber)}
    >
      {pageNumber + 1}
    </Button>
  );
  const renderPageButtons = () => {
    const pageButtons: JSX.Element[] = [];

    // Show 3 page buttons, centered on the current page
    for (
      let pageNumber = Math.max(currentPage - 1, 0);
      pageNumber <= Math.min(currentPage + 1, totalPages - 1);
      pageNumber++
    ) {
      pageButtons.push(renderPageButton(pageNumber));
    }

    return pageButtons;
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNaN(e.target.valueAsNumber) || e.target.valueAsNumber < 1) return;

    setPageSize(e.target.valueAsNumber);
  };

  return (
    <Flex gap={4} justifyContent="flex-end" alignItems={"center"} m={3} p={3}>
      <FormControl
        as={Flex}
        justifyContent="center"
        alignItems="center"
        w="max-content"
      >
        <FormLabel>{t("pagination.pageSize")}</FormLabel>
        <Input
          type="number"
          onChange={handlePageSizeChange}
          w={24}
          value={pageSize}
          min={1}
        />
      </FormControl>
      <IconButton
        isDisabled={isFirstPage}
        icon={<HiChevronDoubleLeft />}
        onClick={handleFirstPage}
        aria-label={t("pagination.firstPage")}
      />
      <IconButton
        isDisabled={isFirstPage}
        icon={<HiChevronLeft />}
        onClick={handlePreviousPage}
        aria-label={t("pagination.previousPage")}
      />

      {renderPageButtons()}
      <IconButton
        isDisabled={isLastPage}
        icon={<HiChevronRight />}
        onClick={handleNextPage}
        aria-label={t("pagination.nextPage")}
      />
      <IconButton
        isDisabled={isLastPage}
        icon={<HiChevronDoubleRight />}
        onClick={handleLastPage}
        aria-label={t("pagination.lastPage")}
      />
    </Flex>
  );
}
