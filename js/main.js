//! Input & Form Variables 
var fullNameInput = document.getElementById("fullName");
var phoneNumber = document.getElementById("phoneNumber");
var emailAddress = document.getElementById("emailAddress");
var address = document.getElementById("address");
var group = document.getElementById("group");
var notes = document.getElementById("notes");
var isFavorite = document.getElementById("isFavorite");
var isEmergency = document.getElementById("isEmergency");

//! Display & Layout Variables
var rowData = document.getElementById("rowData");
var totalContacts = document.getElementById("totalContacts");
var favoritesCount = document.getElementById("favoritesCount");
var emergencyCount = document.getElementById("emergencyCount");
var favoritesList = document.getElementById("favoritesList");
var emergencyList = document.getElementById("emergencyList");

//! Modal Control Variables
var addBtn = document.getElementById("saveContactBtn");
var updateBtn = document.getElementById("updateContactBtn");
var searchInput = document.getElementById("searchInput");

var currentIndex = 0;
var allContact = [];


if(localStorage.getItem("contacts")){
    allContact = JSON.parse(localStorage.getItem("contacts"));
    console.log(allContact);
    display();
}

display();

function saveContacts() {
    localStorage.setItem("contacts", JSON.stringify(allContact));
}

//! Add Contact Function 
function addContact() {
  if (fullNameInput.value.trim() === "" || phoneNumber.value.trim() === "") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please fill out the full name and phone number!"
    });
    return;
  }

  var newContact = {
    fullName: fullNameInput.value.trim(),
    phoneNumber: phoneNumber.value.trim(),
    email: emailAddress.value.trim(),
    address: address.value.trim(),
    group: group.value,
    notes: notes.value.trim(),
    isFavorite: isFavorite.checked,
    isEmergency: isEmergency.checked
  };

  allContact.push(newContact);
  saveContacts();

  closeModal();

  Swal.fire({
    title: "Added Successfully!",
    text: "Contact has been added to your list.",
    icon: "success"
  });

  reset();
  display();
}

//! Reset Function
function reset() {
  fullNameInput.value = '';
  phoneNumber.value = '';
  emailAddress.value = '';
  address.value = '';
  group.value = '';
  notes.value = '';
  isFavorite.checked = false;
  isEmergency.checked = false;

  fullNameInput.classList.remove('is-valid', 'is-invalid');

  if (addBtn && updateBtn) {
    addBtn.classList.remove('d-none');
    updateBtn.classList.add('d-none');
  }
}

//! Display Function
function display() {
  if (allContact.length === 0) {
    rowData.innerHTML = `
      <div class="col-12">
        <p class="alert alert-warning text-center text-danger mb-0">
          No contacts found
        </p>
      </div>`;

    totalContacts.innerHTML = "0";
    favoritesCount.innerHTML = "0";
    emergencyCount.innerHTML = "0";
    favoritesList.innerHTML =
      '<p class="text-center text-muted small mb-0 py-4">No favorites yet</p>';
    emergencyList.innerHTML =
      '<p class="text-center text-muted small mb-0 py-4">No emergency contacts</p>';
    return;
  }

  var box = "";
  var favTotal = 0;
  var emgTotal = 0;
  var favBox = "";
  var emgBox = "";

  for (var i = 0; i < allContact.length; i++) {
    var contact = allContact[i];

    // Initials Generator (First letter of first name + first letter of second name)
    var nameParts = contact.fullName
      ? contact.fullName.trim().split(" ")
      : ["?"];

    var initials =
      nameParts.length >= 2
        ? (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase()
        : nameParts[0].charAt(0).toUpperCase();

    // Favorites Sidebar
    if (contact.isFavorite) {
      favTotal++;

      favBox += `
        <div class="sidebar-contact-card">
          <div class="sidebar-contact-avatar" style="background:#3b82f6">
            ${initials}
          </div>
          <div class="sidebar-contact-info">
            <h5>${contact.fullName}</h5>
            <p>${contact.phoneNumber}</p>
          </div>
          <a href="tel:${contact.phoneNumber}" class="sidebar-call-btn favorites-call">
            <i class="fas fa-phone"></i>
          </a>
        </div>`;
    }

    // Emergency Sidebar
    if (contact.isEmergency) {
      emgTotal++;

      emgBox += `
        <div class="sidebar-contact-card">
          <div class="sidebar-contact-avatar" style="background:#ef4444">
            ${initials}
          </div>
          <div class="sidebar-contact-info">
            <h5>${contact.fullName}</h5>
            <p>${contact.phoneNumber}</p>
          </div>
          <a href="tel:${contact.phoneNumber}" class="sidebar-call-btn emergency-call">
            <i class="fas fa-phone"></i>
          </a>
        </div>`;
    }

    // Main Contact Card
    box += `
      <div class="col-md-6">
        <div class="contact-card">
          <div class="contact-header">
            <div class="contact-avatar bg-primary">
              ${initials}
              ${
                contact.isFavorite
                  ? '<span class="avatar-badge badge-favorite"><i class="fas fa-star"></i></span>'
                  : ""
              }
              ${
                contact.isEmergency
                  ? '<span class="avatar-badge badge-emergency"><i class="fas fa-heart-pulse"></i></span>'
                  : ""
              }
            </div>

            <div class="contact-info">
              <h4>${contact.fullName}</h4>
            </div>
          </div>

          <div class="contact-details">
            <div class="contact-detail phone">
              <i class="fas fa-phone"></i>
              <span>${contact.phoneNumber}</span>
            </div>

            <div class="contact-detail email">
              <i class="fas fa-envelope"></i>
              <span>${contact.email}</span>
            </div>

            <div class="contact-detail address">
              <i class="fas fa-map-marker-alt"></i>
              <span>${contact.address}</span>
            </div>
          </div>

          <div class="contact-tags">
            <span class="tag ${contact.group}">
              ${contact.group}
            </span>

            ${
              contact.isEmergency
                ? '<span class="tag emergency"><i class="fas fa-heartbeat"></i> Emergency</span>'
                : ""
            }

            ${
              contact.isFavorite
                ? '<span class="tag favorite bg-warning"><i class="fas fa-star"></i> Favorite</span>'
                : ""
            }
          </div>

          <div class="contact-actions">

            <a href="tel:${contact.phoneNumber}" class="contact-action call" title="Call">
              <i class="fas fa-phone"></i>
            </a>

            <a href="mailto:${contact.email}" class="contact-action email" title="Email">
              <i class="fas fa-envelope"></i>
            </a>

            <button onclick="toggleFav(${i})"
              class="contact-action favorite ${
                contact.isFavorite ? "active" : ""
              }"
              title="Favorite">
              <i class="fas fa-star"></i>
            </button>

            <button onclick="toggleEmg(${i})"
              class="contact-action emergency ${
                contact.isEmergency ? "active" : ""
              }"
              title="Emergency">
              <i class="fas fa-heart"></i>
            </button>

            <button
              class="contact-action"
              onclick="editData(${i})"
              data-bs-toggle="modal"
              data-bs-target="#addContactModal"
              title="Edit">
              <i class="fas fa-edit"></i>
            </button>

            <button
              class="contact-action delete"
              onclick="deleteContact(${i})"
              title="Delete">
              <i class="fas fa-trash"></i>
            </button>

          </div>
        </div>
      </div>`;
  }

  rowData.innerHTML = box;

  totalContacts.innerHTML = allContact.length;
  favoritesCount.innerHTML = favTotal;
  emergencyCount.innerHTML = emgTotal;

  favoritesList.innerHTML =
    favBox ||
    '<p class="text-center text-muted small mb-0 py-4">No favorites yet</p>';

  emergencyList.innerHTML =
    emgBox ||
    '<p class="text-center text-muted small mb-0 py-4">No emergency contacts</p>';
}

//! Delete Contact Function
function deleteContact(index) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      allContact.splice(index, 1);
      display();
      saveContacts();

      Swal.fire({
        title: "Deleted!",
        text: "Your contact has been deleted.",
        icon: "success"
      });
    }
  });
}

//! Edit & Update Functions
function editData(index) {
  fullNameInput.value = allContact[index].fullName;
  phoneNumber.value = allContact[index].phoneNumber;
  emailAddress.value = allContact[index].email;
  address.value = allContact[index].address;
  group.value = allContact[index].group;
  notes.value = allContact[index].notes;
  isFavorite.checked = allContact[index].isFavorite;
  isEmergency.checked = allContact[index].isEmergency;

  addBtn.classList.add('d-none');
  updateBtn.classList.remove('d-none');

  currentIndex = index;
}

function updateContact() {
  var newContact = {
    fullName: fullNameInput.value.trim(),
    phoneNumber: phoneNumber.value.trim(),
    email: emailAddress.value.trim(),
    address: address.value.trim(),
    group: group.value,
    notes: notes.value.trim(),
    isFavorite: isFavorite.checked,
    isEmergency: isEmergency.checked
  };

  allContact.splice(currentIndex, 1, newContact);
  closeModal();

  Swal.fire({
    title: "Updated Successfully!",
    text: "Contact information has been saved.",
    icon: "success"
  });

  display();
  saveContacts();
}

//! Toggle Functions
function toggleFav(index) {
  allContact[index].isFavorite = !allContact[index].isFavorite;
  display();
  saveContacts();
}

function toggleEmg(index) {
  allContact[index].isEmergency = !allContact[index].isEmergency;
  display();
  saveContacts();
}

//! Search Function
function search() {
  var text = searchInput.value.toLowerCase().trim();
  var box = '';

  for (var i = 0; i < allContact.length; i++) {
    var contact = allContact[i];
    if (
      contact.fullName.toLowerCase().includes(text) ||
      contact.email.toLowerCase().includes(text) ||
      contact.phoneNumber.toLowerCase().includes(text)
    ) {
      var firstName = contact.fullName.trim().split(" ")[0];
      var initials = (firstName.charAt(0) + firstName.charAt(1)).toUpperCase();

      box += `
      <div class="col-md-6">
        <div class="contact-card">
          <div class="contact-header">
            <div class="contact-avatar bg-primary">
              ${initials}
              ${contact.isFavorite ? '<span class="avatar-badge badge-favorite"><i class="fas fa-star"></i></span>' : ''}
              ${contact.isEmergency ? '<span class="avatar-badge badge-emergency"><i class="fas fa-heart-pulse"></i></span>' : ''}
            </div>
            <div class="contact-info">
              <h4>${contact.fullName}</h4>
            </div>
          </div>
          <div class="contact-details">
            <div class="contact-detail phone">
              <i class="fas fa-phone"></i>
              <span>${contact.phoneNumber}</span>
            </div>
            <div class="contact-detail email">
              <i class="fas fa-envelope"></i>
              <span>${contact.email}</span>
            </div>
            <div class="contact-detail address">
              <i class="fas fa-map-marker-alt"></i>
              <span>${contact.address}</span>
            </div>
          </div>
          <div class="contact-tags">
            <span class="tag ${contact.group}">${contact.group}</span>
            ${contact.isEmergency ? '<span class="tag emergency"><i class="fas fa-heartbeat"></i> Emergency</span>' : ''}
            ${contact.isFavorite ? '<span class="tag favorite bg-warning"><i class="fas fa-star"></i> Favorite</span>' : ''}
          </div>
          <div class="contact-actions">
            <a href="tel:${contact.phoneNumber}" class="contact-action call" title="Call">
              <i class="fas fa-phone"></i>
            </a>
            <a href="mailto:${contact.email}" class="contact-action email" title="Email">
              <i class="fas fa-envelope"></i>
            </a>
            <button onclick="toggleFav(${i})" class="contact-action favorite ${contact.isFavorite ? 'active' : ''}" title="Favorite">
              <i class="fas fa-star"></i>
            </button>
            <button onclick="toggleEmg(${i})" class="contact-action emergency ${contact.isEmergency ? 'active' : ''}" title="Emergency">
              <i class="fas fa-heart"></i>
            </button>
            <button class="contact-action" onclick="editData(${i})" data-bs-toggle="modal" data-bs-target="#addContactModal" title="Edit">
              <i class="fas fa-edit"></i>
            </button>
            <button class="contact-action delete" onclick="deleteContact(${i})" title="Delete">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>`;
    }
  }

  if (box === '') {
    rowData.innerHTML = `
      <div class="col-12">
        <p class="alert alert-danger text-center mb-0">
          No Contacts Available
        </p>
      </div>`;
  } else {
    rowData.innerHTML = box;
  }
}

if (searchInput) {
  searchInput.addEventListener("input", search);
}

//! Close Modal Helper
function closeModal() {
  var modalEl = document.getElementById("addContactModal");
  var bootstrapModal = bootstrap.Modal.getInstance(modalEl);
  if (bootstrapModal) {
    bootstrapModal.hide();
  }
}

//! Validation
fullNameInput.addEventListener("input", function () {
  if (fullNameInput.value.trim().length < 3) {
    fullNameInput.classList.add('is-invalid');
    fullNameInput.classList.remove('is-valid');
  } else {
    fullNameInput.classList.remove('is-invalid');
    fullNameInput.classList.add('is-valid');
  }
});