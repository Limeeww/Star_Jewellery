import { auth, db } from "../../firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc } from "firebase/firestore";

/**
 * Function to fetch user data from Firestore
 */
export const signOutUser = async (router: ReturnType<typeof useRouter>) => {
  await auth.signOut();
  router.push("/");
};

/**
 * Function to fetch user data from Firestore
 */
export const fetchUserData = async (userId: string) => {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
};

/**
 * Function to update or create user data in Firestore
 */

export const updateUserProfile = async (userId: string, userData: object) => {
  const docRef = doc(db, "users", userId);
  await setDoc(docRef, userData, { merge: true });
};
