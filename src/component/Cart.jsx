import { useImperativeHandle, forwardRef, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import * as bootstrap from "bootstrap";

import { currency } from "../utils/filter";

const Cart = forwardRef(
  /**
   * Cart 元件：用於顯示購物車內容，並提供操作功能如刪除商品、更新數量及清空購物車。
   *
   * @param {Array} cart - 購物車內容的陣列，包含產品資訊和數量。
   * @param {Function} deleteCart - 刪除購物車中單一商品的函式。
   * @param {Function} deleteCartAll - 清空購物車的函式。
   * @param {Function} updateCart - 更新購物車中商品數量的函式。
   * @param {React.Ref} ref - 用於控制 Offcanvas 的顯示和隱藏。
   */
  ({ cart, deleteCart, deleteCartAll, updateCart }, ref) => {
    const offcanvasInstanceRef = useRef(null); // 存放 Bootstrap Offcanvas 實例
    const offcanvasElementRef = useRef(null); // 存放 DOM 元素參考

    // 初始化 Offcanvas，並提供 ref 方法供父元件呼叫
    useImperativeHandle(ref, () => ({
      show: () => {
        if (offcanvasInstanceRef.current) {
          offcanvasInstanceRef.current.show(); // 顯示 Offcanvas
        }
      },
      hide: () => {
        if (offcanvasInstanceRef.current) {
          offcanvasInstanceRef.current.hide(); // 隱藏 Offcanvas
        }
      },
    }));

    // 在元件掛載時初始化 Offcanvas，並在元件卸載時清理資源
    useEffect(() => {
      if (offcanvasElementRef.current) {
        offcanvasInstanceRef.current = new bootstrap.Offcanvas(
          offcanvasElementRef.current,
          { backdrop: true } // 背景點擊可關閉
        );
      }
      return () => {
        if (offcanvasInstanceRef.current) {
          offcanvasInstanceRef.current.dispose(); // 銷毀 Offcanvas 實例
        }
      };
    }, []);

    return (
      <div
        className="offcanvas offcanvas-end text-nowrap" // Offcanvas 位置設置為右側
        tabIndex="-1"
        id="cartOffcanvas"
        aria-labelledby="cartOffcanvasLabel"
        ref={offcanvasElementRef} // 將 DOM 元素與 ref 綁定
      >
        {/* Offcanvas 標頭 */}
        <div className="offcanvas-header bg-light">
          <h5 className="offcanvas-title" id="cartOffcanvasLabel">
            購物車
          </h5>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => offcanvasInstanceRef.current?.hide()} // 關閉 Offcanvas
          ></button>
        </div>

        {/* Offcanvas 主體內容 */}
        <div className="offcanvas-body">
          {cart?.carts?.length > 0 ? ( // 如果購物車中有商品
            <>
              <table className="table table-hover align-middle">
                <thead className="table-secondary">
                  <tr>
                    <th></th>
                    <th>品名</th>
                    <th>數量/單位</th>
                    <th className="text-end">單價</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.carts.map((item) => (
                    <tr key={item.id}>
                      <td>
                        {/* 刪除商品按鈕 */}
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteCart(item.id)} // 呼叫刪除單一商品的函式
                        >
                          <i className="bi bi-x" /> 刪除
                        </button>
                      </td>
                      <td>{item.product.title}</td>
                      <td>
                        {/* 數量更新輸入框 */}
                        <div className="input-group input-group-sm">
                          <input
                            type="number"
                            className="form-control"
                            min="1"
                            defaultValue={item.qty} // 預設數量
                            key={item.qty} // 讓 React 重新渲染此元素
                            onChange={
                              (e) => updateCart(item.id, Number(e.target.value)) // 更新商品數量
                            }
                          />
                          <span className="input-group-text">
                            {item.product.unit} {/* 單位 */}
                          </span>
                        </div>
                      </td>
                      <td className="text-end">
                        {/* 顯示折扣價（如有） */}
                        {item.final_total !== item.total && (
                          <small className="text-success">折扣價：</small>
                        )}
                        {currency(item.final_total)} {/* 單價 */}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="table-active">
                    <td colSpan="3" className="text-end">
                      總計
                    </td>
                    <td className="text-end">{currency(cart?.total)}</td>
                  </tr>
                  {cart?.final_total !== cart?.total ? (
                    <tr>
                      <td colSpan="3" className="text-end text-success">
                        折扣價
                      </td>
                      <td className="text-end text-success">
                        {currency(cart?.final_total)}
                      </td>
                    </tr>
                  ) : null}
                </tfoot>
              </table>
              {/* 清空購物車按鈕 */}
              <div className="text-end mt-3">
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={deleteCartAll} // 呼叫清空購物車的函式
                >
                  清空購物車
                </button>
              </div>
            </>
          ) : (
            <div className="text-center mt-5">
              {/* 當購物車為空時顯示訊息 */}
              <p className="text-muted">您的購物車是空的。</p>
            </div>
          )}
        </div>
      </div>
    );
  }
);

// 設定 displayName
Cart.displayName = "Cart";

// 修改 PropTypes，直接接受陣列
Cart.propTypes = {
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      product: PropTypes.shape({
        title: PropTypes.string.isRequired,
        unit: PropTypes.string.isRequired,
      }).isRequired,
      qty: PropTypes.number.isRequired,
      total: PropTypes.number.isRequired,
      final_total: PropTypes.number.isRequired,
    })
  ).isRequired,
  deleteCart: PropTypes.func.isRequired, // 刪除單一商品的函式
  deleteCartAll: PropTypes.func.isRequired, // 清空購物車的函式
  updateCart: PropTypes.func.isRequired, // 更新商品數量的函式
};

export default Cart;
