'use client'
import React, {useEffect} from "react";
import {useAuthState} from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/firebaseConfig';
import { useRouter } from 'next/navigation';


export default function Profile(){
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-up');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }
    return(
        <div>Your profile
            <p>{user?.displayName || user?.email}</p>
        </div>
    );
}
