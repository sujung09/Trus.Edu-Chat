---
name: Lumina Learn
colors:
  surface: '#141218'
  surface-dim: '#141218'
  surface-bright: '#3b383e'
  surface-container-lowest: '#0f0d13'
  surface-container-low: '#1d1b20'
  surface-container: '#211f24'
  surface-container-high: '#2b292f'
  surface-container-highest: '#36343a'
  on-surface: '#e6e0e9'
  on-surface-variant: '#cbc4d2'
  inverse-surface: '#e6e0e9'
  inverse-on-surface: '#322f35'
  outline: '#948e9c'
  outline-variant: '#494551'
  surface-tint: '#cfbcff'
  primary: '#cfbcff'
  on-primary: '#381e72'
  primary-container: '#6750a4'
  on-primary-container: '#e0d2ff'
  inverse-primary: '#6750a4'
  secondary: '#cdc0e9'
  on-secondary: '#342b4b'
  secondary-container: '#4d4465'
  on-secondary-container: '#bfb2da'
  tertiary: '#e7c365'
  on-tertiary: '#3e2e00'
  tertiary-container: '#c9a74d'
  on-tertiary-container: '#503d00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#cfbcff'
  on-primary-fixed: '#22005d'
  on-primary-fixed-variant: '#4f378a'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#cdc0e9'
  on-secondary-fixed: '#1f1635'
  on-secondary-fixed-variant: '#4b4263'
  tertiary-fixed: '#ffdf93'
  tertiary-fixed-dim: '#e7c365'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#594400'
  background: '#141218'
  on-background: '#e6e0e9'
  surface-variant: '#36343a'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  container_padding: 16px
  gutter: 12px
---

## Brand & Style
The design system is engineered for a high-engagement educational environment that mimics the addictive, social nature of modern media while maintaining the focus required for learning. It targets a Gen-Z and Millennial demographic familiar with social scrolling but needing structured academic collaboration.

The style is **Social-SaaS Hybrid**. It utilizes a "Dark Mode First" philosophy to reduce eye strain during long study sessions. The aesthetic combines the sleek, immersive quality of **Glassmorphism** with a highly disciplined **Minimalist** layout. Visual interest is driven by vibrant gradients used sparingly as "energy points" against a monochromatic, deep-toned backdrop, ensuring that educational content remains the primary focus while the interface feels premium and contemporary.

## Colors
The palette is built on a "Total Black" foundation to maximize OLED efficiency and visual depth. 
- **Base Backgrounds**: Use `#000000` for the main canvas and `#121212` for elevated surfaces like sidebars or chat bubbles.
- **Accents**: The signature gradient is reserved for active states (e.g., "New Message" indicators, active "Story-style" study groups, or primary action buttons). 
- **Functional Colors**: Use subtle greys for secondary text to create clear hierarchy. Success, error, and warning states should be handled via the gradient's component colors (Orange for warnings, Purple for info) to maintain brand cohesion.

## Typography
This design system relies on **Inter** for its neutral, highly legible character.
- **Hierarchies**: Titles use a tight letter-spacing to mimic editorial social apps. Body text is optimized for long-form reading of educational materials.
- **Mono-spaced Utility**: While not the primary font, **JetBrains Mono** is introduced for code snippets within the chat to ensure clarity in technical discussions.
- **Mobile Scaling**: Headlines larger than 24px should scale down by 15% on mobile devices while maintaining line-height ratios.

## Layout & Spacing
The layout follows a **Fluid Content Model** with fixed utility bars. 
- **Desktop**: A three-pane layout (Navigation | Chat Thread | Group Details). The central chat thread occupies a maximum of 800px to maintain readability.
- **Mobile**: Single-pane focus with a bottom navigation bar for quick thumb access.
- **Rhythm**: Use a 4px baseline grid. Internal component padding should be generous (`16px`) to prevent the interface from feeling cluttered, even during dense academic discussions.

## Elevation & Depth
Depth is achieved through **Tonal Layering** and **Glassmorphism** rather than traditional shadows.
- **Level 0**: `#000000` (Main App Background).
- **Level 1**: `#121212` (Cards, Chat Bubbles, Input Fields).
- **Glass Effect**: Floating headers and the bottom navigation bar use a 20px backdrop blur with a `rgba(28, 28, 28, 0.7)` background.
- **Borders**: All elevated elements feature a `1px` solid border (`rgba(255, 255, 255, 0.1)`) to define edges in a dark environment without needing heavy shadows.

## Shapes
The design system uses a **Rounded** language to feel approachable and modern.
- **Chat Bubbles**: Incoming messages have a 16px radius. Outgoing messages follow the same, except for the "tail" corner which is 4px.
- **Avatars**: Always 100% circular, following the social media convention.
- **Images/Files**: Shared educational resources should use the `rounded-lg` (16px) setting to distinguish them from standard text bubbles.

## Components
- **Buttons**: Primary buttons use the brand gradient with white text. Secondary buttons use a "Ghost" style with a 1px white border.
- **Chat Bubbles**: Outgoing bubbles are subtly tinted with the primary purple; incoming bubbles are `#1C1C1C`.
- **Educational Snippets**: 
    - **Code Blocks**: Darker background (`#080808`) with a subtle syntax highlighting and a "Copy" icon in the top right.
    - **File Attachments**: Horizontal card style with a prominent icon, file name, and "Download/View" actions.
- **Input Field**: A pill-shaped (rounded-xl) bar at the bottom of the chat, containing minimalist outlined icons for attachments, camera, and voice notes.
- **Status Indicators**: "Online" status uses a glowing green dot. "Active Study Session" uses a pulsing ring with the brand gradient around the user's avatar.
- **Icons**: Use linear, 1.5pt stroke-weight icons. Avoid filled icons except for active navigation states.