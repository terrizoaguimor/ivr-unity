# Investigación: Top 10 Interfaces UI/UX + Efectos Hover para Cards

## Executive Summary

Esta investigación analiza las mejores prácticas de UI/UX en dashboards financieros y enterprise, enfocándose en efectos hover, sombras y micro-interacciones para cards con glassmorphism.

---

## Top 10 Interfaces de Referencia

### 1. **Stripe Dashboard**
- Navegación con animación fluida de fondo que se desliza entre items
- Transiciones usando `transform` y `opacity` para performance GPU
- Duración de animaciones < 500ms
- Regla: "Las animaciones nunca deben estorbar"

### 2. **Vercel Dashboard**
- Efecto "direction-aware" que sigue la dirección del mouse
- Hover states con más contraste que estado de reposo
- Prioridad a animaciones GPU (transform, opacity)
- Animaciones interrumpibles y cancelables

### 3. **Linear App**
- Micro-interacciones inteligentes y personalizadas
- Glassmorphism sutil con blur controlado
- Feedback visual instantáneo
- Estados de hover que comunican clickeabilidad

### 4. **Revolut**
- Dashboard con balance en tiempo real y transacciones
- White space generoso con iconografía pesada
- Respuestas en tiempo real que generan confianza
- Personalización basada en comportamiento del usuario

### 5. **Nubank**
- Diseño mobile-first minimalista y cálido
- Simplicidad extrema sin perder funcionalidad
- Cards con bordes suaves y sombras sutiles
- Interfaz que se siente "inteligente, estable y segura"

### 6. **Mercury (B2B Banking)**
- Gradientes sutiles y paletas de color apagadas
- Posicionamiento profesional y maduro
- Ruido visual mínimo
- Cards con elevación sutil al hover

### 7. **Figma**
- Micro-interacciones que responden al contexto
- Transiciones de 150-300ms para fluidez
- Estados hover que indican interactividad
- Sombras que sugieren profundidad

### 8. **Notion**
- Cards que se elevan sutilmente al hover
- Transiciones suaves con easing natural
- Feedback táctil con scale en tap
- Consistencia en todos los componentes

### 9. **Raycast**
- Glassmorphism con blur controlado (4-6px)
- Glow effects sutiles en estados activos
- Animaciones rápidas (120-220ms)
- Respeto por prefers-reduced-motion

### 10. **Framer**
- Animaciones avanzadas con propagación de variantes
- Efectos de "glow" en hover
- Combinación de scale + shadow en hover
- 3D transforms para profundidad

---

## Mejores Prácticas de Hover Effects

### Timing & Performance

| Aspecto | Recomendación |
|---------|---------------|
| Duración | 150-300ms (máximo 500ms) |
| Easing | `cubic-bezier(0.4, 0.0, 0.2, 1)` o `cubic-bezier(0.16, 1, 0.3, 1)` |
| Propiedades GPU | `transform`, `opacity`, `box-shadow` |
| Evitar animar | `width`, `height`, `top`, `left`, `backdrop-filter` |

### Efectos Recomendados para Cards

#### 1. **Lift Effect (Elevación)**
```css
.card {
  transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1);
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(81, 39, 131, 0.15);
}
```

#### 2. **Scale + Shadow**
```css
.card:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 30px rgba(81, 39, 131, 0.12);
}
```

#### 3. **Glow Effect (para estados activos)**
```css
.card:hover {
  box-shadow:
    0 8px 24px rgba(81, 39, 131, 0.12),
    0 0 0 1px rgba(241, 137, 24, 0.1);
}
```

#### 4. **Subtle Border Highlight**
```css
.card {
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.card:hover {
  border-color: rgba(255, 255, 255, 0.2);
}
```

### Framer Motion Patterns

```tsx
// Patrón básico
<motion.div
  whileHover={{
    y: -4,
    scale: 1.01,
    boxShadow: "0 12px 24px rgba(81, 39, 131, 0.15)"
  }}
  whileTap={{ scale: 0.98 }}
  transition={{
    type: "spring",
    stiffness: 400,
    damping: 25
  }}
/>

// Con variantes para propagación
const cardVariants = {
  rest: {
    y: 0,
    boxShadow: "0 4px 16px rgba(81, 39, 131, 0.08)"
  },
  hover: {
    y: -4,
    boxShadow: "0 12px 24px rgba(81, 39, 131, 0.15)"
  }
};
```

### Tailwind CSS Classes

```html
<!-- Lift + Shadow -->
<div class="transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

<!-- Scale + Shadow -->
<div class="transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">

<!-- Combinado con glow -->
<div class="transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
            hover:ring-1 hover:ring-brand-500/20">
```

---

## Reglas de Oro

1. **Sutileza es clave**: `scale(1.02)` no `scale(1.1)`, `translateY(-4px)` no `-10px`
2. **Nunca animar blur en hover**: GPU-expensive, causa jank
3. **Respetar `prefers-reduced-motion`**: Accesibilidad importa
4. **Consistencia**: Mismo efecto hover en todos los cards similares
5. **Propósito**: Cada animación debe comunicar algo (clickeabilidad, estado)
6. **Performance budget**: Máximo 8-10 superficies con blur simultáneo

---

## Recomendaciones para Unity Financial Network

### Efectos a Implementar

1. **glass-card hover**:
   - `translateY(-4px)` + sombra elevada
   - Border más claro en hover
   - Transición de 250ms con ease-glass

2. **glass-panel hover** (sidebar items):
   - Background sutil con tinte purple
   - Sin transform (mantener posición)

3. **Botones primarios (orange)**:
   - Scale sutil `1.02` + shadow glow naranja
   - `whileTap: scale(0.98)` para feedback táctil

4. **Metric cards**:
   - Lift effect con sombra púrpura
   - Opcional: highlight del delta badge

### Implementación CSS

```css
/* Glass Card Hover Enhancement */
@utility glass-card-interactive {
  transition:
    transform 250ms var(--ease-glass),
    box-shadow 250ms var(--ease-glass),
    border-color 250ms var(--ease-glass);
}

@utility glass-card-interactive:hover {
  transform: translateY(-4px);
  box-shadow: var(--glass-shadow-lg), var(--glass-shadow-inset);
  border-color: var(--glass-border-light);
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .glass-card-interactive {
    transition: none;
  }
  .glass-card-interactive:hover {
    transform: none;
  }
}
```

---

## Implementación Final - Unity Financial Network

Los siguientes efectos fueron implementados en `/src/index.css`:

### Variables CSS Agregadas

```css
/* Sombras elevadas para hover */
--glass-shadow-elevated: 0 12px 40px rgba(81, 39, 131, 0.15);
--glass-shadow-glow: 0 0 0 1px rgba(241, 137, 24, 0.08);
--glass-shadow-glow-active: 0 0 0 1px rgba(241, 137, 24, 0.15);

/* Easing functions */
--ease-glass: cubic-bezier(0.16, 1, 0.3, 1);
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);

/* Duraciones */
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 350ms;
```

### Clases Utility Disponibles

| Clase | Efecto | Uso |
|-------|--------|-----|
| `glass-card` | Lift + shadow en hover (automático) | Todas las cards |
| `glass-card-interactive` | Lift + scale + glow mejorado | Cards clickeables |
| `glass-card-glow` | Borde gradiente animado en hover | Cards premium/destacadas |
| `glass-shimmer` | Efecto de brillo que recorre la card | Loading states, CTAs |
| `glass-frost-ring` | Línea de luz en el borde superior | Realismo de refracción |
| `glass-animated-border` | Borde cónico rotativo en hover | Elementos premium |
| `glass-scale` | Solo zoom sutil (1.02) | Imágenes, avatares |
| `glass-lift` | Solo elevación sin scale | Alternativa sutil |

### Ejemplo de Uso

```tsx
// Card estándar (ya tiene hover automático)
<div className="glass-card rounded-2xl p-6">
  ...
</div>

// Card premium con borde animado
<div className="glass-card glass-animated-border rounded-2xl p-6">
  ...
</div>

// Card con efecto shimmer
<div className="glass-card glass-shimmer rounded-2xl p-6">
  ...
</div>

// Card destacada con glow
<div className="glass-card glass-card-glow rounded-2xl p-6">
  ...
</div>
```

---

## Sources

### Dashboard Design
- [Medium - 10 Best UI/UX Dashboard Design Principles 2025](https://medium.com/@farazjonanda/10-best-ui-ux-dashboard-design-principles-for-2025-2f9e7c21a454)
- [Design4Users - Dashboard Design Concepts](https://design4users.com/dashboard-design-concepts/)
- [Muzli - Dashboard Design Inspirations](https://muz.li/blog/top-dashboard-design-examples-inspirations-for-2025/)
- [UXPin - Dashboard Design Principles](https://www.uxpin.com/studio/blog/dashboard-design-principles/)
- [Dribbble - Trending Dashboard 2025](https://dribbble.com/tags/trending-dashboard-design-2025)

### Hover Effects & Animations
- [Josh W. Comeau - Designing Beautiful Shadows](https://www.joshwcomeau.com/css/designing-shadows/)
- [CSS Author - 40 CSS Hover Effects](https://cssauthor.com/css-hover-effects/)
- [TailwindTap - Card Hover Effects](https://www.tailwindtap.com/blog/card-hover-effects-in-tailwind-css)
- [FreeFrontend - 32 Card Hover Effects](https://freefrontend.com/css-card-hover-effects/)
- [Web Peak - Animation Trends 2025](https://webpeak.org/blog/css-js-animation-trends/)

### Glassmorphism
- [FreeFrontend - 60 CSS Glassmorphism Examples](https://freefrontend.com/css-glassmorphism/)
- [UX Pilot - Glassmorphism UI Features](https://uxpilot.ai/blogs/glassmorphism-ui)
- [UI Surgeon - Glassmorphism Generator](https://uisurgeon.com/tools/glassmorphism-css-generator)

### Fintech/Enterprise UI
- [Wavespace - Banking Apps UX](https://www.wavespace.agency/blog/banking-app-ux)
- [Goodface - Top 10 Fintech Interfaces](https://goodface.agency/insight/top-10-fintech-product-interface-designs/)
- [Velmie - Top Banking Apps UX 2025](https://www.velmie.com/post/top-banking-apps-with-the-best-ux)

### Framer Motion & React
- [Maxime Heckel - Advanced Framer Motion](https://blog.maximeheckel.com/posts/advanced-animation-patterns-with-framer-motion/)
- [Framer Motion - Gestures API](https://www.framer.com/motion/gestures/)
- [Vercel Design Guidelines](https://vercel.com/design/guidelines)
