import { memo } from "react";
import { Pagination as MantinePagination } from "@mantine/core";
import { PaginationProps } from "./pagination.types";

const PaginationComponent: React.FC<PaginationProps> = ({ ...props }) => {
	return (
		<MantinePagination
			{...props}
		/>
	);
};

export const Pagination = memo(PaginationComponent);
