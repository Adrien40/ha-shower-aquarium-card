import { css } from "lit";

export const cardStyles = css`
  :host {
    display: block;
    width: 100%;
    box-sizing: border-box;
  }
  ha-card {
    padding: 4px 6px;
    background: var(--card-background-color, #ffffff);
    border-radius: var(--ha-card-border-radius, 12px);
    box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0, 0, 0, 0.1));
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }
  :host([fullscreen]) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    z-index: 1;
  }
  :host([fullscreen]) ha-card {
    padding: 0;
    margin: 0;
    border-radius: 0;
    box-shadow: none;
    height: 100%;
    width: 100%;
    border: none;
    background: transparent;
    justify-content: center;
    align-items: center;
  }
  .card-header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 4px;
    padding: 0 4px;
  }
  .card-title {
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--primary-text-color, #1f2937);
  }
  .aquarium-container {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  :host([fullscreen]) .aquarium-container {
    width: 100%;
    height: 100%;
    flex: 1;
    max-width: 100%;
    padding: 0;
    margin: 0;
  }
  svg {
    display: block;
    width: 100%;
    height: auto;
    max-height: calc(100vh - 100px);
    cursor: pointer;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
  }
  :host([fullscreen]) svg {
    width: 100%;
    height: 100%;
    max-height: 100%;
    aspect-ratio: auto !important;
  }
  /* Keyboard and screen reader access to feeding and knocking. The buttons are
     invisible at rest and appear over the tank as soon as the keyboard focus
     enters the group, so a sighted keyboard user sees what they are pressing. */
  .keyboard-actions {
    position: absolute;
    top: 8px;
    left: 8px;
    z-index: 2;
    display: flex;
    gap: 8px;
  }
  .kb-button {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
    opacity: 0;
  }
  .keyboard-actions:focus-within .kb-button {
    position: static;
    width: auto;
    height: auto;
    margin: 0;
    padding: 6px 14px;
    overflow: visible;
    clip-path: none;
    opacity: 1;
    border: 2px solid var(--primary-color, #0284c7);
    border-radius: 18px;
    background: var(--card-background-color, #ffffff);
    color: var(--primary-text-color, #111827);
    font: inherit;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
  }
  .keyboard-actions:focus-within .kb-button:focus-visible {
    outline: 3px solid var(--primary-color, #0284c7);
    outline-offset: 2px;
  }
  .keyboard-actions:focus-within .kb-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  /* Text for screen readers only. */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
  }
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(75px, 1fr));
    gap: 6px;
    margin-top: 6px;
    text-align: center;
  }
  .metric-box {
    background-color: var(--secondary-background-color, #f3f4f6);
    padding: 6px 4px;
    border-radius: 8px;
  }
  .metric-value {
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--primary-text-color, #111827);
  }
  .metric-unit {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--secondary-text-color, #6b7280);
  }
  .metric-label {
    font-size: 0.75rem;
    color: var(--secondary-text-color, #6b7280);
    margin-top: 1px;
  }
`;
