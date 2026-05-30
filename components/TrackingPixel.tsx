'use client';

const TRACKING_URL = 'https://uf2y3gwxme.execute-api.ap-southeast-1.amazonaws.com/prod/track';

export default function TrackingPixel({ site }: { site: string }) {
  return (
    <img
      src={`${TRACKING_URL}?site=${site}`}
      width={1}
      height={1}
      alt=""
      style={{ position: 'absolute', left: '-9999px' }}
    />
  );
}
