/* =====================================================
MY NOTES
Pure JavaScript Notes Application
===================================================== */

/* =====================================================
DATA
===================================================== */

const STORAGE_KEY = "myNotesApp_notes";

let notes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

let editingNoteId = null;

let noteToDelete = null;

/* =====================================================
DOM ELEMENTS
===================================================== */

const topSearch = document.getElementById("topSearch");

const notesSearch = document.getElementById("notesSearch");

const subjectFilter = document.getElementById("subjectFilter");

const filterInput = document.getElementById("filterInput");

const notesList = document.getElementById("notesList");

const recentNotes = document.getElementById("recentNotes");

const totalNotes = document.getElementById("totalNotes");

const totalSubjects = document.getElementById("totalSubjects");

const latestNote = document.getElementById("latestNote");

const addNoteSection = document.getElementById("addNoteSection");

const noteForm = document.getElementById("noteForm");

const subjectInput = document.getElementById("subject");

const noteTitleInput = document.getElementById("noteTitle");

const noteContentInput = document.getElementById("noteContent");

const datePicker = document.getElementById("datePicker");

const dateNotes = document.getElementById("dateNotes");

const deleteModal = document.getElementById("deleteModal");

const toast = document.getElementById("toast");

const toastMessage = document.getElementById("toastMessage");

/* =====================================================
INITIALIZATION
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

```
renderEverything();

setToday();

renderDateNotes();
```

});

/* =====================================================
LOCAL STORAGE
===================================================== */

function saveNotes() {

```
localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(notes)
);
```

}

/* =====================================================
UTILITY FUNCTIONS
===================================================== */

function generateId() {

```
return Date.now().toString() +
    Math.random().toString(36).substring(2);
```

}

function formatDate(dateString) {

```
const date = new Date(dateString);

return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
});
```

}

function formatTime(dateString) {

```
const date = new Date(dateString);

return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit"
});
```

}

function formatDateTime(dateString) {

```
return `${formatDate(dateString)} • ${formatTime(dateString)}`;
```

}

function getTodayString() {

```
const today = new Date();

const year = today.getFullYear();

const month = String(today.getMonth() + 1).padStart(2, "0");

const day = String(today.getDate()).padStart(2, "0");

return `${year}-${month}-${day}`;
```

}

function escapeHTML(text) {

```
const div = document.createElement("div");

div.textContent = text;

return div.innerHTML;
```

}

function showToast(message) {

```
toastMessage.textContent = message;

toast.classList.add("show");

setTimeout(() => {

    toast.classList.remove("show");

}, 2500);
```

}

/* =====================================================
RENDER EVERYTHING
===================================================== */

function renderEverything() {

```
renderStats();

renderSubjectFilter();

renderRecentNotes();

renderNotes();
```

}

/* =====================================================
STATISTICS
===================================================== */

function renderStats() {

```
totalNotes.textContent = notes.length;


const subjects = [
    ...new Set(
        notes.map(note => note.subject.trim())
    )
];

totalSubjects.textContent = subjects.length;


if (notes.length === 0) {

    latestNote.textContent = "—";

    return;

}


const sorted = [...notes].sort(
    (a, b) =>
        new Date(b.updatedAt) -
        new Date(a.updatedAt)
);


latestNote.textContent = sorted[0].title;
```

}

/* =====================================================
SUBJECT FILTER
===================================================== */

function renderSubjectFilter() {

```
const currentValue = subjectFilter.value;

const subjects = [
    ...new Set(
        notes.map(note => note.subject.trim())
    )
].sort();


subjectFilter.innerHTML = `
    <option value="all">All Subjects</option>
`;


subjects.forEach(subject => {

    const option = document.createElement("option");

    option.value = subject;

    option.textContent = subject;

    subjectFilter.appendChild(option);

});


if (
    subjects.includes(currentValue) ||
    currentValue === "all"
) {

    subjectFilter.value = currentValue;

}
```

}

/* =====================================================
RECENT NOTES
===================================================== */

function renderRecentNotes() {

```
recentNotes.innerHTML = "";


const sortedNotes = [...notes].sort(
    (a, b) =>
        new Date(b.updatedAt) -
        new Date(a.updatedAt)
);


const recent = sortedNotes.slice(0, 4);


if (recent.length === 0) {

    recentNotes.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">📖</div>
            <p>No notes yet.</p>
            <small>Create your first study note to get started.</small>
        </div>
    `;

    return;

}


recent.forEach(note => {

    const card = document.createElement("article");

    card.className = "recent-card";

    card.innerHTML = `
        <span class="note-subject">
            ${escapeHTML(note.subject)}
        </span>

        <h4>
            ${escapeHTML(note.title)}
        </h4>

        <p class="note-preview">
            ${escapeHTML(note.content)}
        </p>

        <div class="note-time">
            ${formatDateTime(note.updatedAt)}
        </div>
    `;


    card.addEventListener("click", () => {

        editNote(note.id);

    });


    recentNotes.appendChild(card);

});
```

}

/* =====================================================
FILTER NOTES
===================================================== */

function getFilteredNotes() {

```
const searchText =
    notesSearch.value.trim().toLowerCase();


const filterText =
    filterInput.value.trim().toLowerCase();


const selectedSubject =
    subjectFilter.value;


return notes.filter(note => {

    const matchesSearch =
        !searchText ||
        note.title.toLowerCase().includes(searchText) ||
        note.content.toLowerCase().includes(searchText) ||
        note.subject.toLowerCase().includes(searchText);


    const matchesSubject =
        selectedSubject === "all" ||
        note.subject === selectedSubject;


    const matchesFilter =
        !filterText ||
        note.subject.toLowerCase().includes(filterText) ||
        note.title.toLowerCase().includes(filterText);


    return (
        matchesSearch &&
        matchesSubject &&
        matchesFilter
    );

});
```

}

/* =====================================================
RENDER ALL NOTES
===================================================== */

function renderNotes() {

```
notesList.innerHTML = "";


const filteredNotes = getFilteredNotes();


const sortedNotes = filteredNotes.sort(
    (a, b) =>
        new Date(b.updatedAt) -
        new Date(a.updatedAt)
);


if (sortedNotes.length === 0) {

    notesList.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">🔎</div>
            <p>No notes found.</p>
            <small>
                Try another search or create a new note.
            </small>
        </div>
    `;

    return;

}


sortedNotes.forEach(note => {

    const card = document.createElement("article");

    card.className = "note-card";

    card.innerHTML = `
        <span class="note-subject">
            ${escapeHTML(note.subject)}
        </span>

        <h4>
            ${escapeHTML(note.title)}
        </h4>

        <p class="note-card-content">
            ${escapeHTML(note.content)}
        </p>

        <div class="note-footer">

            <span class="note-date">
                ${formatDateTime(note.updatedAt)}
            </span>

            <div class="note-actions">

                <button
                    class="icon-btn edit-btn"
                    title="Edit note"
                >
                    ✎
                </button>

                <button
                    class="icon-btn delete delete-note-btn"
                    title="Delete note"
                >
                    ×
                </button>

            </div>

        </div>
    `;


    const editButton =
        card.querySelector(".edit-btn");


    const deleteButton =
        card.querySelector(".delete-note-btn");


    editButton.addEventListener(
        "click",
        () => editNote(note.id)
    );


    deleteButton.addEventListener(
        "click",
        () => openDeleteModal(note.id)
    );


    notesList.appendChild(card);

});
```

}

/* =====================================================
ADD NOTE SECTION
===================================================== */

function openAddNote() {

```
editingNoteId = null;

noteForm.reset();

addNoteSection.scrollIntoView({
    behavior: "smooth",
    block: "start"
});


setTimeout(() => {

    subjectInput.focus();

}, 500);
```

}

function closeAddNote() {

```
editingNoteId = null;

noteForm.reset();
```

}

/* =====================================================
EDIT NOTE
===================================================== */

function editNote(id) {

```
const note =
    notes.find(note => note.id === id);


if (!note) return;


editingNoteId = id;


subjectInput.value = note.subject;

noteTitleInput.value = note.title;

noteContentInput.value = note.content;


addNoteSection.scrollIntoView({
    behavior: "smooth",
    block: "start"
});


setTimeout(() => {

    subjectInput.focus();

}, 500);
```

}

/* =====================================================
SAVE NOTE
===================================================== */

noteForm.addEventListener(
"submit",
function(event) {

```
    event.preventDefault();


    const subject =
        subjectInput.value.trim();

    const title =
        noteTitleInput.value.trim();

    const content =
        noteContentInput.value.trim();


    if (!subject || !title || !content) {

        showToast("Please fill in all fields.");

        return;

    }


    if (editingNoteId) {

        const note =
            notes.find(
                note =>
                    note.id === editingNoteId
            );


        if (note) {

            note.subject = subject;

            note.title = title;

            note.content = content;

            note.updatedAt =
                new Date().toISOString();

        }


        showToast("Note updated successfully.");

    } else {

        const now =
            new Date().toISOString();


        const newNote = {

            id: generateId(),

            subject,

            title,

            content,

            createdAt: now,

            updatedAt: now

        };


        notes.push(newNote);


        showToast("Note saved successfully.");

    }


    saveNotes();

    renderEverything();

    noteForm.reset();

    editingNoteId = null;


    setTimeout(() => {

        document
            .getElementById("allNotesSection")
            .scrollIntoView({
                behavior: "smooth"
            });

    }, 250);

}
```

);

/* =====================================================
DELETE NOTE
===================================================== */

function openDeleteModal(id) {

```
noteToDelete = id;

deleteModal.classList.add("show");
```

}

function closeDeleteModal() {

```
noteToDelete = null;

deleteModal.classList.remove("show");
```

}

document
.getElementById("confirmDelete")
.addEventListener(
"click",
() => {

```
        if (!noteToDelete) return;


        notes =
            notes.filter(
                note =>
                    note.id !== noteToDelete
            );


        saveNotes();

        renderEverything();

        closeDeleteModal();

        showToast("Note deleted.");

        renderDateNotes();

    }
);
```

document
.getElementById("cancelDelete")
.addEventListener(
"click",
closeDeleteModal
);

deleteModal.addEventListener(
"click",
event => {

```
    if (event.target === deleteModal) {

        closeDeleteModal();

    }

}
```

);

/* =====================================================
SEARCH
===================================================== */

topSearch.addEventListener(
"input",
() => {

```
    notesSearch.value =
        topSearch.value;

    renderNotes();

    document
        .getElementById("allNotesSection")
        .scrollIntoView({
            behavior: "smooth"
        });

}
```

);

notesSearch.addEventListener(
"input",
() => {

```
    topSearch.value =
        notesSearch.value;

    renderNotes();

}
```

);

filterInput.addEventListener(
"input",
renderNotes
);

subjectFilter.addEventListener(
"change",
renderNotes
);

/* =====================================================
CLEAR FILTERS
===================================================== */

document
.getElementById("clearFilters")
.addEventListener(
"click",
() => {

```
        topSearch.value = "";

        notesSearch.value = "";

        filterInput.value = "";

        subjectFilter.value = "all";

        renderNotes();

    }
);
```

/* =====================================================
NEW / ADD NOTE BUTTONS
===================================================== */

document
.getElementById("newNoteBtn")
.addEventListener(
"click",
openAddNote
);

document
.getElementById("createNoteBtn")
.addEventListener(
"click",
openAddNote
);

document
.getElementById("addNoteBtn")
.addEventListener(
"click",
openAddNote
);

document
.getElementById("cancelNoteBtn")
.addEventListener(
"click",
() => {

```
        closeAddNote();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);
```

/* =====================================================
VIEW ALL
===================================================== */

document
.getElementById("viewAllBtn")
.addEventListener(
"click",
() => {

```
        document
            .getElementById("allNotesSection")
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);
```

/* =====================================================
DATE FILTER
===================================================== */

function setToday() {

```
datePicker.value =
    getTodayString();
```

}

function renderDateNotes() {

```
const selectedDate =
    datePicker.value;


if (!selectedDate) {

    dateNotes.innerHTML = `
        <p class="empty-text">
            Select a date to view notes.
        </p>
    `;

    return;

}


const filtered =
    notes.filter(note => {

        const date =
            new Date(note.updatedAt);

        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                date.getDate()
            ).padStart(2, "0");


        return (
            `${year}-${month}-${day}` ===
            selectedDate
        );

    });


dateNotes.innerHTML = "";


if (filtered.length === 0) {

    dateNotes.innerHTML = `
        <p class="empty-text">
            No notes were saved on this date.
        </p>
    `;

    return;

}


filtered
    .sort(
        (a, b) =>
            new Date(b.updatedAt) -
            new Date(a.updatedAt)
    )
    .forEach(note => {

        const item =
            document.createElement("div");

        item.className = "date-note";


        item.innerHTML = `
            <h4>
                ${escapeHTML(note.title)}
            </h4>

            <span>
                ${escapeHTML(note.subject)}
                •
                ${formatTime(note.updatedAt)}
            </span>
        `;


        item.addEventListener(
            "click",
            () => editNote(note.id)
        );


        dateNotes.appendChild(item);

    });
```

}

datePicker.addEventListener(
"change",
renderDateNotes
);

document
.getElementById("todayBtn")
.addEventListener(
"click",
() => {

```
        setToday();

        renderDateNotes();

    }
);
```

/* =====================================================
KEYBOARD SHORTCUTS
===================================================== */

document.addEventListener(
"keydown",
event => {

```
    /* Ctrl + K / Cmd + K */
    if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
    ) {

        event.preventDefault();

        notesSearch.focus();

    }


    /* Escape */
    if (event.key === "Escape") {

        closeDeleteModal();

    }

}
```

);
