import { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as bootstrap from "bootstrap";
import validate from "validate.js";
import { useForm } from "react-hook-form";

import "../src/assets/style.css";

import Pagination from "./component/Pagination";
import ProductDetailModal from "./component/ProductDetailModal";
import ProductList from "./component/ProductList";
import Cart from "./component/Cart";
import PlaceOrderForm from "./component/PlaceOrderForm";

const API_BASE = import.meta.env.VITE_API_BASE; // API 基本路徑
const API_PATH = import.meta.env.VITE_API_PATH; // API 路徑

function App() {
  // 狀態管理
  const [loadingCartId, setLoadingCartId] = useState(null); // 加入購物車時的加載狀態
  const [loadingProductId, setLoadingProductId] = useState(null); // 產品加載狀態
  const [products, setProducts] = useState([]); // 產品清單
  const [product, setProduct] = useState({}); // 單一產品的詳細資訊
  const [pagination, setPagination] = useState({}); // 分頁資料
  const [cart, setCart] = useState([]); // 購物車資料
  const [cartQuantity, setCartQuantity] = useState(1); // 購物車數量

  // 參考元件，用於操作 Modal 和 Offcanvas
  const productModalRef = useRef(null);
  const cartOffcanvasRef = useRef(null);

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  /**
   * 取得產品列表
   * @param {number} page - 當前分頁數
   */
  const getProducts = async (page = 1) => {
    try {
      const url = `${API_BASE}/api/${API_PATH}/products?page=${page}`;
      const response = await axios.get(url);
      setProducts(response.data.products); // 設置產品清單
      setPagination(response.data.pagination); // 設置分頁資料
    } catch (error) {
      console.error(error.response.data);
    }
  };

  /**
   * 取得單一產品的詳細資訊
   * @param {string|number} id - 產品 ID
   */
  const getProduct = async (id) => {
    setLoadingProductId(id); // 設置當前產品的加載狀態
    try {
      const url = `${API_BASE}/api/${API_PATH}/product/${id}`;
      const response = await axios.get(url);
      setProduct(response.data.product); // 設置單一產品資訊
    } catch (error) {
      console.error(error.response.data);
    } finally {
      setLoadingProductId(null); // 清除加載狀態
    }
  };

  /**
   * 取得購物車內容
   */
  const getCart = async () => {
    try {
      const url = `${API_BASE}/api/${API_PATH}/cart`;
      const response = await axios.get(url);
      setCart(response.data.data); // 設置購物車內容
    } catch (error) {
      console.error(error.response.data);
    }
  };

  /**
   * 新增產品至購物車
   * @param {string|number} id - 產品 ID
   * @param {number} num - 購買數量
   */
  const addCart = async (id, num) => {
    setLoadingCartId(id); // 設置購物車加載狀態
    const data = {
      product_id: id,
      qty: num,
    };
    try {
      const url = `${API_BASE}/api/${API_PATH}/cart`;
      await axios.post(url, { data });
      getCart(); // 更新購物車內容
    } catch (error) {
      console.error(error.response.data);
    } finally {
      setLoadingCartId(null); // 清除加載狀態
      productModalRef.current.hide(); // 隱藏產品詳細資訊 Modal
    }
  };

  /**
   * 刪除購物車中的某一商品
   * @param {string|number} id - 商品 ID
   */
  const deleteCart = async (id) => {
    try {
      const url = `${API_BASE}/api/${API_PATH}/cart/${id}`;
      await axios.delete(url);
      getCart(); // 更新購物車內容
    } catch (error) {
      console.error(error.response.data);
    }
  };

  /**
   * 清空購物車
   */
  const deleteCartAll = async () => {
    try {
      const url = `${API_BASE}/api/${API_PATH}/carts`;
      await axios.delete(url);
      getCart(); // 更新購物車內容
    } catch (error) {
      console.error(error.response.data);
    }
  };

  /**
   * 更新購物車中商品數量
   * @param {string|number} id - 商品 ID
   * @param {number} qty - 更新後的數量
   */
  const updateCart = async (id, qty = 1) => {
    const data = {
      product_id: id,
      qty,
    };
    try {
      const url = `${API_BASE}/api/${API_PATH}/cart/${id}`;
      await axios.put(url, { data });
      getCart(); // 更新購物車內容
    } catch (error) {
      console.error(error.response.data);
    }
  };

  /**
   * 驗證表單資料
   * @param {Object} data - 表單資料
   * @returns {Object} - 驗證錯誤
   */
  const validateForm = (data) => {
    const validationErrors = validate(data);
    return validationErrors || {};
  };

  /**
   * 處理訂單提交
   * @param {Object} data - 表單資料
   */
  const onSubmit = async (data) => {
    const validationErrors = validateForm(data);
    if (Object.keys(validationErrors).length === 0) {
      try {
        const url = `${API_BASE}/api/${API_PATH}/order`;
        await axios.post(url, { data: { user: data, message: data.message } });
        reset(); // 清空表單
        getCart(); // 更新購物車內容
      } catch (error) {
        console.error(error);
      }
    }
  };

  /**
   * 開啟產品詳細資訊 Modal
   * @param {string|number} id - 產品 ID
   */
  const openModal = (id) => {
    productModalRef.current.show(); // 顯示 Modal
    getProduct(id); // 取得產品詳細資訊
  };

  /**
   * 開啟購物車 Offcanvas
   */
  const openCart = () => {
    cartOffcanvasRef.current.show(); // 顯示 Offcanvas
  };

  /**
   * 切換分頁
   * @param {number} page - 分頁號碼
   */
  const changePage = (page) => {
    getProducts(page); // 取得對應分頁的產品列表
  };

  // 初始化資料
  useEffect(() => {
    getProducts(); // 取得產品列表
    getCart(); // 取得購物車內容

    // 初始化 Bootstrap Modal 和 Offcanvas
    productModalRef.current = new bootstrap.Modal("#productModal", {
      keyboard: false,
    });
    cartOffcanvasRef.current = new bootstrap.Offcanvas("#cartOffcanvas", {
      backdrop: true,
    });
  }, []);

  return (
    <div className="container py-5">
      {/* 產品詳細資訊 Modal */}
      <ProductDetailModal
        ref={productModalRef}
        product={product}
        cartQuantity={cartQuantity}
        setCartQuantity={setCartQuantity}
        addCart={addCart}
      />

      {/* 產品列表 */}
      <ProductList
        products={products}
        openModal={openModal}
        addCart={addCart}
        loadingProductId={loadingProductId}
        loadingCartId={loadingCartId}
      />

      {/* 分頁元件 */}
      <Pagination pagination={pagination} changePage={changePage} />

      {/* 購物車 Offcanvas */}
      <Cart
        ref={cartOffcanvasRef}
        cart={cart}
        deleteCart={deleteCart}
        deleteCartAll={deleteCartAll}
        updateCart={updateCart}
      />

      {/* 懸浮購物車按鈕 */}
      <button
        className="btn btn-success rounded-circle position-fixed shadow"
        style={{
          bottom: "40px",
          right: "40px",
          width: "60px",
          height: "60px",
        }}
        onClick={openCart}>
        <i className="fa fa-shopping-cart"></i>
      </button>

      {/* 訂單表單 */}
      <div className="mt-5 row justify-content-center">
        <PlaceOrderForm
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          register={register}
          errors={errors}
        />
      </div>
    </div>
  );
}

export default App;
