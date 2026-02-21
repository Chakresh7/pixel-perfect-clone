import DashboardLayout from '@/components/layout/DashboardLayout';

const Documents = () => (
  <DashboardLayout breadcrumb={['Projects', 'Documents']}>
    <div className="p-6 lg:p-8">
      <h1 className="text-xl font-semibold text-[#F8FAFC] tracking-tight">Documents</h1>
      <p className="text-sm text-[#64748B] mt-1">Documents — coming soon.</p>
    </div>
  </DashboardLayout>
);

export default Documents;
