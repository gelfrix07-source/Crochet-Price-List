import { Routes, Route } from 'react-router-dom'
import CustomerLayout from './layouts/CustomerLayout'
import AdminLayout from './layouts/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/customer/Home'
import PriceList from './pages/customer/PriceList'
import ProductDetails from './pages/customer/ProductDetails'
import Cart from './pages/customer/Cart'

import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminProductForm from './pages/admin/AdminProductForm'
import AdminCategories from './pages/admin/AdminCategories'
import AdminSettings from './pages/admin/AdminSettings'

export default function App() {
  return (
    <Routes>
      {/* Public customer routes */}
      <Route element={<CustomerLayout />}>
  <Route path="/" element={<Home />} />
  <Route path="/prices" element={<PriceList />} />
  <Route path="/product/:id" element={<ProductDetails />} />
  <Route path="/cart" element={<Cart />} />
</Route>

      {/* Admin login (outside the protected admin layout) */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<AdminProductForm />} />
        <Route path="products/:id/edit" element={<AdminProductForm />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg px-4 text-center">
      <span className="text-4xl" aria-hidden="true">🧶</span>
      <h1 className="font-heading text-2xl font-semibold text-ink">Page not found</h1>
      <p className="font-body text-sm text-ink-soft">The page you're looking for doesn't exist.</p>
      <a href="/" className="btn-primary mt-2">Go Home</a>
    </div>
  )
}
