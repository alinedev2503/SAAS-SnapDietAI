import React, { useState } from 'react';
import { WhiteLabelProvider, useWhiteLabel } from './context/WhiteLabelContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { CameraScanner } from './components/CameraScanner';
import { HealthySwapsModal } from './components/HealthySwapsModal';
import { DemoLimitModal } from './components/DemoLimitModal';
import { LandingPage } from './components/LandingPage';
import { HistoryView } from './views/HistoryView';
import { ProfileView } from './views/ProfileView';
import { WhiteLabelAdminView } from './views/WhiteLabelAdminView';
import { MonthlyReportPdf } from './components/MonthlyReportPdf';
import { ProductScan } from './types/nutrition';

function MainAppContent() {
  const { showDemoModal, closeDemoModal } = useWhiteLabel();
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [selectedSwapScan, setSelectedSwapScan] = useState<ProductScan | null>(null);

  const handleScanComplete = (scan: ProductScan) => {
    // Navigate automatically to History tab after scanning
    setActiveTab('history');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors pb-20 md:pb-8">
      
      {/* Top Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenScanner={() => setIsScannerOpen(true)}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'landing' && (
          <LandingPage
            onOpenScanner={() => setIsScannerOpen(true)}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView
            onOpenScanner={() => setIsScannerOpen(true)}
            onOpenSwaps={(scan) => setSelectedSwapScan(scan)}
          />
        )}

        {activeTab === 'reports' && <MonthlyReportPdf />}

        {activeTab === 'profile' && <ProfileView />}

        {activeTab === 'admin' && <WhiteLabelAdminView />}
      </main>

      {/* Mobile Touch Bottom Nav Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenScanner={() => setIsScannerOpen(true)}
      />

      {/* Camera & Barcode Scanner Modal */}
      <CameraScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanComplete={handleScanComplete}
      />

      {/* AI Healthy Swaps Alternatives Modal */}
      <HealthySwapsModal
        scan={selectedSwapScan}
        onClose={() => setSelectedSwapScan(null)}
      />

      {/* Commercial Demo Limit Modal */}
      <DemoLimitModal
        isOpen={showDemoModal}
        onClose={closeDemoModal}
        onSelectPlan={() => setActiveTab('landing')}
      />

    </div>
  );
}

export default function App() {
  return (
    <WhiteLabelProvider>
      <MainAppContent />
    </WhiteLabelProvider>
  );
}
