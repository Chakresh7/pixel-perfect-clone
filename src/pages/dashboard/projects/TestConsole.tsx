import DashboardLayout from '@/components/layout/DashboardLayout';

const TestConsole = () => (
  <DashboardLayout breadcrumb={['Projects', 'Test Console']}>
    <div className="p-6 lg:p-8">
      <h1 className="text-xl font-semibold text-[#F8FAFC] tracking-tight">Test Console</h1>
      <p className="text-sm text-[#64748B] mt-1">Test Console — coming soon.</p>
    </div>
  </DashboardLayout>
);

export default TestConsole;
