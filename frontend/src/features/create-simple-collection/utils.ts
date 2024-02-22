import { ADDRESS } from '@/consts';

function getBytesSize(mb: number) {
  const B_MULTIPLIER = 1024;
  const KB_MULTIPLIER = 1024;

  return mb * B_MULTIPLIER * KB_MULTIPLIER;
}

const getFileUrl = (file: File) => URL.createObjectURL(file);

const uploadToIpfs = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(ADDRESS.IPFS_UPLOAD, { method: 'POST', body: formData });
  if (!response.ok) throw new Error(response.statusText);

  const [{ ipfsHash }] = await (response.json() as Promise<Record<'ipfsHash', string>[]>);
  return `ipfs://${ipfsHash}`;
};

export { getBytesSize, getFileUrl, uploadToIpfs };
