/**
 * Membersihkan cookie sesi Supabase yang sudah tidak valid di sisi server.
 *
 * Kalau refresh token sudah mati (mis. dipakai di tab lain, sesi dicabut, atau
 * project di-reset), setiap request SSR akan mencoba refresh dan gagal dengan
 * `refresh_token_not_found`. Error-nya sudah ditelan oleh plugin @nuxtjs/supabase,
 * tapi cookie basi tetap dikirim lagi di request berikutnya sehingga warning yang
 * sama terus muncul.
 *
 * Plugin ini jalan setelah `supabase.server` (enforce: "pre") menyelesaikan
 * bootstrap sesi. Kalau user tidak terbaca padahal cookie auth masih ada, berarti
 * sesinya tidak valid -> hapus cookie-nya supaya request berikutnya bersih.
 */
import { deleteCookie, parseCookies } from "h3";

export default defineNuxtPlugin(() => {
    const event = useRequestEvent();
    if (!event) return;

    const { cookiePrefix, redirectOptions } = useRuntimeConfig().public.supabase;

    // Route callback menukar PKCE code menjadi sesi di sisi klien, jangan diganggu.
    const callbackPath = redirectOptions?.callback ?? "/confirm";
    if (event.path.startsWith(callbackPath)) return;

    // Sesi valid, tidak ada yang perlu dibersihkan.
    if (useSupabaseUser().value) return;

    // Tanpa prefix yang jelas, jangan hapus cookie apa pun.
    if (!cookiePrefix) return;

    const staleCookies = Object.keys(parseCookies(event)).filter((name) =>
        name.startsWith(cookiePrefix),
    );
    if (!staleCookies.length) return;

    for (const name of staleCookies) {
        deleteCookie(event, name, { path: "/" });
    }
});
