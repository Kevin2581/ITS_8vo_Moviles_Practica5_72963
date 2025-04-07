// app/index.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import Login from './login';
import RegisterScreen from './registro';

export default function Index() {
  const router = useRouter();

  return (

    <RegisterScreen onRegisterSuccess={() => router.push('./login')} />

  );
}
