import React, {useState, useEffect} from "react";
import { BrowserRouter, Routes, Route, Outlet, useNavigate, useParams} from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';


import { v4 as uuidv4 } from 'uuid';
import { useOutletContext } from "react-router-dom";

function App() {

  const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem("notes")) || []);

  const [currentID, setCurrentID] = useState()


  useEffect( () => {
    localStorage.setItem("notes", JSON.stringify(notes))
  }, [notes]);

  
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout notes={notes} setNotes={setNotes} currentID={currentID} setCurrentID={setCurrentID}
              />}>
          <Route path="/" element={<Default />}></Route>
          <Route path="/:noteID" element={<NoEdit notes={notes} setNotes={setNotes} currentID={currentID} setCurrentID={setCurrentID}/>}></Route>
          <Route path="/:noteID/edit" element={<Edit notes={notes} setNotes={setNotes} currentID={currentID} setCurrentID={setCurrentID}/>} />
        </Route>
      </Routes> 
    </BrowserRouter>
  );
  }

// Layout Component

function Layout(props) {

  function handleSelect(clickedNote) {
    props.setCurrentID(clickedNote.id); 
    
  }

  const navigate = useNavigate();


  useEffect( () => {
    
    const index = props.notes.findIndex(note => note.id === props.currentID);
   
    if (index >= 0) {
      if (props.notes[0].title === "Untitled" && props.notes[0].body === "...") {
        navigate(`/${index + 1}/edit`);
    } else {
      navigate(`/${index + 1}`);
    }
    }
  }, [props.currentID]);
  
const [isHidden, setIsHidden] = useState(false);
function handleHamburger() {
  setIsHidden(!isHidden);
}

  const hiddenStyle = {
    visibility: "hidden"
  };
  const selectedStyle = {
    background: 'rgb(98, 74, 126)',
    color: 'white'
  };

  const unselectedStyle = {
  };
  
  return (
    <section className="container">
      <header className="header">
        <div className="header-button">
          <button className="buttons" id="hamburger-menu" onClick={handleHamburger}>&#9776;</button>
        </div>
        <div className="header-title">
          <h1 id="lotion">Lotion</h1>
          <p className="title-caption">Like Notion, but worse.</p>
        </div>
      </header>
      <div className="main">
        <div className="left" style={isHidden ? hiddenStyle : unselectedStyle}>
          <div className="left-top">
            <h4 id="notes">Notes</h4>
            <button className="buttons" id="add-note" onClick={() => {
              
              const newNote = {
                id: uuidv4(),
                title: "Untitled",
                date: Date.now(),
                body: "..."
              };
              
              props.setCurrentID(newNote.id);
        
              const updatedNotes = props.notes ? [newNote, ...props.notes] : [newNote];

              props.setNotes(updatedNotes);
              
              
              navigate(`/1/edit`) 

              
              }}>+
            </button>
          </div>
          <div className="left-bottom">

            {props.notes.map( (note) => {
              const date1 = new Date(note.date);
              const options = {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              };
            return (
            <div  className="left-bottom-savednote" 
                  key = {note.id} 
                  style = { note.id === props.currentID ? selectedStyle : unselectedStyle }
                  onClick={ () => handleSelect(note)}> 
   
              <h5 className="saved-note-title">{note.title}</h5>
              <p className="saved-note-date">{date1.toLocaleDateString("en-US", options)}</p>
              <p className="saved-note-body">{note.body}</p>
            </div>)
            })}
          
          </div>
        </div>
        <div className="right">
          <Outlet />
        </div>
      </div>
    </section>
  );
}

// NoEdit Component

function NoEdit(props) {
  const { noteID } = useParams();

  function handleDelete() {
    let answer = window.confirm("Are you sure?")
    if (answer && props.notes.length > 0) {
      if (props.notes.length === 1) {
        navigate(`/`);

      }
      const newNotes = props.notes.filter( (note) => note.id != props.currentID);
      props.setNotes(newNotes);

      if (newNotes.length > 0) {
        props.setCurrentID(newNotes[0].id);
      } else {
        props.setCurrentID(undefined);
      }

    }
  }


  const navigate = useNavigate();
  const date1 = new Date(Date.now());
              const options = {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              };
  return (
    <>
      <div className="right-header">
        <div className="right-header-title">
          <h3 id="note-title">{props.notes[noteID - 1].title}</h3>
          <p id="note-date">{date1.toLocaleDateString("en-US", options)}</p>
        </div>
        <div className="right-header-buttons">
          <button className="buttons" id="edit" onClick={() => {
            navigate(`/${noteID}/edit`)}
          }

            
            >Edit</button>
          <button className="buttons" id="delete" onClick={ () => {
            handleDelete()}}
            
          >Delete</button>
        </div>
      </div>
      <div className="right-body">
        <p id="note-body">{props.notes[noteID - 1].body}</p>
      </div>
    </>
  );
}

// Edit Component

function Edit(props) {
  const { noteID } = useParams();
  
  const [title, setTitle] = useState(props.notes[noteID - 1].title);
  const [properTitle, setProperTitle] = useState();


  const [body, setBody] = useState(props.notes[noteID - 1].body);
  const [properBody, setProperBody] = useState();

  function handleDelete() {
    let answer = window.confirm("Are you sure?")
    if (answer && props.notes.length > 0) {
      if (props.notes.length === 1) {
        navigate(`/`);

      }
      const newNotes = props.notes.filter( (note) => note.id != props.currentID);
      props.setNotes(newNotes);

      if (newNotes.length > 0) {
        props.setCurrentID(newNotes[0].id);
      } else {
        props.setCurrentID(undefined);
      }
    }
  }

  
  useEffect(() => {
    if (title === "<p><br></p>") {
      setProperTitle("");
    } else {
      setProperTitle(title.slice(3, title.length - 4));
    }
    if (body === "") {
      setProperBody("");
    } else {
      setProperBody(body.slice(3, body.length - 4));
    }
  });
  

  const navigate = useNavigate();

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','link'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['clean']
    ]
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'link',
    'list', 'bullet',
    'link'
  ];

  return (
    <>
      <div className="right-header">
        <div className="right-header-title">
          <h3 className="right-title-text">
            <ReactQuill className="quill-title"
                        value={title}
                        onChange={setTitle}
                        theme="bubble"
                        modules={modules}
                        formats={formats}
            ></ReactQuill>
          </h3>
          <input type="datetime-local" />
        </div>
        <div className="right-header-buttons">
          <button className="buttons" id="save" onClick={() => {
            
            props.setNotes(props.notes.map( note => {
              if (note.id === props.currentID) {
                return {
                  ...note,
                  title: properTitle,
                  body: properBody
                };
              } else {
                return note;
              }
            }));
            navigate(`/${noteID}`)
            }}
            >Save</button>
          <button className="buttons" id="delete" onClick={ () => {
            handleDelete()}}
          >Delete</button>
        </div>
      </div>
    
      <div className="text-editor">
        <ReactQuill className="react-quill" 
                    placeholder="Your Note Here"
                    value={body}
                    onChange={setBody}
                    theme="snow"
                    modules={modules}
                    formats={formats}
        ></ReactQuill>
      </div>
    </>
  );
}

// Default Component

function Default() {
  return (
    <div className="right-div">
      <h1 className="default-select-create-text">Select a note, or create a new one.</h1>
    </div>
  )
}

export default App;