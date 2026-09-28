import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";

import "../css/app.css";
import AppWrapperLayout from "./components/layouts/app-wrapper-layout";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => resolvePageComponent<any>(`./pages/${name}.tsx`, import.meta.glob("./pages/**/*.tsx")),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <AppWrapperLayout>
                <App {...props} />
            </AppWrapperLayout>,
        );
    },
    progress: {
        color: "#4B5563",
    },
});
