window.onload = function() {
  if(document.URL.indexOf("workspace") > -1){
    $.ajax({url: "/api/v1/note_files/open", success: function(result){
        workspaceData=result;
        console.log(result);
      },
      error: function(result){
        console.log(result);
      }
    });
  }
}

function findFileById(workspaceData,id) {
  for (i=0;i<workspaceData.files.length;i++){
    if (workspaceData.files[i].id==id){
      return workspaceData.files[i];
    }
  }
}

function playFile() {
  var form = getActiveForm();
  file_id = form.action.slice(form.action.lastIndexOf("/")+1);
  var file = findFileById(workspaceData,file_id);
  for(i=0;i<file.notes.length;i++){
    midiNote=convertNoteToMidiNote(file.notes[i]);
    playNote(midiNote)
  }
}

function convertNoteToMidiNote(note){
  octave_notes=workspaceData["octave_tones"];
  note_index_in_octave=octave_notes.indexOf(note.tone)
  return note.octave*octave_notes.length+note_index_in_octave
}

function playNote(midiNote) {
  MIDI.loadPlugin({
    soundfontUrl: "./soundfont/",
    instrument: "acoustic_grand_piano",
    onprogress: function(state, progress) {
      console.log(state, progress);
    },
    onsuccess: function() {
      var delay = 0; // play one note every quarter second
      var note = midiNote; // the MIDI note
      var velocity = 127; // how hard the note hits
      // play the note
      MIDI.setVolume(0, 127);
      MIDI.noteOn(0, note, velocity, delay);
      MIDI.noteOff(0, note, delay + 0.75);
    }
  });
}
