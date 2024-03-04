import { ADDRESS } from '@/consts';

function getBytes(mb: number) {
  const B_MULTIPLIER = 1024;
  const KB_MULTIPLIER = 1024;

  return mb * B_MULTIPLIER * KB_MULTIPLIER;
}

const getFileUrl = (file: File) => URL.createObjectURL(file);

const getFileChunks = (files: File[], chunkSizeBytes: number, maxFilesPerChunk: number) => {
  const chunks: File[][] = [];
  let chunk: File[] = [];
  let chunkSize = 0;

  files.forEach((file) => {
    const potentialChunkSize = chunkSize + file.size;

    if (chunk.length === maxFilesPerChunk || potentialChunkSize > chunkSizeBytes) {
      chunks.push(chunk);
      chunk = [];
      chunkSize = 0;
    }

    chunk.push(file);
    chunkSize += file.size;
  });

  if (chunk.length > 0) chunks.push(chunk);

  return chunks;
};

const uploadToIpfs = async (files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('file', file));

  const response = await fetch(ADDRESS.IPFS_UPLOAD, { method: 'POST', body: formData });
  if (!response.ok) throw new Error(response.statusText);

  const result = await (response.json() as Promise<Record<'ipfsHash', string>[]>);
  return result.map(({ ipfsHash }) => `ipfs://${ipfsHash}`);
};

export { getBytes, getFileUrl, getFileChunks, uploadToIpfs };
