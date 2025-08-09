export default defineAppConfig({
    ui: {
        slideover: {
            slots:{
                overlay: "bg-black/70",
            }
        },
        container: {
            base: 'w-full max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8'
        }
    }
})