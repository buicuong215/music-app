import { MusicApp } from "../model/musicApp.js";


const playMusic = document.querySelector(".bottom-play");
const btnShow = document.querySelector(".btn-show");
btnShow.addEventListener("click", e => {
  playMusic.classList.remove("opacity");
  btnShow.classList.add("opacity");
});


const getJson = async url => {
  try {
    const res = await fetch(url);
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};


const getAllSongs = async (page, size) => {
  const data = await getJson(`https://api-mhmusic.herokuapp.com/song?page_size=${size}&page_index=${page}`);
    MusicApp.songs = data.data;
};

export const getSongById = async id => {
  const data = await getJson(`https://api-mhmusic.herokuapp.com/song/${id}`);
  MusicApp.song = data.data;
};


export const renderSongs = async (page,size) => {
  await getAllSongs(page, size);
  const songContainer = document.querySelector(".song-container");

  if (MusicApp.songs.data.length === 0) {
    return;
  }
  const songsHtml = MusicApp.songs.data
    .map(song => {
      return ` <a class="song song-hidden" data-id=${song.id}>
                        <img src=${song.image} alt=${song.name}>
                        <p>${song.name}</p>                     
                    </a>`;
    })
    .join("");

    songContainer.innerHTML = songsHtml;
    animation();

};


export const handleSong = () => {
     const songs = document.querySelectorAll(".song");
    songs.forEach(song => {
      song.addEventListener("click", async e => {
        const id = song.dataset.id;
        btnShow.classList.add("opacity");
        await getSongById(id);
        renderSongsPlay();
      });
    });
}

const renderSongsPlay = () => {
  playMusic.innerHTML = ` <div class="infor">
            <img src=${MusicApp.song.image} alt=${MusicApp.song.name} />
            <div class="text">
            <p>${MusicApp.song.name}</p>
            <p>${MusicApp.song.singer.fullName}</p>
 </div>
        </div>
        <div>
        <audio controls autoplay>
          <source src=${MusicApp.song.url} type="audio/ogg" />
        </audio>
        </div>
        <div>
           <button class="btn-hidden"><ion-icon name="close-outline"></ion-icon></button>
           </div>`;

  playMusic.classList.remove("opacity");

  document.querySelector(".btn-hidden").addEventListener("click", e => {
    playMusic.classList.add("opacity");
    btnShow.style.backgroundImage = `url(${MusicApp.song.image})`;
    btnShow.classList.remove("opacity");
  });
};





export const renderPages = () => {
    console.log(MusicApp.songs);
    const pages = MusicApp.songs.total_pages;
    const pageCurrent = MusicApp.songs.current_page;
    let linkPage = "";
    for (let i = 1; i <= pages; i++){
        if (i === 1) {
            linkPage += `<span class="page page-current" data-page=${i}>${i}</span>`
            continue;
        }
         linkPage += `<span class="page" data-page=${i}>${i}</span>`;
    }
    document.querySelector(".pages").innerHTML = linkPage;
    
}





export const handlePage = (size) => {
    const pages = document.querySelectorAll(".page");
    
    pages.forEach((page) => {
        page.addEventListener("click", async(e) => {
            const pageCurrent = page.dataset.page;
            await renderSongs(pageCurrent, size);
            handleSong();
            pages.forEach(page => {
                page.classList.remove("page-current");
            });
            page.classList.add("page-current");
        })
    })
}

export const getSongByName = async (name) => {
   const data = await getJson(`https://api-mhmusic.herokuapp.com/song?name=${name}`);
    MusicApp.searchResults = data.data;
};

export const renderSongsList = (list) => {
     const songContainer = document.querySelector(".song-container");

     if (list.length === 0) {
         songContainer.innerHTML = `<h1 class="not-found">Not Found!</h1>`;
         return;
     }
     const songsHtml = list
       .map(song => {
         return ` <a class="song song-hidden" data-id=${song.id}>
                        <img src=${song.image} alt=${song.name}>
                        <p>${song.name}</p>                     
                    </a>`;
       })
       .join("");

    songContainer.innerHTML = songsHtml;
    animation();
}


const animation = () => {
 
    const songContainer = document.querySelector(".song-container");
  const obsCallback = function (entries, observer) {
    entries.forEach(e => {
      if (e.isIntersecting === true) {
        document.querySelectorAll(".song").forEach((e, i) => {
          e.classList.remove("song-hidden");
          e.style.transition = `${(i + 1) * 0.5}s`;
        });
      }
    });
  };

  const obsOptions = {
    root: null,
    threshold: 0.1,
  };

  const observer = new IntersectionObserver(obsCallback, obsOptions);
  observer.observe(songContainer);
};
