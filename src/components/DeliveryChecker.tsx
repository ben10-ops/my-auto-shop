import { useState } from "react";
import { MapPin, Truck, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeliveryCheck } from "@/hooks/useDeliveryCheck";

interface DeliveryCheckerProps {
  onResult?: (available: boolean, charge?: number) => void;
}

export const DeliveryChecker = ({ onResult }: DeliveryCheckerProps) => {
  const [pincode, setPincode] = useState("");
  const { isChecking, isAvailable, deliveryArea, checkPincode } = useDeliveryCheck();

  const handleCheck = async () => {
    const result = await checkPincode(pincode);
    if (result && onResult) {
      onResult(result.available, result.area?.delivery_charge);
    }
  };

  return (
    <div className="p-4 rounded-xl bg-muted/50 border border-border">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-5 h-5 text-primary" />
        <span className="font-medium">Check Local Delivery</span>
      </div>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="Enter Pincode"
          className="flex-1 h-10 px-4 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
        />
        <Button 
          variant="outline" 
          onClick={handleCheck}
          disabled={pincode.length !== 6 || isChecking}
        >
          {isChecking ? <Loader2 className="w-4 h-4 animate-spin" /> : "Check"}
        </Button>
      </div>

      {isAvailable === true && deliveryArea && (
        <div className="mt-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Delivery Available!</span>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            <p><strong>{deliveryArea.area_name}, {deliveryArea.city}</strong></p>
            <div className="flex items-center gap-4 mt-1">
              <span className="flex items-center gap-1">
                <Truck className="w-4 h-4" />
                {deliveryArea.estimated_days === 1 ? "Same Day" : `${deliveryArea.estimated_days} Days`}
              </span>
              <span>
                Delivery: {deliveryArea.delivery_charge === 0 ? "FREE" : `₹${deliveryArea.delivery_charge}`}
              </span>
            </div>
          </div>
        </div>
      )}

      {isAvailable === false && (
        <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <div className="flex items-center gap-2 text-red-500">
            <XCircle className="w-5 h-5" />
            <span className="font-medium">Not Available</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Sorry, we don't deliver to this area yet. We're expanding our delivery network.
          </p>
        </div>
      )}
    </div>
  );
};
