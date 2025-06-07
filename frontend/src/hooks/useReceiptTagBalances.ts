// src/hooks/useReceiptTagBalances.ts
import { useEffect, useState } from "react";
import { Client, dropsToXrp } from "xrpl";
import { Buffer } from "buffer";

export type TagBalances = Record<string, number>;

/**
 * account 지갑에서 validated 트랜잭션 스트림을 구독하고,
 * Memo에 담긴 { from, to, amount }를 파싱해서
 * 태그별 잔액을 계산해 반환하는 Hook
 */
export function useReceiptTagBalances(account: string): TagBalances {
  const [balances, setBalances] = useState<TagBalances>({});

  useEffect(() => {
    const client = new Client("wss://s1.ripple.com");
    let connected = true;

    (async () => {
      await client.connect();
      await client.request({
        command: "subscribe",
        accounts: [account],
      });

      client.on("transaction", (evt: any) => {
        if (!connected || !evt.validated) return;

        const tx = evt.tx_json;
        console.log("tx", tx);
        const memos = tx?.Memos;
        if (!memos?.length) return;

        try {
          const memoHex = memos[0].Memo.MemoData;
          const json = JSON.parse(
            Buffer.from(memoHex, "hex").toString("utf8")
          ) as { from: number; to: number; amount: string };

          const amt = dropsToXrp(json.amount);
          if (isNaN(amt)) return;
          console.log("json", json);
          setBalances((prev) => {
            const next = { ...prev };
            next[String(json.from)] = (next[String(json.from)] || 0) - amt;
            next[String(json.to)] = (next[String(json.to)] || 0) + amt;
            return next;
          });
        } catch (e) {
          console.error("Memo 파싱 오류:", e);
        }
      });
    })().catch(console.error);

    return () => {
      connected = false;
      client.disconnect();
    };
  }, [account]);

  return balances;
}
