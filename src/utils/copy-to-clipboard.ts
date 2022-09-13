/* eslint-disable import/prefer-default-export */
export const copyToClipboard = (text: string) => {
  if (navigator?.clipboard?.writeText) {
    navigator.clipboard.writeText(text);
  } else {
    const textField = document.createElement('textarea');

    document.body.appendChild(textField);

    textField.innerText = text;
    textField.select();

    document.execCommand('copy');

    textField.remove();
  }
};
