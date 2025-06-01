const inputTextEle = document.querySelector(".input");
const outputTextEle = document.querySelector(".output");
const romanjiLink = document.getElementById("romanjiLink");
const speakButton = document.getElementById("speak-button");

document.getElementById("translate-button").addEventListener("click", translate);
document.getElementById("clear-button").addEventListener("click", clear);
speakButton.addEventListener("click", () => {
  const text = outputTextEle.value;
  speakJapanese(text);
});

function translate() {
  const inputText = inputTextEle.value.trim();
  const sourceLanguage = document.querySelector("#source-languages").value;
  const targetLanguage = document.querySelector("#target-languages").value;

  if (!inputText) {
    alert("Please enter some text.");
    return;
  }

  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLanguage}&tl=${targetLanguage}&dt=t&q=${encodeURI(inputText)}`;

  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      const responseReturned = JSON.parse(this.responseText);
      const translations = responseReturned[0].map((text) => text[0]);
      const outputText = translations.join(" ");

      outputTextEle.textContent = outputText;

      // Set Google Translate Romanji Link
      romanjiLink.href = `https://translate.google.com/?sl=ja&tl=en&text=${encodeURIComponent(outputText)}&op=translate`;
      romanjiLink.style.display = "inline-block";
    }
  };
  xhttp.open("GET", url);
  xhttp.send();
}

function clear() {
  inputTextEle.value = "";
  outputTextEle.textContent = "";
  romanjiLink.href = "#";
  romanjiLink.style.display = "none";
}

function speakJapanese(text) {
  if (!text) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ja-JP';
  speechSynthesis.speak(utterance);
}
