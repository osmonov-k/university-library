// app/(auth)/sign-in/page.tsx
'use client';

import AuthForm from '@/components/AuthForm';
import { signInSchema } from '@/lib/validations';

export default function Page() {
  return (
    <AuthForm
      type="SIGN_IN"
      schema={signInSchema}
      defaultValues={{ email: '', password: '' }}
      onSubmit={async (values) => {
        const res = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        const data = await res.json(); // our route always returns JSON
        return data; // { success, error? }
      }}
    />
  );
}
