import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, Upload, X, User, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ObjectUploader } from "./ObjectUploader";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: string;
  productHandle: string;
  rating: number;
  title: string;
  content: string;
  authorName: string;
  authorEmail: string;
  images: string[] | null;
  createdAt: string;
}

interface ReviewSectionProps {
  productHandle: string;
}

function StarRating({ rating, onRate, interactive = false }: { rating: number; onRate?: (r: number) => void; interactive?: boolean }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onRate?.(star)}
          className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
          disabled={!interactive}
        >
          <Star
            className={`w-5 h-5 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  
  return (
    <div className="border border-white/10 rounded-lg p-6 bg-black/30" data-testid={`review-card-${review.id}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blood-red/20 flex items-center justify-center">
            <User className="w-5 h-5 text-blood-red" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-white">{review.authorName}</p>
              <span className="flex items-center gap-1 text-xs text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                <BadgeCheck className="w-3 h-3" />
                Verified Buyer
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {new Date(review.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
        <StarRating rating={review.rating} />
      </div>
      
      <h4 className="font-bold text-white mb-2">{review.title}</h4>
      <p className="text-gray-300 mb-4">{review.content}</p>
      
      {review.images && review.images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {review.images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setExpandedImage(img)}
              className="relative w-20 h-20 rounded overflow-hidden border border-white/10 hover:border-blood-red transition-colors"
            >
              <img
                src={img}
                alt={`Review image ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {expandedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setExpandedImage(null)}
        >
          <button
            onClick={() => setExpandedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-blood-red"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={expandedImage}
            alt="Expanded review image"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
}

function ReviewForm({ productHandle, onSuccess }: { productHandle: string; onSuccess: () => void }) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const { toast } = useToast();

  const submitMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/reviews", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Review Submitted",
        description: "Thank you for your review!",
      });
      setRating(5);
      setTitle("");
      setContent("");
      setAuthorName("");
      setAuthorEmail("");
      setUploadedImages([]);
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit review",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !authorName || !authorEmail) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    submitMutation.mutate({
      productHandle,
      rating,
      title,
      content,
      authorName,
      authorEmail,
      images: uploadedImages,
    });
  };

  const handleGetUploadParameters = async () => {
    const res = await fetch("/api/objects/upload", { method: "POST" });
    const data = await res.json();
    return {
      method: "PUT" as const,
      url: data.uploadURL,
    };
  };

  const handleUploadComplete = (uploadedUrls: string[]) => {
    setUploadedImages(prev => [...prev, ...uploadedUrls]);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="border border-white/10 rounded-lg p-6 bg-black/30 space-y-4">
      <h3 className="text-xl font-bold text-white mb-4">Write a Review</h3>
      
      <div>
        <label className="block text-sm text-gray-400 mb-2">Rating</label>
        <StarRating rating={rating} onRate={setRating} interactive />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Your Name *</label>
          <Input
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="John Doe"
            className="bg-black/50 border-white/20 text-white"
            data-testid="input-review-name"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Email *</label>
          <Input
            type="email"
            value={authorEmail}
            onChange={(e) => setAuthorEmail(e.target.value)}
            placeholder="john@example.com"
            className="bg-black/50 border-white/20 text-white"
            data-testid="input-review-email"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">Review Title *</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Great product!"
          className="bg-black/50 border-white/20 text-white"
          data-testid="input-review-title"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">Your Review *</label>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your experience with this product..."
          rows={4}
          className="bg-black/50 border-white/20 text-white"
          data-testid="input-review-content"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">Add Photos (optional)</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {uploadedImages.map((url, idx) => (
            <div key={idx} className="relative w-16 h-16">
              <img src={url} alt="" className="w-full h-full object-cover rounded" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-blood-red rounded-full flex items-center justify-center"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
        </div>
        <ObjectUploader
          maxNumberOfFiles={5}
          onGetUploadParameters={handleGetUploadParameters}
          onComplete={handleUploadComplete}
          buttonClassName="bg-black/50 border-white/20 text-white hover:bg-white/10"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Images
        </ObjectUploader>
      </div>

      <Button
        type="submit"
        disabled={submitMutation.isPending}
        className="w-full bg-blood-red hover:bg-blood-red/80 text-white"
        data-testid="button-submit-review"
      >
        {submitMutation.isPending ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}

export function ReviewSection({ productHandle }: ReviewSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ["reviews", productHandle],
    queryFn: async () => {
      const res = await fetch(`/api/reviews/${productHandle}`);
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return res.json();
    },
  });

  const avgRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="mt-16 border-t border-white/10 pt-12" data-testid="review-section">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Customer Reviews</h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-3">
              <StarRating rating={Math.round(avgRating)} />
              <span className="text-gray-400">
                {avgRating.toFixed(1)} out of 5 ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
              </span>
            </div>
          )}
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-blood-red hover:bg-blood-red/80"
          data-testid="button-write-review"
        >
          {showForm ? "Cancel" : "Write a Review"}
        </Button>
      </div>

      {showForm && (
        <div className="mb-8">
          <ReviewForm 
            productHandle={productHandle} 
            onSuccess={() => {
              setShowForm(false);
              queryClient.invalidateQueries({ queryKey: ["reviews", productHandle] });
            }}
          />
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8 text-gray-400">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 border border-white/10 rounded-lg bg-black/20">
          <p className="text-gray-400 mb-4">No reviews yet. Be the first to review this product!</p>
          {!showForm && (
            <Button
              onClick={() => setShowForm(true)}
              variant="outline"
              className="border-blood-red text-blood-red hover:bg-blood-red hover:text-white"
            >
              Write a Review
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}
