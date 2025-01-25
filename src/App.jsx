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

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
  const [loadingCartId, setLoadingCartId] = useState(null);
  const [loadingProductId, setLoadingProductId] = useState(null);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});
  const [pagination, setPagination] = useState({});
  const [cart, setCart] = useState([]);
  const [cartQuantity, setCartQuantity] = useState(1);
  const productModalRef = useRef(null);
  const cartOffcanvasRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // 取得全部產品
  const getProducts = async (page = 1) => {
    try {
      const url = `${API_BASE}/api/${API_PATH}/products?page=${page}`;
      const response = await axios.get(url);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
      console.log(response);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  // 取得單一產品
  const getProduct = async (id) => {
    setLoadingProductId(id);
    try {
      const url = `${API_BASE}/api/${API_PATH}/product/${id}`;
      const response = await axios.get(url);
      setProduct(response.data.product);
    } catch (error) {
      console.log(error.response.data);
    } finally {
      setLoadingProductId(null);
    }
  };

  // 取得購物車列表
  const getCart = async () => {
    try {
      const url = `${API_BASE}/api/${API_PATH}/cart`;
      const response = await axios.get(url);
      setCart(response.data.data);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  // 加入購物車
  const addCart = async (id, num) => {
    setLoadingCartId(id);
    const data = {
      product_id: id,
      qty: num,
    };
    try {
      const url = `${API_BASE}/api/${API_PATH}/cart`;
      await axios.post(url, { data });
      getCart();
    } catch (error) {
      console.log(error.response.data);
    } finally {
      setLoadingCartId(null);
      productModalRef.current.hide();
    }
  };

  // 清除單一筆購物車
  const deleteCart = async (id) => {
    try {
      const url = `${API_BASE}/api/${API_PATH}/cart/${id}`;
      await axios.delete(url);
      getCart();
    } catch (error) {
      console.log(error.response.data);
    }
  };

  // 清空購物車
  const deleteCartAll = async () => {
    try {
      const url = `${API_BASE}/api/${API_PATH}/carts`;
      await axios.delete(url);
      getCart();
    } catch (error) {
      console.log(error.response.data);
    }
  };

  // 更新商品數量
  const updateCart = async (id, qty = 1) => {
    try {
      const url = `${API_BASE}/api/${API_PATH}/cart/${id}`;
      const data = {
        product_id: id,
        qty,
      };
      await axios.put(url, { data });
      getCart();
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const validateForm = (data) => {
    const validationErrors = validate(data);
    return validationErrors || {};
  };

  const onSubmit = async (data) => {
    const validationErrors = validateForm(data);
    if (Object.keys(validationErrors).length === 0) {
      try {
        const url = `${API_BASE}/api/${API_PATH}/order`;
        await axios.post(url, { data: { user: data, message: data.message } });
        reset();
        getCart();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const openModal = async (id) => {
    productModalRef.current.show();
    getProduct(id);
  };

  const openCart = () => {
    cartOffcanvasRef.current.show();
  };

  const changePage = (page) => {
    getProducts(page);
  };

  useEffect(() => {
    // 初始化產品和購物車資料
    getProducts();
    getCart();

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
      {/* Product Modal */}
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

      {/* 分頁 */}
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
        className="btn btn-primary rounded-circle position-fixed shadow"
        style={{
          bottom: "50px",
          right: "100px",
          width: "60px",
          height: "60px",
        }}
        onClick={openCart}>
        <i className="fa fa-shopping-cart"></i>
      </button>

      {/* 表單資料 */}
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
