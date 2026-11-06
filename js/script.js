const searchForm = document.getElementById("search-form")
const searchInput = document.getElementById("search-input")
const word = document.getElementById("word")
const pronunciation = document.getElementById("pronunciation")
const partOfSpeech = document.getElementById("part-of-speech")
const meaningText = document.getElementById("meaning-text")
const exampleText = document.getElementById("example-text")
const synonymsText = document.getElementById("synonyms-text")
const pronunciationAudio = document.getElementById("pronunciation-audio")
const message = document.getElementById("message")

const addFavouriteButton = document.getElementById("add-favourite");
const favouriteList = document.getElementById("favourite-list");

let currentWord = "";
async function searchDictionary(searchedWord) {
    const API_URL = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(searchedWord)}`;

    try {
        const response = await fetch(API_URL)
        if (!response.ok) {
            throw new Error("word not found!")
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error.message)
        return null;
    }
}

function displayResult(data) {
    
    const result = data[0];
    currentWord = result.word;
    word.textContent = result.word;
    pronunciation.textContent =
        "Pronunciation: " + (result.phonetic || "Not available");
    const audioFile = result.phonetics.find(
        phonetic => phonetic.audio && phonetic.audio.trim() !== ""
    );
    if (audioFile){
        pronunciationAudio.src = audioFile.audio;
        pronunciationAudio.hidden = false;
    } else {
        pronunciationAudio.hidden = true
        pronunciationAudio.removeAttribute('src');

        pronunciationAudio.load();
    }
    const meaning = result.meanings[0];
    partOfSpeech.textContent = meaning.partOfSpeech;
    const definition = meaning.definitions[0];
    meaningText.textContent = definition.definition;
    exampleText.textContent =
        definition.example || "No example available.";
    const synonyms = meaning.synonyms || [];

    synonymsText.textContent =
        synonyms.length > 0
            ? synonyms.join(", ")
            : "No synonyms available.";
}

searchForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const searchedword = searchInput.value.trim();

    if (searchedword === "") {
        message.textContent = "Please enter a word";
        return;
    }
    message.textContent = "Searching...";

    const data = await searchDictionary(searchedword);

    if (data === null) {
        message.textContent = "Word not found. Try another word.";
        return;
    }

    displayResult(data);
    message.textContent = "";
})

let favourites = JSON.parse(localStorage.getItem("favourites")) || [];

function displayFavourites(){
    favouriteList.innerHTML = "";

    favourites.forEach(function(favourite){
        const listItem = document.createElement("li");
        listItem.textContent = favourite + " ";

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";

        removeButton.addEventListener("Click", function(){
            favourites = favourites.filter(
                word => word !== favourite
            );
            localStorage.setItem(
                "favourites",
                JSON.stringify(favourites)
            );
            displayFavourites();
        });
        listItem.appendChild(removeButton);
        favouriteList.appendChild(listItem);
    })
}
// Add current word to favourite

addFavouriteButton.addEventListener("click", function(){
    if(currentWord === ""){
        return;
    }
    const alreadySaved = favourites.some(
        favourites => favourites.toLowerCase() === currentWord.toLowerCase()
    );
    if (alreadySaved){
        alert("This word is already in your favourites!");
        return;
    }
    favourites.push(currentWord);

    localStorage.setItem(
        "favourites",
        JSON.stringify(favourites)
    );
    displayFavourites();
    alert("Word added to favourites!");

})
displayFavourites();