"use client";

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
    topic: "General",
    topicEmoji: "\uD83D\uDCAC",
    messages: [
      {
        sender: "Etan",
        emoji: "\uD83D\uDC64",
        text: "hey, what did you get done while I was asleep?",
        time: "8:12",
      },
      {
        sender: "Claude",
        emoji: "\uD83E\uDD16",
        text: "Night Shift ran from 3-5am. Shipped 2 PRs on songscript, fixed that flaky test. All green.",
        time: "8:12",
      },
      {
        sender: "Etan",
        emoji: "\uD83D\uDC64",
        text: "nice. any urgent emails?",
        time: "8:13",
      },
      {
        sender: "Claude",
        emoji: "\uD83E\uDD16",
        text: "Stripe payment failed — card expired. Also a 9.2 job match came in and Sarah replied about Thursday. Check Alerts.",
        time: "8:13",
      },
    ],
  },
  {
    topic: "Alerts",
    topicEmoji: "\uD83D\uDD14",
    messages: [
      {
        sender: "Recruiter",
        emoji: "\uD83D\uDCBC",
        text: "Strong match: Senior Engineer @ Acme — 9.2/10. Stack is exactly your thing.",
        time: "06:15",
      },
      {
        sender: "Claude",
        emoji: "\uD83E\uDD16",
        text: "Stripe payment failed for Vercel Pro — card on file expired. Needs action today.",
        time: "09:15",
      },
      {
        sender: "Recruiter",
        emoji: "\uD83D\uDCBC",
        text: 'Sarah @ TechCorp replied: "Let\'s schedule for Thursday."',
        time: "10:30",
      },
      {
        sender: "Coach",
        emoji: "\uD83D\uDCC5",
        text: "Feb so far: $847 across 14 subs. Flagged 3 tax deductions.",
        time: "11:01",
      },
    ],
  },
];

interface TelegramMockProps {
  activeIndex: number;
  onTopicClick?: (index: number) => void;
}

export default function TelegramMock({
  activeIndex,
  onTopicClick,
}: TelegramMockProps) {
  const scene = topicScenes[activeIndex % topicScenes.length];

  return (
    <div className="flex h-full flex-col bg-[#0e1621] text-sm text-white">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/5 bg-[#17212b] px-4 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#e59500] to-[#c46d3c] text-sm font-bold text-[#0c0b0a]">
          G
        </div>
        <div>
          <div className="text-sm font-semibold text-white/95 sm:text-xs">
            Golems
          </div>
          <div className="text-[0.65rem] text-white/40">4 golems online</div>
        </div>
      </div>

      {/* Topic tabs */}
      <div
        className="scrollbar-none flex gap-0 overflow-x-auto border-b border-white/5 bg-[#17212b]"
        role="tablist"
      >
        {topicScenes.map((t, i) => (
          <button
            key={t.topic}
            className={`flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 text-xs whitespace-nowrap transition-colors sm:min-h-[44px] sm:px-2 ${
              i === activeIndex % topicScenes.length
                ? "border-[#e59500] bg-[#e5950010] text-[#e59500]"
                : "border-transparent text-white/40 hover:text-white/60"
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
      <div
        className="scrollbar-none flex flex-1 flex-col gap-3 overflow-y-auto p-4 sm:gap-2 sm:p-3"
        role="tabpanel"
      >
        {scene.messages.map((msg, i) => (
          <div
            key={`${activeIndex}-${i}`}
            className="animate-[fadeSlideUp_0.3s_ease_forwards] rounded-xl bg-[#182533] px-4 py-3 opacity-0 sm:px-3 sm:py-2"
            style={{ animationDelay: `${i * 200}ms` }}
          >
            <div className="mb-1 flex items-center gap-2">
              <span className="text-base sm:text-sm">{msg.emoji}</span>
              <span className="text-xs font-semibold text-[#e59500] sm:text-[0.68rem]">
                {msg.sender}
              </span>
              <span className="ml-auto text-[0.6rem] text-white/25">
                {msg.time}
              </span>
            </div>
            <div className="text-xs leading-relaxed break-words text-white/80 sm:text-[0.75rem]">
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-white/5 py-2 text-center text-[0.7rem] text-white/30 sm:text-[0.65rem]">
        See all topics &rarr;
      </div>
    </div>
  );
}
