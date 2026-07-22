import AppKit
import Foundation
import Vision

func recognize(_ path: String) throws -> [String] {
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
        observation.topCandidates(1).first?.string
    }
}

for path in CommandLine.arguments.dropFirst() {
    do {
        print("FRAME\t\(path)")
        for line in try recognize(path) {
            print(line)
        }
    } catch {
        fputs("OCR failed for \(path): \(error)\n", stderr)
        exit(2)
    }
}
