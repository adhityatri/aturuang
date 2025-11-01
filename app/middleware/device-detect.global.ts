export default defineNuxtRouteMiddleware((to) => {
  let userAgent: string | undefined;

  if (import.meta.server) {
    const headers = useRequestHeaders(["user-agent"]);
    const uaHeader = headers["user-agent"];
    if (Array.isArray(uaHeader)) {
      userAgent = uaHeader[0]; // Ambil elemen pertama jika berupa array
    } else {
      userAgent = uaHeader; // Jika string atau undefined
    }
  } else {
    userAgent = navigator.userAgent;
  }

  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent || ""
    );

  if (!isMobile && to.path === "/desktop") {
    return;
  }

  if (isMobile && to.path === "/desktop") {
    return navigateTo({ name: "homepage", replace: true });
  }

  if (!isMobile) {
    return navigateTo({ name: "desktop-home", replace: true });
  }
});
