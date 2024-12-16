import React, { memo } from "react";
import { Modal as MantineModal, Portal } from "@mantine/core";
import { ModalProps } from "./modal.types";
import { useFrame } from "react-frame-component";
import { classNames } from "@/utils";
import { useFocusTrap } from "@mantine/hooks";

const ModalComponent: React.FC<ModalProps> = ({
    centered,
    stickyHeader,
    Footer,
    ...props
}) => {
    const { document, window } = useFrame();
    const focusTrapRef = useFocusTrap();
    const isIframe = React.useMemo(
        () => window?.self !== window?.top,
        [window]
    );
    if (!document || !window) return <></>;

    return (
        <MantineModal.Root
            {...{
                ...props,
                scrollAreaComponent: stickyHeader
                    ? props.scrollAreaComponent
                    : undefined,
                h: isIframe ? props.h : undefined,
                title: undefined,
            }}
            trapFocus={false}
            target={isIframe ? document.body : undefined}
            centered={centered ?? true}
        >
            <MantineModal.Overlay />
            <MantineModal.Content
                h={props.h}
                mah={props.mah}
                className={classNames("!overflow-hidden !flex flex-col")}
            >
                {props.title && (
                    <MantineModal.Header className="border-b">
                        <MantineModal.Title className="!font-bold !text-[1.125rem] leading-5">
                            {props.title}
                        </MantineModal.Title>
                        <MantineModal.CloseButton />
                    </MantineModal.Header>
                )}
                <MantineModal.Body
                    className={classNames(
                        stickyHeader ? "h-[calc(100%-54px)]" : "",
                        "relative w-full overflow-auto flex flex-col",
                        props.title ? "!pt-3" : ""
                    )}
                    ref={focusTrapRef}
                >
                    {!stickyHeader && props.scrollAreaComponent ? (
                        <props.scrollAreaComponent>
                            {props.children}
                        </props.scrollAreaComponent>
                    ) : (
                        props.children
                    )}
                </MantineModal.Body>
                {Footer && <div className="p-3 pt-0">{Footer}</div>}
            </MantineModal.Content>
        </MantineModal.Root>
    );
};

export const Modal = memo(ModalComponent);
