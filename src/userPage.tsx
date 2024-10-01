import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase"; // Import Firebase auth and db from your setup
import { useAuth } from "./authContext";
import { useNavigate } from "react-router-dom";

const WasteDashboard: React.FC = () => {
  const [wasteItems, setWasteItems] = useState<any[]>([]);
  const [totalPoints, setTotalPoints] = useState<number>(0);

  const { currentUser } = useAuth();

  const userid = currentUser!.email;

  // Fetch the waste items disposed by the user
  useEffect(() => {
    const fetchWasteItems = async () => {
      if (!userid) return;

      try {
        const wasteCollection = collection(db, "waste");
        const q = query(wasteCollection, where("userid", "==", userid));
        const wasteSnapshot = await getDocs(q);
        const wasteList = wasteSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as any[];

        const total = wasteList.reduce(
          (acc, waste) => acc + (waste.point || 0),
          0
        );

        setWasteItems(wasteList);
        setTotalPoints(total);
      } catch (error) {
        console.error("Error fetching waste items: ", error);
      }
    };

    fetchWasteItems();
  }, [userid]);
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold text-center mb-4">
        Your Waste Disposals
      </h1>
      <p className="text-lg text-center mb-6">
        Total Points: <span className="font-bold">{totalPoints}</span>
      </p>
      <div className="flex justify-center mb-8">
        <button
          onClick={() => navigate("/wasteForm")}
          className=" py-2 px-6 bg-black text-white rounded-md hover:bg-gray-900 transition"
        >
          upload waste{" "}
        </button>
      </div>

      {wasteItems.length === 0 ? (
        <p className="text-center text-gray-500">No waste submissions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Location</th>
                <th className="py-2 px-4">Quantity</th>
                <th className="py-2 px-4">Type</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Point</th>
              </tr>
            </thead>
            <tbody>
              {wasteItems.map((waste) => (
                <tr key={waste.userid} className="border-b">
                  <td className="py-2 px-4">{waste.wasteName}</td>
                  <td className="py-2 px-4">{waste.location}</td>
                  <td className="py-2 px-4">{waste.quantity || 0}</td>
                  <td className="py-2 px-4">{waste.wasteType}</td>
                  <td className="py-2 px-4">{waste.status}</td>
                  <td className="py-2 px-4">{waste.point}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WasteDashboard;
