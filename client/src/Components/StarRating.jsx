import { Star } from "lucide-react";

const StarRating = ({ rating, setRating }) => {
  return (
    <div className="flex gap-1 cursor-pointer">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={24}
          onClick={() => setRating(star)}    
          className={
            star <= rating
              ? "text-yellow-500 fill-yellow-500 transition"
              : "text-gray-400 dark:text-gray-600 transition"
          }
        />
      ))}
    </div>
  );
};

export default StarRating;
