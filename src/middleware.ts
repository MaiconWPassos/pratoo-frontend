import { defineMiddleware } from "astro:middleware";
import { api } from "./domain/lib/api";

export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.auth = {
    user: null,
  };

  if (context.url.pathname.includes("/auth")) return await next();

  const rtkByCookies = context.cookies.get("__session")?.value;

  if (rtkByCookies) {
    try {
      const response = await api.get<ResponseApi<User>>("/auth/me", {
        headers: { Authorization: `Bearer ${rtkByCookies}` },
      });

      context.locals.auth = {
        user: response.data.data,
      };
    } catch (error) {
      console.log("Request Error:", error);
      return context.redirect("/auth/login");
    }
  } else {
    return context.redirect("/auth/login");
  }

  const result = await next();
  return result;
});
