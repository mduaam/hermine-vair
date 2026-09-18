'use client';
// CLIENT: interactive audit log viewer with expandable before/after state diffs

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Layers, Search } from 'lucide-react';

interface AuditEntry {
  id: string;
  actor_id?: string | null;
  action: string;
  resource_type: string;
  resource_id: string;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  ip?: string | null;
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
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filtrer par action, type de ressource ou ID..."
            className="w-full bg-white border border-slate-300 rounded-md pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 shadow-xs"
          />
        </div>
        <div className="text-xs text-slate-500 whitespace-nowrap">
          <span className="font-mono font-semibold text-slate-900">{filteredLogs.length}</span> entrées
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-3 px-4 w-8"></th>
                <th className="py-3 px-4">Horodatage</th>
                <th className="py-3 px-4">Action Exécutée</th>
                <th className="py-3 px-4">Ressource Cible</th>
                <th className="py-3 px-4">Opérateur / IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {filteredLogs.map((entry) => {
                const isExpanded = expandedId === entry.id;
                return (
                  <React.Fragment key={entry.id}>
                    <tr
                      onClick={() => toggleExpand(entry.id)}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 text-center">
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-indigo-600 inline-block" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 inline-block" />
                        )}
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-600 whitespace-nowrap">
                        {new Date(entry.created_at).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 font-mono text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold tracking-wide rounded">
                          {entry.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-900">
                        <div className="flex items-center gap-1.5">
                          <span className="uppercase text-[10px] text-slate-400 font-medium">
                            {entry.resource_type} :
                          </span>
                          <span className="font-mono text-xs font-semibold text-slate-800">
                            {entry.resource_id}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        <div className="text-[11px] font-sans">
                          <span className="font-mono text-slate-700">{entry.ip || '127.0.0.1'}</span>
                          {entry.actor_id && (
                            <span className="text-[10px] block text-slate-400 font-mono truncate max-w-[140px]">
                              {entry.actor_id}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Expandable Before / After Diff */}
                    {isExpanded && (
                      <tr className="bg-slate-50/60 border-b border-slate-200">
                        <td colSpan={5} className="p-4 sm:p-5 space-y-3">
                          <div className="flex items-center gap-2 text-xs font-sans text-slate-900 font-semibold border-b border-slate-200 pb-2">
                            <Layers className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Traçabilité des États (Before / After Snapshot)</span>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Before */}
                            <div className="space-y-1.5">
                              <span className="text-[10px] uppercase font-mono font-semibold tracking-wider text-slate-500 block">
                                État Initial (Before) :
                              </span>
                              <pre className="p-3 bg-white border border-slate-200 rounded text-[11px] text-slate-700 font-mono overflow-x-auto max-h-48 leading-relaxed shadow-xs">
                                {entry.before
                                  ? JSON.stringify(entry.before, null, 2)
                                  : 'null (Création initiale)'}
                              </pre>
                            </div>

                            {/* After */}
                            <div className="space-y-1.5">
                              <span className="text-[10px] uppercase font-mono font-semibold tracking-wider text-indigo-700 block">
                                Nouvel État (After) :
                              </span>
                              <pre className="p-3 bg-white border border-indigo-200 rounded text-[11px] text-indigo-950 font-mono overflow-x-auto max-h-48 leading-relaxed shadow-xs">
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
