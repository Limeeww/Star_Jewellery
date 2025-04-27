import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { CartItem } from "@/types/cartItem";

export const addOrIncrementCartItem = async (
  userId: string,
  newItem: CartItem
): Promise<void> => {
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return;

  const data = snap.data();
  const updatedCart: CartItem[] = data.cartItems || [];

  const existingIndex = updatedCart.findIndex(
    (item) =>
      item.productId === newItem.productId &&
      item.size === newItem.size &&
      item.insert === newItem.insert &&
      item.materialColor === newItem.materialColor
  );

  if (existingIndex > -1) {
    updatedCart[existingIndex].quantity += newItem.quantity;
  } else {
    updatedCart.push(newItem);
  }

  await updateDoc(userRef, { cartItems: updatedCart });
};

export const incrementQuantity = async (
  userId: string,
  productId: number,
  size: number,
  insert: string,
  materialColor: string
): Promise<void> => {
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return;

  const data = snap.data();
  let updatedCart: CartItem[] = data.cartItems || [];

  updatedCart = updatedCart.map((item: CartItem) => {
    if (
      item.productId === productId &&
      item.size === size &&
      item.insert === insert &&
      item.materialColor === materialColor
    ) {
      return { ...item, quantity: item.quantity + 1 };
    }
    return item;
  });
  await updateDoc(userRef, { cartItems: updatedCart });
};

export const decrementQuantity = async (
  userId: string,
  productId: number,
  size: number,
  insert: string,
  materialColor: string
): Promise<void> => {
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return;

  let updatedCart: CartItem[] = snap.data().cartItems || [];

  updatedCart = updatedCart
    .map((item: CartItem) => {
      if (
        item.productId === productId &&
        item.size === size &&
        item.insert === insert &&
        item.materialColor === materialColor
      ) {
        if (item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return null;
      }
      return item;
    })
    .filter(Boolean) as CartItem[];

  await updateDoc(userRef, { cartItems: updatedCart });
};

export const removeItem = async (
  userId: string,
  productId: number,
  size: number,
  insert: string,
  materialColor: string
): Promise<void> => {
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return;

  let updatedCart: CartItem[] = snap.data().cartItems || [];
  updatedCart = updatedCart.filter(
    (item: CartItem) =>
      !(
        item.productId === productId &&
        item.size === size &&
        item.insert === insert &&
        item.materialColor === materialColor
      )
  );

  await updateDoc(userRef, { cartItems: updatedCart });
};
