var midi_loaded=false;

window.onload = function() {
  if(document.URL.indexOf("workspace") > -1){
    $.ajax({url: "/api/v1/note_files/open", success: function(result){
        workspaceData=result;
        console.log(result);
        MIDI.loadPlugin({
        soundfontUrl: "./soundfont/",
        instrument: "acoustic_grand_piano",
          onprogress: function(state, progress) {
            console.log(state, progress);
          },
          onsuccess: function() {
            midi_loaded=true;
            console.log("Midi loaded")
          }
        });
      },
      error: function(result){
        console.log(result);
      }
    });
  }
}

function loadMidi()
  {
    MIDI.loadPlugin({
        soundfontUrl: "./soundfont/",
        instrument: "acoustic_grand_piano",
          onprogress: function(state, progress) {
            console.log(state, progress);
          },
          onsuccess: function() {
            midi_loaded=true;
            console.log("Midi loaded")
          }
        });
  }

function findFileById(workspaceData,id) {
  for (i=0;i<workspaceData.files.length;i++){
    if (workspaceData.files[i].id==id){
      return workspaceData.files[i];
    }
  }
}

function playFile(file) {
  if (midi_loaded) {

    var date = new Date();
    var startTime = date.getTime();
    var timeIncrement = 250;
    var delay=.500;
    var note_index = 0

    for(i=0;i<workspaceData.divisions.length;i++){
      var note = file.notes[note_index];
      if (note.start_index ==
        workspaceData.divisions[i]){
        currentMidiNote=convertNoteToMidiNote(note);
        note_index++;
      }else{
        currentMidiNote=null;
      }
      var nextPlayTime=startTime+timeIncrement*i;
      // if (file.notes[i]){
        // playNote(convertNoteToMidiNote(file.notes[0]),delay)
        //   setTimeout( function() {
        //     playNote(convertNoteToMidiNote(file.notes[0]),delay);
        //   }, 1000)
      // }
      while (true){
        date = new Date();
        time = date.getTime();
        if (time >= nextPlayTime){
          if (currentMidiNote){
            playNote(currentMidiNote,delay);
          }
          break
        }
      }
      if (note_index>=file.notes.length){
        break;
      }  
    }
  }
}


function convertNoteToMidiNote(note){
  octave_notes=workspaceData["octave_tones"];
  note_index_in_octave=octave_notes.indexOf(note.tone);
  return note.octave*octave_notes.length+note_index_in_octave;
}


function playNote(midiNote,delay) {
var note = midiNote; // the MIDI note
      var velocity = 127; // how hard the note hits
      // play the note
      MIDI.setVolume(0, 127);
      MIDI.noteOn(0, note, velocity, 0);//last zero is starting delay, i.e. start right away
      MIDI.noteOff(0, note, delay);
}