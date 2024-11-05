import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
  databaseURL: "https://watched-movie-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const watchedMoviesInDB = ref(database, "watchedMovies")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const wishListEl = document.getElementById("wish-list")

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    
    if (inputValue) {
        push(watchedMoviesInDB, inputValue)
        clearInputFieldEl()
    }
})

onValue(watchedMoviesInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        clearWishListEl()
        
        itemsArray.forEach(item => appendItemToWishListEl(item))
    } else {
        wishListEl.innerHTML = "<p class='text-center text-gray-500'>Немає фільмів... поки що</p>"
    }
})

function clearWishListEl() {
    wishListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendItemToWishListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    let checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.className = "mr-3 h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
    
    newEl.className = "flex items-center bg-gray-50 p-3 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 transition duration-200"
    newEl.appendChild(checkbox)
    newEl.appendChild(document.createTextNode(itemValue))
    
    checkbox.addEventListener("change", function() {
        if (checkbox.checked) {
            newEl.classList.add("fade-out")
            
            setTimeout(() => {
                let exactLocationOfItemInDB = ref(database, `watchedMovies/${itemID}`)
                remove(exactLocationOfItemInDB)
            }, 500) 
        }
    })
    
    wishListEl.append(newEl)
}
