function getBytesSize(mb: number) {
  const B_MULTIPLIER = 1024;
  const KB_MULTIPLIER = 1024;

  return mb * B_MULTIPLIER * KB_MULTIPLIER;
}

const getFileUrl = (file: File) => URL.createObjectURL(file);

export { getBytesSize, getFileUrl };
