'use client';
import { clientEnv } from '@/lib/config.client';
import { IKVideo, ImageKitProvider } from 'imagekitio-next';
import React from 'react';

const BookVideo = ({ videoUrl }: { videoUrl: string }) => {
  return (
    <ImageKitProvider
      publicKey={clientEnv.imagekit.publicKey}
      urlEndpoint={clientEnv.imagekit.urlEndpoint}
    >
      <IKVideo path={videoUrl} controls={true} className="w-full rounded-xl" />
    </ImageKitProvider>
  );
};

export default BookVideo;
