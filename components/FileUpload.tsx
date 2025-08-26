'use client';
import React, { useRef, useState } from 'react';
import { clientEnv } from '@/lib/config.client';
import { IKImage, IKUpload, IKVideo, ImageKitProvider } from 'imagekitio-next';
import Image from 'next/image';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const {
  imagekit: { publicKey, urlEndpoint },
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
    return { signature, token, expire };
  } catch (error: any) {
    throw new Error(`Authentication failed: ${error.message}`);
  }
};

interface Props {
  type: 'image' | 'video';
  accept: string;
  placeholder: string;
  folder: string;
  variant: 'dark' | 'light';
  onFileChange: (filePath: string) => void;
  value?: string;
}

const FileUpload = ({
  type,
  accept,
  placeholder,
  folder,
  variant,
  onFileChange,
  value,
}: Props) => {
  const ikUploadRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<{ filePath: string | null }>({
    filePath: value ?? null,
  });
  const [progress, setProgress] = useState(0);

  const styles = {
    button:
      variant === 'dark'
        ? 'bg-dark-300'
        : 'bg-light-600 border-gray-100 border',
    placeholder: variant === 'dark' ? 'text-light-100' : 'text-slate-500',
    text: variant === 'dark' ? 'text-light-100' : 'text-dark-400',
  };

  const onError = (error: any) => {
    console.log(error);
    toast(`${type} upload failed`, {
      description: `Your ${type} upload failed. Please try again.`,
    });
  };

  const onSuccess = (res: any) => {
    setFile(res);
    onFileChange(res.filePath);
    toast(`${type} uploaded successfully`, {
      description: `${res.filePath} has been uploaded successfully.`,
    });
  };

  const onValidate = (f: File) => {
    if (type === 'image') {
      if (f.size > 20 * 1024 * 1024) {
        toast('File size too large', {
          description: 'Please upload a file that is less than 20MB',
        });
        return false;
      }
    } else if (f.size > 50 * 1024 * 1024) {
      toast('File size too large', {
        description: 'Please upload a file that is less than 20MB',
      });
      return false;
    }
    return true;
  };

  return (
    <ImageKitProvider
      publicKey={publicKey}
      authenticator={authenticator}
      urlEndpoint={urlEndpoint}
    >
      <IKUpload
        ref={ikUploadRef as any}
        onError={onError}
        onSuccess={onSuccess}
        className="hidden"
        useUniqueFileName={true}
        validateFile={onValidate}
        onUploadStart={() => setProgress(0)}
        onUploadProgress={({
          loaded,
          total,
        }: {
          loaded: number;
          total: number;
        }) => {
          const percent = total ? Math.round((loaded / total) * 100) : 0;
          setProgress(percent);
        }}
        folder={folder}
        accept={accept}
      />

      <button
        className={cn('upload-btn', styles.button)}
        onClick={(e) => {
          e.preventDefault();
          ikUploadRef.current?.click();
        }}
      >
        <Image
          src="/icons/upload.svg"
          alt="upload-icon"
          width={20}
          height={20}
          className="object-contain"
        />
        <p className={cn('text-base', styles.placeholder)}>{placeholder}</p>

        {file && (
          <p className={cn('upload-filename', styles.text)}>{file.filePath}</p>
        )}

        {progress > 0 && (
          <div className="w-full rounded-full bg-green-200">
            <div className="progress" style={{ width: `${progress}%` }}>
              {progress}%
            </div>
          </div>
        )}
      </button>

      {file &&
        (type === 'image' ? (
          <IKImage
            alt={file.filePath}
            path={file.filePath}
            width={500}
            height={300}
          />
        ) : type === 'video' ? (
          <IKVideo
            path={file.filePath}
            controls={true}
            className="h-96 w-full rounded-xl"
          />
        ) : null)}
    </ImageKitProvider>
  );
};

export default FileUpload;
