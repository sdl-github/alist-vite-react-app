import { defineConfig, presetAttributify, presetIcons, presetTypography, presetUno } from 'unocss'
import transformerAttributifyJsx from '@unocss/transformer-attributify-jsx-babel'

export default defineConfig({
    theme: {
    },
    shortcuts: {
        'h-btn': 'h-48px w-100% bg-#5C33BE b-none text-white rounded-8px'
    },
    safelist: [],
    presets: [
        presetUno(),
        presetAttributify(),
        presetIcons({
            extraProperties: { 'display': 'inline-block', 'vertical-align': 'middle' },
        }),
        presetTypography(),
    ],
    transformers: [
        transformerAttributifyJsx()
    ]
})
