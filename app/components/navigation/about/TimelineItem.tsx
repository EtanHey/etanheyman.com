interface TimelineItemProps {
  period: string;
  title: string;
  description: string;
  index?: number;
}

const TimelineItem = ({period, title, description, index = 0}: TimelineItemProps) => {
  return (
    <div className='flex flex-col border-l-2 border-blue-500 pl-4 pb-2' data-timeline-index={index}>
      <span className='text-sm text-blue-400 font-medium'>{period}</span>
      <h3 className='text-lg font-semibold mt-1 mb-2'>{title}</h3>
      <p className='text-sm font-light'>{description}</p>
    </div>
  );
};

export default TimelineItem;
