import { Button } from "@/components/ui/button";

interface ShopPayButtonProps {
  variantIds: string[];
  className?: string;
}

export function ShopPayButton({ variantIds, className }: ShopPayButtonProps) {
  return (
    <Button 
      className={`bg-[#5a31f4] hover:bg-[#5a31f4]/90 text-white font-sans font-medium ${className}`}
      onClick={() => console.log('Shop Pay checkout initiated for:', variantIds)}
    >
      Buy with Shop Pay
    </Button>
  );
}
