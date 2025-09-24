import imageCompression from 'browser-image-compression';

type Props = {
  maxWidth: number;
};

export const useImageResizer = ({ maxWidth }: Props) => {
  const options = {
    maxWidthOrHeight: maxWidth
  };

  const resizeFile = async (file: File) => {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  };

  return { resizeFile };
};
