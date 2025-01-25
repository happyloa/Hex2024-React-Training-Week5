import { forwardRef, useRef } from "react"; // 引入 useRef 用於控制 Toast
import PropTypes from "prop-types"; // 用於檢查元件的 prop 類型
import * as bootstrap from "bootstrap"; // 引入 Bootstrap，用於操作 Toast

const ProductDetailModal = forwardRef(
  ({ product, cartQuantity, setCartQuantity, addCart }, ref) => {
    const toastRef = useRef(null); // 參考 Toast 的 DOM 元素

    // 顯示 Toast 的函式
    const showToast = () => {
      const toast = new bootstrap.Toast(toastRef.current);
      toast.show();
    };

    // 包裝 `addCart` 函式，加入 Toast 的顯示邏輯
    const handleAddCart = async () => {
      await addCart(product.id, cartQuantity); // 呼叫原本的 addCart 函式
      showToast(); // 顯示 Toast 提示
    };

    return (
      <>
        {/* Bootstrap Toast */}
        <div
          className="toast align-items-center bg-warning border-0 position-fixed bottom-0 start-0 m-3 shadow-sm"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          ref={toastRef}
          style={{ zIndex: 1055 }}>
          <div className="d-flex">
            <div className="toast-body">商品已加入購物車！</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast"
              aria-label="Close"></button>
          </div>
        </div>

        {/* Modal 結構 */}
        <div
          className="modal fade"
          id="productModal"
          aria-hidden="true"
          ref={ref}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              {/* Modal Header */}
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">
                  產品名稱：{product.title}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"></button>
              </div>

              {/* Modal Body */}
              <div className="modal-body">
                {/* 圖片區塊 */}
                <div className="text-center mb-4">
                  <img
                    className="img-fluid rounded"
                    src={product.imageUrl}
                    alt={product.title}
                  />
                </div>

                {/* 產品內容 */}
                <div className="mb-3">
                  <p className="fw-bold text-muted">產品內容：</p>
                  <p>{product.content}</p>
                </div>

                {/* 產品描述 */}
                <div className="mb-3">
                  <p className="fw-bold text-muted">產品描述：</p>
                  <p>{product.description}</p>
                </div>

                {/* 價格區域 */}
                <div className="mb-4">
                  <p>
                    <span className="text-muted">原價：</span>
                    <del className="text-danger">${product.origin_price}</del>
                  </p>
                  <p className="fs-5 fw-bold text-success">
                    特價：${product.price}
                  </p>
                </div>

                {/* 購買數量 */}
                <div className="d-flex align-items-center gap-2">
                  <label className="fw-bold">購買數量：</label>
                  <button
                    className="btn btn-outline-danger"
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() =>
                      setCartQuantity((prev) => (prev === 1 ? prev : prev - 1))
                    }>
                    <i className="fa-solid fa-minus"></i>
                  </button>
                  <input
                    className="form-control w-auto text-center"
                    type="number"
                    value={cartQuantity}
                    min="1"
                    max="10"
                    onChange={(e) => setCartQuantity(Number(e.target.value))}
                  />
                  <button
                    className="btn btn-outline-primary"
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setCartQuantity((prev) => prev + 1)}>
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal">
                  關閉
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleAddCart}>
                  加入購物車
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
);

ProductDetailModal.displayName = "ProductDetailModal"; // 設定元件名稱

/**
 * PropTypes 驗證，用於檢查 ProductDetailModal 的 props。
 */
ProductDetailModal.propTypes = {
  product: PropTypes.shape({
    title: PropTypes.string,
    imageUrl: PropTypes.string,
    content: PropTypes.string,
    description: PropTypes.string,
    origin_price: PropTypes.number,
    price: PropTypes.number,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  cartQuantity: PropTypes.number.isRequired,
  setCartQuantity: PropTypes.func.isRequired,
  addCart: PropTypes.func.isRequired,
};

export default ProductDetailModal;
