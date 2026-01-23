'use client';

import {
    Header,
    HeroSection,
    HowItWorksSection,
    FeaturesSection,
    AppDownloadSection,
    Footer,
} from './components';

export function LandingPage() {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main>
                <HeroSection />
                <HowItWorksSection />
                <FeaturesSection />
                <AppDownloadSection />
            </main>
            <Footer />
        </div>
    );
}
