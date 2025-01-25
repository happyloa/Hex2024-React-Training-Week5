import { useImperativeHandle, forwardRef, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import * as bootstrap from "bootstrap";

import { currency } from "../utils/filter";

const Cart = forwardRef(
  ({ cart, deleteCart, deleteCartAll, updateCart }, ref) => {
    const offcanvasRef = useRef(null);

    // 初始化 Offcanvas
    useImperativeHandle(ref, () => ({
      show: () => {
        if (offcanvasRef.current) {
          offcanvasRef.current.show();
        }
      },
    }));

    useEffect(() => {
      offcanvasRef.current = new bootstrap.Offcanvas("#cartOffcanvas", {
        backdrop: true,
      });
    }, []);

    return (
      <div
        className="offcanvas offcanvas-end text-nowrap"
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
    );
  }
);

// 設定 displayName
Cart.displayName = "Cart";

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
  deleteCart: PropTypes.func.isRequired,
  deleteCartAll: PropTypes.func.isRequired,
  updateCart: PropTypes.func.isRequired,
};

export default Cart;
