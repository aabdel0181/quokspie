import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { GetKpisResponse, GetProductsResponse } from "./types";

// Define the response type for device data
export interface GetDeviceDataResponse {
    DeviceId: string;
    Timestamp: string;
    ClockSpeed: number;
    MemoryUsed: number; 
    PowerUsage: number;
    Temperature: number;
}

// Create an API slice
export const api = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
    reducerPath: "main",
    tagTypes: ["Kpis", "Products", "Devices"],
    endpoints: (build) => ({
        getKpis: build.query<Array<GetKpisResponse>, void>({
            query: () => "kpi/kpis/",
            providesTags: ["Kpis"],
        }),
        getProducts: build.query<Array<GetProductsResponse>, void>({
            query: () => "product/products/",
            providesTags: ["Products"],
        }),
        getDeviceData: build.query<Array<GetDeviceDataResponse>, void>({
            query: () => "api/devices",
            providesTags: ["Devices"],
        }),
    }),
});

// Export hooks for usage in functional components
export const { useGetKpisQuery, useGetProductsQuery, useGetDeviceDataQuery } = api;