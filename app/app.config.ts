export default defineAppConfig({
    ui: {
        select: {
            slots : {
                base: 'rounded-[2em] bg-neutral-100!'
            },
            variants: {
                size: {
                    xl: {
                        base: 'px-6 py-4 text-sm'
                    }
                }
            }
        },
        input: {
            slots: {
                base: 'rounded-[2em] bg-neutral-100!'
            },
            variants: {
                size: {
                    xl: {
                        base : 'px-6 py-4 text-sm'
                    } 
                }
            }
        },
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