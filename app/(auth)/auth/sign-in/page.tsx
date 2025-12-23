'use client';

import { signInWithFacebook, signInWithGithub, signInWithGoogle } from '@/app/actions/auth';
import Spinner from '@/app/components/ui/Spinner';
import { useState } from 'react';

type providerType = 'google' | 'github' | 'facebook';

export default function LoginPage() {
  const [loading, setLoading] = useState({ provider: '' });

  const signInHandler = async (provider: providerType) => {
    switch (provider) {
      case 'google':
        await signInWithGoogle();
        setLoading({ provider });
        break;
      case 'github':
        await signInWithGithub();
        setLoading({ provider });

        break;
      case 'facebook':
        await signInWithFacebook();
        setLoading({ provider });
        break;
      default:
        break;
    }
  };

  return (
    <div className="auth-page-wrapper d-flex flex-column align-items-center justify-content-start min-vh-100 pt-5">
      <div className="login-card text-center" style={{ maxWidth: '420px', width: '100%' }}>
        <div className="login-header mb-5">
          <img
            src="/assets/img/logo2.png"
            alt="CronLabs Logo"
            style={{ width: '320px', height: 'auto' }}
            className="mb-4"
          />
          <p className="text-secondary mb-0" style={{ fontSize: '0.95rem' }}>
            Sign in with your Social account
          </p>
        </div>

        <div className="oauth-group d-grid w-100 mt-n4">
          {/* Added 'me-3' class to all images for icon spacing */}
          <button
            onClick={() => signInHandler('google')}
            className="btn oauth-btn d-flex align-items-center justify-content-center py-3 w-100 mb-2"
          >
            {loading.provider === 'google' && (
              <Spinner type="Scale" size={20} width={3} className="mr-2" />
            )}
            <img
              src="https://authjs.dev/img/providers/google.svg"
              width="24"
              alt="Google"
              className="me-3"
            />
            <span className="fw-semibold btn-text">Continue with Google</span>
          </button>

          <button
            onClick={() => signInHandler('github')}
            className="btn oauth-btn d-flex align-items-center justify-content-center py-3 w-100 mb-2"
          >
            {loading.provider === 'github' && (
              <Spinner type="Scale" size={20} width={3} className="mr-2" />
            )}
            <img
              src="https://authjs.dev/img/providers/github.svg"
              width="24"
              alt="GitHub"
              style={{ filter: 'invert(1)' }}
              className="me-3"
            />
            <span className="fw-semibold btn-text">Continue with GitHub</span>
          </button>

          <button
            onClick={() => signInHandler('facebook')}
            className="btn oauth-btn d-flex align-items-center justify-content-center py-3 w-100 mb-2"
          >
            {loading.provider === 'facebook' && (
              <Spinner type="Scale" size={20} width={3} className="mr-2" />
            )}
            <img
              src="https://authjs.dev/img/providers/facebook.svg"
              width="24"
              alt="Facebook"
              className="me-3"
            />
            <span className="fw-semibold btn-text">Continue with Facebook</span>
          </button>
        </div>

        <div className="footer-credit mt-4">
          <p className="text-secondary">Created by Michael Antoni</p>
        </div>
      </div>
    </div>
  );
}
