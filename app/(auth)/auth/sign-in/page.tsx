'use client';

import { signInWithFacebook, signInWithGithub, signInWithGoogle } from '@/app/actions/auth';
import Spinner from '@/app/components/ui/Spinner';
import { useState } from 'react';

type providerType = 'google' | 'github' | 'facebook';

export default function LoginPage() {
  const [loading, setLoading] = useState({ provider: '' });

  const signInHandler = async (provider: providerType) => {
    if (!provider) return;

    // set loading
    setLoading({ provider });
    try {
      switch (provider) {
        case 'google':
          // await signInWithGoogle();
          break;
        case 'github':
          // await signInWithGithub();
          break;
        case 'facebook':
          // await signInWithFacebook();
          break;
        default:
          setLoading({ provider: '' });
          break;
      }
    } catch (error) {
      console.log(error);
      setLoading({ provider: '' });
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
            Sign in with your social account.
          </p>
        </div>

        <div className="oauth-group d-grid w-100 mt-n4">
          {/* Added 'me-2' class to all images for icon spacing */}
          <button
            onClick={() => signInHandler('google')}
            className="btn oauth-btn d-flex align-items-center justify-content-center py-3 w-100 mb-2 px-100"
          >
            {loading.provider === 'google' && <Spinner type="Scale" size={18} width={2} />}
            <img src="https://authjs.dev/img/providers/google.svg" width="19" alt="Google" />
            <span className="btn-text">Continue with Google</span>
          </button>

          <button
            onClick={() => signInHandler('github')}
            className="btn oauth-btn d-flex align-items-center justify-content-center py-3 w-100 mb-2 px-100"
          >
            {loading.provider === 'github' && <Spinner type="Scale" size={18} width={2} />}
            <img
              src="https://authjs.dev/img/providers/github.svg"
              width="19"
              alt="GitHub"
              style={{ filter: 'invert(1)' }}
            />
            <span className="btn-text">Continue with GitHub</span>
          </button>

          <button
            onClick={() => signInHandler('facebook')}
            className="btn oauth-btn d-flex align-items-center justify-content-center py-3 w-100 mb-2 px-100"
          >
            {loading.provider === 'facebook' && <Spinner type="Scale" size={18} width={2} />}
            <img src="https://authjs.dev/img/providers/facebook.svg" width="19" alt="Facebook" />
            <span className="btn-text">Continue with Facebook</span>
          </button>
        </div>

        <div className="footer-credit mt-4">
          <p className="text-secondary">Created by Michael Antoni</p>
        </div>
      </div>
    </div>
  );
}
