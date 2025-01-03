import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase"; // Import Supabase client

export default function Request() {
  const navigate = useNavigate();
  const [bloodStock, setBloodStock] = useState([]);
  const [requestData, setRequestData] = useState([]);

  // Fixed blood groups
  const fixedBloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Fetch blood stock data
  useEffect(() => {
    const fetchBloodStock = async () => {
      try {
        const { data, error } = await supabase
          .from("blood_stock")
          .select("blood_type, no_of_bottles");

        if (error) throw error;

        // Ensure all fixed blood groups are displayed
        const bloodStockData = fixedBloodGroups.map((group) => {
          const match = data.find((item) => item.blood_type === group);
          return {
            blood_type: group,
            total_units: match ? parseInt(match.no_of_bottles, 10) || 0 : 0,
          };
        });

        setBloodStock(bloodStockData);
      } catch (error) {
        console.error("Error fetching blood stock:", error.message);
      }
    };

    fetchBloodStock();
  }, []);

  // Fetch request data
  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        const { data, error } = await supabase
          .from("requests")
          .select("blood_type, quantity, status,request_date, ward_no");

        if (error) throw error;

        setRequestData(data || []);
      } catch (error) {
        console.error("Error fetching request data:", error.message);
      }
    };

    fetchRequestData();
  }, []);

  return (
    <div className="flex items-center justify-center flex-grow bg-gray-200 overflow-hidden">
      <div className="flex w-full m-2">
        {/* Left Side: Blood Stock Data */}
        <div className="w-1/3 grid grid-rows-8 gap-4 px-8 pb-8 bg-gray-100 rounded shadow mx-4">
          <h3 className="text-xl font-bold text-center text-gray-800 mt-4">Available Units</h3>
          {bloodStock.map((stock, index) => (
            <div
              key={index}
              className="bg-red-100 rounded-lg shadow-md p-3 flex items-center w-[90%]"
            >
              <div className="flex justify-between w-full mx-4">
                <span className="text-lg font-semibold text-red-700">{stock.blood_type}</span>
                <span className="text-gray-700">Available units: {stock.total_units}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Request Details Table */}
        <div className="w-2/3 border p-4 rounded shadow bg-gray-100 relative">
          <h2 className="text-xl font-bold mb-10 text-center">Request Details</h2>
          <button
            onClick={() => navigate("/Requestform")}
            className="font-bold absolute top-10 right-10 text-white active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all mt-4 py-2 px-10 rounded-xl text-lg"
            style={{ backgroundColor: "#dc143c" }}
          >
            Add
          </button>
          <div className="py-8">
            <table className="w-full border-collapse rounded-lg bg-white shadow-md overflow-hidden">
              <thead>
                <tr className="border-b">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ward No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blood Group
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Units
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {requestData.length > 0 ? (
                  requestData.map((request, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-6 py-4 whitespace-nowrap">{request.request_date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{request.ward_no}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        {request.blood_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{request.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            request.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : request.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : request.status === "Rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {request.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-6 text-gray-500 font-medium"
                    >
                      No Requests Available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
