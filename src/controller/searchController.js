import { getSongByName, handleSong, renderSongsList } from "../helper/helper.js";
import { MusicApp } from "../model/musicApp.js";
const btnSearch = document.querySelector(".btn-search");
const input = document.querySelector("input");
const handerSearch = async () => {
    if (input.value === "") {
        return;
    }
    await getSongByName(input.value);
    renderSongsList(MusicApp.searchResults.data);
    handleSong();
    renderPages();
    handlePage(size);
}


btnSearch.addEventListener("click",await handerSearch)

input.addEventListener("keypress",async e => {
    if (e.key === "Enter") {
        await handerSearch();
    }
})

