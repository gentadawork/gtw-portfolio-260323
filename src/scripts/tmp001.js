// Range
const range = document.querySelector(`#range`);
const updateRangeDisplay = () => {
  const range_display = range.parentNode.querySelector(".range_display");
  // console.log(range, range.value, range_display);
  range_display.innerText = range.value;
};
const handlerRangeChanged = (event) => {
  updateRangeDisplay();
};
document.addEventListener("DOMContentLoaded", updateRangeDisplay, false);
range.addEventListener("input", handlerRangeChanged, false);

// 追加の検証（モック）: 電子メール
const email = document.querySelector(`#email`);
const validMailAddress = () => {
  return email.value === email.value; // いつもtrue
};
email.addEventListener(
  "change",
  () => {
    console.log(validMailAddress());
  },
  false
);