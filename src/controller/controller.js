import { renderPages, renderSongs,handlePage ,handleSong} from "../helper/helper.js";

let pageCurrent = 1;
const size = 6;
await renderSongs(pageCurrent, size);
handleSong();
renderPages();
handlePage(size);

