import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface DeliveryArea {
  id: string;
  pincode: string;
  area_name: string;
  city: string;
  delivery_charge: number;
  estimated_days: number;
  is_active: boolean;
}

export const useDeliveryCheck = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [deliveryArea, setDeliveryArea] = useState<DeliveryArea | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const checkPincode = async (pincode: string) => {
    if (!pincode || pincode.length !== 6) {
      setIsAvailable(null);
      setDeliveryArea(null);
      return;
    }

    setIsChecking(true);
    
    const { data, error } = await supabase
      .from("delivery_areas")
      .select("*")
      .eq("pincode", pincode)
      .eq("is_active", true)
      .maybeSingle();

    setIsChecking(false);

    if (error || !data) {
      setIsAvailable(false);
      setDeliveryArea(null);
      return { available: false, area: null };
    }

    setIsAvailable(true);
    setDeliveryArea(data);
    return { available: true, area: data };
  };

  const reset = () => {
    setIsAvailable(null);
    setDeliveryArea(null);
  };

  return {
    isChecking,
    isAvailable,
    deliveryArea,
    checkPincode,
    reset
  };
};
