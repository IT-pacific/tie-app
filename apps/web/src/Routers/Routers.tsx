import React from 'react';
import Orders from '@/pages/Orders';
import Layout from '@/layout/Layout';
import Dashboard from '@/pages/Dashboard';
import Inventories from '@/pages/Inventories';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Register from '@/pages/auth/Register';
import Login from '@/pages/auth/Login';
import ProtectedRoute from './ProtectedRoute';
import CustomerOrderPage from '@/pages/CustomerOrderPage';
import NotFoundPage from '@/pages/404Page';
import OrderPayment from '@/pages/OrderPayment';
import DocumentPage from '@/pages/Document';
import EditDocument from '@/pages/EditDocument';

const Routers = () => {
  return (
    <Router>
      <Routes>
        {/* unprotected routes */}
        
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/login" element={<Login />} />
        {/* protected routes */}

        <Route path="/" element={<ProtectedRoute component={Layout} />}>
          <Route path="/" element={<ProtectedRoute component={Dashboard} />} />
          <Route path='/documents' element={<DocumentPage />} />
          <Route path='/documents/:id' element={<EditDocument/>}/>
          <Route
            path="/order/:id"
            element={<ProtectedRoute component={OrderPayment} />}
        />
          <Route
            path="/orders"
            element={<ProtectedRoute component={Orders} />}
          />
          <Route
            path="/inventory"
            element={<ProtectedRoute component={Inventories} />}
          />
        </Route>
        <Route
            path="/items/:id"
            element={<CustomerOrderPage />}
        />
       

        <Route path='*' element={<NotFoundPage />}></Route>
      
      </Routes>

    </Router>
  );
};

export default Routers;
