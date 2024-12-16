import { ModalProps as MantineModalProps } from "@mantine/core";

export interface ModalProps extends MantineModalProps {
    stickyHeader?: boolean;
    Footer?: React.ReactNode;
}
