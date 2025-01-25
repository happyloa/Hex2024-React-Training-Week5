import { forwardRef } from "react"; // 用於轉發 ref，方便父元件控制此元件的 DOM 節點
import PropTypes from "prop-types"; // 用於檢查元件的 prop 類型

/**
 * ProductDetailModal 元件顯示產品的詳細資訊。
 * 它是一個 Bootstrap 的 Modal，包含產品的圖片、描述、價格資訊以及購買數量選擇功能。
 *
 * @param {Object} product - 包含產品詳細資訊的物件。
 * @param {number} cartQuantity - 當前選擇的購買數量。
 * @param {Function} setCartQuantity - 用於設定購買數量的函式。
 * @param {Function} addCart - 用於將產品加入購物車的函式。
 * @param {Object} ref - 用於控制此元件的外部引用，例如開啟或關閉 Modal。
 */
const ProductDetailModal = forwardRef(
  ({ product, cartQuantity, setCartQuantity, addCart }, ref) => {
    return (
      <div
        className="modal fade" // Bootstrap Modal 類，`fade` 加入淡入淡出的動畫效果
        id="productModal" // Modal 的 ID，用於與 JavaScript 控制交互
        aria-hidden="true" // 隱藏時避免被輔助工具讀取
        ref={ref} // 將 Modal 的 DOM 元素暴露給父元件
      >
        <div className="modal-dialog modal-lg">
          {" "}
          {/* Bootstrap 標準寬度的大型對話框 */}
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title fw-bold">產品名稱：{product.title}</h5>
              <button
                type="button"
                className="btn-close" // Bootstrap 關閉按鈕樣式
                data-bs-dismiss="modal" // 點擊時關閉 Modal
                aria-label="Close" // 無障礙標籤
              ></button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              {/* 圖片區塊 */}
              <div className="text-center mb-4">
                <img
                  className="img-fluid rounded" // 確保圖片響應式顯示，且邊角為圓角
                  src={product.imageUrl} // 產品圖片來源
                  alt={product.title} // 替代文字，顯示產品名稱
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
                  } // 當數量大於 1 時減少數量
                >
                  <i className="fa-solid fa-minus"></i>{" "}
                  {/* FontAwesome Minus Icon */}
                </button>
                <input
                  className="form-control w-auto text-center"
                  type="number"
                  value={cartQuantity} // 當前購買數量
                  min="1" // 最小購買數量
                  max="10" // 最大購買數量
                  onChange={(e) => setCartQuantity(Number(e.target.value))} // 更新購買數量
                />
                <button
                  className="btn btn-outline-primary"
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setCartQuantity((prev) => prev + 1)} // 增加購買數量
                >
                  <i className="fa-solid fa-plus"></i>{" "}
                  {/* FontAwesome Plus Icon */}
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal" // 點擊時關閉 Modal
              >
                關閉
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={() => addCart(product.id, cartQuantity)} // 加入購物車的操作
              >
                加入購物車
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ProductDetailModal.displayName = "ProductDetailModal"; // 顯示名稱，用於開發工具中的識別

/**
 * PropTypes 驗證，用於檢查 ProductDetailModal 的 props。
 */
ProductDetailModal.propTypes = {
  product: PropTypes.shape({
    title: PropTypes.string, // 產品名稱
    imageUrl: PropTypes.string, // 產品圖片 URL
    content: PropTypes.string, // 產品內容
    description: PropTypes.string, // 產品描述
    origin_price: PropTypes.number, // 原價
    price: PropTypes.number, // 特價
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // 產品 ID
  }).isRequired,
  cartQuantity: PropTypes.number.isRequired, // 當前購買數量
  setCartQuantity: PropTypes.func.isRequired, // 更新購買數量的函式
  addCart: PropTypes.func.isRequired, // 加入購物車的函式
};

export default ProductDetailModal;
