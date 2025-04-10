// utils/cartActions.ts
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { CartItem } from "../types/cartItem";

export const incrementQuantity = async (
  userId: string,
  productId: number
): Promise<void> => {
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return;

  const data = snap.data();
  let updatedCart: CartItem[] = data.cartItems || [];

  updatedCart = updatedCart.map((item: CartItem) =>
    item.productId === productId
      ? { ...item, quantity: item.quantity + 1 }
      : item
  );

  await updateDoc(userRef, { cartItems: updatedCart });
};

export const decrementQuantity = async (
  userId: string,
  productId: number
): Promise<void> => {
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return;

  let updatedCart: CartItem[] = snap.data().cartItems || [];

  updatedCart = updatedCart.map((item: CartItem) => {
    if (item.productId === productId && item.quantity > 1) {
      return { ...item, quantity: item.quantity - 1 };
    }
    return item;
  });

  await updateDoc(userRef, { cartItems: updatedCart });
};

export const removeItem = async (
  userId: string,
  productId: number
): Promise<void> => {
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return;

  let updatedCart: CartItem[] = snap.data().cartItems || [];
  updatedCart = updatedCart.filter(
    (item: CartItem) => item.productId !== productId
  );

  await updateDoc(userRef, { cartItems: updatedCart });
};
