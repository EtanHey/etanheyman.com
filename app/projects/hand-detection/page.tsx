import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Github, Play, Brain, Target, Zap, Download, Code, ChevronRight } from "lucide-react";
import projectData from "./project.json";

export default function HandDetectionPage() {
  return (
    <main className="relative z-10 container mx-auto px-4 py-8 md:px-8 lg:px-16">
      {/* Back button */}
      <div className="relative z-20 mb-8">
        <Link
          href="/"
          className="inline-block text-blue-300 transition-colors hover:text-blue-200"
        >
          ← Back to Home
        </Link>
      </div>

      {/* Hero Section */}
      <div className="relative z-20 mb-12">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="mb-4 font-[Nutmeg] text-[34px] font-semibold text-white md:text-[64px]">
              {projectData.title}
            </h1>
            <p className="font-[Nutmeg] text-[18px] leading-[1.4] font-light text-white/80 md:text-[24px]">
              {projectData.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
        <div className="relative z-30 rounded-[20px] bg-white/10 backdrop-blur-sm p-6 shadow-[0px_0px_40px_0px_rgba(15,130,235,0.3)]">
          <div className="flex items-center mb-3">
            <Target className="w-5 h-5 text-blue-400 mr-2" />
            <span className="font-[Nutmeg] text-[16px] font-medium text-blue-300">Accuracy</span>
          </div>
          <p className="font-[Nutmeg] text-[32px] font-bold text-white">{projectData.metrics.accuracy}</p>
          <p className="font-[Nutmeg] text-[14px] text-white/60">3-class detection</p>
        </div>
        <div className="relative z-30 rounded-[20px] bg-white/10 backdrop-blur-sm p-6 shadow-[0px_0px_40px_0px_rgba(15,130,235,0.3)]">
          <div className="flex items-center mb-3">
            <Brain className="w-5 h-5 text-blue-400 mr-2" />
            <span className="font-[Nutmeg] text-[16px] font-medium text-blue-300">Dataset</span>
          </div>
          <p className="font-[Nutmeg] text-[32px] font-bold text-white">{projectData.metrics.dataset_size}</p>
          <p className="font-[Nutmeg] text-[14px] text-white/60">annotated images</p>
        </div>
        <div className="relative z-30 rounded-[20px] bg-white/10 backdrop-blur-sm p-6 shadow-[0px_0px_40px_0px_rgba(15,130,235,0.3)]">
          <div className="flex items-center mb-3">
            <Zap className="w-5 h-5 text-blue-400 mr-2" />
            <span className="font-[Nutmeg] text-[16px] font-medium text-blue-300">Performance</span>
          </div>
          <p className="font-[Nutmeg] text-[32px] font-bold text-white">{projectData.metrics.inference_speed}</p>
          <p className="font-[Nutmeg] text-[14px] text-white/60">real-time inference</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative z-20 mb-12 flex flex-col gap-4 md:flex-row">
        <a
          href={projectData.links.demo}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-4 rounded-[80px] bg-blue-500 px-8 py-5 font-[Nutmeg] text-[20px] text-white transition-colors hover:bg-blue-600 md:text-[24px]"
        >
          <Play className="w-5 h-5" />
          Live Demo
          <ChevronRight className="w-5 h-5" />
        </a>
        <a
          href={projectData.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-4 rounded-[80px] border-2 border-[#59BCF5] px-8 py-5 font-[Nutmeg] text-[20px] text-[#59BCF5] transition-colors hover:bg-[#59BCF5] hover:text-white md:text-[24px]"
        >
          <Github className="w-5 h-5" />
          Source Code
        </a>
        <a
          href={projectData.links.model}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-4 rounded-[80px] border-2 border-[#88CFF8] px-8 py-5 font-[Nutmeg] text-[20px] text-[#88CFF8] transition-colors hover:bg-[#88CFF8] hover:text-white md:text-[24px]"
        >
          <Download className="w-5 h-5" />
          Download Model
        </a>
      </div>

      {/* Project Overview */}
      <div className="relative z-20 mb-16">
        <h2 className="mb-6 font-[Nutmeg] text-[26px] font-semibold text-[#88CFF8] md:text-[40px]">
          Project Overview
        </h2>
        <div className="space-y-4">
          <p className="font-[Nutmeg] text-[16px] leading-[1.6] text-white/80 md:text-[18px]">
            {projectData.description.long}
          </p>
          <p className="font-[Nutmeg] text-[16px] leading-[1.6] text-white/60 md:text-[18px]">
            {projectData.description.technical}
          </p>
        </div>
      </div>

      {/* Technical Stack */}
      <div className="relative z-20 mb-16">
        <h2 className="mb-6 font-[Nutmeg] text-[26px] font-semibold text-[#88CFF8] md:text-[40px]">
          Technical Stack
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(projectData.tech_stack).map(([category, techs]) => (
            <div key={category} className="relative z-30 rounded-[20px] bg-white/5 backdrop-blur-sm p-4">
              <h3 className="font-[Nutmeg] text-[14px] font-medium text-blue-400 mb-2 capitalize">
                {category.replace('_', ' ')}
              </h3>
              <div className="space-y-1">
                {(techs as string[]).map((tech) => (
                  <div key={tech} className="font-[Nutmeg] text-[14px] text-white/80">
                    {tech}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Achievements */}
      <div className="relative z-20 mb-16">
        <h2 className="mb-6 font-[Nutmeg] text-[26px] font-semibold text-[#88CFF8] md:text-[40px]">
          Key Achievements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectData.achievements.map((achievement, index) => (
            <div
              key={index}
              className="relative z-30 rounded-[20px] bg-white/10 backdrop-blur-sm p-6 shadow-[0px_0px_40px_0px_rgba(15,130,235,0.3)]"
            >
              <div className="text-3xl mb-3">{achievement.icon}</div>
              <h3 className="font-[Nutmeg] text-[18px] font-semibold text-white mb-2">
                {achievement.title}
              </h3>
              <p className="font-[Nutmeg] text-[14px] text-white/70">
                {achievement.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Development Timeline */}
      <div className="relative z-20 mb-16">
        <h2 className="mb-8 font-[Nutmeg] text-[26px] font-semibold text-[#88CFF8] md:mb-12 md:text-[40px]">
          Development Timeline
        </h2>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute top-0 bottom-0 left-0 w-1 rounded-lg bg-[#002072]">
            <div
              className="absolute top-0 left-0 w-full rounded-lg bg-blue-500"
              style={{
                height: `${(1 / projectData.timeline.length) * 100}%`,
              }}
            />
          </div>

          {/* Timeline items */}
          <div className="space-y-12">
            {projectData.timeline.map((item, index) => (
              <div key={index} className="flex gap-6 md:gap-12">
                <div className="relative z-30 flex size-[40px] items-center justify-center rounded-full bg-blue-500 shadow-[0px_0px_24px_0px_rgba(15,130,235,1)] flex-shrink-0">
                  <span className="font-[Nutmeg] text-[16px] font-medium text-white">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="font-[Nutmeg] text-[14px] text-blue-400 mb-1">
                    {item.date}
                  </div>
                  <h3 className="font-[Nutmeg] text-[20px] font-semibold text-white mb-2 md:text-[24px]">
                    {item.milestone}
                  </h3>
                  <p className="font-[Nutmeg] text-[14px] text-white/70 md:text-[16px]">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technical Challenges */}
      <div className="relative z-20 mb-16">
        <h2 className="mb-6 font-[Nutmeg] text-[26px] font-semibold text-[#88CFF8] md:text-[40px]">
          Technical Challenges Overcome
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projectData.challenges.map((challenge, index) => (
            <div
              key={index}
              className="relative z-30 rounded-[20px] bg-white/5 backdrop-blur-sm p-6"
            >
              <h3 className="font-[Nutmeg] text-[18px] font-semibold text-red-400 mb-2">
                Problem
              </h3>
              <p className="font-[Nutmeg] text-[14px] text-white/70 mb-4">
                {challenge.problem}
              </p>
              <h3 className="font-[Nutmeg] text-[18px] font-semibold text-green-400 mb-2">
                Solution
              </h3>
              <p className="font-[Nutmeg] text-[14px] text-white/70 mb-4">
                {challenge.solution}
              </p>
              <div className="border-t border-white/10 pt-4">
                <span className="font-[Nutmeg] text-[14px] text-blue-400">Impact: </span>
                <span className="font-[Nutmeg] text-[14px] text-white/60">
                  {challenge.impact}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Code Examples */}
      <div className="relative z-20 mb-16">
        <h2 className="mb-6 font-[Nutmeg] text-[26px] font-semibold text-[#88CFF8] md:text-[40px]">
          Integration Examples
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-[Nutmeg] text-[18px] font-semibold text-white mb-3">
              Basic Usage (Python)
            </h3>
            <div className="relative z-30 rounded-[20px] bg-[#001440] p-6 overflow-x-auto">
              <pre className="text-[14px] text-blue-300">
                <code>{projectData.code_examples.basic_usage}</code>
              </pre>
            </div>
          </div>
          <div>
            <h3 className="font-[Nutmeg] text-[18px] font-semibold text-white mb-3">
              API Integration (JavaScript)
            </h3>
            <div className="relative z-30 rounded-[20px] bg-[#001440] p-6 overflow-x-auto">
              <pre className="text-[14px] text-blue-300">
                <code>{projectData.code_examples.api_integration}</code>
              </pre>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <a
            href={projectData.links.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="font-[Nutmeg] text-[16px]">View complete documentation and examples</span>
          </a>
        </div>
      </div>

      {/* Future Roadmap */}
      <div className="relative z-20 mb-16">
        <h2 className="mb-6 font-[Nutmeg] text-[26px] font-semibold text-[#88CFF8] md:text-[40px]">
          Future Roadmap
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projectData.future_roadmap.map((phase, index) => (
            <div
              key={index}
              className="relative z-30 rounded-[20px] bg-white/10 backdrop-blur-sm p-6 shadow-[0px_0px_40px_0px_rgba(15,130,235,0.3)]"
            >
              <div className="font-[Nutmeg] text-[14px] text-blue-400 mb-2">
                {phase.phase}
              </div>
              <h3 className="font-[Nutmeg] text-[20px] font-semibold text-white mb-4">
                {phase.title}
              </h3>
              <ul className="space-y-2">
                {phase.tasks.map((task, taskIndex) => (
                  <li key={taskIndex} className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className="font-[Nutmeg] text-[14px] text-white/70">
                      {task}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Lessons Learned */}
      <div className="relative z-20">
        <h2 className="mb-6 font-[Nutmeg] text-[26px] font-semibold text-[#88CFF8] md:text-[40px]">
          Key Lessons Learned
        </h2>
        <div className="relative z-30 rounded-[20px] bg-white/5 backdrop-blur-sm p-8">
          <ul className="space-y-4">
            {projectData.lessons_learned.map((lesson, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                <span className="font-[Nutmeg] text-[16px] text-white/80">
                  {lesson}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}