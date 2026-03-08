/**
 * Serving size scaler for recipe pages.
 * Reads data-base-qty attributes on ingredient quantity spans,
 * and updates them when the yield input changes.
 */
(function () {
  "use strict";

  const FRACTIONS = [
    { decimal: 0.25, display: "¼" },
    { decimal: 1 / 3, display: "⅓" },
    { decimal: 0.5, display: "½" },
    { decimal: 2 / 3, display: "⅔" },
    { decimal: 0.75, display: "¾" },
  ];

  function formatQty(num) {
    if (num === 0) return "0";

    const whole = Math.floor(num);
    const frac = num - whole;

    // Check fractional part against common fractions (within 0.02 tolerance)
    for (const { decimal, display } of FRACTIONS) {
      if (Math.abs(frac - decimal) < 0.02) {
        return whole > 0 ? `${whole} ${display}` : display;
      }
    }

    // If very close to a whole number
    if (Math.abs(frac) < 0.02) return String(whole);
    if (Math.abs(frac - 1) < 0.02) return String(whole + 1);

    // Otherwise round to 2 decimal places and strip trailing zeros
    return parseFloat(num.toFixed(2)).toString();
  }

  function scaleIngredients(ratio) {
    document.querySelectorAll("[data-base-qty]").forEach((el) => {
      const base = parseFloat(el.dataset.baseQty);
      if (isNaN(base)) return;
      el.textContent = formatQty(base * ratio);
    });
  }

  function init() {
    const input = document.getElementById("yield-input");
    if (!input) return;

    const baseYield = parseFloat(input.dataset.baseYield);
    if (isNaN(baseYield) || baseYield === 0) return;

    input.addEventListener("input", function () {
      const newYield = parseFloat(this.value);
      if (isNaN(newYield) || newYield <= 0) return;
      scaleIngredients(newYield / baseYield);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
