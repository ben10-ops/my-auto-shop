import { useEffect, useState } from "react";
import { Search, FileText, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AuditLog {
  id: string;
  admin_user_id: string;
  action_type: string;
  table_name: string;
  record_id: string | null;
  old_values: any;
  new_values: any;
  description: string | null;
  created_at: string;
}

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTable, setFilterTable] = useState("");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("admin_audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (!error && data) {
      setLogs(data);
    }
    setIsLoading(false);
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.table_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTable = !filterTable || log.table_name === filterTable;
    return matchesSearch && matchesTable;
  });

  const getActionBadge = (action: string) => {
    const colors: Record<string, string> = {
      CREATE: "bg-green-500/20 text-green-500",
      UPDATE: "bg-blue-500/20 text-blue-500",
      DELETE: "bg-red-500/20 text-red-500",
      STATUS_UPDATE: "bg-purple-500/20 text-purple-500",
    };
    return colors[action] || "bg-muted text-muted-foreground";
  };

  const tables = [...new Set(logs.map((l) => l.table_name))];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="font-heading text-2xl sm:text-3xl mb-6">Audit Logs</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-card border border-border text-sm focus:outline-none focus:border-primary"
          />
        </div>
        <select
          value={filterTable}
          onChange={(e) => setFilterTable(e.target.value)}
          className="h-10 px-3 rounded-lg bg-card border border-border text-sm focus:outline-none focus:border-primary"
        >
          <option value="">All Tables</option>
          {tables.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No audit logs found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-xl bg-card border border-border"
            >
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${getActionBadge(log.action_type)}`}
                  >
                    {log.action_type}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground">
                    {log.table_name}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {new Date(log.created_at).toLocaleString()}
                </div>
              </div>

              {log.description && (
                <p className="text-sm mb-2">{log.description}</p>
              )}

              {log.record_id && (
                <p className="text-xs text-muted-foreground">
                  Record ID: {log.record_id}
                </p>
              )}

              {(log.old_values || log.new_values) && (
                <details className="mt-2">
                  <summary className="text-xs text-primary cursor-pointer hover:underline">
                    View changes
                  </summary>
                  <div className="mt-2 grid sm:grid-cols-2 gap-2 text-xs">
                    {log.old_values && (
                      <div className="p-2 rounded bg-red-500/10">
                        <p className="font-medium text-red-400 mb-1">Before</p>
                        <pre className="overflow-x-auto text-muted-foreground">
                          {JSON.stringify(log.old_values, null, 2)}
                        </pre>
                      </div>
                    )}
                    {log.new_values && (
                      <div className="p-2 rounded bg-green-500/10">
                        <p className="font-medium text-green-400 mb-1">After</p>
                        <pre className="overflow-x-auto text-muted-foreground">
                          {JSON.stringify(log.new_values, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminAuditLogs;
