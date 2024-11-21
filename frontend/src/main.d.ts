import '@/index.css';
export declare const store: import("@reduxjs/toolkit").EnhancedStore<{
    main: import("@reduxjs/toolkit/query").CombinedState<{
        getKpis: import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, "Kpis" | "Products" | "Devices", import("./state/types.ts").GetKpisResponse[], "main">;
        getProducts: import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, "Kpis" | "Products" | "Devices", import("./state/types.ts").GetProductsResponse[], "main">;
        getDeviceData: import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, "Kpis" | "Products" | "Devices", import("./state/api.ts").GetDeviceDataResponse[], "main">;
    }, "Kpis" | "Products" | "Devices", "main">;
}, import("redux").UnknownAction, import("@reduxjs/toolkit").Tuple<[import("redux").StoreEnhancer<{
    dispatch: import("redux-thunk").ThunkDispatch<{
        main: import("@reduxjs/toolkit/query").CombinedState<{
            getKpis: import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, "Kpis" | "Products" | "Devices", import("./state/types.ts").GetKpisResponse[], "main">;
            getProducts: import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, "Kpis" | "Products" | "Devices", import("./state/types.ts").GetProductsResponse[], "main">;
            getDeviceData: import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, "Kpis" | "Products" | "Devices", import("./state/api.ts").GetDeviceDataResponse[], "main">;
        }, "Kpis" | "Products" | "Devices", "main">;
    }, undefined, import("redux").UnknownAction>;
}>, import("redux").StoreEnhancer]>>;
