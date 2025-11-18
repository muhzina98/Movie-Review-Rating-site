import { useEffect } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";  
const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const navigate = useNavigate();
  const { fetchUser ,setUser} = useAuth(); 

  useEffect(() => {
  async function verify() {
    try {
      console.log("Session ID:", sessionId);

      const res = await axios.get(
        `${BASE_URL}/api/payment/verify-session?session_id=${sessionId}`,
        { withCredentials: true }
      );

const updatedUser = res.data.user;
        if (updatedUser) {
          // update local storage + auth context
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setUser(updatedUser);
        } else {
          // fallback to re-fetch
          fetchUser();
        }

      alert("🎉 PRIME Activated Successfully!");
      navigate("/user-dashboard");
    } catch (err) {
      console.error(err);
      alert("Verification failed!");
    }
  }

  if (sessionId) verify();
}, [sessionId]);


  return (
    <div className="text-center p-10">
      <h1 className="text-3xl font-bold">Verifying Payment...</h1>
    </div>
  );
}
