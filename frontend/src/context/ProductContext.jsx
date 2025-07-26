"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ProductContext = createContext();

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error("useProducts must be used within a ProductProvider");
    }
    return context;
};

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState(() => localStorage.getItem("token"));

    useEffect(() => {
        setToken(localStorage.getItem("token"));
    }, []);

    async function getProducts() {
        try {
            console.log('Token:', token);
            if (!token) {
                console.log('No token available');
                setProducts([]);
                return;
            }
            
            const response = await fetch(
                `${import.meta.env.VITE_BASE_URL}/products`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            if (!response.ok) {
                console.error('Products fetch error:', response.status, response.statusText);
                if (response.status === 401) {
                    // Token might be invalid, clear it
                    localStorage.removeItem("token");
                    setToken(null);
                }
                setProducts([]);
                return;
            }
            
            const data = await response.json();
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
        }
    }
    useEffect(() => {
        getProducts();
    }, []);

    const addProduct = (product) => {
        const newProduct = {
            ...product,
            lastUpdated: new Date().toISOString().split("T")[0],
        };
        setProducts((prev) => [...prev, newProduct]);
    };

    const updateProduct = (id, updatedProduct) => {
        setProducts((prev) =>
            prev.map((product) =>
                product.id === Number.parseInt(id)
                    ? {
                          ...product,
                          ...updatedProduct,
                          lastUpdated: new Date().toISOString().split("T")[0],
                      }
                    : product
            )
        );
    };

    const deleteProduct = (id) => {
        setProducts((prev) => prev.filter((product) => product.id !== id));
    };

    const getProductById = (id) => {
        return products.find((product) => product.id === Number.parseInt(id));
    };

    const getLowStockProducts = () => {
        return products.filter((product) => product.quantity <= 10);
    };

    const getRecentlyUpdated = () => {
        return products
            .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
            .slice(0, 5);
    };

    const value = {
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProducts,
        getProductById,
        getLowStockProducts,
        getRecentlyUpdated,
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};
