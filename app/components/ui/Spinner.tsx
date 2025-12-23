'use client';

import {
  BeatLoader,
  ClipLoader,
  ClockLoader,
  MoonLoader,
  PuffLoader,
  PulseLoader,
  ScaleLoader,
} from 'react-spinners';
import { CSSProperties } from 'react';

const loaders = {
  Puff: PuffLoader,
  Beat: BeatLoader,
  Clip: ClipLoader,
  Clock: ClockLoader,
  Moon: MoonLoader,
  Pulse: PulseLoader,
  Scale: ScaleLoader,
};

type SpinnerProps = {
  text?: string;
  color?: string;
  size?: number;
  width?: number;
  type?: keyof typeof loaders;
  className?: string; // New prop for custom classes
};

export default function Spinner({
  text,
  color = '#ffffff',
  size = 15,
  width,
  type = 'Puff',
  className = '', // Default to empty string
}: SpinnerProps) {
  const override: CSSProperties = {
    display: 'inline-block',
    verticalAlign: 'middle',
  };

  const SelectedLoader = loaders[type] || PuffLoader;

  return (
    // We inject the className here
    <div className={`d-flex align-items-center justify-content-center ${className}`}>
      <SelectedLoader
        color={color}
        loading={true}
        cssOverride={override}
        size={size}
        height={size}
        width={width || size / 5}
        radius={2}
        aria-label="Loading Spinner"
      />
      {text && (
        <span className="ms-2" style={{ color }}>
          {text}
        </span>
      )}
    </div>
  );
}
