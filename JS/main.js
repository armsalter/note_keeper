// ! Ay dizisi
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
// ! HTML den JS e çekilen elemanlar
const addBox = document.querySelector(".add-box");
const popupBox = document.querySelector(".popup-box");
const popup = document.querySelector(".popup");
const closeBtn = document.querySelector("header i");
const form = document.querySelector("form");
const wrapper = document.querySelector(".wrapper");
const popupTitle = document.querySelector("#popup-title");
const popupBtn = document.querySelector("#form-btn");

// console.log(popupTitle);
// console.log(popupBtn);
// console.log(addBox);
// console.log(closeBtn);
// ! Global Scopa sahip değişkenler
let notes = JSON.parse(localStorage.getItem("notes")) || [];
let isUpdate = false; // Güncelleme Modunda mı?
let updateId = null; // Güncellenecek elemanın id si
// Sayfa yüklendiği anda render fonksiyonunu çalıştır
document.addEventListener("DOMContentLoaded", renderNotes(notes));
// Note içerisindeki menüyü aktif edecek fonksiyon.
// function showMenu (item){
// console.log(item); bu kapsama çıkarmadı O yüzden şunu yapmak gerekecek
// }
// ? Bir HTML elmanının kapsayıcısına erişmek için 2 yöntem var,1.si parentElement metodudur, 2. si de closest metodudur.
//Note içerisinde Menuyü aktif edecek fonksiyon
function showMenu(item) {
  // console.log(item.parentElement);// sonrasında console.log u kaldırıp cons yazıyoruz
  const parentElement = item.parentElement;
  // parentElement e bir show classı ekle,Bunu nasıl yapıyoruz
  parentElement.classList.add("show");

  // Aktif edilen menuyu pasife çek, bunu nasıl yaparız
  document.addEventListener("click", (e) => {
    if (e.target.tagName != "I" || e.target != item) {
      parentElement.classList.remove("show");
    }
  });
}
//Note elemanını silecek fonksiyon
function deleteNote(item) {
  // console.log(`Delete Note`);
  const response = confirm("Bu notu silmek istediğinizden eminmisiniz?");
  // Eğer silme işlemi onaylandıysa
  if (response) {
    // ! console.log(item.parentElement.parentElement.parentElement.parentElement); Bu şekile kapsayıcıya ulaşmak verimli değil.Bunun yerine
    //! closest metodu kullanılabilir.
    // tıklanılan delete-icon nun kapsayıcısına eriş
    const noteItem = item.closest(".note");
    // noteItem in id sine eriş
    const noteId = Number(noteItem.dataset.id); // number yerine parseInt de kullanılabilir.
    // console.log(typeof noteId);
    // id si bilene notu , notes dizisinden kaldır.
    notes = notes.filter((note) => note.id != noteId); // id si buradaki noteId ye eşit olmayanları döndür demektir.
    // console.log(notes)
    // Güncel not dizisine göre localstorage ı güncelle

    localStorage.setItem("notes", JSON.stringify(notes));

    // Notes dizisinin final hallerine göre note ları render et.

    renderNotes(notes);
  }
}
// Note elmanını güncelleyecek fonksiyon
function editNote(item) {
  // console.log(item.closest(".note"));
  // tıklanılan note a eriş
  const note = item.closest(".note");
  // note un id sine eriş
  const noteId = parseInt(note.dataset.id);
  //console.log(noteId); // bu gelen değer stringdir aslında o yüzden parceInt kullandık( siyah yada beyaz renk olursa string olduğunu anlıyoruz.)

  // id si bilinen notu not dizisinden bul

  const foundedNote = notes.find((note) => note.id == noteId);
 // console.log(foundedNote);

  // popup ı aktif et
  // popup ın class listesine show u ekle
  popupBox.classList.add("show");
  popup.classList.add("show");
  document.body.style.overflow = "hidden";

  // form içerisindeki elemanlara note değerini ata
  form[0].value = foundedNote.title;
  form[1].value = foundedNote.description;
  // Güncelleme Modu için gerekli değişkenlere atama yap
  isUpdate = true;
  updateId = noteId;

  // popup içerisindeki title ve buton içeriklerini güncelle
  popupTitle.textContent = "Update Note";
  popupBtn.textContent = "Update";
}

// wrapper elemanına bir olay tanımla
wrapper.addEventListener("click", (e) => {
  // hangi elemana tıklandı, ... elamanına tıklandıysa menüyü aktif et  //console.log(e.target);
  if (e.target.classList.contains("bx-dots-horizontal-rounded")) {
    // Note ile alakalı yönetimi sağlayan menü yü aktif et.
    //console.log(`... noktaya tıklandı.`)
    showMenu(e.target);
  }
  // delete-icon classına sahip elemana tıklandıysa
  else if (e.target.classList.contains("delete-icon")) {
    //console.log(`silme butonuna tıklandı`);
    deleteNote(e.target);
  }
  // edit icon classına sahip elemana tıklandıysa
  else if (e.target.classList.contains("edit-icon")) {
    // console.log(`Edit icona tıklandı`);
    editNote(e.target);
  }
});

// Popup ı aktif etmek için addBox a olay tanımla
addBox.addEventListener("click", () => {
  // popup ın class listesine show u ekle
  popupBox.classList.add("show");
  popup.classList.add("show");
  document.body.style.overflow = "hidden";
});
// popup ı pasif etmek için closeBtn ye olay tanımla
closeBtn.addEventListener("click", () => {
  // popup ın class listesinden show u kaldır
  popupBox.classList.remove("show");
  popup.classList.remove("show");
  document.body.style.overflow = "auto";

  // popup kapatıldığında form içerisini temizle
  form.reset();
  // popup ı eski haline çevir.
  popupTitle.textContent = "New Note";
  popupBtn.textContent = "Add";
  isUpdate = false;
  updateId = null;
});

// ! SUBMIT GÖNDERME OLAYI

form.addEventListener("submit", (e) => {
  // form gönderildiğinde default özellik olarak sayfa yenilenir, bunu engellemek için preventDefault() metodu kullanılır
  e.preventDefault();
  // title ve desciption a erişme
  const titleInput = e.target[0];
  const discriptionInput = e.target[1];
  // title ve description değerlerine erişme
  const title = titleInput.value;
  const description = discriptionInput.value;

  // console.log(title);
  // console.log(description);
  if (!title || !description) {
    alert(`Title ve Description kısımları boş bırakılamaz`);
    return; //Kullanıcıya uyarı verildiyse fonksiyonu durdur.
  }
  // todo : Formun gönderilmesi sonucunda elde edilen verilerle Note elemanı oluşturulacak.
  // console.log(`Form gönderildi`)

  //Title
  //description    Bunların hepsi bir elemanda olacak biz hangi veri tipi
  //Date           ile bunu yönetebiliriz, Tabiki  "OBJE" olmalıdır.
  //İd
  // Note un gönderildiği güncel tarih verisine erişim New Date()

  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth(); // + 1 demeye gerek kalmadı yukarda tanımladığımız months dizisinden dolayı
  const updateMonth = months[month];
  const year = date.getFullYear();
  const id = date.getTime();

  // ! Popup güncelleme modunda mı? Ekleme modundamı?
  if (isUpdate) {
    // console.log(`Güncelleme Yapılacak`)
    // notes dizisi içerisinde güncellenecek elemanın sırasını bul
    const updateIndex = notes.findIndex((note) => note.id == updateId);

    // bulunan index deki elemanı notes dizisi içerisinde güncelle
    notes[updateIndex] = {
      title, // title : title yerine yazıldı
      description, //description : description yerine yazıldı
      date: `${updateMonth}${day},${year}`,
      id,
    };
    // popup ı eski haline çevir.
    popupTitle.textContent = "New Note";
    popupBtn.textContent = "Add";
    isUpdate = false;
    updateId = null;
  } else {
    let noteItem = {
      title, // title : title yerine yazıldı
      description, //description : description yerine yazıldı
      date: `${updateMonth}${day},${year}`,
      id,
    };
    // Formun gönderilmesi ile oluşturulan noteItem i note dizisine ekle
    notes.push(noteItem);
  }

  // ? Bu note elemanını oluşturduk , şimdi bu note elemanını bir arada tutmamız lazım, sayfayı yenilediğimizde de bunu katbetmememiz gerekiyor.Bunun için JS de yenilemede verileri kaybetmemek için localstorage den yararlanılır.
  // Notes dizisini local storage a kayıt yap
  localStorage.setItem("notes", JSON.stringify(notes)); //(localstorage.setItem eleman gönderir)(JS bizden string olarak istiyor o yüzden JSON.stringfy() metodu kullandık)

  // ? formu temizle
  // Bu 1. Metod du  titleInput.value = "";
  //                 discriptionInput.value = "";
  // 2. Metod aşağıdaki form.reset() metodu
  form.reset();
  // ? popup ı pasife çek
  popupBox.classList.remove("show");
  popup.classList.remove("show");
  document.body.style.overflow = "auto";
  // note ları renderlamak için renderNotes fonksiyonu çalıştır.
  renderNotes(notes);
});

// console.log(date);
// console.log(day);
// console.log(month);
// console.log(year);
//console.log(id);
// ? notları Arayüze RENDER edecek fonksiyon
function renderNotes(notes) {
  // Bu fonksiyon notes dizisinde yer alan her note elemanı için bir arayüz elemanı render et(işle)
  // ! renderNotes fonksiyonu her çalıştığında her seferinde önceden eklenen notları tekrar render ediyor bu durumu düzeltmek için her rendernotes fonksiyonu çalıştığında .note clasına sahip tüm elemanları kaldır.
  document.querySelectorAll(".note").forEach((noteItem) => noteItem.remove());
  // Bir arayüzü elemanını ekrandan kaldırmak için remove metodu kullanılır.Bu metod kaldırmak istenilen elemanın ardından .remove şeklinde kullanılır.
  notes.forEach((note) => {
    // console.log(note);
    // notes dizisi içindeki her eleman için bir note html i oluştur
    let noteHtml = `  <div class="note" data-id=${note.id}>
        <div class="details">
          <h2>${note.title}</h2>
          <p>${note.description}</p>
        </div>

        <div class="bottom">
          <p>${note.date}</p>

          <div class="settings">
            <i class="bx bx-dots-horizontal-rounded"></i>
            <ul class="menu">
              <li class="edit-icon"><i class="bx bx-edit"></i>Edit</li>
              <li class="delete-icon">
                <i class="bx bx-trash-alt"></i> Delete
              </li>
            </ul>
          </div>
        </div>
      </div>`;
    //     console.log(noteHtml);
    // Oluşturulan HTML elemanını ara yüze ekle,,inserAdjacentHTML metodu lullanılır.,hangi elemandan koyacaksak önce o eleman yazılır.
    addBox.insertAdjacentHTML("afterend", noteHtml);
  });
}
renderNotes(notes);
