import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
        getDeviceData: build.query<Array<GetDeviceDataResponse>, void>({
            query: () => "api/devices/",
            providesTags: ["Devices"],
        }),
    }),
});

// Export hooks for usage in functional components
export const { useGetDeviceDataQuery } = api;