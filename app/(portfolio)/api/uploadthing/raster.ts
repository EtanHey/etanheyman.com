const imageLimit = { maxFileSize: "4MB", maxFileCount: 1, minFileCount: 0 } as const;
export const rasterUploadConfig = {
  "image/png": imageLimit,
  "image/jpeg": imageLimit,
  "image/webp": imageLimit,
  "image/gif": imageLimit,
  "image/avif": imageLimit,
};

export async function matchesRasterMime(file: File): Promise<boolean> {
  const header = Buffer.from(await file.slice(0, 16).arrayBuffer());
  switch (file.type) {
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
