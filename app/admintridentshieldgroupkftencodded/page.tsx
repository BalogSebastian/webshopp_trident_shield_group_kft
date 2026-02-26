"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";

export default function AdminTridentShieldGroupKftEncoddedDashboard() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  type ProductItem = { _id: string; name: string; category?: string; price: number; stock: number; sku?: string; image?: string; isActive?: boolean };
  type OrderItem = { _id: string; transactionId: string; customerName: string; productName: string; quantity: number; totalPrice: number };
  type PurchaseItem = { _id: string; purchaseDate: string | Date; supplierName: string; invoiceNumber: string; productName: string; sku?: string; quantity: number; unit: string; netUnitPrice: number; netTotalPrice: number; vatRate: number; grossTotalPrice: number };
  type SaleItem = { _id: string; transactionId: string; productId: string; saleDate: string | Date; productName: string; customerName: string; quantity: number; calculatedPurchaseUnitPrice: number; totalPurchaseValue: number; netUnitPrice: number; profit: number; vatRate: number; grossUnitPrice: number; companyName?: string; taxNumber?: string; address?: string; contactPerson?: string; phoneNumber?: string; shippingAddress?: string };
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [editForm, setEditForm] = useState({ name: "", price: "", stock: "" });
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [addForm, setAddForm] = useState({ 
    name: "", 
    category: "", 
    price: "", 
    stock: "", 
    sku: "", 
    image: "" 
  });
  const [productView, setProductView] = useState<'cards' | 'table'>('cards');
  const [showNewProductRow, setShowNewProductRow] = useState(false);
  const [newProductForm, setNewProductForm] = useState({ 
    name: "", 
    category: "", 
    price: "", 
    stock: "", 
    sku: "", 
    image: "" 
  });
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);
  const [showNewPurchaseRow, setShowNewPurchaseRow] = useState(true);
  const [newPurchaseForm, setNewPurchaseForm] = useState({
    purchaseDate: "",
    supplierName: "",
    invoiceNumber: "",
    productName: "",
    sku: "",
    quantity: "",
    unit: "db",
    netUnitPrice: "",
    netTotalPrice: "",
    vatRate: "27",
    grossTotalPrice: ""
  });
  const [sales, setSales] = useState<SaleItem[]>([]);
  const [showNewSaleRow, setShowNewSaleRow] = useState(true);
  const [showNewSaleCompanyDetails, setShowNewSaleCompanyDetails] = useState(false);
  const [expandedSaleCompanyDetails, setExpandedSaleCompanyDetails] = useState<Set<string>>(new Set());
  const [newSaleForm, setNewSaleForm] = useState({
    transactionId: "",
    productId: "",
    saleDate: "",
    productName: "",
    customerName: "",
    companyName: "",
    taxNumber: "",
    address: "",
    contactPerson: "",
    phoneNumber: "",
    shippingAddress: "",
    quantity: "",
    calculatedPurchaseUnitPrice: "",
    totalPurchaseValue: "",
    netUnitPrice: "",
    profit: "",
    vatRate: "27",
    grossUnitPrice: "",
    totalGrossPrice: ""
  });
  const [inventory, setInventory] = useState<{ sku: string; currentQty: number; avgCost: number; valuation: number; unit: string }[]>([]);
  const [importInfo, setImportInfo] = useState<string>("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Azonnal beállítjuk az időt a kliens oldalon
    setCurrentTime(new Date());

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  // ActiveTab mentése és visszaállítása frissítés után
  useEffect(() => {
    // Frissítéskor visszaállítjuk az utolsó fülöt
    const savedTab = localStorage.getItem('adminActiveTab');
    if (savedTab && ['dashboard', 'products', 'orders', 'purchases', 'sales'].includes(savedTab)) {
      setActiveTab(savedTab);
    }
  }, []);

  useEffect(() => {
    // Mindig elmentjük az aktuális fült
    localStorage.setItem('adminActiveTab', activeTab);
  }, [activeTab]);

  const loadData = async () => {
    try {
      setError("");
      setSuccessMessage("");
      
      const productsResponse = await fetch('/api/products');
      const ordersResponse = await fetch('/api/orders');
      const purchasesResponse = await fetch('/api/purchases');
      const salesResponse = await fetch('/api/sales');
      
      if (!productsResponse.ok) {
        throw new Error('Hiba a termékek lekérésekor');
      }
      if (!ordersResponse.ok) {
        throw new Error('Hiba a rendelések lekérésekor');
      }
      if (!purchasesResponse.ok) {
        throw new Error('Hiba a beszerzések lekérésekor');
      }
      if (!salesResponse.ok) {
        throw new Error('Hiba az értékesítések lekérésekor');
      }
      
      const productsData = await productsResponse.json();
      const ordersData = await ordersResponse.json();
      const purchasesData = await purchasesResponse.json();
      const salesData = await salesResponse.json();
      
      // Termékek és rendelések API tömbként adja vissza, beszerzések és értékesítések API {data: ...} formátumban
      setProducts(Array.isArray(productsData) ? productsData : []);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setPurchases(purchasesData.data || []);
      setSales(salesData.data || []);
      
      // NEM változtatjuk az activeTab-ot, maradunk ahol voltunk
    } catch (error) {
      console.error('Hiba az adatok betöltésekor:', error);
      setError('Nem sikerült az adatok betöltése');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    router.push("/admintrident");
  };

  const handleProductUpdate = async (productId: string, updateData: Record<string, unknown>) => {
    try {
      setError("");
      setSuccessMessage("");
      
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setSuccessMessage('Sikeres frissítés!');
        await loadData();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        throw new Error(result.error || 'Hiba a frissítés során');
      }
    } catch (e: unknown) {
      console.error('Hiba a termék frissítésekor:', error);
      setError('Hiba a frissítés során');
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleProductDelete = async (productId: string) => {
    if (!confirm('Biztosan törölni szeretné ezt a terméket?')) {
      return;
    }
    
    try {
      setError("");
      setSuccessMessage("");
      
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setSuccessMessage('Termék sikeresen törölve!');
        await loadData();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        throw new Error(result.error || 'Hiba a törlés során');
      }
    } catch (e: unknown) {
      console.error('Hiba a termék törlésekor:', error);
      setError('Hiba a törlés során');
      setTimeout(() => setError(""), 3000);
    }
  };

  const toggleProductStatus = async (productId: string, currentStatus: boolean) => {
    // A főoldal logikája: isActive = true vagy nem létezik => AKTÍV
    // Tehát az inaktív állapotot explicit false jelenti
    const newStatus = currentStatus ? false : true;
    await handleProductUpdate(productId, { isActive: newStatus });
  };

  const startEditProduct = (product: ProductItem) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name || "",
      price: product.price?.toString() || "",
      stock: product.stock?.toString() || ""
    });
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setEditForm({ name: "", price: "", stock: "" });
  };

  const saveEdit = async () => {
    if (!editingProduct) return;
    
    const updateData = {
      name: editForm.name,
      price: parseFloat(editForm.price),
      stock: parseInt(editForm.stock)
    };
    
    await handleProductUpdate(editingProduct._id, updateData);
    cancelEdit();
  };

  const handleAddProduct = async () => {
    try {
      setError("");
      setSuccessMessage("");
      
      const productData = {
        name: addForm.name,
        category: addForm.category,
        price: parseFloat(addForm.price),
        stock: parseInt(addForm.stock),
        sku: addForm.sku,
        image: addForm.image || "https://via.placeholder.com/150",
        isActive: true
      };
      
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setSuccessMessage('Termék sikeresen hozzáadva!');
        await loadData();
        cancelAddProduct();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        throw new Error(result.error || 'Hiba a termék hozzáadása során');
      }
    } catch (e: unknown) {
      console.error('Hiba a termék hozzáadásakor:', error);
      setError('Hiba a termék hozzáadása során');
      setTimeout(() => setError(""), 3000);
    }
  };

  const cancelAddProduct = () => {
    setShowAddProduct(false);
    setAddForm({ 
      name: "", 
      category: "", 
      price: "", 
      stock: "", 
      sku: "", 
      image: "" 
    });
  };

  const handleAddProductFromRow = async () => {
    try {
      setError("");
      setSuccessMessage("");
      
      const productData = {
        name: newProductForm.name,
        category: newProductForm.category,
        price: parseFloat(newProductForm.price),
        stock: parseInt(newProductForm.stock),
        sku: newProductForm.sku,
        image: newProductForm.image || "https://via.placeholder.com/150",
        isActive: true
      };
      
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setSuccessMessage('Termék sikeresen hozzáadva!');
        await loadData();
        setShowNewProductRow(false);
        setNewProductForm({ 
          name: "", 
          category: "", 
          price: "", 
          stock: "", 
          sku: "", 
          image: "" 
        });
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        throw new Error(result.error || 'Hiba a termék hozzáadása során');
      }
    } catch (e: unknown) {
      console.error('Hiba a termék hozzáadásakor:', error);
      setError('Hiba a termék hozzáadása során');
      setTimeout(() => setError(""), 3000);
    }
  };

  const cancelNewProductRow = () => {
    setShowNewProductRow(false);
    setNewProductForm({ 
      name: "", 
      category: "", 
      price: "", 
      stock: "", 
      sku: "", 
      image: "" 
    });
  };

  // Beszerzési műveletek
  const handleAddPurchase = async () => {
    try {
      setError("");
      setSuccessMessage("");
      
      const purchaseData = {
        purchaseDate: newPurchaseForm.purchaseDate,
        supplierName: newPurchaseForm.supplierName,
        invoiceNumber: newPurchaseForm.invoiceNumber,
        productName: newPurchaseForm.productName,
        sku: newPurchaseForm.sku,
        quantity: parseFloat(newPurchaseForm.quantity),
        unit: newPurchaseForm.unit,
        netUnitPrice: parseFloat(newPurchaseForm.netUnitPrice),
        netTotalPrice: parseFloat(newPurchaseForm.netTotalPrice),
        vatRate: parseFloat(newPurchaseForm.vatRate),
        grossTotalPrice: parseFloat(newPurchaseForm.grossTotalPrice)
      };
      
      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(purchaseData)
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setSuccessMessage('Beszerzés sikeresen hozzáadva!');
        await loadData();
        resetNewPurchaseForm();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        throw new Error(result.error || 'Hiba a beszerzés hozzáadása során');
      }
    } catch (e: unknown) {
      console.error('Hiba a beszerzés hozzáadásakor:', error);
      setError('Hiba a beszerzés hozzáadása során');
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleUpdatePurchase = async (id: string, updateData: Partial<PurchaseItem>) => {
    try {
      setError("");
      setSuccessMessage("");
      
      const response = await fetch(`/api/purchases/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setSuccessMessage('Beszerzés sikeresen módosítva!');
        await loadData();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        throw new Error(result.error || 'Hiba a beszerzés módosítása során');
      }
    } catch (e: unknown) {
      console.error('Hiba a beszerzés módosításakor:', error);
      setError('Hiba a beszerzés módosítása során');
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleDeletePurchase = async (id: string) => {
    if (!confirm('Biztosan törölni szeretné ezt a beszerzést?')) {
      return;
    }
    
    try {
      setError("");
      setSuccessMessage("");
      
      const response = await fetch(`/api/purchases/${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setSuccessMessage('Beszerzés sikeresen törölve!');
        await loadData();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        throw new Error(result.error || 'Hiba a beszerzés törlése során');
      }
    } catch (e: unknown) {
      console.error('Hiba a beszerzés törlésekor:', error);
      setError('Hiba a beszerzés törlése során');
      setTimeout(() => setError(""), 3000);
    }
  };

  // ÉRTÉKESÍTÉS MŰVELETEK
  const handleAddSale = async () => {
    try {
      setError("");
      setSuccessMessage("");
      
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSaleForm)
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setSuccessMessage('Értékesítés sikeresen hozzáadva!');
        setNewSaleForm({
          transactionId: "",
          productId: "",
          saleDate: "",
          productName: "",
          customerName: "",
          companyName: "",
          taxNumber: "",
          address: "",
          contactPerson: "",
          phoneNumber: "",
          shippingAddress: "",
          quantity: "",
          calculatedPurchaseUnitPrice: "",
          totalPurchaseValue: "",
          netUnitPrice: "",
          profit: "",
          vatRate: "27",
          grossUnitPrice: "",
          totalGrossPrice: ""
        });
        await loadData();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        throw new Error(result.error || 'Hiba az értékesítés hozzáadása során');
      }
    } catch (e: unknown) {
      console.error('Hiba az értékesítés hozzáadásakor:', error);
      setError('Hiba az értékesítés hozzáadása során');
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleUpdateSale = async (id: string, updateData: Partial<SaleItem>) => {
    try {
      setError("");
      setSuccessMessage("");
      
      const response = await fetch(`/api/sales/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setSuccessMessage('Értékesítés sikeresen módosítva!');
        await loadData();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        throw new Error(result.error || 'Hiba az értékesítés módosítása során');
      }
    } catch (e: unknown) {
      console.error('Hiba az értékesítés módosításakor:', error);
      setError('Hiba az értékesítés módosítása során');
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleDeleteSale = async (id: string) => {
    if (!confirm('Biztosan törölni szeretné ezt az értékesítést?')) {
      return;
    }
    
    try {
      setError("");
      setSuccessMessage("");
      
      const response = await fetch(`/api/sales/${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setSuccessMessage('Értékesítés sikeresen törölve!');
        await loadData();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        throw new Error(result.error || 'Hiba az értékesítés törlése során');
      }
    } catch (e: unknown) {
      console.error('Hiba az értékesítés törlésekor:', error);
      setError('Hiba az értékesítés törlése során');
      setTimeout(() => setError(""), 3000);
    }
  };

  const resetNewPurchaseForm = () => {
    setNewPurchaseForm({
      purchaseDate: "",
      supplierName: "",
      invoiceNumber: "",
      productName: "",
      sku: "",
      quantity: "",
      unit: "db",
      netUnitPrice: "",
      netTotalPrice: "",
      vatRate: "27",
      grossTotalPrice: ""
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header - admintriednet stílusban */}
      <header className="w-full bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-center h-[90px]">
            {/* Bal oldal - Logo és cím */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-black uppercase tracking-tighter text-gray-900">ADMIN TRIDENT SHIELD</h1>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Group Kft Encodded</p>
              </div>
            </div>
            
            {/* Jobb oldal - Idő és kijelentkezés */}
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Aktuális idő</p>
                <p className="text-gray-900 font-mono text-lg font-bold">{currentTime?.toLocaleTimeString() || '--:--:--'}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="bg-gray-900 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-blue-500/30"
              >
                KIJELENTKEZÉS
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-8 pt-8">
        {/* Üzenetek */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 text-sm font-bold text-center rounded-lg">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-600 p-4 text-sm font-bold text-center rounded-lg">
            {successMessage}
          </div>
        )}
        
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
          {['dashboard', 'products', 'orders', 'purchases', 'sales', 'sheets'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-6 rounded-lg font-bold uppercase tracking-wider transition-all ${
                activeTab === tab
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'dashboard' ? 'Áttekintés' : tab === 'products' ? 'Termékek' : tab === 'orders' ? 'Rendelések' : tab === 'purchases' ? 'Beszerzés' : tab === 'sales' ? 'Értékesítés' : 'Sheets'}
            </button>
          ))}
        </div>
        <div className="mt-4">
          <div className="flex gap-2">
            <a href="/admintridentshieldgroupkftencodded/purchases" className="px-3 py-2 bg-gray-900 text-white rounded text-xs font-bold">Beszerzés oldal</a>
            <a href="/admintridentshieldgroupkftencodded/sales" className="px-3 py-2 bg-gray-900 text-white rounded text-xs font-bold">Értékesítés oldal</a>
            <a href="/admintridentshieldgroupkftencodded/inventory" className="px-3 py-2 bg-gray-900 text-white rounded text-xs font-bold">Készlet oldal</a>
            <a href="/adminloggedinuserslistforfacts" className="px-3 py-2 bg-blue-600 text-white rounded text-xs font-bold">Felhasználók</a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        {activeTab === 'dashboard' && (
          <div>
            {/* Üdvözlő szekció */}
            <div className="text-center mb-16">
              <div className="inline-block bg-yellow-400 text-black px-4 py-2 text-sm font-black uppercase tracking-widest mb-6">
                ÜDVÖZÖLJÜK!
              </div>
              <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-gray-900 mb-6">
                Admin Trident Shield
                <span className="block text-3xl md:text-4xl text-blue-600 mt-2">Group Kft Encodded</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                Sikeresen bejelentkezett az adminisztrációs felületre. 
                Itt kezelheti a termékeket és a rendeléseket.
              </p>
            </div>

            {/* Statisztikai kártyák */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter text-gray-900 mb-2">Összes Termék</h3>
                <p className="text-3xl font-mono text-blue-600 font-bold">{products.length}</p>
                <p className="text-gray-500 text-sm mt-1">Összes termék</p>
              </div>
              
              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter text-gray-900 mb-2">Aktív Termékek</h3>
                <p className="text-3xl font-mono text-green-600 font-bold">
                  {products.filter(product => product.isActive !== false).length}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  {products.length > 0 ? Math.round((products.filter(product => product.isActive !== false).length / products.length) * 100) : 0}% az összesből
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 text-center">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter text-gray-900 mb-2">Rendelések</h3>
                <p className="text-3xl font-mono text-yellow-600 font-bold">{orders.length}</p>
                <p className="text-gray-500 text-sm mt-1">Összes rendelés</p>
              </div>
            </div>

            {/* Idő információ */}
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter text-gray-900 mb-2">Aktuális Idő</h3>
                <p className="text-3xl font-mono text-blue-600 font-bold">{currentTime?.toLocaleTimeString() || '--:--:--'}</p>
                <p className="text-gray-500 text-sm mt-1">{currentTime?.toLocaleDateString('hu-HU', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  weekday: 'long'
                }) || '----. --. --.'}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sheets' && (
          <div className="relative group">
            <div className="space-y-8 pointer-events-none opacity-60">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-gray-900">CSV Import</h2>
                <p className="text-gray-500 text-sm mt-1">Beszerzés és Értékesítés importálása</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <p className="text-sm font-bold mb-2">Beszerzés CSV</p>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        const text = await f.text();
                        setImportInfo("");
                        const res = await fetch("/api/import/purchases", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ csv: text }),
                        });
                        const json = await res.json();
                        if (json.success) {
                          setImportInfo(`Beszerzés importálva: ${json.count} sor`);
                          await loadData();
                        } else {
                          setImportInfo(`Hiba: ${json.error || 'ismeretlen hiba'}`);
                        }
                      }}
                      className="w-full text-sm"
                    />
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <p className="text-sm font-bold mb-2">Értékesítés CSV (FIFO)</p>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        const text = await f.text();
                        setImportInfo("");
                        const res = await fetch("/api/import/sales", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ csv: text }),
                        });
                        const json = await res.json();
                        if (json.success) {
                          setImportInfo(`Értékesítés importálva: ${json.count} sor`);
                          await loadData();
                        } else {
                          setImportInfo(`Hiba: ${json.error || 'ismeretlen hiba'}`);
                        }
                      }}
                      className="w-full text-sm"
                    />
                  </div>
                </div>
                {importInfo && (
                  <div className="mt-4 text-sm text-blue-700">{importInfo}</div>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight text-gray-900">Készlet Összesítő (FIFO)</h2>
                    <p className="text-gray-500 text-sm mt-1">Aktuális raktárkészlet és értékelés</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        const res = await fetch("/api/inventory/summary");
                        const json = await res.json();
                        if (json.success) {
                          setInventory(json.data || []);
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-bold"
                    >
                      Frissítés
                    </button>
                    <button
                      onClick={async () => {
                        const resProducts = await fetch("/api/products");
                        const productsData = await resProducts.json();
                        const map: Record<string, ProductItem> = {};
                        for (const p of productsData) {
                          if (p.sku) map[p.sku] = p;
                        }
                        for (const row of inventory) {
                          const p = map[row.sku];
                          if (p) {
                            await fetch(`/api/products/${p._id}`, {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ stock: row.currentQty }),
                            });
                          }
                        }
                        await loadData();
                      }}
                      className="px-4 py-2 bg-gray-800 text-white rounded-md text-sm font-bold"
                    >
                      Készlet szinkronizálása
                    </button>
                  </div>
                </div>
                <div className="mt-6 bg-white rounded-xl border border-gray-200 overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Termék ID</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Terméknév</th>
                        <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Aktuális raktárkészlet</th>
                        <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">FIFO egységköltség</th>
                        <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Összérték</th>
                        <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Mennyiség</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {inventory.map((row, idx) => {
                        const product = products.find((p) => p.sku === row.sku);
                        return (
                          <tr key={`${row.sku}-${idx}`} className="hover:bg-blue-50">
                            <td className="px-4 py-2 font-mono text-sm text-gray-700">{row.sku}</td>
                            <td className="px-4 py-2 text-sm text-gray-700">{product?.name || "-"}</td>
                            <td className="px-4 py-2 text-right font-mono text-sm text-gray-700">{row.currentQty}</td>
                            <td className="px-4 py-2 text-right font-mono text-sm text-gray-700">{row.avgCost.toLocaleString('hu-HU')} Ft</td>
                            <td className="px-4 py-2 text-right font-mono text-sm text-gray-700">{row.valuation.toLocaleString('hu-HU')} Ft</td>
                            <td className="px-4 py-2 text-center text-sm text-gray-700">{row.unit}</td>
                          </tr>
                        );
                      })}
                      {inventory.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-xs uppercase tracking-widest">
                            Nincs adat. Kattintson a Frissítés gombra.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 rounded-xl bg-white/70 backdrop-blur-sm z-10 pointer-events-auto cursor-not-allowed"></div>
            <div className="absolute top-2 right-2 z-20 hidden group-hover:block">
              <span className="px-3 py-1 text-xs font-bold rounded bg-yellow-100 text-yellow-800 shadow">
                Fejlesztés alatt van, várható frissítés közeleg
              </span>
            </div>
          </div>
        )}
        {activeTab === 'products' && (
          <div>
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900">Termék Kezelés</h2>
                <p className="text-gray-500 text-sm mt-2">Itt kezelheti a webshop termékeit.</p>
              </div>
              <div className="flex items-center gap-4">
                {/* Nézet váltó gombok */}
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setProductView('cards')}
                    className={`px-4 py-2 rounded-md font-bold text-sm transition-all ${
                      productView === 'cards' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Kártyák
                  </button>
                  <button
                    onClick={() => setProductView('table')}
                    className={`px-4 py-2 rounded-md font-bold text-sm transition-all ${
                      productView === 'table' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Táblázat
                  </button>
                </div>
                <button 
                  onClick={() => setShowAddProduct(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-green-500/30 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  ÚJ TERMÉK
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Betöltés...</p>
              </div>
            ) : productView === 'cards' ? (
              // KÁRTYÁS NÉZET
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden">
                          {product.image && <img src={product.image} className="w-full h-full object-cover" alt="" />}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{product.name}</h3>
                          <p className="text-gray-500 text-sm">{product.price} Ft</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded font-bold ${
                              (product.isActive !== false) 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {(product.isActive !== false) ? 'AKTÍV' : 'INAKTÍV'}
                            </span>
                            <span className="text-xs text-gray-500">
                              Készlet: {product.stock || 0} db
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-500 uppercase tracking-wider font-bold">Státusz:</label>
                          <button
                            onClick={() => toggleProductStatus(product._id, product.isActive !== false)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              (product.isActive !== false) ? 'bg-green-600' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                (product.isActive !== false) ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => startEditProduct(product)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                          >
                            Szerkesztés
                          </button>
                          <button 
                            onClick={() => handleProductDelete(product._id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                          >
                            Törlés
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {products.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <p className="uppercase tracking-widest font-bold">Nincsenek termékek</p>
                  </div>
                )}
              </div>
            ) : (
              // TÁBLÁZATOS NÉZET - PROFESSZIONÁLIS EXCEL STÍLUS
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-300">
                      <tr>
                        <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">KÉP</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">TERMÉK NÉV</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">KATEGÓRIA</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">ÁR</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">KÉSZLET</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">STÁTUSZ</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">SKU</th>
                        <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">MŰVELETEK</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {products.map((product, index) => (
                        <tr key={product._id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-all duration-150`}>
                          <td className="px-4 py-4 border-r border-gray-100">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg border border-gray-300 overflow-hidden flex items-center justify-center">
                              {product.image ? (
                                <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                              ) : (
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 border-r border-gray-100">
                            <div className="font-semibold text-gray-900">{product.name}</div>
                          </td>
                          <td className="px-6 py-4 border-r border-gray-100">
                            <span className="text-gray-600 font-medium">{product.category}</span>
                          </td>
                          <td className="px-6 py-4 text-right font-mono font-semibold text-gray-900 border-r border-gray-100">
                            {product.price.toLocaleString('hu-HU')} Ft
                          </td>
                          <td className="px-6 py-4 border-r border-gray-100">
                            <div className="flex justify-center">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                                (product.stock || 0) > 10 
                                  ? 'bg-green-100 text-green-800' 
                                  : (product.stock || 0) > 0 
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                              }`}>
                                {product.stock || 0} db
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 border-r border-gray-100">
                            <div className="flex justify-center">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                                (product.isActive !== false) 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {(product.isActive !== false) ? 'AKTÍV' : 'INAKTÍV'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center font-mono text-sm text-gray-600 border-r border-gray-100">
                            {product.sku || '-'}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => toggleProductStatus(product._id, product.isActive !== false)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                                  (product.isActive !== false) ? 'bg-green-600' : 'bg-gray-300'
                                }`}
                                title="Státusz váltás"
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                                    (product.isActive !== false) ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                              <button 
                                onClick={() => startEditProduct(product)}
                                className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors duration-150"
                                title="Szerkesztés"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0L15 5.586V9a2 2 0 012 2v2a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2z" />
                                </svg>
                                Szerkesztés
                              </button>
                              <button 
                                onClick={() => handleProductDelete(product._id)}
                                className="inline-flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-md transition-colors duration-150"
                                title="Törlés"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Törlés
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {products.length === 0 && (
                        <tr>
                          <td colSpan={8} className="px-6 py-12 text-center">
                            <div className="text-gray-500">
                              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                              </svg>
                              <p className="text-lg font-medium">Nincsenek termékek</p>
                              <p className="text-sm mt-1">Adjon hozzá új termékeket a webshopban</p>
                            </div>
                          </td>
                        </tr>
                      )}
                      
                      {/* ÚJ TERMÉK SOR */}
                      {showNewProductRow && (
                        <tr className="bg-blue-50 border-t-2 border-blue-300">
                          <td className="px-4 py-4 border-r border-gray-100">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg border border-gray-300 overflow-hidden flex items-center justify-center">
                              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </div>
                          </td>
                          <td className="px-6 py-4 border-r border-gray-100">
                            <input
                              type="text"
                              placeholder="Termék neve"
                              value={newProductForm.name}
                              onChange={e => setNewProductForm({...newProductForm, name: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </td>
                          <td className="px-6 py-4 border-r border-gray-100">
                            <input
                              type="text"
                              placeholder="Kategória"
                              value={newProductForm.category}
                              onChange={e => setNewProductForm({...newProductForm, category: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </td>
                          <td className="px-6 py-4 text-right border-r border-gray-100">
                            <input
                              type="number"
                              placeholder="Ár"
                              value={newProductForm.price}
                              onChange={e => setNewProductForm({...newProductForm, price: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </td>
                          <td className="px-6 py-4 border-r border-gray-100">
                            <input
                              type="number"
                              placeholder="Készlet"
                              value={newProductForm.stock}
                              onChange={e => setNewProductForm({...newProductForm, stock: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </td>
                          <td className="px-6 py-4 border-r border-gray-100">
                            <div className="flex justify-center">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                                ÚJ TERMÉK
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center border-r border-gray-100">
                            <input
                              type="text"
                              placeholder="SKU"
                              value={newProductForm.sku}
                              onChange={e => setNewProductForm({...newProductForm, sku: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={handleAddProductFromRow}
                                className="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md transition-colors duration-150"
                                title="Mentés"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Mentés
                              </button>
                              <button 
                                onClick={cancelNewProductRow}
                                className="inline-flex items-center px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium rounded-md transition-colors duration-150"
                                title="Mégse"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Mégse
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                      
                      {/* PLUSZ SOR */}
                      {!showNewProductRow && (
                        <tr className="hover:bg-gray-50">
                          <td colSpan={8} className="px-6 py-4 text-center">
                            <button 
                              onClick={() => setShowNewProductRow(true)}
                              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-150 border border-blue-300"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                              Új termék hozzáadása
                            </button>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900">Rendelések Kezelése</h2>
              <p className="text-gray-500 text-sm mt-2">Itt láthatja a webshopban leadott összes rendelést.</p>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Betöltés...</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="text-[10px] uppercase font-black tracking-widest text-gray-400 bg-gray-50/50 border-b border-gray-100">
                    <tr>
                      <th className="py-5 pl-8">Tranzakció ID</th>
                      <th className="py-5">Vevő Neve</th>
                      <th className="py-5">Termék</th>
                      <th className="py-5 text-center">Mennyiség</th>
                      <th className="py-5 text-right pr-8">Végösszeg</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-bold text-gray-700 divide-y divide-gray-50">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="py-5 pl-8 font-mono text-blue-600 text-xs group-hover:underline cursor-pointer">
                          {order.transactionId}
                        </td>
                        <td className="py-5">{order.customerName}</td>
                        <td className="py-5 text-gray-500">{order.productName}</td>
                        <td className="text-center py-5">
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">{order.quantity} db</span>
                        </td>
                        <td className="text-right pr-8 font-mono">{order.totalPrice.toLocaleString()} Ft</td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr><td colSpan={5} className="py-12 text-center text-gray-400 text-xs uppercase tracking-widest">Nincs aktív rendelés</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'purchases' && (
          <div className="fixed inset-0 bg-white z-40 flex flex-col">
            {/* Fejléc */}
            <div className="bg-white border-b border-gray-300 px-4 py-2 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Beszerzés Kezelése</h2>
                <p className="text-gray-500 text-xs">Itt adhatja hozzá a beszerzési adatokat.</p>
              </div>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded font-medium text-xs transition-colors"
              >
                Bezárás
              </button>
            </div>

            {/* Táblázat konténer - Teljes magasság */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-auto">
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 bg-gray-100 border-b-2 border-gray-300 z-10">
                    <tr>
                      <th className="px-2 py-1 text-left text-[10px] font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300 border-b border-gray-400 min-w-[100px]">BESZERZÉS DÁTUMA</th>
                      <th className="px-2 py-1 text-left text-[10px] font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300 border-b border-gray-400 min-w-[120px]">BESZÁLLÍTÓ NEVE</th>
                      <th className="px-2 py-1 text-left text-[10px] font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300 border-b border-gray-400 min-w-[100px]">SZÁMLA SORSZÁMA</th>
                      <th className="px-2 py-1 text-left text-[10px] font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300 border-b border-gray-400 min-w-[150px]">TERMÉKNÉV</th>
                      <th className="px-2 py-1 text-left text-[10px] font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300 border-b border-gray-400 min-w-[80px]">CIKKSZÁM</th>
                      <th className="px-2 py-1 text-center text-[10px] font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300 border-b border-gray-400 min-w-[80px]">MENNYISÉG</th>
                      <th className="px-2 py-1 text-left text-[10px] font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300 border-b border-gray-400 min-w-[80px]">MÉRTÉKEGYSÉG</th>
                      <th className="px-2 py-1 text-right text-[10px] font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300 border-b border-gray-400 min-w-[120px]">NETTÓ BESZERZÉSI ÁR</th>
                      <th className="px-2 py-1 text-right text-[10px] font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300 border-b border-gray-400 min-w-[120px]">NETTÓ ÖSSZÉRTÉK</th>
                      <th className="px-2 py-1 text-center text-[10px] font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300 border-b border-gray-400 min-w-[60px]">ÁFA (%)</th>
                      <th className="px-2 py-1 text-right text-[10px] font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300 border-b border-gray-400 min-w-[120px]">BRUTTÓ BESZERZÉSI ÁR</th>
                      <th className="px-2 py-1 text-center text-[10px] font-bold text-gray-700 uppercase tracking-wider border-b border-gray-400 min-w-[80px]">MŰVELETEK</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {/* Új beszerzés sor */}
                    <tr className="bg-blue-50 hover:bg-blue-100 border-b border-gray-200">
                      <td className="px-2 py-1 border-r border-gray-200">
                        <input
                          type="date"
                          value={newPurchaseForm.purchaseDate}
                          onChange={(e) => setNewPurchaseForm({...newPurchaseForm, purchaseDate: e.target.value})}
                          className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-gray-50"
                        />
                      </td>
                      <td className="px-2 py-1 border-r border-gray-200">
                        <input
                          type="text"
                          placeholder="Beszállító neve"
                          value={newPurchaseForm.supplierName}
                          onChange={(e) => setNewPurchaseForm({...newPurchaseForm, supplierName: e.target.value})}
                          className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-gray-50"
                        />
                      </td>
                      <td className="px-2 py-1 border-r border-gray-200">
                        <input
                          type="text"
                          placeholder="SZ-2024-001"
                          value={newPurchaseForm.invoiceNumber}
                          onChange={(e) => setNewPurchaseForm({...newPurchaseForm, invoiceNumber: e.target.value})}
                          className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-gray-50"
                        />
                      </td>
                      <td className="px-2 py-1 border-r border-gray-200">
                        <input
                          type="text"
                          placeholder="Termék neve"
                          value={newPurchaseForm.productName}
                          onChange={(e) => setNewPurchaseForm({...newPurchaseForm, productName: e.target.value})}
                          className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-gray-50"
                        />
                      </td>
                      <td className="px-2 py-1 border-r border-gray-200">
                        <input
                          type="text"
                          placeholder="Cikkszám"
                          value={newPurchaseForm.sku}
                          onChange={(e) => setNewPurchaseForm({...newPurchaseForm, sku: e.target.value})}
                          className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-gray-50"
                        />
                      </td>
                      <td className="px-2 py-1 border-r border-gray-200">
                        <input
                          type="number"
                          placeholder="0"
                          value={newPurchaseForm.quantity}
                          onChange={(e) => setNewPurchaseForm({...newPurchaseForm, quantity: e.target.value})}
                          className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-gray-50"
                        />
                      </td>
                      <td className="px-2 py-1 border-r border-gray-200">
                        <input
                          type="text"
                          placeholder="db"
                          value={newPurchaseForm.unit}
                          onChange={(e) => setNewPurchaseForm({...newPurchaseForm, unit: e.target.value})}
                          className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-gray-50"
                        />
                      </td>
                      <td className="px-2 py-1 text-right border-r border-gray-200">
                        <input
                          type="number"
                          placeholder="0"
                          value={newPurchaseForm.netUnitPrice}
                          onChange={(e) => setNewPurchaseForm({...newPurchaseForm, netUnitPrice: e.target.value})}
                          className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs font-mono text-right focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-gray-50"
                        />
                      </td>
                      <td className="px-2 py-1 text-right border-r border-gray-200">
                        <input
                          type="number"
                          placeholder="0"
                          value={newPurchaseForm.netTotalPrice}
                          onChange={(e) => setNewPurchaseForm({...newPurchaseForm, netTotalPrice: e.target.value})}
                          className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs font-mono text-right focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-gray-50"
                        />
                      </td>
                      <td className="px-2 py-1 border-r border-gray-200">
                        <input
                          type="number"
                          placeholder="27"
                          value={newPurchaseForm.vatRate}
                          onChange={(e) => setNewPurchaseForm({...newPurchaseForm, vatRate: e.target.value})}
                          max="27"
                          className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-gray-50"
                        />
                      </td>
                      <td className="px-2 py-1 text-right border-r border-gray-200">
                        <input
                          type="number"
                          placeholder="0"
                          value={newPurchaseForm.grossTotalPrice}
                          onChange={(e) => setNewPurchaseForm({...newPurchaseForm, grossTotalPrice: e.target.value})}
                          className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs font-mono text-right focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-gray-50"
                        />
                      </td>
                      <td className="px-2 py-1">
                        <div className="flex items-center justify-center gap-1">
                          <button 
                            onClick={handleAddPurchase}
                            className="p-0.5 bg-green-600 hover:bg-green-700 text-white rounded transition-colors duration-150"
                            title="Hozzáadás"
                          >
                            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Létező beszerzések */}
                    {purchases.map((purchase) => (
                      <tr key={purchase._id} className="bg-white hover:bg-blue-50 border-b border-gray-200">
                        <td className="px-2 py-1 border-r border-gray-200">
                          <input
                            type="date"
                            value={new Date(purchase.purchaseDate).toISOString().split('T')[0]}
                            onChange={(e) => handleUpdatePurchase(purchase._id, {...purchase, purchaseDate: e.target.value})}
                            className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-transparent hover:bg-gray-50"
                          />
                        </td>
                        <td className="px-2 py-1 border-r border-gray-200">
                          <input
                            type="text"
                            value={purchase.supplierName}
                            onChange={(e) => handleUpdatePurchase(purchase._id, {...purchase, supplierName: e.target.value})}
                            className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-transparent hover:bg-gray-50"
                          />
                        </td>
                        <td className="px-2 py-1 border-r border-gray-200">
                          <input
                            type="text"
                            value={purchase.invoiceNumber}
                            onChange={(e) => handleUpdatePurchase(purchase._id, {...purchase, invoiceNumber: e.target.value})}
                            className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-transparent hover:bg-gray-50"
                          />
                        </td>
                        <td className="px-2 py-1 border-r border-gray-200">
                          <input
                            type="text"
                            value={purchase.productName}
                            onChange={(e) => handleUpdatePurchase(purchase._id, {...purchase, productName: e.target.value})}
                            className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-transparent hover:bg-gray-50"
                          />
                        </td>
                        <td className="px-2 py-1 border-r border-gray-200">
                          <input
                            type="text"
                            value={purchase.sku || ''}
                            onChange={(e) => handleUpdatePurchase(purchase._id, {...purchase, sku: e.target.value})}
                            className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-transparent hover:bg-gray-50"
                          />
                        </td>
                        <td className="px-2 py-1 border-r border-gray-200">
                          <input
                            type="number"
                            value={purchase.quantity}
                            onChange={(e) => handleUpdatePurchase(purchase._id, {...purchase, quantity: parseFloat(e.target.value)})}
                            className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-transparent hover:bg-gray-50"
                          />
                        </td>
                        <td className="px-2 py-1 border-r border-gray-200">
                          <input
                            type="text"
                            value={purchase.unit}
                            onChange={(e) => handleUpdatePurchase(purchase._id, {...purchase, unit: e.target.value})}
                            className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-transparent hover:bg-gray-50"
                          />
                        </td>
                        <td className="px-2 py-1 text-right border-r border-gray-200">
                          <input
                            type="number"
                            value={purchase.netUnitPrice}
                            onChange={(e) => handleUpdatePurchase(purchase._id, {...purchase, netUnitPrice: parseFloat(e.target.value)})}
                            className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs font-mono text-right focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-transparent hover:bg-gray-50"
                          />
                        </td>
                        <td className="px-2 py-1 text-right border-r border-gray-200">
                          <input
                            type="number"
                            value={purchase.netTotalPrice}
                            onChange={(e) => handleUpdatePurchase(purchase._id, {...purchase, netTotalPrice: parseFloat(e.target.value)})}
                            className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs font-mono text-right focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-transparent hover:bg-gray-50"
                          />
                        </td>
                        <td className="px-2 py-1 border-r border-gray-200">
                          <input
                            type="number"
                            value={purchase.vatRate}
                            onChange={(e) => handleUpdatePurchase(purchase._id, {...purchase, vatRate: parseFloat(e.target.value)})}
                            max="27"
                            className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-transparent hover:bg-gray-50"
                          />
                        </td>
                        <td className="px-2 py-1 text-right border-r border-gray-200">
                          <input
                            type="number"
                            value={purchase.grossTotalPrice}
                            onChange={(e) => handleUpdatePurchase(purchase._id, {...purchase, grossTotalPrice: parseFloat(e.target.value)})}
                            className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs font-mono text-right focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-transparent hover:bg-gray-50"
                          />
                        </td>
                        <td className="px-2 py-1">
                          <div className="flex items-center justify-center gap-1">
                            <button 
                              className="p-0.5 bg-red-600 hover:bg-red-700 text-white rounded transition-colors duration-150"
                              onClick={() => handleDeletePurchase(purchase._id)}
                              title="Törlés"
                            >
                              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="fixed inset-0 bg-white z-40 flex flex-col">
            {/* Fejléc */}
            <div className="bg-white border-b border-gray-300 px-4 py-2 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Értékesítés Kezelése</h2>
                <p className="text-gray-500 text-xs">Itt adhatja hozzá az értékesítési adatokat.</p>
              </div>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded font-medium text-xs transition-colors"
              >
                Bezárás
              </button>
            </div>

            {/* Táblázat konténer - Teljes magasság */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-auto">
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 bg-gray-100 border-b-2 border-gray-300 z-10">
                    <tr>
                      <th className="px-2 py-1 text-left text-xs font-bold text-gray-700 border-r border-gray-200">Tranzakció Id</th>
                      <th className="px-2 py-1 text-left text-xs font-bold text-gray-700 border-r border-gray-200">Termék Id</th>
                      <th className="px-2 py-1 text-left text-xs font-bold text-gray-700 border-r border-gray-200">Értékesítés Dátum</th>
                      <th className="px-2 py-1 text-left text-xs font-bold text-gray-700 border-r border-gray-200">Terméknév</th>
                      <th className="px-2 py-1 text-left text-xs font-bold text-gray-700 border-r border-gray-200">Vásárló neve</th>
                      <th className="px-2 py-1 text-left text-xs font-bold text-gray-700 border-r border-gray-200">Mennyiség</th>
                      <th className="px-2 py-1 text-right text-xs font-bold text-gray-700 border-r border-gray-200">Kalk. beszerzési egységár</th>
                      <th className="px-2 py-1 text-right text-xs font-bold text-gray-700 border-r border-gray-200">Teljes beszerzési érték</th>
                      <th className="px-2 py-1 text-right text-xs font-bold text-gray-700 border-r border-gray-200">Nettó Eladási ár / db</th>
                      <th className="px-2 py-1 text-right text-xs font-bold text-gray-700 border-r border-gray-200">Profit</th>
                      <th className="px-2 py-1 text-center text-xs font-bold text-gray-700 border-r border-gray-200">ÁFA Kulcs</th>
                      <th className="px-2 py-1 text-right text-xs font-bold text-gray-700 border-r border-gray-200">Bruttó eladási ár</th>
                      <th className="px-2 py-1 text-center text-xs font-bold text-gray-700 border-r border-gray-200">Cégadatok</th>
                      <th className="px-2 py-1 text-center text-xs font-bold text-gray-700">Műveletek</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* ÚJ ÉRTÉKESÍTÉS SOR */}
                    {showNewSaleRow && (
                      <tr className="bg-blue-50 border-t-2 border-blue-300">
                        <td className="px-2 py-1 border-r border-gray-200">
                          <input
                            type="text"
                            placeholder="Tranzakció ID"
                            value={newSaleForm.transactionId}
                            onChange={(e) => setNewSaleForm({...newSaleForm, transactionId: e.target.value})}
                            className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white"
                          />
                        </td>
                        <td className="px-2 py-1 border-r border-gray-200">
                          <input
                            type="text"
                            placeholder="Termék ID"
                            value={newSaleForm.productId}
                            onChange={(e) => setNewSaleForm({...newSaleForm, productId: e.target.value})}
                            className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white"
                          />
                        </td>
                        <td className="px-2 py-1 border-r border-gray-200">
                          <input
                            type="date"
                            value={newSaleForm.saleDate}
                            onChange={(e) => setNewSaleForm({...newSaleForm, saleDate: e.target.value})}
                            className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white"
                          />
                        </td>
                        <td className="px-2 py-1 border-r border-gray-200">
                          <input
                            type="text"
                            placeholder="Terméknév"
                            value={newSaleForm.productName}
                            onChange={(e) => setNewSaleForm({...newSaleForm, productName: e.target.value})}
                            className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white"
                          />
                        </td>
                        <td className="px-2 py-1 border-r border-gray-200">
                          <input
                            type="text"
                            placeholder="Vásárló neve"
                            value={newSaleForm.customerName}
                            onChange={(e) => setNewSaleForm({...newSaleForm, customerName: e.target.value})}
                            className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white"
                          />
                        </td>
                        <td className="px-2 py-1 border-r border-gray-200">
                          <input
                            type="number"
                            placeholder="Mennyiség"
                            value={newSaleForm.quantity}
                            onChange={(e) => setNewSaleForm({...newSaleForm, quantity: e.target.value})}
                            className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white"
                          />
                        </td>
                        <td className="px-2 py-1 text-right border-r border-gray-200">
                          <input
                            type="number"
                            placeholder="Besz. egységár"
                            value={newSaleForm.calculatedPurchaseUnitPrice}
                            onChange={(e) => setNewSaleForm({...newSaleForm, calculatedPurchaseUnitPrice: e.target.value})}
                            className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs font-mono text-right focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white"
                          />
                        </td>
                        <td className="px-2 py-1 text-right border-r border-gray-200">
                          <input
                            type="number"
                            placeholder="Besz. érték"
                            value={newSaleForm.totalPurchaseValue}
                            onChange={(e) => setNewSaleForm({...newSaleForm, totalPurchaseValue: e.target.value})}
                            className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs font-mono text-right focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white"
                          />
                        </td>
                        <td className="px-2 py-1 text-right border-r border-gray-200">
                          <input
                            type="number"
                            placeholder="Nettó ár/db"
                            value={newSaleForm.netUnitPrice}
                            onChange={(e) => setNewSaleForm({...newSaleForm, netUnitPrice: e.target.value})}
                            className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs font-mono text-right focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white"
                          />
                        </td>
                        <td className="px-2 py-1 text-right border-r border-gray-200">
                          <input
                            type="number"
                            placeholder="Profit"
                            value={newSaleForm.profit}
                            onChange={(e) => setNewSaleForm({...newSaleForm, profit: e.target.value})}
                            className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs font-mono text-right focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white"
                          />
                        </td>
                        <td className="px-2 py-1 border-r border-gray-200">
                          <input
                            type="number"
                            value={newSaleForm.vatRate}
                            onChange={(e) => setNewSaleForm({...newSaleForm, vatRate: e.target.value})}
                            max="27"
                            className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white"
                          />
                        </td>
                        <td className="px-2 py-1 text-right border-r border-gray-200">
                          <input
                            type="number"
                            placeholder="Bruttó ár"
                            value={newSaleForm.grossUnitPrice}
                            onChange={(e) => setNewSaleForm({...newSaleForm, grossUnitPrice: e.target.value})}
                            className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs font-mono text-right focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white"
                          />
                        </td>
                        <td className="px-2 py-1 border-r border-gray-200">
                          <button
                            onClick={() => setShowNewSaleCompanyDetails(!showNewSaleCompanyDetails)}
                            className="w-full px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs font-medium transition-colors duration-150 flex items-center justify-center gap-1"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            Cégadatok
                          </button>
                        </td>
                        <td className="px-2 py-1">
                          <div className="flex items-center justify-center gap-1">
                            <button 
                              className="p-0.5 bg-green-600 hover:bg-green-700 text-white rounded transition-colors duration-150"
                              onClick={handleAddSale}
                              title="Hozzáadás"
                            >
                              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                      {showNewSaleCompanyDetails && (
                        <tr className="bg-blue-50 border-b border-blue-200">
                          <td colSpan={13} className="px-4 py-3">
                            <div className="bg-white rounded-lg p-4 border border-blue-200">
                              <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                Cégadatok
                              </h4>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-600">Cégnév</label>
                                  <input
                                    type="text"
                                    placeholder="Cégnév"
                                    value={newSaleForm.companyName}
                                    onChange={(e) => setNewSaleForm({...newSaleForm, companyName: e.target.value})}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-600">Adószám</label>
                                  <input
                                    type="text"
                                    placeholder="Adószám"
                                    value={newSaleForm.taxNumber}
                                    onChange={(e) => setNewSaleForm({...newSaleForm, taxNumber: e.target.value})}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-600">Cím</label>
                                  <input
                                    type="text"
                                    placeholder="Cím"
                                    value={newSaleForm.address}
                                    onChange={(e) => setNewSaleForm({...newSaleForm, address: e.target.value})}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-600">Kapcsolattartó</label>
                                  <input
                                    type="text"
                                    placeholder="Kapcsolattartó neve"
                                    value={newSaleForm.contactPerson}
                                    onChange={(e) => setNewSaleForm({...newSaleForm, contactPerson: e.target.value})}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-600">Telefonszám</label>
                                  <input
                                    type="text"
                                    placeholder="Telefonszám"
                                    value={newSaleForm.phoneNumber}
                                    onChange={(e) => setNewSaleForm({...newSaleForm, phoneNumber: e.target.value})}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-600">Szállítási cím</label>
                                  <input
                                    type="text"
                                    placeholder="Szállítási cím"
                                    value={newSaleForm.shippingAddress}
                                    onChange={(e) => setNewSaleForm({...newSaleForm, shippingAddress: e.target.value})}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white"
                                  />
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}

                    {/* LÉTEZŐ ÉRTÉKESÍTÉSEK */}
                    {sales.map((sale) => (
                      <React.Fragment key={sale._id}>
                        <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-2 py-1 border-r border-gray-200">
                          <input
                            type="text"
                            value={sale.transactionId}
                            onChange={(e) => handleUpdateSale(sale._id, {...sale, transactionId: e.target.value})}
                            className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-transparent hover:bg-gray-50"
                          />
                        </td>
                        <td className="px-2 py-1 border-r border-gray-200">
                          <input
                            type="text"
                            value={sale.productId}
                            onChange={(e) => handleUpdateSale(sale._id, {...sale, productId: e.target.value})}
                            className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-transparent hover:bg-gray-50"
                          />
                        </td>
                        <td className="px-2 py-1 border-r border-gray-200">
                          <input
                            type="date"
                            value={new Date(sale.saleDate).toISOString().split('T')[0]}
                            onChange={(e) => handleUpdateSale(sale._id, {...sale, saleDate: e.target.value})}
                            className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-transparent hover:bg-gray-50"
                          />
                        </td>
                        <td className="px-2 py-1 border-r border-gray-200">
                          <input
                            type="text"
                            value={sale.productName}
                            onChange={(e) => handleUpdateSale(sale._id, {...sale, productName: e.target.value})}
                            className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-transparent hover:bg-gray-50"
                          />
                        </td>
                        <td className="px-2 py-1 border-r border-gray-200">
                          <input
                            type="text"
                            value={sale.customerName}
                            onChange={(e) => handleUpdateSale(sale._id, {...sale, customerName: e.target.value})}
                            className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-transparent hover:bg-gray-50"
                          />
                        </td>
                        <td className="px-2 py-1 border-r border-gray-200">
                          <input
                            type="number"
                            value={sale.quantity}
                            onChange={(e) => handleUpdateSale(sale._id, {...sale, quantity: parseFloat(e.target.value)})}
                            className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-transparent hover:bg-gray-50"
                          />
                        </td>
                        <td className="px-2 py-1 text-right border-r border-gray-200">
                          <input
                            type="number"
                            value={sale.calculatedPurchaseUnitPrice}
                            onChange={(e) => handleUpdateSale(sale._id, {...sale, calculatedPurchaseUnitPrice: parseFloat(e.target.value)})}
                            className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs font-mono text-right focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-transparent hover:bg-gray-50"
                          />
                        </td>
                        <td className="px-2 py-1 text-right border-r border-gray-200">
                          <input
                            type="number"
                            value={sale.totalPurchaseValue}
                            onChange={(e) => handleUpdateSale(sale._id, {...sale, totalPurchaseValue: parseFloat(e.target.value)})}
                            className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs font-mono text-right focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-transparent hover:bg-gray-50"
                          />
                        </td>
                        <td className="px-2 py-1 text-right border-r border-gray-200">
                          <input
                            type="number"
                            value={sale.netUnitPrice}
                            onChange={(e) => handleUpdateSale(sale._id, {...sale, netUnitPrice: parseFloat(e.target.value)})}
                            className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs font-mono text-right focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-transparent hover:bg-gray-50"
                          />
                        </td>
                        <td className="px-2 py-1 text-right border-r border-gray-200">
                          <input
                            type="number"
                            value={sale.profit}
                            onChange={(e) => handleUpdateSale(sale._id, {...sale, profit: parseFloat(e.target.value)})}
                            className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs font-mono text-right focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-transparent hover:bg-gray-50"
                          />
                        </td>
                        <td className="px-2 py-1 border-r border-gray-200">
                          <input
                            type="number"
                            value={sale.vatRate}
                            onChange={(e) => handleUpdateSale(sale._id, {...sale, vatRate: parseFloat(e.target.value)})}
                            max="27"
                            className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-transparent hover:bg-gray-50"
                          />
                        </td>
                        <td className="px-2 py-1 text-right border-r border-gray-200">
                          <input
                            type="number"
                            value={sale.grossUnitPrice}
                            onChange={(e) => handleUpdateSale(sale._id, {...sale, grossUnitPrice: parseFloat(e.target.value)})}
                            className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs font-mono text-right focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-transparent hover:bg-gray-50"
                          />
                        </td>
                        <td className="px-2 py-1 border-r border-gray-200">
                          <button
                            onClick={() => {
                              const newExpanded = new Set(expandedSaleCompanyDetails);
                              if (newExpanded.has(sale._id)) {
                                newExpanded.delete(sale._id);
                              } else {
                                newExpanded.add(sale._id);
                              }
                              setExpandedSaleCompanyDetails(newExpanded);
                            }}
                            className="w-full px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-medium transition-colors duration-150 flex items-center justify-center gap-1"
                          >
                            <svg className={`w-3 h-3 transition-transform duration-150 ${expandedSaleCompanyDetails.has(sale._id) ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            Cégadatok
                          </button>
                        </td>
                        <td className="px-2 py-1">
                          <div className="flex items-center justify-center gap-1">
                            <button 
                              className="p-0.5 bg-red-600 hover:bg-red-700 text-white rounded transition-colors duration-150"
                              onClick={() => handleDeleteSale(sale._id)}
                              title="Törlés"
                            >
                              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedSaleCompanyDetails.has(sale._id) && (
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <td colSpan={13} className="px-4 py-3">
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                              <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                Cégadatok - {sale.customerName}
                              </h4>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-600">Cégnév</label>
                                  <input
                                    type="text"
                                    value={sale.companyName || ''}
                                    onChange={(e) => handleUpdateSale(sale._id, {...sale, companyName: e.target.value})}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-600">Adószám</label>
                                  <input
                                    type="text"
                                    value={sale.taxNumber || ''}
                                    onChange={(e) => handleUpdateSale(sale._id, {...sale, taxNumber: e.target.value})}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-600">Cím</label>
                                  <input
                                    type="text"
                                    value={sale.address || ''}
                                    onChange={(e) => handleUpdateSale(sale._id, {...sale, address: e.target.value})}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-600">Kapcsolattartó</label>
                                  <input
                                    type="text"
                                    value={sale.contactPerson || ''}
                                    onChange={(e) => handleUpdateSale(sale._id, {...sale, contactPerson: e.target.value})}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-600">Telefonszám</label>
                                  <input
                                    type="text"
                                    value={sale.phoneNumber || ''}
                                    onChange={(e) => handleUpdateSale(sale._id, {...sale, phoneNumber: e.target.value})}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-600">Szállítási cím</label>
                                  <input
                                    type="text"
                                    value={sale.shippingAddress || ''}
                                    onChange={(e) => handleUpdateSale(sale._id, {...sale, shippingAddress: e.target.value})}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white"
                                  />
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <div className="text-center mt-12 pb-8">
        <p className="text-gray-400 text-sm font-medium">
          Admin Trident Shield Group Kft Encodded V1.0 • Biztonsági hozzáférés • 
          <span className="text-blue-600 font-bold">Industrial Safety Systems</span>
        </p>
      </div>

      {/* Szerkesztő Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-2xl border border-gray-100 relative">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 text-gray-900">Termék Szerkesztése</h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-600">Termék neve</label>
                <input 
                  type="text" 
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-600 focus:bg-white transition-all" 
                  value={editForm.name}
                  onChange={e => setEditForm({...editForm, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-600">Ár (Ft)</label>
                <input 
                  type="number" 
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-600 focus:bg-white transition-all" 
                  value={editForm.price}
                  onChange={e => setEditForm({...editForm, price: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-600">Készlet (db)</label>
                <input 
                  type="number" 
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-600 focus:bg-white transition-all" 
                  value={editForm.stock}
                  onChange={e => setEditForm({...editForm, stock: e.target.value})}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button 
                onClick={saveEdit}
                className="flex-1 bg-blue-700 hover:bg-blue-600 text-white py-4 rounded-xl font-black uppercase tracking-wider transition-all shadow-lg hover:shadow-blue-500/30"
              >
                MENTÉS
              </button>
              <button 
                onClick={cancelEdit}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-4 rounded-xl font-black uppercase tracking-wider transition-all"
              >
                MÉGSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Új Termék Hozzáadása Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 text-gray-900">Új Termék Hozzáadása</h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-600">Termék neve *</label>
                <input 
                  type="text" 
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-600 focus:bg-white transition-all" 
                  placeholder="Pl: Fali Tartó Konzol"
                  value={addForm.name}
                  onChange={e => setAddForm({...addForm, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-600">Kategória *</label>
                <input 
                  type="text" 
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-600 focus:bg-white transition-all" 
                  placeholder="Pl: Tartókonzol"
                  value={addForm.category}
                  onChange={e => setAddForm({...addForm, category: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-600">Ár (Ft) *</label>
                <input 
                  type="number" 
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-600 focus:bg-white transition-all" 
                  placeholder="Pl: 15000"
                  value={addForm.price}
                  onChange={e => setAddForm({...addForm, price: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-600">Készlet (db) *</label>
                <input 
                  type="number" 
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-600 focus:bg-white transition-all" 
                  placeholder="Pl: 25"
                  value={addForm.stock}
                  onChange={e => setAddForm({...addForm, stock: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-600">Cikkszám (SKU)</label>
                <input 
                  type="text" 
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-600 focus:bg-white transition-all" 
                  placeholder="Pl: FTK-001"
                  value={addForm.sku}
                  onChange={e => setAddForm({...addForm, sku: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-600">Kép URL</label>
                <input 
                  type="url" 
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-600 focus:bg-white transition-all" 
                  placeholder="https://kep-url.hu/termek.jpg"
                  value={addForm.image}
                  onChange={e => setAddForm({...addForm, image: e.target.value})}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button 
                onClick={handleAddProduct}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-black uppercase tracking-wider transition-all shadow-lg hover:shadow-green-500/30"
              >
                HOZZÁADÁS
              </button>
              <button 
                onClick={cancelAddProduct}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-4 rounded-xl font-black uppercase tracking-wider transition-all"
              >
                MÉGSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
