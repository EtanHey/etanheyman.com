'use client';

import { useEffect, useState } from 'react';
import {
  getLinkedInConnections,
  getConnectionMatches,
  type LinkedInConnection,
  type ConnectionMatch,
} from '../actions/data';
import {
  Users,
  RefreshCw,
  ExternalLink,
  Building2,
  Search,
  Briefcase,
  MessageCircle,
  Link2,
} from 'lucide-react';

function formatDate(date: string | null): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

const matchTypeColors: Record<string, string> = {
  exact: 'bg-emerald-500/20 text-emerald-400',
  substring: 'bg-blue-500/20 text-blue-400',
  fuzzy: 'bg-amber-500/20 text-amber-400',
};

export default function ConnectionsPage() {
  const [connections, setConnections] = useState<LinkedInConnection[]>([]);
  const [matches, setMatches] = useState<ConnectionMatch[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedConnection, setSelectedConnection] = useState<LinkedInConnection | null>(null);
  const [messagesOnly, setMessagesOnly] = useState(false);

  const refresh = async () => {
    setLoading(true);
    const [connResult, matchResult] = await Promise.all([
      getLinkedInConnections({ search, hasMessages: messagesOnly || undefined }),
      getConnectionMatches(),
    ]);
    setConnections(connResult.connections);
    setTotal(connResult.total);
    setMatches(matchResult.matches);
    setLoading(false);
  };

  useEffect(() => { refresh(); }, [search, messagesOnly]);

  const connectionMatches = (connectionId: string) =>
    matches.filter((m) => m.connection_id === connectionId);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between pb-4">
        <h1 className="text-lg font-semibold text-white flex items-center gap-2">
          <Users className="h-5 w-5 text-amber-400" />
          LinkedIn Connections
          <span className="text-sm font-normal text-white/40">
            ({total} connections, {matches.length} job matches)
          </span>
        </h1>
        <button
          onClick={refresh}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-white/60 hover:bg-white/5"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Search + Filters */}
      <div className="shrink-0 flex items-center gap-3 pb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input
            type="text"
            placeholder="Search by name, company, position..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm text-white placeholder-white/30 focus:border-white/20 focus:outline-none"
          />
        </div>
        <button
          onClick={() => setMessagesOnly(!messagesOnly)}
          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
            messagesOnly
              ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
              : 'border-white/10 text-white/60 hover:bg-white/5'
          }`}
        >
          <MessageCircle className="h-4 w-4" />
          With Messages
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex gap-4 min-h-0 overflow-hidden">
        {/* Connections List */}
        <div className={`${selectedConnection ? 'hidden md:flex' : 'flex'} w-full md:w-[360px] md:shrink-0 flex-col min-h-0 md:border-r md:border-white/10 md:pr-4`}>
          <div className="flex-1 overflow-y-auto space-y-2">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-6 w-6 text-white/40 animate-spin" />
              </div>
            ) : connections.length === 0 ? (
              <div className="text-center py-12 text-white/50">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No connections found</p>
              </div>
            ) : (
              connections.map((conn) => {
                const jobMatches = connectionMatches(conn.id);
                return (
                  <button
                    key={conn.id}
                    type="button"
                    onClick={() => setSelectedConnection(conn)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedConnection?.id === conn.id
                        ? 'bg-white/10 border-white/30'
                        : 'bg-white/5 border-white/10 hover:bg-white/[0.07]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm text-white font-medium truncate flex-1">
                        {conn.full_name}
                      </p>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {conn.has_messages && (
                          <MessageCircle className="h-3.5 w-3.5 text-amber-400" />
                        )}
                        {jobMatches.length > 0 && (
                          <span className="text-[10px] text-emerald-400 bg-emerald-400/10 rounded-full px-1.5 py-0.5 font-medium">
                            {jobMatches.length} match{jobMatches.length !== 1 && 'es'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      {conn.company && (
                        <span className="flex items-center gap-1 truncate">
                          <Building2 className="h-3 w-3" />
                          {conn.company}
                        </span>
                      )}
                    </div>
                    {conn.position && (
                      <div className="text-xs text-white/40 truncate mt-0.5">
                        {conn.position}
                      </div>
                    )}
                    <div className="mt-1 text-[10px] text-white/30">
                      Connected {formatDate(conn.connected_on)}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Connection Detail */}
        <div className={`${selectedConnection ? 'flex' : 'hidden md:flex'} flex-1 flex-col min-h-0`}>
          {selectedConnection ? (
            <div className="h-full flex flex-col bg-white/5 rounded-lg border border-white/10 p-5 overflow-hidden">
              <button
                type="button"
                onClick={() => setSelectedConnection(null)}
                className="md:hidden shrink-0 text-white/60 mb-3 text-sm"
              >
                &larr; Back
              </button>

              {/* Connection Header */}
              <div className="shrink-0 border-b border-white/10 pb-4 mb-4">
                <h2 className="text-lg font-semibold text-white">{selectedConnection.full_name}</h2>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-white/60">
                  {selectedConnection.company && (
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5" />
                      {selectedConnection.company}
                    </span>
                  )}
                  {selectedConnection.position && <span>{selectedConnection.position}</span>}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedConnection.email && (
                    <span className="text-xs text-white/50 bg-white/5 rounded px-2 py-1">
                      {selectedConnection.email}
                    </span>
                  )}
                  {selectedConnection.linkedin_url && (
                    <a
                      href={selectedConnection.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 bg-blue-400/10 rounded px-2 py-1 flex items-center gap-1 hover:bg-blue-400/20"
                    >
                      LinkedIn <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {selectedConnection.has_messages && (
                    <span className="text-xs text-amber-400 bg-amber-400/10 rounded px-2 py-1 flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" /> Has messages
                    </span>
                  )}
                </div>
                <div className="text-xs text-white/30 mt-2">
                  Connected {formatDate(selectedConnection.connected_on)}
                  {selectedConnection.relationship_strength && selectedConnection.relationship_strength !== 'unknown' && (
                    <> | Relationship: {selectedConnection.relationship_strength}</>
                  )}
                </div>
              </div>

              {/* Job Matches for this connection */}
              <div className="flex-1 overflow-y-auto space-y-3">
                <h3 className="text-sm font-medium text-white/60 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Job Matches ({connectionMatches(selectedConnection.id).length})
                </h3>
                {connectionMatches(selectedConnection.id).length === 0 ? (
                  <p className="text-sm text-white/40 py-4">
                    No matching jobs found for {selectedConnection.company || 'this company'}
                  </p>
                ) : (
                  connectionMatches(selectedConnection.id).map((match) => (
                    <div
                      key={match.id}
                      className="bg-white/5 rounded-lg border border-white/10 p-3"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-medium rounded-full px-2 py-0.5 ${
                            matchTypeColors[match.company_match_type] || 'bg-white/10 text-white/60'
                          }`}>
                            {match.company_match_type}
                          </span>
                          <span className="text-xs text-white/40">
                            {Math.round(match.match_confidence * 100)}% confidence
                          </span>
                        </div>
                        {match.job?.match_score != null && (
                          <span className={`text-xs font-medium ${
                            match.job.match_score >= 7 ? 'text-emerald-400' :
                            match.job.match_score >= 4 ? 'text-amber-400' : 'text-white/40'
                          }`}>
                            Score: {match.job.match_score}/10
                          </span>
                        )}
                      </div>
                      {match.job && (
                        <div>
                          <p className="text-sm text-white font-medium">{match.job.title}</p>
                          <p className="text-xs text-white/50 mt-0.5">
                            {match.job.company}
                            {match.job.status && (
                              <span className="ml-2 text-white/30">({match.job.status})</span>
                            )}
                          </p>
                          <a
                            href={match.job.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-1"
                          >
                            View listing <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-white/40 bg-white/[0.02] rounded-lg border border-white/5">
              <Link2 className="h-16 w-16 mb-4 opacity-30" />
              <p className="text-lg">Select a connection</p>
              <p className="text-sm mt-1">View their details and job matches</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
