import { useEffect } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const navigate = useNavigate();
  const { fetchUser, setUser } = useAuth();

  useEffect(() => {
    async function verify() {
      try {
        console.log("Session ID:", sessionId);

        const res = await axios.get(
          `/payment/verify-session?session_id=${sessionId}`
        );

        const updatedUser = res.data.user;

        if (updatedUser) {
          setUser(updatedUser);
        } else {
          fetchUser();
        }

        alert("🎉 PRIME Activated Successfully!");
        navigate("/user-dashboard");
      } catch (err) {
        console.error(err);
        alert("Verification failed!");
        navigate("/user-dashboard");
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
