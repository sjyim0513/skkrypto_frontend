// src/components/ReceiptBalances.tsx
import React from "react";
import { useReceiptTagBalances } from "../hooks/useReceiptTagBalances";

interface Props {
  /** 영수증 지갑 주소 */
  account: string;
}

export const ReceiptBalances: React.FC<Props> = ({ account }) => {
  const balances = useReceiptTagBalances(account);

  // 태그–잔액 엔트리를 잔액 내림차순으로 정렬
  const sortedEntries = Object.entries(balances).sort(([, a], [, b]) => b - a);

  return (
    <div style={{ padding: 16 }}>
      <h2>RANKING</h2>
      {sortedEntries.length === 0 ? (
        <p>아직 트랜잭션이 없습니다.</p>
      ) : (
        <ul>
          {sortedEntries.map(([tag, amt]) => (
            <li key={tag}>
              Tag <strong>{tag}</strong>: {amt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
