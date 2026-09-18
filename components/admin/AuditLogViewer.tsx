'use client';
// CLIENT: interactive audit log viewer with expandable before/after state diffs

import React, { useState } from 'react';
import { Shield, ChevronDown, ChevronRight, User, Terminal, Calendar, Layers } from 'lucide-react';

interface AuditEntry {
  id: string;
  actor_id?: string;
  action: string;
  resource_type: string;
  resource_id: string;
  before: any;
  after: any;
  ip?: string;
  created_at: string;
}

interface AuditLogViewerProps {
  logs: AuditEntry[];
}

export function AuditLogViewer({ logs }: AuditLogViewerProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const filteredLogs = logs.filter((log) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      log.action.toLowerCase().includes(term) ||
      log.resource_type.toLowerCase().includes(term) ||
      log.resource_id.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="flex items-center justify-between gap-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filtrer par action, type de ressource ou identifiant..."
          className="w-full sm:w-96 bg-background border border-border/60 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold"
        />
        <div className="text-xs text-muted-foreground whitespace-nowrap">
          <span className="font-mono font-medium text-foreground">{filteredLogs.length}</span> entrées
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-surface border border-border/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/60 bg-muted/20 text-muted-foreground uppercase tracking-widest text-[10px]">
                <th className="py-3.5 px-4 font-normal w-8"></th>
                <th className="py-3.5 px-4 font-normal">Horodatage</th>
                <th className="py-3.5 px-4 font-normal">Action Exécutée</th>
                <th className="py-3.5 px-4 font-normal">Ressource Cible</th>
                <th className="py-3.5 px-4 font-normal">Opérateur / IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-mono text-[11px]">
              {filteredLogs.map((entry) => {
                const isExpanded = expandedId === entry.id;
                return (
                  <React.Fragment key={entry.id}>
                    <tr
                      onClick={() => toggleExpand(entry.id)}
                      className="hover:bg-muted/10 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4 text-center">
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-gold inline-block" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground inline-block" />
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-sans text-muted-foreground whitespace-nowrap">
                        {new Date(entry.created_at).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 font-mono text-[10px] bg-primary/10 text-primary border border-primary/20 font-semibold tracking-wide">
                          {entry.action}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-sans text-foreground">
                        <div className="flex items-center gap-1.5">
                          <span className="uppercase text-[10px] text-muted-foreground">
                            {entry.resource_type} :
                          </span>
                          <span className="font-mono text-xs font-medium">
                            {entry.resource_id}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">
                        <div className="text-[10px] font-sans">
                          <span>{entry.ip || '127.0.0.1'}</span>
                          {entry.actor_id && (
                            <span className="text-[9px] block text-muted-foreground font-mono truncate max-w-[120px]">
                              {entry.actor_id}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Expandable Before / After Diff */}
                    {isExpanded && (
                      <tr className="bg-muted/5 border-b border-border/40">
                        <td colSpan={5} className="p-4 sm:p-6 space-y-4">
                          <div className="flex items-center gap-2 text-xs font-serif text-primary font-medium border-b border-border/40 pb-2">
                            <Layers className="w-3.5 h-3.5 text-gold" />
                            <span>Traçabilité des États (Before / After Snapshot)</span>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Before */}
                            <div className="space-y-1.5">
                              <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground block">
                                État Initial (Before) :
                              </span>
                              <pre className="p-3 bg-background border border-border/60 text-[10px] text-muted-foreground font-mono overflow-x-auto rounded-none max-h-48">
                                {entry.before
                                  ? JSON.stringify(entry.before, null, 2)
                                  : 'null (Création initiale)'}
                              </pre>
                            </div>

                            {/* After */}
                            <div className="space-y-1.5">
                              <span className="text-[10px] uppercase font-mono tracking-wider text-primary block font-medium">
                                Nouvel État (After) :
                              </span>
                              <pre className="p-3 bg-background border border-border/60 text-[10px] text-foreground font-mono overflow-x-auto rounded-none max-h-48">
                                {entry.after ? JSON.stringify(entry.after, null, 2) : 'null'}
                              </pre>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
