import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to add token
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('adminToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - redirect to login
            if (typeof window !== 'undefined') {
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUser');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Dashboard & Statistics
export const getDashboardStats = () => api.get('/admin/stats');
export const getRevenueChart = (params?: any) => api.get('/admin/stats/revenue', { params });
export const getBookingTrends = (params?: any) => api.get('/admin/stats/bookings', { params });

// Users
export const getUsers = (params?: any) => api.get('/users', { params });
export const getUser = (id: number) => api.get(`/users/${id}`);
export const updateUser = (id: number, data: any) => api.patch(`/users/${id}`, data);
export const deleteUser = (id: number) => api.delete(`/users/${id}`);
export const updateUserRole = (id: number, role: string) => api.patch(`/users/${id}/role`, { vaiTro: role });

// Flight Bookings
export const getFlightBookings = (params?: any) => api.get('/bookings', { params });
export const getFlightBooking = (id: number) => api.get(`/bookings/${id}`);
export const updateFlightBookingStatus = (id: number, status: string) => api.patch(`/bookings/${id}/status`, { trangThai: status });
export const cancelFlightBooking = (id: number) => api.post(`/bookings/${id}/cancel`);

// Bus Bookings
export const getBusBookings = (params?: any) => api.get('/bus-bookings', { params });
export const getBusBooking = (id: number) => api.get(`/bus-bookings/${id}`);
export const updateBusBookingStatus = (id: number, status: string) => api.patch(`/bus-bookings/${id}/status`, { trangThaiDat: status });

// Car Rental Bookings
export const getCarBookings = (params?: any) => api.get('/car-rental-bookings', { params });
export const getCarBooking = (id: number) => api.get(`/car-rental-bookings/${id}`);
export const updateCarBookingStatus = (id: number, status: string) => api.patch(`/car-rental-bookings/${id}/status`, { trangThai: status });

// Airport Transfer Bookings
export const getTransferBookings = (params: any) => api.get('/airport-transfer-bookings', { params });
export const getTransferBooking = (id: number) => api.get(`/airport-transfer-bookings/${id}`);
export const updateTransferBookingStatus = (id: number, status: string) => api.patch(`/airport-transfer-bookings/${id}/status`, { trangThai: status });

// Airlines
export const getAirlines = () => api.get('/catalog/airlines');
export const createAirline = (data: any) => api.post('/catalog/airlines', data);
export const updateAirline = (id: number, data: any) => api.patch(`/catalog/airlines/${id}`, data);
export const deleteAirline = (id: number) => api.delete(`/catalog/airlines/${id}`);

// Airports
export const getAirports = () => api.get('/catalog/airports');
export const createAirport = (data: any) => api.post('/catalog/airports', data);
export const updateAirport = (id: number, data: any) => api.patch(`/catalog/airports/${id}`, data);
export const deleteAirport = (id: number) => api.delete(`/catalog/airports/${id}`);

// Bus Companies
export const getBusCompanies = (params?: any) => api.get('/bus-companies', { params });
export const createBusCompany = (data: any) => api.post('/bus-companies', data);
export const updateBusCompany = (id: number, data: any) => api.patch(`/bus-companies/${id}`, data);
export const deleteBusCompany = (id: number) => api.delete(`/bus-companies/${id}`);

// Car Rental Companies
export const getCarCompanies = (params?: any) => api.get('/car-rental-companies', { params });
export const createCarCompany = (data: any) => api.post('/car-rental-companies', data);
export const updateCarCompany = (id: number, data: any) => api.patch(`/car-rental-companies/${id}`, data);
export const deleteCarCompany = (id: number) => api.delete(`/car-rental-companies/${id}`);

// Hotels
export const getHotels = (params?: any) => api.get('/hotels', { params });
export const getHotel = (id: number) => api.get(`/hotels/${id}`);
export const createHotel = (data: any) => api.post('/hotels', data);
export const updateHotel = (id: number, data: any) => api.patch(`/hotels/${id}`, data);
export const deleteHotel = (id: number) => api.delete(`/hotels/${id}`);

// Payments
export const getPayments = (params?: any) => api.get('/payments', { params });
export const getPayment = (id: number) => api.get(`/payments/${id}`);
export const updatePaymentStatus = (id: number, status: string) => api.patch(`/payments/${id}/status`, { trangThai: status });

// Promotions
export const getPromotions = (params?: any) => api.get('/promotions', { params });
export const getPromotion = (id: number) => api.get(`/promotions/${id}`);
export const createPromotion = (data: any) => api.post('/promotions', data);
export const updatePromotion = (id: number, data: any) => api.patch(`/promotions/${id}`, data);
export const deletePromotion = (id: number) => api.delete(`/promotions/${id}`);
export const togglePromotion = (id: number, isActive: boolean) => api.patch(`/promotions/${id}/toggle`, { isActive });

// Reviews
export const getReviews = (params?: any) => api.get('/reviews', { params });
export const deleteReview = (id: number) => api.delete(`/reviews/${id}`);

export default api;
