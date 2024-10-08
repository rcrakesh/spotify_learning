let currentsong = new Audio();
let songs
let currentfolder


function secondsToMinuteSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "Invalid input";
    }
    // Calculate minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Pad with leading zeros if needed
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // Return the formatted time as minutes:seconds
    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getsongs(folder) {
    currentfolder = folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")


    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    //show all the songs
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + ` <li>
                             <img class="invert" src="music.svg" alt="music">
                             <div class="info">
                                 <div>${song.replaceAll("%20", " ")}</div>
                             
                             </div>
                             <img class="invert" src="play.svg" alt="playb">
 
                         </li>`;

    }


    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(li => {
        li.addEventListener("click", event => {
            // 'li' refers to the clicked list item, while 'event' is the event object
            const infoElement = li.querySelector(".info").firstElementChild;

            if (infoElement) {
                // Log and pass the text to playMusic after trimming whitespace
                console.log(infoElement.innerHTML);
                playMusic(infoElement.innerHTML.trim());
            } else {
                console.error("No .info element found!");
            }
        });
    });



}
const playMusic = (track, pause = false) => {
    // let audio = new Audio("/spotify_project/songs/" + track)
    currentsong.src = `/${currentfolder}/` + track
    if (!pause) {
        currentsong.play()
        play.src = "pause.svg"
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main() {

    await getsongs("songs/cs")
    console.log(songs)
    playMusic(songs[0], true)


    // display all the album songs 


    // play and pause
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "pause.svg"
        } else {
            currentsong.pause()
            play.src = "play.svg"
        }
    })

    // time update eventreq.accepts(types);
    currentsong.addEventListener("timeupdate", () => {
        console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".songtime").innerHTML = `${
        secondsToMinuteSeconds(currentsong.currentTime)} / ${secondsToMinuteSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })


    // add seebar eventlistener
    document.querySelector(".seekbar").addEventListener("click", e => {
            let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
            document.querySelector(".circle").style.left = percent + "%";
            currentsong.currentTime = ((currentsong.duration) * percent) / 100
        })
        //add event listerer for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
            document.querySelector(".left").style.left = "0";
        })
        // close button
    document.querySelector(".close").addEventListener("click", () => {
            document.querySelector(".left").style.left = "-120%";

        })
        //add an event listener previous song
    previous.addEventListener("click", () => {
            console.log("previous clicked")
            console.log("currentsong")
            let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
            if ((index - 1) >= 0) {
                playMusic(songs[index - 1])
            }
        })
        //     // for next song
        // next.addEventListener("click", () => {
        //         currentsong.pause()
        //         console.log("next clicked")


    //         let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    //         if ((index + 1) >= 0) {
    //             playMusic(songs[index + 1])
    //         }
    //     })

    next.addEventListener("click", () => {
        currentsong.pause(); // Pause the current song
        console.log("next clicked");

        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);

        // Check if the next song exists
        if (index + 1 < songs.length) {
            // If there is a next song, play it
            playMusic(songs[index + 1]);
        } else {
            // If it's the last song, loop back to the first song
            playMusic(songs[0]);
        }
    });

    // // click on the card and open the left bar
    // document.querySelectorAll(".card").forEach(card => {
    //     card.addEventListener("click", e => {


    //     });
    // });




    // volume button;
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
            console.log(e, e.target, e.target.value)
            currentsong.volume = parseInt(e.target.value) / 100;
        })
        //mute butttonreq.accepts(
    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        } else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentsong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })

    // load dynamic card
    Array.from(document.getElementsByClassName("card")).forEach(e => {
            e.addEventListener("click", async item => {
                songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)

            })
        })
        //     // to open the toggle part of hamburger
        // document.querySelector(".card").forEach(e => {
        //     e.addEventListener("click", async item => {
        //         document.querySelector(".left").style.left = "0";

    //     })
    // })

    // document.querySelector(".hamburger").addEventListener("click", () => {
    //     document.querySelector(".left").style.left = "0";


    // event listenerreq.accepts(types);
    // Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
    //     e.addEventListener("click", e => {
    //         console.log(e.querySelector(".info").firstElementChild.innerHTML)
    //         playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    //     })


    // });
    //     var audio = new Audio(songs[0]);
    //     audio.play();
}
main()