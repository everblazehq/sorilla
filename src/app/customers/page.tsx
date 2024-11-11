import { CustomersTable } from "@/components/customers-table"

export default async function Page() {
  return (
    <div className="flex w-full flex-1 flex-col p-4">
      <div className="flex flex-1 flex-col rounded-lg border border-neutral-800 bg-neutral-900">
        <main className="">
          <div className="border-b border-neutral-800 px-6 py-4">
            <h1 className="text-2xl font-medium text-white">Customers</h1>
          </div>
          <div className="px-6 py-4">
            <CustomersTable />
          </div>
        </main>
      </div>
    </div>
  ) 
} 
