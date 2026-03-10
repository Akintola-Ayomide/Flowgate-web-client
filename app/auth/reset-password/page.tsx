import { Suspense } from 'react';
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';
import { AuthLayout } from '@/features/auth/components/AuthLayout';

export default function ResetPasswordPage() {
    return (
        <AuthLayout>
            <Suspense fallback={<div>Loading...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </AuthLayout>
    );
}
