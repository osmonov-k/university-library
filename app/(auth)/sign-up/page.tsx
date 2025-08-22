'use client';

import AuthForm from '@/components/AuthForm';
import { signUpSchema } from '@/lib/validations';
import { signIn } from 'next-auth/react';

export default function Page() {
  return (
    <AuthForm
      type="SIGN_UP"
      schema={signUpSchema}
      defaultValues={{
        email: '',
        password: '',
        fullName: '',
        universityId: 0,
        universityCard: '', // make sure your ImageUpload gives you a string path or similar
      }}
      onSubmit={async (values) => {
        // 1) Create the user
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });

        // Try to parse JSON safely
        let data: any = null;
        try {
          data = await res.json();
        } catch {}

        if (!res.ok || !data?.success) {
          const message = data?.error || `Sign-up failed (${res.status})`;
          return { success: false, error: message };
        }

        // 2) Auto sign in
        const r = await signIn('credentials', {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        if (r?.error) return { success: false, error: r.error };
        return { success: true };
      }}
    />
  );
}
