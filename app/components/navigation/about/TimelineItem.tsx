interface TimelineItemProps {
  period: string;
  title: string;
  description: string;
  index?: number;
  isActive?: boolean;
}

const TimelineItem = ({ period, title, description, index = 0, isActive = false }: TimelineItemProps) => {
  return (
    <div className={`flex flex-col pb-2 ${isActive ? "border-l-4 border-blue-500 pl-2 -ml-2" : ""}`} data-timeline-index={index} aria-hidden={!isActive}>
      <span className='text-sm text-blue-400 font-medium'>{period}</span>
      <h3 className={`text-lg font-semibold mt-1 mb-2 ${isActive ? "text-blue-500" : ""}`}>{title}</h3>
      <p className='text-sm font-light'>{description}</p>
    </div>
  );
};

export default TimelineItem;
