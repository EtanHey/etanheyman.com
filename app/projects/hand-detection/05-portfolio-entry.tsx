import React from 'react';
import { ExternalLink, Github, Play, Code, Brain, Target, Zap } from 'lucide-react';

interface PortfolioEntryProps {
  className?: string;
}

const HandDetectionPortfolio: React.FC<PortfolioEntryProps> = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-lg p-8 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Hand Detection ML Pipeline
          </h2>
          <p className="text-lg text-gray-600">
            Real-time computer vision model for precise hand detection and classification
          </p>
        </div>
        <div className="flex space-x-3">
          <a
            href="https://huggingface.co/EtanHey/hand-detection-3class"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            <Play className="w-4 h-4 mr-2" />
            Live Demo
          </a>
          <a
            href="https://github.com/etanheyman/hand-sign-detection"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Github className="w-4 h-4 mr-2" />
            Source
          </a>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Target className="w-5 h-5 text-green-600 mr-2" />
            <span className="font-semibold text-green-800">Accuracy</span>
          </div>
          <p className="text-2xl font-bold text-green-700">96%</p>
          <p className="text-sm text-green-600">3-class detection</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Brain className="w-5 h-5 text-blue-600 mr-2" />
            <span className="font-semibold text-blue-800">Dataset</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">1,740</p>
          <p className="text-sm text-blue-600">annotated images</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Zap className="w-5 h-5 text-purple-600 mr-2" />
            <span className="font-semibold text-purple-800">Performance</span>
          </div>
          <p className="text-2xl font-bold text-purple-700">Real-time</p>
          <p className="text-sm text-purple-600">30+ FPS inference</p>
        </div>
      </div>

      {/* Project Description */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Project Overview</h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          A sophisticated computer vision pipeline that detects and classifies hands in real-time using YOLO (You Only Look Once)
          architecture. The model distinguishes between hands, arms, and background with 96% accuracy, making it suitable for
          gesture recognition applications, accessibility tools, and human-computer interaction systems.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Built with a focus on practical deployment, the project includes comprehensive training pipelines, data collection tools,
          and production-ready integrations for web applications.
        </p>
      </div>

      {/* Technical Stack */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Technical Stack</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: 'YOLOv8', category: 'ML Framework' },
            { name: 'PyTorch', category: 'Deep Learning' },
            { name: 'OpenCV', category: 'Computer Vision' },
            { name: 'FastAPI', category: 'Backend' },
            { name: 'React/Next.js', category: 'Frontend' },
            { name: 'HuggingFace', category: 'Deployment' },
            { name: 'Gradio', category: 'Demo Interface' },
            { name: 'Python', category: 'Language' }
          ].map((tech, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded-lg">
              <div className="font-medium text-gray-900">{tech.name}</div>
              <div className="text-xs text-gray-500">{tech.category}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Achievements */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Achievements</h3>
        <div className="space-y-3">
          {[
            'Achieved 96% accuracy on 3-class hand detection (hand/arm/background)',
            'Trained on custom dataset of 1,740 manually annotated images',
            'Deployed production-ready model to HuggingFace Spaces with interactive demo',
            'Built comprehensive training pipeline with automated data collection',
            'Created reusable Next.js components for web integration',
            'Implemented real-time inference with 30+ FPS performance',
            'Developed FastAPI backend for seamless integration with web applications'
          ].map((achievement, index) => (
            <div key={index} className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-gray-700">{achievement}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Challenges */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Technical Challenges Overcome</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Data Quality & Balance</h4>
            <p className="text-gray-700 text-sm">
              Implemented strategic data collection with diverse lighting conditions, hand positions,
              and backgrounds to prevent overfitting. Created balanced dataset across all classes.
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Real-time Performance</h4>
            <p className="text-gray-700 text-sm">
              Optimized YOLO model architecture and inference pipeline to achieve 30+ FPS
              performance while maintaining high accuracy for real-time applications.
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Class Distinction</h4>
            <p className="text-gray-700 text-sm">
              Developed sophisticated approach to distinguish between hands and arms,
              critical for accurate gesture recognition and reducing false positives.
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Production Deployment</h4>
            <p className="text-gray-700 text-sm">
              Created seamless deployment pipeline to HuggingFace with interactive demo,
              plus integration components for web applications.
            </p>
          </div>
        </div>
      </div>

      {/* Integration Examples */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Integration Examples</h3>
        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <code className="text-green-400 text-sm">
            <div className="mb-2"># Load model directly from HuggingFace</div>
            <div className="mb-2">from ultralytics import YOLO</div>
            <div className="mb-4">model = YOLO('https://huggingface.co/EtanHey/hand-detection-3class/resolve/main/model.pt')</div>

            <div className="mb-2"># Real-time detection</div>
            <div className="mb-2">results = model(image)</div>
            <div>detections = results[0].boxes</div>
          </code>
        </div>
        <div className="mt-4">
          <a
            href="https://huggingface.co/EtanHey/hand-detection-3class"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            View complete documentation and examples
          </a>
        </div>
      </div>

      {/* Future Plans */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Future Development</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'Gesture Recognition',
              description: 'Expand beyond detection to recognize specific hand gestures (peace, thumbs up, OK sign)'
            },
            {
              title: 'Hand Tracking',
              description: 'Implement temporal tracking for smooth hand following across video frames'
            },
            {
              title: 'Mobile Optimization',
              description: 'Optimize model for mobile deployment with TensorFlow Lite conversion'
            },
            {
              title: 'Multi-hand Support',
              description: 'Enhance model to detect and track multiple hands simultaneously'
            }
          ].map((plan, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-gray-900">{plan.title}</h4>
              <p className="text-gray-600 text-sm">{plan.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HandDetectionPortfolio;