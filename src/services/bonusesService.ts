import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

export function calculateAccrualBonus(purchaseAmount: number): number {
  return Math.floor(purchaseAmount * 0.003);
}

export function calculateDiscountPercentFromBonuses(
  bonusCount: number
): number {
  if (bonusCount < 100) return 0;
  return Math.floor((bonusCount / 100) * 5);
}

export function calculateDiscountAmount(
  purchaseAmount: number,
  bonusCount: number
): number {
  const percent = calculateDiscountPercentFromBonuses(bonusCount);
  return +(purchaseAmount * (percent / 100)).toFixed(2);
}

export async function creditBonuses(
  userId: string,
  purchaseAmount: number
): Promise<void> {
  const ref = doc(db, "users", userId);
  const snap = await getDoc(ref);
  const current = (snap.data()?.bonuses as number) ?? 0;
  const bonus = calculateAccrualBonus(purchaseAmount);
  await updateDoc(ref, { bonuses: current + bonus });
}

export async function redeemBonuses(
  userId: string,
  amount: number
): Promise<void> {
  if (amount <= 0) return;
  const ref = doc(db, "users", userId);
  const snap = await getDoc(ref);
  const current = (snap.data()?.bonuses as number) ?? 0;
  const newTotal = Math.max(0, current - amount);
  await updateDoc(ref, { bonuses: newTotal });
}
