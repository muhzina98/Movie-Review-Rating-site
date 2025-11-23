import axios from "axios";

export default function PrimeButton() {
  const startPayment = async () => {
    try {
      const res = await axios.post("/api/payment/create-checkout-session"); 
      // 🔥 BASE_URL removed
      // 🔥 withCredentials removed (handled globally)

      window.location.href = res.data.url;
    } catch (err) {
      alert("Payment start failed!");
    }
  };

  return (
    <button
      onClick={startPayment}
      className="bg-yellow-500 hover:bg-yellow-600 px-5 py-2 rounded font-semibold"
    >
      Become PRIME (Yearly)
    </button>
  );
}
