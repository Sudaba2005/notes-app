class NotesApp{
    constructor(){
        this.notes = JSON.parse(localStorage.getItem("notes")) || [];
        this.currentNote = null;
        this.initializeElements();
        this.addEventListeners();
        this. displayNotesList();
        const isDarkMode = localStorage.getItem("darkMode") === "true";
        if(isDarkMode){
            document.body.classList.add("moon-emoji-btn");
            this.moonBtn.textContent = "☀️";
        }
    }

    initializeElements(){
        this.moonBtn = document.getElementById("moon-btn");
        this.newNotes = document.getElementById("AddNoteTitle");
        this.noteList = document.getElementById("note-lists");
        this.noteContent = document.getElementById("note-content");
        this.previewContent = document.getElementById("preview-editor");
        this.newNoteBtn = document.getElementById("note-btn");
        this.saveNoteBtn = document.getElementById("saveNotes");
        this.deleteNoteBtn = document.getElementById("deleteNotes");
        this.tabBtn = document.querySelectorAll(".tab-btn");
    }

    addEventListeners(){
        this.newNoteBtn.addEventListener("click" , ()=> this.createNewNote());
        this.saveNoteBtn.addEventListener("click" , ()=> this.saveNote());
        this.deleteNoteBtn.addEventListener("click" , ()=> this.dltNote());
        this.noteContent.addEventListener("input" , ()=> this.updatePreview());
        this.tabBtn.forEach(btn => {
            btn.addEventListener("click" , (e) => this.switchTab(e));
        });
        this.moonBtn.addEventListener("click" ,() => this.toggleDarkMode());
    }

    saveNote(){
        const title = this.newNotes.value.trim();
        const content = this.noteContent.value.trim();

        if(!title || !content){
            alert("Please enter both title and content");
            return;
        }

        const note = {
            id: this.currentNote ?this.currentNote.id : Date.now(),
            title,
            content,
            lastModify: new Date().toISOString(),
        };

        if(this.currentNote){
            const index = this.notes.findIndex((n) => n.id === this.currentNote.id);
            this.notes[index] = note;
        }
        else{
            this.notes.push(note);
        }

        this.currentNote = note;
        this.saveToLocalStorage();
        this.displayNotesList();

    }
    dltNote(){
        if(!this.currentNote) return;

        if(confirm("Are you sure you want to delete this note?")){
            this.notes = this.notes.filter((note) => note.id !== this.currentNote.id);
            this.saveToLocalStorage();
            this.displayNotesList();
            this.createNewNote();
        }

    }

    createNewNote(){
        this.currentNote = null;
        this.newNotes.value = "";
        this.noteContent.value = "";
        this.updatePreview();
    }


    saveToLocalStorage(){
        localStorage.setItem("notes" , JSON.stringify(this.notes));
    }



    updatePreview(){}
    switchTab(e){
        const tab = e.target.dataset.tab;
        this.tabBtn.forEach((btn) => btn.classList.remove("active"));
        e.target.classList.add("active");


        if(tab === "preview"){
            this.noteContent.style.display = "none";
            this.previewContent.style.display = "block";
        }
        else{
            this.noteContent.style.display = "block";
            this.previewContent.style.display = "none";
        }
    }
    toggleDarkMode(){
        document.body.classList.toggle("moon-emoji-btn");
        const isDarkMode = document.body.classList.contains("moon-emoji-btn");
        this.moonBtn.textContent = isDarkMode ? "☀️" : "🌙";
        localStorage.setItem("darkMode" , isDarkMode);


    }
    loadNote(note){
        this.currentNote = note;
        this.newNotes.value = note.title;
        this.noteContent.value = note.content;
        this.updatePreview();
    }


    updatePreview(){
         const markdown = this.noteContent.value;
         this.previewContent.innerHTML = marked.parse(markdown);

    }


     displayNotesList(){
        // console.log("Notes: " , this.notes);
        this.noteList.innerHTML = "";
        this.notes.forEach((note) => {
            const noteElement = this.createNoteElement(note);
            this.noteList.appendChild(noteElement);
        });
    }
    
    createNoteElement(note){
        const div = document.createElement("div");
        div.classList.add("notes");
        if(this.currentNote && this.currentNote.id === note.id){
            div.classList.add("active");
        }

        const formattedDate = new Date(note.lastModify).toLocaleDateString("en-Gb",{
            day: "2-digit",
            month: "short",
            year: "numeric",
        })

        div.innerHTML = `
        <h3>${note.title}</h3>
        <p>${formattedDate}</p>
        `;

        div.addEventListener("click" , ()=> this.loadNote(note));
        return div;
    }

}

new NotesApp();