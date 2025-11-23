import axios from "axios";
const BASE_URL = "https://685013d7e7c42cfd17974a33.mockapi.io";
export const getTaxes = () => axios.get(`${BASE_URL}/taxes`);
export const getCountries = () => axios.get(`${BASE_URL}/countries`);
export const updateTax = (id, data) => axios.put(`${BASE_URL}/taxes/${id}`, data);
