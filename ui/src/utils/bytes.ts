export function getBytes(str: string) {
  let bytes = str.length,
    i = 0;
  for (; i < bytes; i++) if (str.charCodeAt(i) > 255) bytes++;

  return bytes;
}

const MB = 1048576;
export const MAX_SIZE = MB;