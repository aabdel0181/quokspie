import { GetKpisResponse, GetProductsResponse } from "./types";
export interface GetDeviceDataResponse {
    DeviceId: string;
    Timestamp: string;
    ClockSpeed: number;
    MemoryUsed: number;
    PowerUsage: number;
    Temperature: number;
}
export declare const api: import("@reduxjs/toolkit/query").Api<import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, {
    getKpis: import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, "Kpis" | "Products" | "Devices", GetKpisResponse[], "main">;
    getProducts: import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, "Kpis" | "Products" | "Devices", GetProductsResponse[], "main">;
    getDeviceData: import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, "Kpis" | "Products" | "Devices", GetDeviceDataResponse[], "main">;
}, "main", "Kpis" | "Products" | "Devices", typeof import("@reduxjs/toolkit/query").coreModuleName | typeof import("@reduxjs/toolkit/query/react").reactHooksModuleName>;
export declare const useGetKpisQuery: <R extends Record<string, any> = import("@reduxjs/toolkit/query").TSHelpersId<(Omit<{
    status: import("@reduxjs/toolkit/query").QueryStatus.uninitialized;
    originalArgs?: undefined;
    data?: undefined;
    error?: undefined;
    requestId?: undefined;
    endpointName?: string | undefined;
    startedTimeStamp?: undefined;
    fulfilledTimeStamp?: undefined;
} & {
    currentData?: GetKpisResponse[] | undefined;
    isUninitialized: false;
    isLoading: false;
    isFetching: false;
    isSuccess: false;
    isError: false;
}, "isUninitialized"> & {
    isUninitialized: true;
}) | import("@reduxjs/toolkit/query").TSHelpersOverride<import("@reduxjs/toolkit/query").QuerySubState<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, "Kpis" | "Products" | "Devices", GetKpisResponse[], "main">> & {
    currentData?: GetKpisResponse[] | undefined;
    isUninitialized: false;
    isLoading: false;
    isFetching: false;
    isSuccess: false;
    isError: false;
}, {
    isLoading: true;
    isFetching: boolean;
    data: undefined;
} | ({
    isSuccess: true;
    isFetching: true;
    error: undefined;
} & Required<Pick<import("@reduxjs/toolkit/query").QuerySubState<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, "Kpis" | "Products" | "Devices", GetKpisResponse[], "main">> & {
    currentData?: GetKpisResponse[] | undefined;
    isUninitialized: false;
    isLoading: false;
    isFetching: false;
    isSuccess: false;
    isError: false;
}, "data" | "fulfilledTimeStamp">>) | ({
    isSuccess: true;
    isFetching: false;
    error: undefined;
} & Required<Pick<import("@reduxjs/toolkit/query").QuerySubState<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, "Kpis" | "Products" | "Devices", GetKpisResponse[], "main">> & {
    currentData?: GetKpisResponse[] | undefined;
    isUninitialized: false;
    isLoading: false;
    isFetching: false;
    isSuccess: false;
    isError: false;
}, "data" | "fulfilledTimeStamp" | "currentData">>) | ({
    isError: true;
} & Required<Pick<import("@reduxjs/toolkit/query").QuerySubState<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, "Kpis" | "Products" | "Devices", GetKpisResponse[], "main">> & {
    currentData?: GetKpisResponse[] | undefined;
    isUninitialized: false;
    isLoading: false;
    isFetching: false;
    isSuccess: false;
    isError: false;
}, "error">>)>> & {
    status: import("@reduxjs/toolkit/query").QueryStatus;
}>(arg: void | typeof import("@reduxjs/toolkit/query").skipToken, options?: (import("@reduxjs/toolkit/query").SubscriptionOptions & {
    skip?: boolean;
    refetchOnMountOrArgChange?: boolean | number;
} & {
    skip?: boolean;
    selectFromResult?: ((state: import("@reduxjs/toolkit/query").TSHelpersId<(Omit<{
        status: import("@reduxjs/toolkit/query").QueryStatus.uninitialized;
        originalArgs?: undefined;
        data?: undefined;
        error?: undefined;
        requestId?: undefined;
        endpointName?: string | undefined;
        startedTimeStamp?: undefined;
        fulfilledTimeStamp?: undefined;
    } & {
        currentData?: GetKpisResponse[] | undefined;
        isUninitialized: false;
        isLoading: false;
        isFetching: false;
        isSuccess: false;
        isError: false;
    }, "isUninitialized"> & {
        isUninitialized: true;
    }) | import("@reduxjs/toolkit/query").TSHelpersOverride<import("@reduxjs/toolkit/query").QuerySubState<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, "Kpis" | "Products" | "Devices", GetKpisResponse[], "main">> & {
        currentData?: GetKpisResponse[] | undefined;
        isUninitialized: false;
        isLoading: false;
        isFetching: false;
        isSuccess: false;
        isError: false;
    }, {
        isLoading: true;
        isFetching: boolean;
        data: undefined;
    } | ({
        isSuccess: true;
        isFetching: true;
        error: undefined;
    } & Required<Pick<import("@reduxjs/toolkit/query").QuerySubState<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, "Kpis" | "Products" | "Devices", GetKpisResponse[], "main">> & {
        currentData?: GetKpisResponse[] | undefined;
        isUninitialized: false;
        isLoading: false;
        isFetching: false;
        isSuccess: false;
        isError: false;
    }, "data" | "fulfilledTimeStamp">>) | ({
        isSuccess: true;
        isFetching: false;
        error: undefined;
    } & Required<Pick<import("@reduxjs/toolkit/query").QuerySubState<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, "Kpis" | "Products" | "Devices", GetKpisResponse[], "main">> & {
        currentData?: GetKpisResponse[] | undefined;
        isUninitialized: false;
        isLoading: false;
        isFetching: false;
        isSuccess: false;
        isError: false;
    }, "data" | "fulfilledTimeStamp" | "currentData">>) | ({
        isError: true;
    } & Required<Pick<import("@reduxjs/toolkit/query").QuerySubState<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, "Kpis" | "Products" | "Devices", GetKpisResponse[], "main">> & {
        currentData?: GetKpisResponse[] | undefined;
        isUninitialized: false;
        isLoading: false;
        isFetching: false;
        isSuccess: false;
        isError: false;
    }, "error">>)>> & {
        status: import("@reduxjs/toolkit/query").QueryStatus;
    }) => R) | undefined;
}) | undefined) => [R][R extends any ? 0 : never] & {
    refetch: () => import("@reduxjs/toolkit/query").QueryActionCreatorResult<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, "Kpis" | "Products" | "Devices", GetKpisResponse[], "main">>;
}, useGetProductsQuery: <R extends Record<string, any> = import("@reduxjs/toolkit/query").TSHelpersId<(Omit<{
    status: import("@reduxjs/toolkit/query").QueryStatus.uninitialized;
    originalArgs?: undefined;
    data?: undefined;
    error?: undefined;
    requestId?: undefined;
    endpointName?: string | undefined;
    startedTimeStamp?: undefined;
    fulfilledTimeStamp?: undefined;
} & {
    currentData?: GetProductsResponse[] | undefined;
    isUninitialized: false;
    isLoading: false;
    isFetching: false;
    isSuccess: false;
    isError: false;
}, "isUninitialized"> & {
    isUninitialized: true;
}) | import("@reduxjs/toolkit/query").TSHelpersOverride<import("@reduxjs/toolkit/query").QuerySubState<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, "Kpis" | "Products" | "Devices", GetProductsResponse[], "main">> & {
    currentData?: GetProductsResponse[] | undefined;
    isUninitialized: false;
    isLoading: false;
    isFetching: false;
    isSuccess: false;
    isError: false;
}, {
    isLoading: true;
    isFetching: boolean;
    data: undefined;
} | ({
    isSuccess: true;
    isFetching: true;
    error: undefined;
} & Required<Pick<import("@reduxjs/toolkit/query").QuerySubState<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, "Kpis" | "Products" | "Devices", GetProductsResponse[], "main">> & {
    currentData?: GetProductsResponse[] | undefined;
    isUninitialized: false;
    isLoading: false;
    isFetching: false;
    isSuccess: false;
    isError: false;
}, "data" | "fulfilledTimeStamp">>) | ({
    isSuccess: true;
    isFetching: false;
    error: undefined;
} & Required<Pick<import("@reduxjs/toolkit/query").QuerySubState<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, "Kpis" | "Products" | "Devices", GetProductsResponse[], "main">> & {
    currentData?: GetProductsResponse[] | undefined;
    isUninitialized: false;
    isLoading: false;
    isFetching: false;
    isSuccess: false;
    isError: false;
}, "data" | "fulfilledTimeStamp" | "currentData">>) | ({
    isError: true;
} & Required<Pick<import("@reduxjs/toolkit/query").QuerySubState<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, "Kpis" | "Products" | "Devices", GetProductsResponse[], "main">> & {
    currentData?: GetProductsResponse[] | undefined;
    isUninitialized: false;
    isLoading: false;
    isFetching: false;
    isSuccess: false;
    isError: false;
}, "error">>)>> & {
    status: import("@reduxjs/toolkit/query").QueryStatus;
}>(arg: void | typeof import("@reduxjs/toolkit/query").skipToken, options?: (import("@reduxjs/toolkit/query").SubscriptionOptions & {
    skip?: boolean;
    refetchOnMountOrArgChange?: boolean | number;
} & {
    skip?: boolean;
    selectFromResult?: ((state: import("@reduxjs/toolkit/query").TSHelpersId<(Omit<{
        status: import("@reduxjs/toolkit/query").QueryStatus.uninitialized;
        originalArgs?: undefined;
        data?: undefined;
        error?: undefined;
        requestId?: undefined;
        endpointName?: string | undefined;
        startedTimeStamp?: undefined;
        fulfilledTimeStamp?: undefined;
    } & {
        currentData?: GetProductsResponse[] | undefined;
        isUninitialized: false;
        isLoading: false;
        isFetching: false;
        isSuccess: false;
        isError: false;
    }, "isUninitialized"> & {
        isUninitialized: true;
    }) | import("@reduxjs/toolkit/query").TSHelpersOverride<import("@reduxjs/toolkit/query").QuerySubState<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, "Kpis" | "Products" | "Devices", GetProductsResponse[], "main">> & {
        currentData?: GetProductsResponse[] | undefined;
        isUninitialized: false;
        isLoading: false;
        isFetching: false;
        isSuccess: false;
        isError: false;
    }, {
        isLoading: true;
        isFetching: boolean;
        data: undefined;
    } | ({
        isSuccess: true;
        isFetching: true;
        error: undefined;
    } & Required<Pick<import("@reduxjs/toolkit/query").QuerySubState<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, "Kpis" | "Products" | "Devices", GetProductsResponse[], "main">> & {
        currentData?: GetProductsResponse[] | undefined;
        isUninitialized: false;
        isLoading: false;
        isFetching: false;
        isSuccess: false;
        isError: false;
    }, "data" | "fulfilledTimeStamp">>) | ({
        isSuccess: true;
        isFetching: false;
        error: undefined;
    } & Required<Pick<import("@reduxjs/toolkit/query").QuerySubState<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, "Kpis" | "Products" | "Devices", GetProductsResponse[], "main">> & {
        currentData?: GetProductsResponse[] | undefined;
        isUninitialized: false;
        isLoading: false;
        isFetching: false;
        isSuccess: false;
        isError: false;
    }, "data" | "fulfilledTimeStamp" | "currentData">>) | ({
        isError: true;
    } & Required<Pick<import("@reduxjs/toolkit/query").QuerySubState<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, "Kpis" | "Products" | "Devices", GetProductsResponse[], "main">> & {
        currentData?: GetProductsResponse[] | undefined;
        isUninitialized: false;
        isLoading: false;
        isFetching: false;
        isSuccess: false;
        isError: false;
    }, "error">>)>> & {
        status: import("@reduxjs/toolkit/query").QueryStatus;
    }) => R) | undefined;
}) | undefined) => [R][R extends any ? 0 : never] & {
    refetch: () => import("@reduxjs/toolkit/query").QueryActionCreatorResult<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, "Kpis" | "Products" | "Devices", GetProductsResponse[], "main">>;
}, useGetDeviceDataQuery: <R extends Record<string, any> = import("@reduxjs/toolkit/query").TSHelpersId<(Omit<{
    status: import("@reduxjs/toolkit/query").QueryStatus.uninitialized;
    originalArgs?: undefined;
    data?: undefined;
    error?: undefined;
    requestId?: undefined;
    endpointName?: string | undefined;
    startedTimeStamp?: undefined;
    fulfilledTimeStamp?: undefined;
} & {
    currentData?: GetDeviceDataResponse[] | undefined;
    isUninitialized: false;
    isLoading: false;
    isFetching: false;
    isSuccess: false;
    isError: false;
}, "isUninitialized"> & {
    isUninitialized: true;
}) | import("@reduxjs/toolkit/query").TSHelpersOverride<import("@reduxjs/toolkit/query").QuerySubState<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, "Kpis" | "Products" | "Devices", GetDeviceDataResponse[], "main">> & {
    currentData?: GetDeviceDataResponse[] | undefined;
    isUninitialized: false;
    isLoading: false;
    isFetching: false;
    isSuccess: false;
    isError: false;
}, {
    isLoading: true;
    isFetching: boolean;
    data: undefined;
} | ({
    isSuccess: true;
    isFetching: true;
    error: undefined;
} & Required<Pick<import("@reduxjs/toolkit/query").QuerySubState<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, "Kpis" | "Products" | "Devices", GetDeviceDataResponse[], "main">> & {
    currentData?: GetDeviceDataResponse[] | undefined;
    isUninitialized: false;
    isLoading: false;
    isFetching: false;
    isSuccess: false;
    isError: false;
}, "data" | "fulfilledTimeStamp">>) | ({
    isSuccess: true;
    isFetching: false;
    error: undefined;
} & Required<Pick<import("@reduxjs/toolkit/query").QuerySubState<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, "Kpis" | "Products" | "Devices", GetDeviceDataResponse[], "main">> & {
    currentData?: GetDeviceDataResponse[] | undefined;
    isUninitialized: false;
    isLoading: false;
    isFetching: false;
    isSuccess: false;
    isError: false;
}, "data" | "fulfilledTimeStamp" | "currentData">>) | ({
    isError: true;
} & Required<Pick<import("@reduxjs/toolkit/query").QuerySubState<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, "Kpis" | "Products" | "Devices", GetDeviceDataResponse[], "main">> & {
    currentData?: GetDeviceDataResponse[] | undefined;
    isUninitialized: false;
    isLoading: false;
    isFetching: false;
    isSuccess: false;
    isError: false;
}, "error">>)>> & {
    status: import("@reduxjs/toolkit/query").QueryStatus;
}>(arg: void | typeof import("@reduxjs/toolkit/query").skipToken, options?: (import("@reduxjs/toolkit/query").SubscriptionOptions & {
    skip?: boolean;
    refetchOnMountOrArgChange?: boolean | number;
} & {
    skip?: boolean;
    selectFromResult?: ((state: import("@reduxjs/toolkit/query").TSHelpersId<(Omit<{
        status: import("@reduxjs/toolkit/query").QueryStatus.uninitialized;
        originalArgs?: undefined;
        data?: undefined;
        error?: undefined;
        requestId?: undefined;
        endpointName?: string | undefined;
        startedTimeStamp?: undefined;
        fulfilledTimeStamp?: undefined;
    } & {
        currentData?: GetDeviceDataResponse[] | undefined;
        isUninitialized: false;
        isLoading: false;
        isFetching: false;
        isSuccess: false;
        isError: false;
    }, "isUninitialized"> & {
        isUninitialized: true;
    }) | import("@reduxjs/toolkit/query").TSHelpersOverride<import("@reduxjs/toolkit/query").QuerySubState<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, "Kpis" | "Products" | "Devices", GetDeviceDataResponse[], "main">> & {
        currentData?: GetDeviceDataResponse[] | undefined;
        isUninitialized: false;
        isLoading: false;
        isFetching: false;
        isSuccess: false;
        isError: false;
    }, {
        isLoading: true;
        isFetching: boolean;
        data: undefined;
    } | ({
        isSuccess: true;
        isFetching: true;
        error: undefined;
    } & Required<Pick<import("@reduxjs/toolkit/query").QuerySubState<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, "Kpis" | "Products" | "Devices", GetDeviceDataResponse[], "main">> & {
        currentData?: GetDeviceDataResponse[] | undefined;
        isUninitialized: false;
        isLoading: false;
        isFetching: false;
        isSuccess: false;
        isError: false;
    }, "data" | "fulfilledTimeStamp">>) | ({
        isSuccess: true;
        isFetching: false;
        error: undefined;
    } & Required<Pick<import("@reduxjs/toolkit/query").QuerySubState<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, "Kpis" | "Products" | "Devices", GetDeviceDataResponse[], "main">> & {
        currentData?: GetDeviceDataResponse[] | undefined;
        isUninitialized: false;
        isLoading: false;
        isFetching: false;
        isSuccess: false;
        isError: false;
    }, "data" | "fulfilledTimeStamp" | "currentData">>) | ({
        isError: true;
    } & Required<Pick<import("@reduxjs/toolkit/query").QuerySubState<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, "Kpis" | "Products" | "Devices", GetDeviceDataResponse[], "main">> & {
        currentData?: GetDeviceDataResponse[] | undefined;
        isUninitialized: false;
        isLoading: false;
        isFetching: false;
        isSuccess: false;
        isError: false;
    }, "error">>)>> & {
        status: import("@reduxjs/toolkit/query").QueryStatus;
    }) => R) | undefined;
}) | undefined) => [R][R extends any ? 0 : never] & {
    refetch: () => import("@reduxjs/toolkit/query").QueryActionCreatorResult<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, "Kpis" | "Products" | "Devices", GetDeviceDataResponse[], "main">>;
};
