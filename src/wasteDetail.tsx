import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Import Firestore methods
import { db } from "./firebase"; // Adjust the path as per your setup

interface WasteItem {
  userid: string;
  wasteName: string;
  location: string;
  date: string;
  disposalMethod: string;
  quantity: number;
  wasteType: string;
  imageUrl: string;
  status: string;
  description: string;
  additionalWasteInfo: string;
  bankName: string;
  accountNumber: string;
}

const WasteDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [wasteItem, setWasteItem] = useState<WasteItem | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [additionalInfo, setAdditionalInfo] = useState<string>("");

  // Fetch the waste item from Firebase
  const fetchWasteItem = async () => {
    const wasteDoc = doc(db, "waste", id!); // Use Firestore modular syntax
    const wasteSnap = await getDoc(wasteDoc);

    if (wasteSnap.exists()) {
      setWasteItem({ userid: wasteSnap.id, ...wasteSnap.data() } as WasteItem);
    } else {
      setWasteItem({
        userid: "2",
        wasteName: "Cow wastes",
        location: "obj",
        date: "2024-09-03",
        wasteType: "Organic",
        imageUrl: "https://via.placeholder.com/150",
        quantity: 5,
        disposalMethod: "Drop-off",
        status: "approved",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maiores aliquid, rem laudantium molestias culpa ducimus exercitationem quo quod necessitatibus? Dicta eius deleniti officia consequatur magni. Reiciendis soluta repudiandae sunt ab ad ipsa, sit sapiente esse sint nulla quis labore, dolorum quidem pariatur, eaque animi quas magni perspiciatis suscipit! Neque, a vel tempore voluptatum est possimus molestias ullam odio asperiores dolores ipsam in enim ab reiciendis cumque nam provident, perferendis assumenda mollitia. Sed consequuntur repellendus saepe velit accusantium vero non. Accusamus ab aliquam soluta! Iusto alias perferendis dolore in fugiat quis itaque mollitia. Consequuntur nam maiores doloremque, harum ipsum est dolor. ",
        additionalWasteInfo:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maiores aliquid, rem laudantium molestias culpa ducimus exercitationem quo quod necessitatibus? Dicta eius deleniti officia consequatur magni. Reiciendis soluta repudiandae sunt ab ad ipsa, sit sapiente esse sint nulla quis labore, dolorum quidem pariatur, eaque animi quas magni perspiciatis suscipit! Neque, a vel tempore voluptatum est possimus molestias ullam odio asperiores dolores ipsam in enim ab reiciendis cumque nam provident, perferendis assumenda mollitia. Sed consequuntur repellendus saepe velit accusantium vero non. Accusamus ab aliquam soluta! Iusto alias perferendis dolore in fugiat quis itaque mollitia. Consequuntur nam maiores doloremque, harum ipsum est dolor.",
        bankName: "Eco bank",
        accountNumber: "22102200000",
      });
      console.log("No such waste item found");
    }
  };

  useEffect(() => {
    if (id) {
      fetchWasteItem();
    }
  }, [id]);

  // Approve waste item
  const handleApprove = async () => {
    if (wasteItem) {
      const wasteDoc = doc(db, "waste", wasteItem.userid);
      await updateDoc(wasteDoc, {
        status: "approved",
      });
      alert("Waste approved");
    }
  };

  // Reject waste item
  const handleReject = async () => {
    if (wasteItem) {
      const wasteDoc = doc(db, "waste", wasteItem.userid);
      await updateDoc(wasteDoc, {
        status: "rejected",
      });
      alert("Waste rejected");
    }
  };

  if (!wasteItem) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex flex-col gap-8">
        {/* Waste Image */}
        <div className="flex justify-center">
          <img
            src={wasteItem.imageUrl}
            // src="/waste_management.jpg"
            alt={wasteItem.wasteType}
            className="w-full max-w-lg object-cover"
          />
        </div>

        {/* Waste Details */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4">{wasteItem.wasteName}</h1>
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500 font-semibold text-2xl mb-2">
                {wasteItem.wasteType}
              </p>
              <p className="  mb-4">
                {" "}
                <span className="font-semibold"> User </span> -{" "}
                {wasteItem.userid}
              </p>
              <p className="  mb-4">
                {" "}
                <span className="font-semibold"> Quantity</span> -{" "}
                {wasteItem.quantity}
              </p>
              <p className=" mb-4">{wasteItem.date}</p>
            </div>
            <div>
              <p className="mb-4">
                <span className="font-semibold"> Waste Method</span> -
                {wasteItem.disposalMethod}
              </p>
              <p className="mb-4">
                <span className="font-semibold"> Location </span> -
                {wasteItem.location}
              </p>
              <p className=" mb-4">
                <span className="font-semibold"> Status </span> -{" "}
                {wasteItem.status}
              </p>
            </div>
            <div>
              <p className="text-2xl semi-bold mb-4">Bank Details</p>
              <p className="mb-4">
                <span className="font-semibold"> Bank Name</span> -
                {wasteItem.bankName}
              </p>
              <p className="mb-4">
                <span className="font-semibold"> Account Number </span> -
                {wasteItem.accountNumber}
              </p>
            </div>
          </div>

          <p className="text-gray-800 mb-4">{wasteItem.description}</p>
          <p className="text-gray-600 mb-4">{wasteItem.additionalWasteInfo}</p>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Reward Price ( Optional if rejected )
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded-lg"
              placeholder="Enter the amount of reward in naira"
              value={additionalInfo}
              onChange={(e: any) => setAdditionalInfo(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">
              Additional Infor mation for the user
            </label>
            <textarea
              className="w-full p-2 border rounded-lg"
              placeholder="Enter the amount of reward in naira"
              value={amount}
              onChange={(e: any) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={handleApprove}
            >
              Approve
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={handleReject}
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WasteDetailsPage;
