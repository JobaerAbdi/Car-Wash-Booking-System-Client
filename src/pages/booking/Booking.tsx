import { Divider, List, Skeleton } from "antd";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import InfiniteScroll from "react-infinite-scroll-component";
import { useGetMyPendingBookingsQuery } from "../../redux/features/admin/Bookings";
import { TBooking } from "../../types/Bookings";


const Booking = () => {
  const [selectedService, setSelectedService] = useState<TBooking | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [data, setData] = useState<TBooking[]>([]);


  // Fetch pending bookings data from the backend
  const { data: MyBookingData, isLoading } = useGetMyPendingBookingsQuery(undefined);

  // Process the fetched data once it's loaded
  useEffect(() => {
    if (MyBookingData?.data) {
      setData(MyBookingData.data);
      if (MyBookingData.data.length > 0) {
        setSelectedService(MyBookingData.data[0]);
      }
    }
  }, [MyBookingData]);

  const loadMoreData = () => {
    if (data.length >= (MyBookingData?.data?.length ?? 0)) {
      return;
    }
    setTimeout(() => {
      setData([
        ...data,
        ...(MyBookingData?.data?.slice(data.length, data.length + 1) ?? []),
      ]);
    }, 1000);
  };

  const handlePayment = () => {
    if (!userName || !userEmail || !selectedDate) {
      Swal.fire({
        title: "Incomplete Information",
        text: "Please fill in all the fields before proceeding to payment.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    // Payment processing logic with AAMARPAY
    const paymentUrl = `https://aamarpay.com/pay?amount=${selectedService?.service?.price}&customer_name=${userName}&customer_email=${userEmail}&service_id=${selectedService?._id}`;
    window.location.href = paymentUrl;

    // Redirect to success page after payment
    window.location.replace("/success");
  };

  if (isLoading) {
    return <p>Loading bookings...</p>;
  }

  return (
    <div className="relative mt-[62px] p-4 min-h-screen grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Left Side: Selected Service and Slot Information */}
      <div className="h-full flex flex-col">
        <h1 className="text-lg lg:text-2xl font-serif p-4 text-center">
          Book Services
        </h1>
        <div
          id="scrollableDiv"
          className="flex-1 overflow-auto p-4 border border-gray-300"
          style={{
            maxHeight: "400px",
          }}
        >
          <InfiniteScroll
            dataLength={data.length}
            next={loadMoreData}
            hasMore={data.length < (MyBookingData?.data?.length ?? 0)}
            loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
            endMessage={
              <Divider className="font-serif" plain>
                It is all, nothing more 🤐
              </Divider>
            }
            scrollableTarget="scrollableDiv"
          >
            <List
              dataSource={data}
              renderItem={(item:any) => (
                <List.Item
                  key={item._id}
                  onClick={() => setSelectedService(item)}
                >
                  <div className="flex flex-col font-serif">
                    <span>{item.service.name}</span>
                    <span>{item.description}</span>
                    <span>Price: ${item.service.price}</span>
                    <span>Duration: {item.service.duration} mins</span>
                  </div>
                </List.Item>
              )}
            />
          </InfiniteScroll>
        </div>
      </div>
      {/* Right Side: User Information Form */}
      <div className="h-full flex flex-col justify-center">
        <h2 className="text-lg lg:text-2xl mb-4 text-center p-4 font-serif">
          User Information
        </h2>
        <div className="relative bg-white rounded-lg shadow-lg font-serif flex-1 overflow-auto">
          <form className="p-3">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Name:</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="border p-2 rounded w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email:</label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="border p-2 rounded w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Select Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border p-2 rounded w-full"
                required
              />
            </div>
            {/* Pay Now Button */}
            <button
              type="button"
              onClick={handlePayment}
              className="mt-4 py-2 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 w-full"
            >
              Pay Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Booking;