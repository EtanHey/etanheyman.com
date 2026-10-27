export async function matchesImageMime(file: File): Promise<boolean> {
  const header = Buffer.from(await file.slice(0, 16).arrayBuffer());
  switch (file.type) {
    case "image/svg+xml": {
      const bytes = await file.arrayBuffer();
      let svg: string;
      try {
        svg = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
      } catch {
        return false;
      }
      // AIDEV-NOTE: Conservative root/literal-hazard check, not a full XML sanitizer.
      // Uploaded SVGs must remain external <img> resources, never inline markup.
      return /^\s*(?:<\?xml\s[\s\S]*?\?>\s*)?(?:<!--[\s\S]*?-->\s*)*<svg(?:\s|\/?>)/i.test(svg)
        && !/<script\b|javascript\s*:|\bon[a-z]+\s*=|<foreignObject\b/i.test(svg);
    }
    case "image/png": return header.subarray(0, 8).equals(Buffer.from("89504e470d0a1a0a", "hex"));
    case "image/jpeg": return header.subarray(0, 3).equals(Buffer.from("ffd8ff", "hex"));
    case "image/gif": return ["GIF87a", "GIF89a"].includes(header.toString("latin1", 0, 6));
    case "image/webp": return header.toString("latin1", 0, 4) === "RIFF" && header.toString("latin1", 8, 12) === "WEBP";
    case "image/avif": {
      if (header.length < 16 || header.toString("latin1", 4, 8) !== "ftyp") return false;
      const size = header.readUInt32BE(0);
      if (size < 16 || size > file.size || size % 4 !== 0) return false;
      const brands = Buffer.from(await file.slice(8, size).arrayBuffer());
      for (let offset = 0; offset < brands.length; offset += 4) {
        if (offset !== 4 && ["avif", "avis"].includes(brands.toString("latin1", offset, offset + 4))) return true;
      }
      return false;
    }
    default: return false;
  }
}
