# Hand Sign Detection Project

## Overview
This directory contains the complete documentation and data for the Hand Sign Detection ML project showcased on etanheyman.com.

## Structure
```
hand-detection/
├── project.json                     # Main project data (metrics, timeline, etc.)
├── 01-ml-visions-foundation.md     # Original ML experiments and patterns
├── 02-pipeline-framework.md        # ML training pipeline abstraction
├── 03-hand-detection-chronicle.md  # Complete development timeline
├── 04-technical-patterns.md        # Reusable code patterns and solutions
├── 05-portfolio-entry.tsx          # React component for portfolio
├── 05-portfolio-data.json          # Structured data for portfolio component
├── MASTER-JOURNEY.md               # Executive summary of entire journey
└── README.md                       # This file
```

## Quick Links
- **Live Demo**: https://huggingface.co/EtanHey/hand-detection-3class
- **GitHub**: https://github.com/etanheyman/hand-sign-detection
- **Model Download**: https://huggingface.co/EtanHey/hand-detection-3class/resolve/main/model.pt

## Integration
To add this project to the portfolio site:

```tsx
// Import the portfolio component
import HandDetectionProject from '@/app/projects/hand-detection/05-portfolio-entry'

// Or load the JSON data
import projectData from '@/app/projects/hand-detection/project.json'
```

## Key Metrics
- **Accuracy**: 96.3%
- **Dataset**: 1,740 images
- **Speed**: 30+ FPS
- **Model Size**: 10.26 MB

## Technical Stack
- YOLOv8s-cls
- Python/PyTorch
- Next.js + Vercel AI SDK
- HuggingFace Spaces
- FastAPI