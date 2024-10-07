import React, { useEffect, useState } from "react";
import WasteApprovalCard from "./WasteApprovalCard";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import { useNavigate } from "react-router-dom";

interface WasteItem {
  id: string;
  userid: string;
  name: string;
  date: string;
  wasteType: string;
  imageUrl: string;
  quantity: number;
  method: string;
  status: string; // 'pending', 'approved', 'rejected'
}

// export const
//   {
//     id: "1",
//     name: "Nylons",
//     date: "2024-09-05",
//     wasteType: "Plastic",
//     imageUrl: "https://via.placeholder.com/150",
//     quantity: 10,
//     method: "Pickup",
//     status: "pending",
//   },
//   {
//     id: "2",
//     name: "Plastic waste",
//     date: "2024-09-03",
//     wasteType: "Organic",
//     imageUrl: "https://via.placeholder.com/150",
//     quantity: 5,
//     method: "Drop-off",
//     status: "approved",
//   },
//   {
//     id: "3",
//     name: "Glass bottles",
//     date: "2024-09-02",
//     wasteType: "Glass",
//     imageUrl: "https://via.placeholder.com/150",
//     quantity: 8,
//     method: "Pickup",
//     status: "rejected",
//   },
//   {
//     id: "4",
//     name: "Unlabeled Waste",
//     date: "2024-09-01",
//     wasteType: "Metal",
//     imageUrl: "https://via.placeholder.com/150",
//     quantity: 12,
//     method: "Drop-off",
//     status: "pending",
//   },
//   {
//     id: "5",
//     name: "Brown papers",
//     date: "2024-08-30",
//     wasteType: "Paper",
//     imageUrl: "https://via.placeholder.com/150",
//     quantity: 7,
//     method: "Pickup",
//     status: "pending",
//   },
//   {
//     id: "6",
//     name: "drink plastics",
//     date: "2024-08-28",
//     wasteType: "Plastic",
//     imageUrl: "https://via.placeholder.com/150",
//     quantity: 20,
//     method: "Drop-off",
//     status: "approved",
//   },
//   {
//     id: "7",
//     name: "cow dungs",
//     date: "2024-08-27",
//     wasteType: "Organic",
//     imageUrl: "https://via.placeholder.com/150",
//     quantity: 3,
//     method: "Pickup",
//     status: "pending",
//   },
//   {
//     id: "8",
//     name: "Olivia Harris",
//     date: "2024-08-26",
//     wasteType: "Glass",
//     imageUrl: "https://via.placeholder.com/150",
//     quantity: 15,
//     method: "Drop-off",
//     status: "approved",
//   },
//   {
//     id: "9",
//     name: "Sophia Miller",
//     date: "2024-08-25",
//     wasteType: "Metal",
//     imageUrl: "https://via.placeholder.com/150",
//     quantity: 9,
//     method: "Pickup",
//     status: "rejected",
//   },
//   {
//     id: "10",
//     name: "James Anderson",
//     date: "2024-08-24",
//     wasteType: "Plastic",
//     imageUrl: "https://via.placeholder.com/150",
//     quantity: 25,
//     method: "Drop-off",
//     status: "pending",
//   },
// ];

const AdminApproval: React.FC = () => {
  const [wasteItems, setWasteItems] = useState<any[]>([]);

  const fetchWasteItems = async () => {
    const wasteCollection = collection(db, "waste");
    const wasteSnapshot = await getDocs(wasteCollection);
    const wasteList = wasteSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as WasteItem[];
    setWasteItems(wasteList);
    console.log(wasteList);
  };

  const handleApproval = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    const wasteDoc = doc(db, "waste", id);
    await updateDoc(wasteDoc, { status });
    fetchWasteItems(); // Refresh the data after approval/rejection
  };

  useEffect(() => {
    fetchWasteItems();
  }, []);

  const navigate = useNavigate();

  const handleCardClick = (id: string) => {
    navigate(`/waste/${id}`);
  };

  return (
    <div className="flex flex-col  p-6 bg-gray-100">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4 ">Waste Management Approval</h1>
        <button
          onClick={() => navigate("/create-admin")}
          className=" py-2 px-6 bg-black text-white rounded-md hover:bg-gray-900 transition"
        >
          Create Admin
        </button>
      </div>
      <div className="flex justify-evenly flex-wrap">
        {wasteItems.map((item) => (
          <WasteApprovalCard
            key={item.id}
            wasteItem={item}
            onApprove={() => handleApproval(item.id, "approved")}
            onReject={() => handleApproval(item.id, "rejected")}
            handleClick={() => handleCardClick(item.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminApproval;
