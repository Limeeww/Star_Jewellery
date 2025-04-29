import { useState, useEffect, useCallback } from "react";
import { useUserList } from "./useUserList";
import type { Address } from "@/types/userTypes";

export function useAddresses() {
  const { items: addresses, loading, save } = useUserList<Address>("addresses");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && addresses.length && selectedIndex === null) {
      const def = addresses.findIndex((a) => a.preferredShippingAddress);
      setSelectedIndex(def >= 0 ? def : 0);
    }
  }, [loading, addresses, selectedIndex]);

  const prepare = useCallback(
    (list: Address[], addr: Address, idx?: number) => {
      const next = [...list];
      if (next.length === 0) {
        addr.preferredShippingAddress = true;
        addr.preferredBillingAddress = true;
      } else {
        if (addr.preferredShippingAddress)
          next.forEach(
            (a, i) => i !== idx && (a.preferredShippingAddress = false)
          );
        if (addr.preferredBillingAddress)
          next.forEach(
            (a, i) => i !== idx && (a.preferredBillingAddress = false)
          );
      }
      if (idx != null) next[idx] = addr;
      else next.push(addr);
      return next;
    },
    []
  );

  const add = useCallback(
    (addr: Address) => save(prepare(addresses, addr)),
    [addresses, prepare, save]
  );
  const update = useCallback(
    (idx: number, addr: Address) => save(prepare(addresses, addr, idx)),
    [addresses, prepare, save]
  );
  const remove = useCallback(
    (idx: number) => save(addresses.filter((_, i) => i !== idx)),
    [addresses, save]
  );
  const selectAddress = useCallback((idx: number) => setSelectedIndex(idx), []);

  return {
    addresses,
    loading,
    selectedIndex,
    add,
    update,
    remove,
    selectAddress,
  };
}
