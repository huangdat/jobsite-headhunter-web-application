# Design System Specification: The Kinetic Executive

## 1. Overview & Creative North Star
The "Kinetic Executive" is a design system built on the philosophy of **"Luminous Authority."** It rejects the static, boxed-in nature of traditional administration dashboards in favor of an editorial, high-contrast experience that feels both prestigious and high-velocity.

### The Creative North Star: The Digital Architect
We move beyond "Standard UI" by utilizing a high-contrast juxtaposition: a deep, architectural sidebar (`#0B0F19`) set against a sprawling, airy canvas (`#f6f6ff`). We break the "template" look through **intentional asymmetry**—where the heavy gravity of the sidebar allows the content area to feel infinitely expansive. We avoid the "grid-prison" by using white space as a structural element rather than a gap between boxes.

---

## 2. Colors & Surface Philosophy
Our palette is rooted in a "Forest High-Tech" aesthetic, blending organic greens with deep obsidian and clinical whites.

### The "No-Line" Rule
**Prohibit 1px solid borders for sectioning.** Physical boundaries are antiquated. Instead, define structure through:
*   **Background Shifts:** Use `surface-container-low` for secondary groupings against a `surface` background.
*   **Tonal Transitions:** A transition from `surface` to `surface-container` creates a "ledge" rather than a wall.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers.
*   **Base:** `surface` (#f6f6ff)
*   **Level 1 (Sections):** `surface-container-low` (#eef0ff)
*   **Level 2 (Active Cards):** `surface-container-lowest` (#ffffff)
*   **Elevation:** To create depth, stack a `surface-container-lowest` card atop a `surface-container-low` section.

### The Glass & Gradient Rule
To ensure the system feels bespoke:
*   **Primary CTA Gradient:** Use a linear gradient from `primary` (#006a2d) to `primary-fixed-dim` (#5bf083) at a 135° angle. This adds "soul" and a tactile, liquid quality to actions.
*   **Glassmorphism:** For floating menus or overlays, use `surface-container-lowest` at 80% opacity with a `20px` backdrop-blur.

---

## 3. Typography
We utilize a dual-typeface system to balance technical precision with editorial authority.

*   **Display & Headlines (Manrope):** Use Manrope for all `display` and `headline` tiers. Its geometric yet warm proportions convey modern leadership. Use `headline-lg` (2rem) for page titles to establish an immediate hierarchy.
*   **Body & Labels (Inter):** Use Inter for all functional data. Its high x-height ensures readability at small scales (`body-sm` 0.75rem).
*   **The Power Scale:** Large `display-md` numbers should be used for KPIs to create "visual anchors" on a page, drawing the eye to the most critical data points first.

---

## 4. Elevation & Depth
We eschew "Drop Shadows" in favor of **Tonal Layering** and **Ambient Light.**

*   **The Layering Principle:** Depth is achieved by stacking. A `surface-container-highest` element feels closer to the user than a `surface-dim` element.
*   **Ambient Shadows:** For floating elements (Modals/Popovers), use a multi-layered shadow: 
    *   `0px 10px 30px rgba(10, 14, 24, 0.04)` 
    *   `0px 2px 8px rgba(10, 14, 24, 0.02)`
*   **The Ghost Border Fallback:** If a container sits on a background of the same color, use a 1px border of `outline-variant` at **15% opacity**. Never use a 100% opaque border.

---

## 5. Components

### Navigation Sidebar (The Anchor)
*   **Background:** `#0B0F19` (Inverse Surface).
*   **Interaction:** Active states use a "Luminous Tab"—a 3px vertical pill of `primary` (#006a2d) on the left edge, with the menu item text shifting to `inverse_primary`.
*   **Profile Section:** Anchored to the bottom, separated by a subtle `surface-variant` (at 10% opacity) "Ghost Border" top edge.

### Topbar Action Sequence
*   **Notification Bell:** Ghost style (no container), `on-surface-variant` color.
*   **Documentation:** Outline style using `outline` token. Border-radius `md` (0.375rem).
*   **Primary Button:** Solid `primary` container. Apply the **Signature Gradient**.

### Forms & Inputs
*   **Inputs:** Use `surface-container-lowest`. No borders. Use a bottom-only stroke of `outline-variant` (2px) that transforms into a `primary` stroke on focus.
*   **Spacing:** Use `spacing-4` (1rem) for internal padding and `spacing-6` (1.5rem) between form fields.

### Cards & Data Lists
*   **Rule:** Forbid divider lines. Use `spacing-2` (0.5rem) of vertical white space to separate list items.
*   **Selection:** Hovering over a list item should trigger a shift to `surface-container-high`, creating a "soft-lift" effect.

---

## 6. Do’s and Don'ts

### Do
*   **Do** use `display-lg` for empty state headers to make the void feel intentional and designed.
*   **Do** allow the sidebar to be the only dark element on the screen to maintain the "Command Center" feel.
*   **Do** use `rounded-xl` (0.75rem) for large containers to soften the technical edge of the data.

### Don’t
*   **Don't** use pure black (#000) for text. Use `on-surface` (#2b2e3a) for high-end legibility.
*   **Don't** use traditional "Card-on-Grey" layouts. Keep the main background `surface` (#f6f6ff) and use white containers only for the highest level of interaction.
*   **Don't** use standard green for errors. Errors must strictly use the `error` (#b02500) tokens to ensure they are never confused with our `primary` brand green.