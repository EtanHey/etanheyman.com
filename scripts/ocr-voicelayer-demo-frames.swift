import AppKit
import Foundation
import Vision

func recognize(_ path: String) throws -> [(text: String, box: CGRect)] {
    guard let image = NSImage(contentsOfFile: path),
          let data = image.tiffRepresentation,
          let bitmap = NSBitmapImageRep(data: data),
          let cgImage = bitmap.cgImage else {
        throw NSError(domain: "VoiceLayerDemoOCR", code: 1, userInfo: [
            NSLocalizedDescriptionKey: "Could not decode image"
        ])
    }

    let request = VNRecognizeTextRequest()
    request.recognitionLevel = .accurate
    request.usesLanguageCorrection = true
    let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
    try handler.perform([request])

    return (request.results ?? []).compactMap { observation in
        observation.topCandidates(1).first.map { candidate in
            (candidate.string, observation.boundingBox)
        }
    }
}

let includeBounds = CommandLine.arguments.contains("--bounds")
let paths = CommandLine.arguments.dropFirst().filter { $0 != "--bounds" }

for path in paths {
    do {
        print("FRAME\t\(path)")
        for line in try recognize(path) {
            if includeBounds {
                print(String(format: "BOUNDS\t%.6f\t%.6f\t%.6f\t%.6f\t%@", line.box.minX, line.box.minY, line.box.width, line.box.height, line.text))
            } else {
                print(line.text)
            }
        }
    } catch {
        fputs("OCR failed for \(path): \(error)\n", stderr)
        exit(2)
    }
}
