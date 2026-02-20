import { toast } from "react-toastify";

export function loadData(callback) {
       fetch("https://api.jsonbin.io/v3/b/699727c5ae596e708f379737", {
              method: "GET",
              headers: {
                     "X-Master-Key": "$2a$10$IGp4PqCfg92WldTUE5P75eYzZXa3gPh3sTmi1Bom1R5QGueyxX4nO"
              }
       })
              .then(e => e.json())
              .then(callback)
              .catch(e => {
                     toast.error("خطا در دریافت اطلاعات", {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            theme: "light"
                     });
              })
}
export function saveData(callback, newData) {
       fetch("https://api.jsonbin.io/v3/b/699727c5ae596e708f379737", {
              method: "PUT",
              headers: {
                     "Content-Type": "application/json",
                     "X-Bin-Versioning": "false", // false = overwrite
                     "X-Master-Key": "$2a$10$IGp4PqCfg92WldTUE5P75eYzZXa3gPh3sTmi1Bom1R5QGueyxX4nO"
              },
              body: JSON.stringify(newData)
       })
              .then(e => e.json())
              .then(callback)
              .catch(e => {
                     console.log(e)
                     toast.error("خطا در ثبت اطلاعات", {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            theme: "light"
                     });
              })
}