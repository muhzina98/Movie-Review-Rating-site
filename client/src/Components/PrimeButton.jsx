import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function PrimeButton() {
  const startPayment = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/payment/create-checkout-session`,
        {},
        { withCredentials: true }
      );
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
