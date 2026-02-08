'use client';

import { useEffect, useState } from 'react';
import { getOutreachData, type OutreachContact, type OutreachMessage } from '../actions/data';
import { Users, RefreshCw, Send, ExternalLink, Building2 } from 'lucide-react';

const statusColors: Record<string, string> = {
  draft: 'bg-zinc-500/20 text-zinc-400',
  sent: 'bg-blue-500/20 text-blue-400',
  replied: 'bg-emerald-500/20 text-emerald-400',
  bounced: 'bg-red-500/20 text-red-400',
  pending: 'bg-amber-500/20 text-amber-400',
};

function formatDate(date: string): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString();
}

export default function OutreachPage() {
  const [contacts, setContacts] = useState<OutreachContact[]>([]);
  const [messages, setMessages] = useState<OutreachMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<OutreachContact | null>(null);

  const refresh = async () => {
    setLoading(true);
    const { contacts: c, messages: m } = await getOutreachData();
    setContacts(c);
    setMessages(m);
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  const contactMessages = (contactId: string) =>
    messages.filter((m) => m.contact_id === contactId);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between pb-4">
        <h1 className="text-lg font-semibold text-white flex items-center gap-2">
          <Users className="h-5 w-5 text-emerald-400" />
          Outreach Pipeline
          <span className="text-sm font-normal text-white/40">
            ({contacts.length} contacts, {messages.length} messages)
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

      {/* Content */}
      <div className="flex-1 flex gap-4 min-h-0 overflow-hidden">
        {/* Contacts List */}
        <div className={`${selectedContact ? 'hidden md:flex' : 'flex'} w-full md:w-[360px] md:shrink-0 flex-col min-h-0 md:border-r md:border-white/10 md:pr-4`}>
          <div className="flex-1 overflow-y-auto space-y-2">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-6 w-6 text-white/40 animate-spin" />
              </div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-12 text-white/50">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No contacts yet</p>
              </div>
            ) : (
              contacts.map((contact) => {
                const msgs = contactMessages(contact.id);
                return (
                  <button
                    key={contact.id}
                    type="button"
                    onClick={() => setSelectedContact(contact)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedContact?.id === contact.id
                        ? 'bg-white/10 border-white/30'
                        : 'bg-white/5 border-white/10 hover:bg-white/[0.07]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm text-white font-medium truncate flex-1">{contact.name}</p>
                      {msgs.length > 0 && (
                        <span className="text-[10px] text-white/40 bg-white/10 rounded-full px-1.5 py-0.5">
                          {msgs.length} msg{msgs.length !== 1 && 's'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      {contact.company && (
                        <span className="flex items-center gap-1 truncate">
                          <Building2 className="h-3 w-3" />
                          {contact.company}
                        </span>
                      )}
                      {contact.role && <span className="truncate">{contact.role}</span>}
                    </div>
                    <div className="mt-1 text-[10px] text-white/30">
                      {formatDate(contact.created_at)}
                      {contact.source && ` · ${contact.source}`}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Contact Detail */}
        <div className={`${selectedContact ? 'flex' : 'hidden md:flex'} flex-1 flex-col min-h-0`}>
          {selectedContact ? (
            <div className="h-full flex flex-col bg-white/5 rounded-lg border border-white/10 p-5 overflow-hidden">
              <button
                type="button"
                onClick={() => setSelectedContact(null)}
                className="md:hidden shrink-0 text-white/60 mb-3 text-sm"
              >
                &larr; Back
              </button>

              {/* Contact Header */}
              <div className="shrink-0 border-b border-white/10 pb-4 mb-4">
                <h2 className="text-lg font-semibold text-white">{selectedContact.name}</h2>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-white/60">
                  {selectedContact.company && (
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5" />
                      {selectedContact.company}
                    </span>
                  )}
                  {selectedContact.role && <span>{selectedContact.role}</span>}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedContact.email && (
                    <span className="text-xs text-white/50 bg-white/5 rounded px-2 py-1">
                      {selectedContact.email}
                    </span>
                  )}
                  {selectedContact.linkedin_url && (
                    <a
                      href={selectedContact.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 bg-blue-400/10 rounded px-2 py-1 flex items-center gap-1 hover:bg-blue-400/20"
                    >
                      LinkedIn <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-3">
                <h3 className="text-sm font-medium text-white/60 flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Messages ({contactMessages(selectedContact.id).length})
                </h3>
                {contactMessages(selectedContact.id).length === 0 ? (
                  <p className="text-sm text-white/40 py-4">No messages yet</p>
                ) : (
                  contactMessages(selectedContact.id).map((msg) => (
                    <div
                      key={msg.id}
                      className="bg-white/5 rounded-lg border border-white/10 p-3"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-medium rounded-full px-2 py-0.5 ${
                            statusColors[msg.status] || statusColors.draft
                          }`}>
                            {msg.status}
                          </span>
                          <span className="text-xs text-white/40">{msg.message_type}</span>
                        </div>
                        <span className="text-xs text-white/30">
                          {msg.sent_at ? formatDate(msg.sent_at) : formatDate(msg.created_at)}
                        </span>
                      </div>
                      {msg.message_text && (
                        <p className="text-sm text-white/60 whitespace-pre-wrap line-clamp-6">
                          {msg.message_text}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-white/40 bg-white/[0.02] rounded-lg border border-white/5">
              <Users className="h-16 w-16 mb-4 opacity-30" />
              <p className="text-lg">Select a contact</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
