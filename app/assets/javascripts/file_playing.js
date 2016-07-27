var  midi_loaded=false;

// window.onload = function() {
//   if(document.URL.indexOf("workspace") > -1){
//     $.ajax({url: "/api/v1/note_files/open", success: function(result){
//         workspaceData=result;
//         console.log(result);
//         MIDI.loadPlugin({
//         soundfontUrl: "./soundfont/",
//         instrument: "acoustic_grand_piano",
//           onprogress: function(state, progress) {
//             console.log(state, progress);
//           },
//           onsuccess: function() {
//             midi_loaded=true;
//             console.log("Midi loaded")
//           }
//         });
//       },
//       error: function(result){
//         console.log(result);
//       }
//     });
//   }
// }

function loadMidi() {
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
};

function findFileById(workspaceData,id) {
  for (i=0;i<workspaceData.files.length;i++){
    if (workspaceData.files[i].id==id){
      return workspaceData.files[i];
    }
  }
};

function playFile(file, divisions, octaveTones) {
  if (midi_loaded) {

    if (file.matrix) { 
      var notesOrderedByStartIndex = extractNotesFromMatrixOrderedByStartIndex(file.matrix, divisions)
      var date = new Date();
      var startTime = date.getTime();
      var timeIncrement = 250;
      var delay=.500;

      var i;
      for(i=0;i<divisions.length;i++){
        var pitch = notesOrderedByStartIndex[divisions[i]];
        if (pitch){
          currentMidiNote=convertNoteToMidiNote(pitch, octaveTones);
        } 
        else {
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
        if (i==notesOrderedByStartIndex["lastNoteDivisionIndex"]){
          break;
        }  
      }

    }
  }
};

function extractNotesFromMatrixOrderedByStartIndex(matrix, divisions){
  var notesOrderedByStartIndex = {};
  var i;
  for (i=0;i<divisions.length;i++){
    notesOrderedByStartIndex[divisions[i]] = null;
    for (pitch in matrix){
      if (matrix[pitch][divisions[i]]){
        notesOrderedByStartIndex[divisions[i]] = pitch; //example: notesOrderedByStartIndex["1.2.1"]="C#"
        notesOrderedByStartIndex["lastNoteDivisionIndex"]=i;
        break; //will only extract one pitch for a giving start index
      };
    };   
  };
  return notesOrderedByStartIndex; 
};

function convertNoteToMidiNote(pitch, octaveTones){
  //need a new js function to figure out pitch.tone and pitch.octave; in the new js function, use use a single pitch like C#4 to find a number via .match(/\d+/)[0] then find index of this number and everything before that is pitch
  pitch=extractOctaveAndToneFromPitch(pitch);
  note_index_in_octave=octaveTones.indexOf(pitch.tone);
  return pitch.octave*octaveTones.length+note_index_in_octave;
};

function extractOctaveAndToneFromPitch(pitch){
  octave = pitch.match(/\d+/)[0];
  tone = pitch.slice(0,pitch.indexOf(octave));
  return {octave: octave, tone: tone};
};


function playNote(midiNote,delay) {
var note = midiNote; // the MIDI note
      var velocity = 127; // how hard the note hits
      // play the note
      MIDI.setVolume(0, 127);
      MIDI.noteOn(0, note, velocity, 0);//last zero is starting delay, i.e. start right away
      MIDI.noteOff(0, note, delay);
};