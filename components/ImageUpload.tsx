'use client';
import React, { useRef, useState } from 'react';
import { clientEnv } from '@/lib/config.client';
import { IKImage, IKUpload, ImageKitProvider } from 'imagekitio-next';
import Image from 'next/image';
import { toast } from 'sonner';

const {
  imagekit: { publicKey, urlEndpoint },
  apiEndpoint,
} = clientEnv;

const authenticator = async () => {
  try {
    const response = await fetch(`/api/auth/imagekit`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to authenticate with status ${response.status}: ${errorText}`,
      );
    }

    const data = await response.json();
    const { signature, token, expire } = data;
    return {
      signature,
      token,
      expire,
    };
  } catch (error: any) {
    throw new Error(`Authentication failed: ${error.message}`);
  }
};

const ImageUpload = ({
  onFileChange,
}: {
  onFileChange: (filePath: string) => void;
}) => {
  const ikUploadRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<{ filePath: string } | null>(null);

  const onError = (error: any) => {
    console.log(error);
    toast('Image uploaded failed', {
      description: 'Your image upload failed. Please try again.',
    });
  };
  const onSuccess = (res: any) => {
    setFile(res);
    onFileChange(res.filePath);
    toast('Image uploaded successfully', {
      description: `${res.filePath} has been uploaded successfully.`,
    });
  };

  return (
    <ImageKitProvider
      publicKey={publicKey}
      authenticator={authenticator}
      urlEndpoint={urlEndpoint}
    >
      <IKUpload
        className="hidden"
        ref={ikUploadRef}
        onError={onError}
        onSuccess={onSuccess}
        fileName="test-upload.png"
      />
      <button
        className="upload-btn"
        onClick={(e) => {
          e.preventDefault();
          if (ikUploadRef.current) {
            ikUploadRef.current?.click();
          }
        }}
      >
        <Image
          src="/icons/upload.svg"
          alt="upload-icon"
          width={20}
          height={20}
          className="object-contain"
        />
        <p className="text-base text-light-100">Upload File</p>
        {file && <p className="upload-filename">{file.filePath}</p>}
      </button>

      {file && (
        <IKImage
          alt={file.filePath}
          path={file.filePath}
          width={500}
          height={300}
        />
      )}
    </ImageKitProvider>
  );
};

export default ImageUpload;
