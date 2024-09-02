import { TBooking } from "../../../types/Bookings";
import { TResponceRedux } from "../../../types/global";
import { baseApi } from "../../api/BaseApi";

const BookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBookings: builder.query({
      query: () => {
        return {
          url: "/bookings",
          method: "GET",
        };
      },
      transformResponse: (response: TResponceRedux<TBooking[]>) => ({
        data: response.data,
        meta: response.meta,
      }),
    }),
    getMyBookings: builder.query({
      query: () => {
        return {
          url: "/my-bookings",
          method: "GET",
        };
      },
      transformResponse: (response: TResponceRedux<TBooking[]>) => ({
        data: response.data,
        meta: response.meta,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetAllBookingsQuery, useGetMyBookingsQuery } = BookingApi;
