import DashboardLayout from '@/components/layout/DashboardLayout';

const NewProject = () => (
  <DashboardLayout breadcrumb={['Projects', 'New Project']}>
    <div className="p-6 lg:p-8">
      <h1 className="text-xl font-semibold text-[#F8FAFC] tracking-tight">New Project</h1>
      <p className="text-sm text-[#64748B] mt-1">Create a new project — coming soon.</p>
    </div>
  </DashboardLayout>
);

export default NewProject;
