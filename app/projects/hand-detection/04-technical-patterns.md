# Technical Patterns & Solutions Reference

This document captures proven technical patterns, solutions, and code improvements from building the hand sign detection pipeline. Use this as a technical reference for future ML projects.

## Table of Contents
1. [Data Capture & Management Patterns](#data-capture--management-patterns)
2. [Training Optimization Techniques](#training-optimization-techniques)
3. [Model Architecture & Deployment](#model-architecture--deployment)
4. [API Integration Patterns](#api-integration-patterns)
5. [Performance Optimizations](#performance-optimizations)
6. [Bug Fixes & Solutions](#bug-fixes--solutions)
7. [Reusable Code Patterns](#reusable-code-patterns)

---

## Data Capture & Management Patterns

### 1. Continuous Camera with Clean Frame Capture

**Problem**: Need high-quality training data without manual frame saving.

**Solution**: Auto-capture with review system

```python
# capture_and_review.py - Key pattern
class CaptureWithReview:
    def capture_session(self, category="hand", count=50):
        # Temporal directory for review
        session_dir = self.temp_dir / f"{category}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"

        auto_capture = False
        last_capture_time = 0

        while captured < count:
            # Auto-capture with timing control
            if auto_capture and (current_time - last_capture_time) >= 0.33:  # 3 FPS
                cv2.imwrite(str(filepath), frame)
                captured += 1
                last_capture_time = current_time
```

**Key Benefits**:
- ✅ Consistent 3 FPS capture rate prevents blurry frames
- ✅ Temporal staging prevents accidental dataset pollution
- ✅ Progress bars provide clear visual feedback
- ✅ Mirror flip (`cv2.flip(frame, 1)`) for natural UX

### 2. Smart Dataset Organization

**Before**: Flat directory structure
```
data/
├── hand1.jpg
├── hand2.jpg
├── not_hand1.jpg
```

**After**: Hierarchical with validation splits
```python
# Pattern from train_unified.py
data_path = Path("data/hand_cls")
for split in ['train', 'val']:
    for category in ['hand', 'arm', 'not_hand']:
        path = data_path / split / category
        path.mkdir(parents=True, exist_ok=True)
```

**Dataset Statistics Pattern**:
```python
def prepare_training_data():
    stats = {}
    total = 0

    for split in ['train', 'val']:
        stats[split] = {}
        for category in ['hand', 'arm', 'not_hand']:
            path = data_path / split / category
            count = len(list(path.glob("*.jpg"))) if path.exists() else 0
            stats[split][category] = count
            total += count

    # Check class balance - warn if severely imbalanced
    if hand_total < 50:
        print("⚠️ Need more HAND samples for good detection!")
```

### 3. Class Hierarchy Detection Strategy

**Problem**: Conflicting hand vs. arm classifications.

**Solution**: Smart hierarchy prioritization

```python
# From train_three_class_weighted.py
config = {
    'names': {
        0: 'hand',      # Priority 1 - Always wins
        1: 'arm',       # Priority 2 - Only if no hand
        2: 'not_hand'   # Priority 3 - Neither
    },
    # Class weights - hand mistakes are 2x more costly
    'class_weights': [2.0, 1.0, 0.8]
}
```

**Training Logic**:
- Hand detection gets highest weight (2.0)
- Model learns: "If hand visible → HAND (even with arm)"
- Arm only detected when no hand present
- Reduces false negatives for hands

---

## Training Optimization Techniques

### 1. Progressive Training Strategy

**Pattern**: Start simple, add complexity

```python
# Stage 1: Binary classification (hand vs not_hand)
# Stage 2: Add arm class with hierarchy
# Stage 3: Fine-tune with weighted loss

epochs = 40  # More epochs for stability
batch = 16   # Smaller batch for better gradients
patience = 15  # Increased patience for convergence
lr0 = 0.005   # Lower LR for fine-grained learning
```

### 2. Smart Model Versioning

**Before**: Overwriting models
```python
model.save("hand_detector.pt")  # Overwrites previous
```

**After**: Automatic versioning with compatibility
```python
# From train_unified.py
existing_models = list(models_dir.glob("unified_v*.pt"))
next_version = len(existing_models) + 1

# Save versioned
dest = models_dir / f"unified_v{next_version}.pt"
shutil.copy(best_model, dest)

# Update latest for easy access
latest = models_dir / "unified_detector.pt"
shutil.copy(best_model, latest)

# Backward compatibility
hand_detector = models_dir / "hand_detector.pt"
shutil.copy(best_model, hand_detector)
```

### 3. Device-Adaptive Training

```python
def has_mps():
    """Check if Apple Silicon MPS is available"""
    try:
        import torch
        return torch.backends.mps.is_available()
    except:
        return False

# In training command
cmd = [
    "yolo", "classify", "train",
    f"model=yolov8{model_size}-cls.pt",
    "device=mps" if has_mps() else "device=cpu"
]
```

### 4. Training Monitoring Patterns

**Real-time Resource Monitoring**:
```python
# monitor.py - Background resource tracking
def monitor_resources():
    while True:
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()

        # Check Python processes using >10% CPU
        python_procs = []
        for proc in psutil.process_iter(['pid', 'name', 'cpu_percent']):
            if 'python' in proc.info['name'].lower():
                cpu = proc.info['cpu_percent']
                if cpu > 10:
                    python_procs.append(f"PID {proc.info['pid']}: {cpu:.1f}%")
```

**Training Metrics Extraction**:
```python
# Extract final metrics from YOLO training
results_file = runs_dir / "results.csv"
if results_file.exists():
    with open(results_file, 'r') as f:
        lines = f.readlines()
        if len(lines) > 1:
            headers = lines[0].strip().split(',')
            values = lines[-1].strip().split(',')
            for h, v in zip(headers[:5], values[:5]):
                print(f"   {h:15s}: {float(v):6.4f}")
```

---

## Model Architecture & Deployment

### 1. HuggingFace Hub Integration

**Direct Model Loading**:
```python
# Load from HuggingFace without local storage
model = YOLO('https://huggingface.co/EtanHey/hand-detection-3class/resolve/main/model.pt')
```

**Comprehensive Model Card Generation**:
```python
# From upload_to_huggingface.py
model_card = f"""---
tags:
- yolov8
- image-classification
- hand-detection
library_name: ultralytics
---

# Usage Examples for Multiple Frameworks
[... comprehensive examples for Python, Next.js, React Native, Swift...]
"""
```

### 2. Multi-Platform Deployment Strategy

**FastAPI Backend Pattern**:
```python
# backend/api.py - Production-ready API
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Hand Detection API")

# CORS for multiple environments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-app.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # CRITICAL: Handle YOLO's alphabetical class ordering
    classes = ['arm', 'hand', 'not_hand']  # Index 0=arm, 1=hand, 2=not_hand

    return {
        "class": classes[top_class_idx],
        "confidence": float(probs.top1conf),
        "all_probs": {
            "hand": float(probs.data[1]),  # Index 1 = hand
            "arm": float(probs.data[0]),   # Index 0 = arm
            "not_hand": float(probs.data[2])  # Index 2 = not_hand
        }
    }
```

### 3. Next.js Integration Patterns

**API Route with Error Handling**:
```typescript
// app/api/detect-hand/route.ts
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;

    // Forward to Python backend
    const backendFormData = new FormData();
    backendFormData.append('file', image);

    const response = await fetch(
      process.env.PYTHON_API_URL || 'http://localhost:8000/predict',
      { method: 'POST', body: backendFormData }
    );

    const result = await response.json();
    return NextResponse.json({
      class: result.class,
      confidence: result.confidence,
      isHand: result.class === 'hand',
      isArm: result.class === 'arm',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Detection failed' }, { status: 500 });
  }
}
```

**Real-time Webcam Integration**:
```typescript
// From hand-detector.tsx
const captureFromWebcam = useCallback(() => {
  if (!videoRef.current) return;

  const canvas = document.createElement('canvas');
  canvas.width = videoRef.current.videoWidth;
  canvas.height = videoRef.current.videoHeight;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'webcam-capture.jpg', { type: 'image/jpeg' });
        handleFileUpload(file);
      }
    }, 'image/jpeg');
  }
}, []);
```

---

## API Integration Patterns

### 1. Vercel AI SDK Integration

**Streaming AI Analysis**:
```typescript
// Combine hand detection with AI interpretation
const { complete, completion, isLoading: isAiLoading } = useCompletion({
  api: '/api/ai-describe',
});

// After detecting hand, generate AI description
if (data.isHand) {
  await complete(
    `Describe what gesture or sign this hand might be making with ${(
      data.confidence * 100
    ).toFixed(1)}% confidence.`
  );
}
```

### 2. Error Handling Patterns

**Graceful Degradation**:
```python
# backend/api.py
if not results or not results[0].probs:
    return {
        "error": "No detection results",
        "class": "not_hand",
        "confidence": 0.0,
        "all_probs": {"hand": 0.0, "arm": 0.0, "not_hand": 1.0}
    }
```

**Frontend Error Recovery**:
```typescript
try {
  const response = await fetch('/api/detect-hand', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) throw new Error('Detection failed');
  const data = await response.json();
  setResult(data);
} catch (error) {
  console.error('Detection error:', error);
  // Show user-friendly error without breaking UI
}
```

---

## Performance Optimizations

### 1. Memory Management

**Batch Size Optimization**:
```python
# For Apple Silicon (limited VRAM)
batch = 16  # Start here
# If OOM: batch = 8
# If still OOM: batch = 4

# Gradient accumulation to maintain effective batch size
effective_batch = 32  # Target
gradient_accumulation_steps = effective_batch // batch
```

**Image Processing Optimization**:
```python
# Efficient frame capture for live demo
resized = cv2.resize(frame, (imgsz, imgsz))  # Resize once
results = model(resized, verbose=False, device=device)[0]  # Batch inference
```

### 2. Inference Speed Patterns

**Device Detection & Optimization**:
```python
# live_demo_three_class.py
if torch.backends.mps.is_available():
    device = 'mps'
    print("🖥️ Using Apple Silicon GPU (MPS)")
elif torch.cuda.is_available():
    device = 'cuda'
    print("🎮 Using NVIDIA GPU (CUDA)")
else:
    device = 'cpu'
    print("💻 Using CPU")
```

**Frame Rate Control**:
```python
# Prevent overwhelming the model
frame_count = 0
while True:
    ret, frame = cap.read()
    frame_count += 1

    # Process every Nth frame for performance
    if frame_count % 3 == 0:  # Every 3rd frame
        results = model(frame)
```

---

## Bug Fixes & Solutions

### 1. YOLO Class Ordering Issue

**Problem**: YOLO uses alphabetical ordering internally, causing wrong class mappings.

**Before (Broken)**:
```python
classes = ['hand', 'arm', 'not_hand']  # Wrong!
predicted_class = classes[probs.top1]   # Returns wrong class
```

**After (Fixed)**:
```python
# backend/api.py - CRITICAL FIX
# YOLO uses alphabetical order for classes!
classes = ['arm', 'hand', 'not_hand']  # Index 0=arm, 1=hand, 2=not_hand

return {
    "class": classes[top_class_idx],
    "all_probs": {
        "hand": float(probs.data[1]),      # Index 1 = hand
        "arm": float(probs.data[0]),       # Index 0 = arm
        "not_hand": float(probs.data[2])   # Index 2 = not_hand
    }
}
```

### 2. Apple Silicon MPS Compatibility

**Problem**: PyTorch pin_memory warnings and compatibility issues.

**Solution**: Conditional device selection with fallbacks
```python
# Warning suppression pattern
import warnings
warnings.filterwarnings("ignore", category=UserWarning, module="torch.utils.data.dataloader")

# Device detection with fallback
def get_device():
    if torch.backends.mps.is_available():
        return 'mps'
    elif torch.cuda.is_available():
        return 'cuda'
    return 'cpu'
```

### 3. CORS Issues in Production

**Problem**: Frontend can't connect to backend in deployed environment.

**Solution**: Environment-aware CORS configuration
```python
# Dynamic CORS origins
origins = [
    "http://localhost:3000",      # Development
    "https://your-app.vercel.app" # Production
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 4. File Path Issues in Training

**Problem**: Relative paths break when script run from different directories.

**Solution**: Always use absolute paths
```python
# train_three_class_weighted.py
data_path = Path.cwd() / 'data' / 'three_class'
config = {
    'path': str(data_path.absolute()),  # Use absolute path
    'train': 'train',
    'val': 'val',
}
```

---

## Reusable Code Patterns

### 1. ML Pipeline Template

```python
# ml.py - Single-file ML pipeline
class MLPipeline:
    def __init__(self, project_name="ml_project"):
        self.setup_dirs()
        self.load_or_create_config()

    def train(self, epochs=None, resume=False):
        # Auto-detect framework and device
        if HAS_YOLO and self.config.get('model_type') == 'yolo':
            return self.train_yolo(epochs, resume)
        elif HAS_TORCH:
            return self.train_pytorch(epochs, resume)

    def test(self, model_path=None):
        if HAS_GRADIO:
            self.test_gradio(model_path)
        else:
            self.test_cli(model_path)
```

### 2. Progress Visualization Pattern

```python
# Visual progress bars in terminal
def show_progress(current, total, category="items"):
    bar_width = int((current / total) * 40)
    bar = "█" * bar_width + "░" * (40 - bar_width)
    percent = (current / total) * 100
    print(f"\r{category}: {bar} {current}/{total} ({percent:.1f}%)", end="")
```

### 3. Configuration Management

```python
# Smart config with environment fallbacks
def get_config():
    config = {
        'api_url': os.getenv('PYTHON_API_URL', 'http://localhost:8000'),
        'model_url': os.getenv('MODEL_URL', 'https://huggingface.co/EtanHey/hand-detection-3class/resolve/main/model.pt'),
        'batch_size': int(os.getenv('BATCH_SIZE', '16')),
        'epochs': int(os.getenv('EPOCHS', '50'))
    }
    return config
```

### 4. Robust File Operations

```python
# Safe file operations with cleanup
def safe_file_operation(source, destination):
    try:
        # Create backup if destination exists
        if destination.exists():
            backup = destination.with_suffix(f"{destination.suffix}.backup")
            shutil.copy(destination, backup)

        # Perform operation
        shutil.copy(source, destination)

        # Cleanup backup on success
        if backup.exists():
            backup.unlink()

    except Exception as e:
        # Restore backup if operation failed
        if backup.exists():
            shutil.copy(backup, destination)
            backup.unlink()
        raise e
```

### 5. Live Demo Template

```python
# Reusable webcam demo pattern
class LiveDemo:
    def __init__(self, model_path):
        self.model = YOLO(model_path)
        self.device = self.detect_device()

    def detect_device(self):
        if torch.backends.mps.is_available():
            return 'mps'
        elif torch.cuda.is_available():
            return 'cuda'
        return 'cpu'

    def run(self):
        cap = cv2.VideoCapture(0)
        while True:
            ret, frame = cap.read()
            if not ret: break

            frame = cv2.flip(frame, 1)  # Mirror for UX
            results = self.model(frame, device=self.device)

            # Draw results
            self.draw_results(frame, results)
            cv2.imshow('Demo', frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        cap.release()
        cv2.destroyAllWindows()
```

---

## Key Takeaways

### What Worked Well ✅

1. **Temporal staging** for data capture prevents dataset pollution
2. **Progressive training** (binary → ternary → weighted) builds robust models
3. **Automatic versioning** prevents losing good models
4. **Device-adaptive code** works across Apple Silicon, NVIDIA, and CPU
5. **HuggingFace integration** simplifies deployment and sharing
6. **Hierarchical classification** solves conflicting class problems

### What to Avoid ❌

1. **Relative paths** in training scripts
2. **Hardcoded class mappings** (watch YOLO's alphabetical ordering!)
3. **Large batch sizes** on limited VRAM (start with 16, reduce if OOM)
4. **Ignoring class imbalance** (always check distribution)
5. **Missing CORS configuration** for web deployment
6. **Overwriting models** without versioning

### Performance Metrics Achieved 📊

- **Training Speed**: ~3 minutes for 50 epochs (Apple M1 Pro)
- **Inference Speed**: 30+ FPS on webcam
- **Model Accuracy**: 96.3% validation accuracy
- **Model Size**: 2.97 MB (deployable anywhere)
- **API Response Time**: <200ms for single image

This reference captures the battle-tested patterns from building a complete ML pipeline. Copy these patterns for your next computer vision project to avoid common pitfalls and accelerate development.

CLAUDE_COUNTER: 9