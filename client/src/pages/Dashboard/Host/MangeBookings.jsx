import { Helmet } from "react-helmet-async";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import { getHostBookings } from "../../../api/booking";
import TableRows from "../../../components/Dashboard/TableRows/TableRows";

const MangeBookings = () => {
  const { user, loading } = useAuth();
  const {
    data: bookings = [],

    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["bookings", user?.email],
    enabled: !loading,
    queryFn: async () => await getHostBookings(user?.email),
  });

  if (isLoading) return <LoadingSpinner></LoadingSpinner>;

  console.log(bookings);
  return (
    <>
      <Helmet>
        <title>My Listings</title>
      </Helmet>

      <div className="container mx-auto px-4 sm:px-8">
        <div className="py-8">
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                     guest Info
                    </th>

                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      From
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      To
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookings &&
                    bookings.map((booking) => (
                      <TableRows
                      booking={booking}
                        key={booking._id}
                        refetch={refetch}
                      ></TableRows>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MangeBookings;
