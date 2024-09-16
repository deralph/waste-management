import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Import Firestore methods
import { db } from "./firebase"; // Adjust the path as per your setup

interface WasteItem {
  id: string;
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

  const navigate = useNavigate();
  // Fetch the waste item from Firebase
  const fetchWasteItem = async () => {
    const wasteDoc = doc(db, "waste", id!); // Use Firestore modular syntax
    const wasteSnap = await getDoc(wasteDoc);

    if (wasteSnap.exists()) {
      setWasteItem({ userid: wasteSnap.id, ...wasteSnap.data() } as WasteItem);
    } else {
      console.log("No such waste item found");
    }
  };

  useEffect(() => {
    if (id) {
      fetchWasteItem();
    }
  }, [id]);

  const handleApprove = async () => {
    if (wasteItem) {
      // Firebase logic for approving the waste
      try {
        await updateDoc(doc(db, "waste", wasteItem.id), {
          status: "approved",
          approvedAt: new Date(),
        });
        // Extract necessary details
        const email = wasteItem.userid;
        const wasteDescription = wasteItem.description;
        const awardedPrice = amount;

        // Construct the mailto link
        const mailtoLink = `mailto:${email}?subject=Waste Approval Notification&body=Dear esteemed user ,%0D%0A%0D%0AWe are pleased to inform you that your waste submission has been approved!%0D%0A%0D%0AWaste Description: ${wasteDescription}%0D%0AAwarded Price: $${awardedPrice}%0D%0AAdditional Info: ${additionalInfo}%0D%0A%0D%0AThank you for your contribution to making our environment cleaner!%0D%0A%0D%0ABest regards,%0D%0AThe Waste Management Team`;

        // Open the mailto link in a new tab
        window.location.href = mailtoLink;
        alert("Waste approved");
        navigate("/admin/approve");
      } catch (error: any) {
        console.error("Error approving waste: ", error);
        alert(`Error approving waste:  ${error}!`);
      }
    } else {
      console.log("invalid waste page");
    }
  };

  const handleReject = async () => {
    // Firebase logic for rejecting the waste
    if (wasteItem) {
      try {
        await updateDoc(doc(db, "waste", wasteItem.id), {
          status: "rejected",
          rejectedAt: new Date(),
        });

        // Extract necessary details
        const email = wasteItem.userid;
        const wasteDescription = wasteItem.description;

        // Construct the mailto link
        const mailtoLink = `mailto:${email}?subject=Waste Rejection Notification&body=Dear esteemed user,%0D%0A%0D%0AWe regret to inform you that your waste submission has been rejected.%0D%0A%0D%0AWaste Description: ${wasteDescription}%0D%0AReason: ${
          additionalInfo ||
          "Unfortunately, your submission does not meet our criteria at this time."
        }%0D%0A%0D%0AWe encourage you to review our guidelines and submit again in the future.%0D%0A%0D%0AThank you for your understanding,%0D%0A%0D%0ABest regards,%0D%0AThe Waste Management Team`;

        // Open the mailto link in a new tab
        window.location.href = mailtoLink;
        alert("Waste rejected");
        navigate("/admin/approve");
      } catch (error) {
        console.error("Error rejecting waste: ", error);
        alert(`Error rejecting waste: ", ${error} `);
      }
    } else {
      console.log("invalid waste page");
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
              Additional Information for the user
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
