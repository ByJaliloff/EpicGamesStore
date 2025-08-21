import { Outlet } from 'react-router-dom'
import AdminHeader from '../components/AdminHeader'

function AdminLayout() {
  return (
    <>
    <AdminHeader/>
    <main className="bg-gradient-to-b from-[#0E0D0E] via-[#150C15] to-[#0F131E] ">
        <Outlet/>
    </main>
   
    </>
  )
}

export default AdminLayout