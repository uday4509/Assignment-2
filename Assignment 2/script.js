function searchWord() {
  const word = document.getElementById('wordInput').value.trim();
  const resultBox = document.getElementById('result');
  resultBox.innerHTML = "<p>Loading...</p>";

  if (!word) {
    resultBox.innerHTML = "<p>Please enter a word.</p>";
    return;
  }

  //  DictionaryAPI.dev
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then(res => res.json())
    .then(data => {
      if (!Array.isArray(data)) {
        resultBox.innerHTML = `<p>No definition found for "${word}".</p>`;
        return;
      }

      const definition = data[0].meanings[0].definitions[0].definition;
      const partOfSpeech = data[0].meanings[0].partOfSpeech;
      const example = data[0].meanings[0].definitions[0].example || "No example available.";

      // Datamuse
      fetch(`https://api.datamuse.com/words?rel_syn=${word}`)
        .then(res => res.json())
        .then(synonymsData => {
          const synonyms = synonymsData.slice(0, 5).map(item => item.word).join(", ") || "None";

          // Datamuse
          fetch(`https://api.datamuse.com/words?rel_rhy=${word}`)
            .then(res => res.json())
            .then(rhymeData => {
              const rhymes = rhymeData.slice(0, 5).map(item => item.word).join(", ") || "None";

              resultBox.innerHTML = `
                <h2>${word}</h2>
                <p><strong>Part of Speech:</strong> ${partOfSpeech}</p>
                <p><strong>Definition:</strong> ${definition}</p>
                <p><strong>Example:</strong> ${example}</p>
                <p><strong>Synonyms:</strong> ${synonyms}</p>
                <p><strong>Rhymes:</strong> ${rhymes}</p>
              `;
            })
            .catch(() => {
              resultBox.innerHTML += `<p><strong>Rhymes:</strong> Error fetching rhymes.</p>`;
            });
        })
        .catch(() => {
          resultBox.innerHTML += `<p><strong>Synonyms:</strong> Error fetching synonyms.</p>`;
        });
    })
    .catch(() => {
      resultBox.innerHTML = "<p>Error fetching definition.</p>";
    });
}

//  Toggle
function toggleTheme() {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

// Font Change
function changeFont(font) {
  document.body.style.fontFamily = font;
}

// Page Load
window.onload = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    const toggle = document.getElementById("darkModeToggle");
    if (toggle) toggle.checked = true;
  }
};
function speakWord(word) {
  if (!word) return;
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = 'en-US'; // Or 'en-GB'
  speechSynthesis.speak(utterance);
}

