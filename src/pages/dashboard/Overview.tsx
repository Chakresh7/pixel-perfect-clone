import DashboardLayout from '@/components/layout/DashboardLayout';

const Overview = () => (
  <DashboardLayout breadcrumb="Overview">
    <div className="p-6 lg:p-8">
      <h1 className="text-xl font-semibold text-[#F8FAFC] tracking-tight">Overview</h1>
      <p className="text-sm text-[#64748B] mt-1">Welcome to your dashboard.</p>
    </div>
  </DashboardLayout>
);

export default Overview;
