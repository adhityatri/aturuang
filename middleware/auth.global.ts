export default defineNuxtRouteMiddleware(async (to, _from) => {
  // const user = useSupabaseUser();
  const { isDesktop, isMobileOrTablet } = useDevice();

  // redirect to desktop home if user access on desktop
  if (isDesktop && to.name !== "desktop-home") {
    return await navigateTo({ name: "desktop-home", replace: true });
  }

  if (isMobileOrTablet) {
    
    if (to.name === "desktop-home") {
      return await navigateTo({ name: "login-page", replace: true });
    }
    // if (to.name === "homepage") {
    //   return await navigateTo({ name: "login-page", replace: true });
    // }
  }
  // if (isMobileOrTablet && to.name !== "desktop-home") {
  // console.log('user value', user.value)
  // if (user.value) {
  //   console.log('user is logged in, redirecting to homepage');
  //   return await navigateTo({ name: "homepage", replace: true });
  // }

  // console.log('user is not logged in, redirecting to login page');

  //   return await navigateTo({ name: "login-page" });
  // }
  // if (isMobileOrTablet) {
  //   return await navigateTo({ name: "homepage", replace: true });

  // return await navigateTo({ name: "login-page", replace: true });
  // }
});
