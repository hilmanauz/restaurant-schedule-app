import { ResponseAPIProps } from "@/lib/fetch-api-client/types";

export type FetchDataProps = {
    loading: boolean;
    fetchData: ({
        promise,
        onClose,
        onError,
        success,
    }: {
        promise: () =>
            | Promise<void>
            | Promise<ResponseAPIProps>
            | Promise<PromiseSettledResult<ResponseAPIProps>[]>;
        onClose?: (
            res:
                | ResponseAPIProps
                | PromiseSettledResult<ResponseAPIProps>[]
                | void
        ) => void;
        onError?: (idx?: number) => void;
        success?: {
            title: string | React.ReactNode;
            desc: string | React.ReactNode;
        };
    }) => Promise<
        ResponseAPIProps | PromiseSettledResult<ResponseAPIProps>[] | undefined
    >;
    LoadingCover: () => JSX.Element;
};
