import { defineMiddleware } from "astro:middleware";
import { api } from "./domain/lib/api";

export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.auth = {
    user: null,
  };

  if (!context.url.pathname.includes("/app")) return await next();

  const rtkByCookies = context.cookies.get("__session")?.value;

  console.log("RTK:", rtkByCookies);

  if (rtkByCookies) {
    try {
      const response = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${rtkByCookies}` },
      });

      context.locals.auth = {
        user: response.data.user,
      };
    } catch (error) {
      console.log("Request Error:", error);
      return context.redirect("/");
    }
  } else {
    return context.redirect("/");
  }

  const result = await next();
  return result;
});
