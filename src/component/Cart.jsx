import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import * as bootstrap from "bootstrap";

import { currency } from "../utils/filter";

function Cart({ cart, deleteCart, deleteCartAll, updateCart }) {
  const offcanvasRef = useRef(null);

  // 初始化 Offcanvas
  useEffect(() => {
    offcanvasRef.current = new bootstrap.Offcanvas("#cartOffcanvas", {
      backdrop: true,
    });
  }, []);

  // 打開 Offcanvas
  const openCart = () => {
    offcanvasRef.current.show();
  };

  return (
    <>
      {/* Offcanvas Trigger */}
      <button
        className="btn btn-outline-primary"
        type="button"
        onClick={openCart}>
        查看購物車
      </button>

      {/* Offcanvas */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="cartOffcanvas"
        aria-labelledby="cartOffcanvasLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="cartOffcanvasLabel">
            購物車
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          {/* 購物車內容 */}
          {cart?.carts?.length > 0 ? (
            <>
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th></th>
                    <th>品名</th>
                    <th>數量/單位</th>
                    <th>單價</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.carts.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => deleteCart(item.id)}>
                          <i className="bi bi-x" /> 刪除
                        </button>
                      </td>
                      <td>{item.product.title}</td>
                      <td>
                        <div className="input-group input-group-sm">
                          <input
                            type="number"
                            className="form-control"
                            min="1"
                            defaultValue={item.qty}
                            key={item.qty}
                            onChange={(e) =>
                              updateCart(item.id, Number(e.target.value))
                            }
                          />
                          <div className="input-group-text">
                            /{item.product.unit}
                          </div>
                        </div>
                      </td>
                      <td className="text-end">
                        {item.final_total !== item.total && (
                          <small className="text-success">折扣價：</small>
                        )}
                        {currency(item.final_total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
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
              <div className="text-end">
                <button
                  className="btn btn-outline-danger"
                  type="button"
                  onClick={deleteCartAll}>
                  清空購物車
                </button>
              </div>
            </>
          ) : (
            <p>您的購物車是空的。</p>
          )}
        </div>
      </div>
    </>
  );
}

Cart.propTypes = {
  cart: PropTypes.shape({
    carts: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        product: PropTypes.shape({
          title: PropTypes.string.isRequired,
          unit: PropTypes.string.isRequired,
        }).isRequired,
        qty: PropTypes.number.isRequired,
        total: PropTypes.number.isRequired,
        final_total: PropTypes.number.isRequired,
      })
    ),
    total: PropTypes.number,
    final_total: PropTypes.number,
  }).isRequired,
  deleteCart: PropTypes.func.isRequired,
  deleteCartAll: PropTypes.func.isRequired,
  updateCart: PropTypes.func.isRequired,
};

export default Cart;
