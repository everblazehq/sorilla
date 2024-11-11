import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/utils/supabase'
  
export default async function Index() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()


  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex w-full flex-1 flex-col p-4">
      <div className="flex flex-1 flex-col rounded-lg border border-neutral-800 bg-neutral-900">
        <main className="">
          <div className="px-6 py-4 border-b border-neutral-800">
            <h1 className="text-2xl font-medium text-white">Dashboard</h1>
          </div>
          <div className="px-6 py-4">
            <p className="text-lg">
              {user ? user.email : ''}
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
