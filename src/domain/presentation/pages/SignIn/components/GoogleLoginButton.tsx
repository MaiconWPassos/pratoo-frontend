import { api } from "@/domain/lib/api";
import { exceptionValidation } from "@/domain/lib/error";
import fbApp from "@/domain/lib/firebase";
import { Button } from "@/external/components/ui/button";

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import Cookies from "js-cookie";
import { useState } from "react";

const auth = getAuth(fbApp);
const provider = new GoogleAuthProvider();

export default function GoogleLoginButton() {
  const [error, setError] = useState("");
  const handleGoogleLogin = async () => {
    try {
      setError("");
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const {
        data: { data },
      } = await api.post<ResponseApi<AuthResponse>>("/auth/google", {
        idToken,
      });

      Cookies.set("__session", data.token, { expires: 7 });

      window.location.href = "/";
    } catch (error: any) {
      const { message } = exceptionValidation(error);
      setError(message);
    }
  };

  return (
    <div className="w-full">
      <Button onClick={handleGoogleLogin} type="button" className="w-full">
        <img
          src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
          alt="Google Logo"
          className="w-4 h-4 mr-2"
        />
        Entrar com Google
      </Button>
      <span className="text-red-500 text-sm block mt-2 text-center">
        {error}
      </span>
    </div>
  );
}
