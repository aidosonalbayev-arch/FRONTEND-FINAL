import { useSelector } from "react-redux";
import {
  selectAllTime,
  selectThisMonth,
  selectCount,
} from "../store/totalSlice";

export function Summary() {
  const allTime = useSelector(selectAllTime);
  const thisMonth = useSelector(selectThisMonth);
  const count = useSelector(selectCount);

  return (
    <div className="summary-grid">
      <div className="metric">
        <p className="metric-label">Всего потрачено</p>
        <p className="metric-value">{allTime}</p>
      </div>
      <div className="metric">
        <p className="metric-label">За этот месяц</p>
        <p className="metric-value">{thisMonth}</p>
      </div>
      <div className="metric">
        <p className="metric-label">Кол-во расходов</p>
        <p className="metric-value">{count}</p>
      </div>
    </div>
  );
}
