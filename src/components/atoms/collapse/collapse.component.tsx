import { memo } from "react";
import { Collapse as MantineCollapse } from "@mantine/core";
import { CollapseProps } from "./collapse.types";

const CollapseComponent: React.FC<CollapseProps> = ({ ...props }) => {
	return (
		<MantineCollapse
			{...props}
		/>
	);
};

export const Collapse = memo(CollapseComponent);
