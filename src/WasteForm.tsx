import { useState } from "react";
import { storage, db } from "./firebase.ts"; // Make sure to configure Firebase
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { useAuth } from "./authContext.tsx";

const WasteForm = () => {
  const [wasteName, setWasteName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<any>(null);
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [wasteType, setWasteType] = useState("");
  const [additionalWasteInfo, setAdditionalWasteInfo] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { currentUser } = useAuth();

  const userid = currentUser!.email;

  const handleImageChange = (e: any) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!image) {
      alert("Please upload an image.");
      return;
    }
    const storageRef = ref(storage, `wasteImages/${image.name}`);
    try {
      // Upload the image to Firebase storage
      await uploadBytes(storageRef, image);
      const imageUrl = await getDownloadURL(storageRef);

      // Save the waste data along with the image URL to Firestore
      await addDoc(collection(db, "waste"), {
        userid,
        wasteName,
        location,
        date,
        quantity,
        wasteType,
        imageUrl,
        status: "pending",
        point: 0,
        description,
        additionalWasteInfo,
      });

      setSuccessMessage("Waste details and image uploaded successfully!");
      setWasteName("");
      setDescription("");
      setLocation("");
      setDate("");
      setQuantity("");
      setWasteType("");
      setImage(null);
      setAdditionalWasteInfo("");
    } catch (error: any) {
      console.error("Error uploading waste:", error);
      setSuccessMessage(`An error occured : ${error!.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-white flex flex-col md:flex-row rounded-lg shadow-lg w-full lg:w-4/5 overflow-hidden">
        {/* Picture Section */}
        <div className="md:w-1/2 flex items-center justify-center p-8">
          <img
            src="waste_management.jpg" // Replace this with the appropriate image URL
            alt="Waste"
            className="object-contain max-h-60 md:max-h-full"
          />
        </div>

        {/* Form Section */}
        <div className="md:w-1/2 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-center mb-6">
            Waste Management Form
          </h2>
          {successMessage && (
            <p className="text-green-500 mb-4 text-center">{successMessage}</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium">
                Waste Name
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                placeholder="Enter the name of the waste"
                value={wasteName}
                onChange={(e: any) => setWasteName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Upload Image
              </label>
              <input
                type="file"
                className="w-full p-2 border rounded-lg"
                onChange={handleImageChange}
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Location</label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                placeholder="Enter the location"
                value={location}
                onChange={(e: any) => setLocation(e.target.value)}
                required
              />
            </div>

            <div className="flex space-x-4">
              <div>
                <label className="block mb-2 text-sm font-medium">Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-lg"
                  value={date}
                  onChange={(e: any) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Quantity</label>
              <input
                type="number"
                className="w-full p-2 border rounded-lg"
                placeholder="Enter the quantity"
                value={quantity}
                onChange={(e: any) => setQuantity(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Waste Type
              </label>
              <select
                className="w-full p-2 border rounded-lg"
                value={wasteType}
                onChange={(e: any) => setWasteType(e.target.value)}
                required
              >
                <option value="">Select Waste Type</option>
                <option value="Plastic">Plastic</option>
                <option value="Organic">Organic</option>
                <option value="Electronic">Electronic</option>
                <option value="Metal">Metal</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Description
              </label>
              <textarea
                className="w-full p-2 border rounded-lg"
                placeholder="Enter Waste Description"
                value={description}
                onChange={(e: any) => setDescription(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Additional Information
              </label>
              <textarea
                className="w-full p-2 border rounded-lg"
                placeholder="Enter any additional information"
                value={additionalWasteInfo}
                onChange={(e: any) => setAdditionalWasteInfo(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Submit Waste
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WasteForm;
