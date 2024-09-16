import { useState } from "react";
import {
  signInWithEmailAndPassword,
  // GoogleAuthProvider,
  // signInWithPopup,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebase.ts";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./authContext.tsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const { isAdmin } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    try {
      if (isSignUp) {
        // Sign-up logic
        const user = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log("user sign up = ", user);
        // Redirect or notify user after successful sign-up
      } else {
        // Login logic
        const user = await signInWithEmailAndPassword(auth, email, password);
        console.log("user log in = ", user);
        console.log(user.user.email);
        // Redirect or notify user after successful login
      }
      if (isAdmin) {
        console.log("is admin");
        navigate("/admin/approve");
      } else {
        navigate("/wasteForm");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  // const handleGoogleLogin = async () => {
  //   const provider = new GoogleAuthProvider();
  //   try {
  //     await signInWithPopup(auth, provider);
  //     // Redirect or notify user after Google login
  //   } catch (err: any) {
  //     setError(err.message);
  //   }
  // };

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center ">
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-4 w-[80%] ">
        <div className=" md:block md:w-1/2 bg-gray-100 flex items-center justify-center p-10">
          {/* Illustration can go here */}
          <div className="text-center">
            {/* <div className="bg-orange-500 h-24 w-24 rounded-full mb-4"></div>
            <div className="bg-purple-600 h-24 w-24 rounded-lg mb-4"></div>
            <div className="bg-yellow-400 h-24 w-24 rounded-full mb-4"></div> */}
            <img src="/waste_management.jpg" alt="profile pics" />
          </div>
        </div>
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-red-900 text-2xl font-bold text-center mb-8 ">
            {isSignUp ? "Create an Account" : "Welcome back!"}
          </h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {/* <div className="flex justify-between items-center mb-4">
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox h-4 w-4" />
                <span className="ml-2">Remember for 30 days</span>
              </label>
              <a href="#" className="text-sm">
                Forgot password?
              </a>
            </div> */}
            <button className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-900 transition">
              {isSignUp ? "Sign Up" : "Log In"}
            </button>
          </form>
          <div className="my-4">
            {/* <button
              className="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition flex justify-center items-center"
              onClick={handleGoogleLogin}
            >
              {isSignUp ? "Sign up with Google" : "Log in with Google"}
            </button> */}
          </div>
          <p className="text-center text-sm">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <button
              className="underline ml-1"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "Log In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
