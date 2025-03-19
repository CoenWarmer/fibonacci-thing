import '@fontsource/inter';
import { ThemeProvider } from '@mui/joy/styles';
import { CssVarsProvider } from '@mui/joy/styles';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from '../utils/createEmotionCache';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function App({ Component, pageProps, emotionCache = clientSideEmotionCache }: any) {
    return (
        <CacheProvider value={emotionCache}>
            <CssVarsProvider>
                <ThemeProvider>
                    <Component {...pageProps} />
                </ThemeProvider>
            </CssVarsProvider>
        </CacheProvider>
    );
}
