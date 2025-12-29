import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface AuditLogParams {
  actionType: string;
  tableName: string;
  recordId?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  description?: string;
}

export const useAuditLog = () => {
  const { user } = useAuth();

  const logAction = async ({
    actionType,
    tableName,
    recordId,
    oldValues,
    newValues,
    description,
  }: AuditLogParams) => {
    if (!user) return;

    try {
      await supabase.from("admin_audit_logs").insert({
        admin_user_id: user.id,
        action_type: actionType,
        table_name: tableName,
        record_id: recordId,
        old_values: oldValues,
        new_values: newValues,
        description,
      });
    } catch (error) {
      console.error("Failed to log audit action:", error);
    }
  };

  return { logAction };
};
