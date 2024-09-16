import React, { useState } from "react";
import Modal from "./modal";

interface WasteItem {
  userid: string;
  wasteName: string;
  date: string;
  wasteType: string;
  imageUrl: string;
  quantity: number;
  method: string;
  status: string; // 'pending', 'approved', 'rejected'
}

interface Props {
  wasteItem: WasteItem;
  onApprove: () => void;
  onReject: () => void;
  handleClick: () => void;
}

const WasteApprovalCard: React.FC<Props> = ({
  wasteItem,
  onApprove,
  onReject,
  handleClick,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);

  // const handleImageClick = () => {
  //   setModalOpen(true);
  // };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white shadow-2xl rounded-md p-4 flex flex-[30%] flex-col my-4 max-w-[400px]"
    >
      <img
        src={wasteItem.imageUrl}
        // src="waste_management.jpg"
        alt="Waste"
        className="w-full h-32 object-cover rounded-md"
        onClick={handleClick}
      />
      <h2 className="text-lg font-bold mt-2">{wasteItem.wasteName}</h2>
      <div className="flex justify-between">
        <div className="px-2">
          <p className="font-semibold text-slate-500">
            Date: <span className="text-slate-950"> {wasteItem.date}</span>
          </p>
          <p className="font-semibold text-slate-500">
            Type: <span className="text-slate-950">{wasteItem.wasteType}</span>
          </p>
        </div>
        <div>
          <p className="font-semibold text-slate-500">
            Quantity:{" "}
            <span className="text-slate-950">{wasteItem.quantity}</span>
          </p>
          <p className="font-semibold text-slate-500">
            Method: <span className="text-slate-950">{wasteItem.method}</span>
          </p>
        </div>
      </div>
      <p className=" text-white w-2/5 bg-slate-600 text-center p-2 font-semibold mt-4 rounded-2xl">
        {" "}
        {wasteItem.status}
      </p>
      {wasteItem.status === "pending" && (
        <div className="flex space-x-2 mt-4">
          <button
            onClick={onApprove}
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Approve
          </button>
          <button
            onClick={onReject}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Reject
          </button>
        </div>
      )}
      {isModalOpen && (
        <Modal imageUrl={wasteItem.imageUrl} onClose={closeModal} />
      )}
    </div>
  );
};

export default WasteApprovalCard;
