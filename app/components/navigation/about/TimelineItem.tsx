interface TimelineItemProps {
  period: string;
  title: string;
  description: string;
  index?: number;
  isActive?: boolean;
}

const TimelineItem = ({
  period,
  title,
  description,
  index = 0,
  isActive = false,
}: TimelineItemProps) => {
  return (
    <div
      className={`flex flex-col pb-2 ${isActive ? "-ml-2 border-l-4 border-blue-500 pl-2" : ""}`}
      data-timeline-index={index}
      aria-hidden={!isActive}
    >
      <span className="text-sm font-medium text-blue-400">{period}</span>
      <h3
        className={`mt-1 mb-2 text-lg font-semibold ${isActive ? "text-blue-500" : ""}`}
      >
        {title}
      </h3>
      <p className="text-sm font-light">{description}</p>
    </div>
  );
};

export default TimelineItem;
