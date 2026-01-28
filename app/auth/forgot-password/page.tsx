import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';
import { AuthLayout } from '@/features/auth/components/AuthLayout';

export default function ForgotPasswordPage() {
    return (
        <AuthLayout>
            <ForgotPasswordForm />
        </AuthLayout>
    );
}
