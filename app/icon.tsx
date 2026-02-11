import { ImageResponse } from 'next/og'

// Configuración del runtime para máxima velocidad
export const runtime = 'edge'

// Metadatos del icono
export const alt = 'NextCMS Logo'
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Generación del icono mediante código (Satori)
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'transparent',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#028ce8',
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z"
            fill="currentColor"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}