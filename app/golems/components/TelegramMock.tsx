'use client';

interface TelegramMessage {
  sender: string;
  emoji: string;
  text: string;
  time: string;
}

interface TopicScene {
  topic: string;
  topicEmoji: string;
  messages: TelegramMessage[];
}

const topicScenes: TopicScene[] = [
  {
    topic: 'General',
    topicEmoji: '\uD83D\uDCAC',
    messages: [
      { sender: 'Etan', emoji: '\uD83D\uDC64', text: 'hey, what did you get done while I was asleep?', time: '8:12' },
      { sender: 'ClaudeGolem', emoji: '\uD83E\uDD16', text: 'Night Shift ran from 3-5am. Shipped 2 PRs on songscript, fixed that flaky test. All green.', time: '8:12' },
      { sender: 'ClaudeGolem', emoji: '\uD83E\uDD16', text: 'Also: 1 urgent email from Stripe, and a 9.2 job match came in. Check the topics.', time: '8:13' },
    ],
  },
  {
    topic: 'Email',
    topicEmoji: '\uD83D\uDCE7',
    messages: [
      { sender: 'EmailGolem', emoji: '\uD83D\uDCE7', text: 'Stripe payment failed for Vercel Pro — card on file expired. Needs action today.', time: '09:15' },
      { sender: 'EmailGolem', emoji: '\uD83D\uDCE7', text: 'GitHub: 2 review requests on golems. Routed interview prep email to Recruiter.', time: '09:16' },
      { sender: 'EmailGolem', emoji: '\uD83D\uDCE7', text: 'Reminder: follow-up with Acme is due tomorrow. Draft ready if you want it.', time: '09:17' },
    ],
  },
  {
    topic: 'Recruitment',
    topicEmoji: '\uD83D\uDCBC',
    messages: [
      { sender: 'RecruiterGolem', emoji: '\uD83D\uDCBC', text: 'Sarah @ TechCorp replied: "Let\'s schedule for Thursday." Want me to confirm?', time: '10:30' },
      { sender: 'RecruiterGolem', emoji: '\uD83D\uDCBC', text: 'Your Elo is 1847 now. Ready for a system design round? You\'ve been crushing it.', time: '10:31' },
      { sender: 'RecruiterGolem', emoji: '\uD83D\uDCBC', text: 'Sent check-ins to 3 contacts who went quiet. Keeping the pipeline warm.', time: '10:32' },
    ],
  },
  {
    topic: 'Finance',
    topicEmoji: '\uD83D\uDCB0',
    messages: [
      { sender: 'TellerGolem', emoji: '\uD83D\uDCB0', text: '\u26A0\uFE0F Heads up: Vercel charge bounced. Update the card before they suspend.', time: '11:00' },
      { sender: 'TellerGolem', emoji: '\uD83D\uDCB0', text: 'Feb so far: $847 across 14 subs. Software is 62% of spend.', time: '11:01' },
      { sender: 'TellerGolem', emoji: '\uD83D\uDCB0', text: 'Flagged 3 tax deductions from this week. Review when you get a chance.', time: '11:02' },
    ],
  },
  {
    topic: 'Jobs',
    topicEmoji: '\uD83C\uDFAF',
    messages: [
      { sender: 'JobGolem', emoji: '\uD83C\uDFAF', text: 'Strong match: Senior Engineer @ Acme — 9.2/10. Stack is exactly your thing.', time: '06:15' },
      { sender: 'JobGolem', emoji: '\uD83C\uDFAF', text: 'Also found: Full Stack @ TechCorp (8.7) — React + Node, remote-first.', time: '06:16' },
      { sender: 'JobGolem', emoji: '\uD83C\uDFAF', text: 'Sent intro to the Acme recruiter. 3 new listings matched your profile today.', time: '06:17' },
    ],
  },
];

interface TelegramMockProps {
  activeIndex: number;
  onTopicClick?: (index: number) => void;
}

export default function TelegramMock({ activeIndex, onTopicClick }: TelegramMockProps) {
  const scene = topicScenes[activeIndex % topicScenes.length];

  return (
    <div className="flex flex-col h-full bg-[#0e1621] text-white text-sm">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#17212b] border-b border-white/5">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#e59500] to-[#c46d3c] flex items-center justify-center text-[#0c0b0a] font-bold text-sm shrink-0">
          G
        </div>
        <div>
          <div className="font-semibold text-sm text-white/95 sm:text-xs">Golems</div>
          <div className="text-[0.65rem] text-white/40">5 golems online</div>
        </div>
      </div>

      {/* Topic tabs */}
      <div className="flex overflow-x-auto bg-[#17212b] border-b border-white/5 gap-0" role="tablist">
        {topicScenes.map((t, i) => (
          <button
            key={t.topic}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-xs whitespace-nowrap border-b-2 transition-colors shrink-0 sm:min-h-[44px] sm:px-2 ${
              i === activeIndex % topicScenes.length
                ? 'border-[#e59500] text-[#e59500] bg-[#e5950010]'
                : 'border-transparent text-white/40 hover:text-white/60'
            }`}
            onClick={() => onTopicClick?.(i)}
            type="button"
            role="tab"
            aria-selected={i === activeIndex % topicScenes.length}
          >
            <span>{t.topicEmoji}</span>
            <span>{t.topic}</span>
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 p-4 sm:gap-2 sm:p-3" role="tabpanel">
        {scene.messages.map((msg, i) => (
          <div
            key={`${activeIndex}-${i}`}
            className="bg-[#182533] rounded-xl px-4 py-3 animate-[fadeSlideUp_0.3s_ease_forwards] opacity-0 sm:px-3 sm:py-2"
            style={{ animationDelay: `${i * 200}ms` }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base sm:text-sm">{msg.emoji}</span>
              <span className="font-semibold text-[#e59500] text-xs sm:text-[0.68rem]">{msg.sender}</span>
              <span className="text-[0.6rem] text-white/25 ml-auto">{msg.time}</span>
            </div>
            <div className="text-white/80 text-xs leading-relaxed sm:text-[0.75rem] break-words">{msg.text}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center py-2 text-[0.7rem] text-white/30 border-t border-white/5 sm:text-[0.65rem]">
        See all topics &rarr;
      </div>
    </div>
  );
}
