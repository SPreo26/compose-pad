// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require theme/jquery
//= require jquery_ujs
//= require turbolinks
//= require theme/bootstrap


//= require_tree .

function saveFile() {
  getActiveForm().submit();
}

function closeFile() {
  formAction = getActiveForm().getAttribute("action");

  id = formAction.substring(formAction.lastIndexOf("/")+1,formAction.length);

  window.location.href = "/note_files/" + id + "/close_file";
  // var child1 = document.getElementsByClassName("active")[0];

  // var parent1 = child1.parentElement;

  // var activePaneUrl = child1.getElementsByTagName("a")[0].href;

  // var child2 = document.getElementById(activePaneUrl.substring(activePaneUrl.indexOf("#")+1,activePaneUrl.length));

  // var parent2 = child2.parentElement;

  // parent1.removeChild(child1);
  // parent2.removeChild(child2);

}

function createFile() {
  var form = document.getElementById("file-create-form");
    form.submit();
}

function getActiveForm() {
  var activePaneUrl = document.getElementsByClassName("active")[0].getElementsByTagName("a")[0].href;

  var activePaneId = activePaneUrl.substring(activePaneUrl.indexOf("#")+1,activePaneUrl.length);

  var form = document.getElementById(activePaneId).getElementsByTagName("form")[0];

  return form;
}

function eraseText() {
  document.getElementById("file-create-form").getElementsByTagName("textarea")[0].innerHTML="";
}

function addTopOrBottomClassToFileInNewspaper(id,parentId,fileNum,numFiles){
  var file_line = document.getElementById(id)
  if ($("\#"+id).position().top==0){
    file_line.className += " file-top";
  }
  var elementHeight = $("\#"+id).height()
  var elementBottom = $("\#"+id).position().top + elementHeight
  var parentBottom =  $("\#"+parentId).height() 
  if (parentBottom - elementBottom < elementHeight || fileNum == numFiles) {
    file_line.className += " file-bottom";
  }
}

function abbrevIfTextOverflow(id, index){
  if ($('#'+id)[0].scrollWidth >  $('#'+id).innerWidth()) {
    var file_text_elem = document.getElementById(id);
    text=file_text_elem.value;
    abbrevText(file_text_elem, text);
    originalFileNames.values[index] = "\n" + originalFileNames.values[index]; //mark that abbreviation was made with an illegal newline character in array of original names 
  }
}

function abbrevText(text_elem, text){
  if (text.length<8) {
      text_elem.value = text.substring(0,text.length) + "..";
    }else{
      text_elem.value = text.substring(0,4) + ".." + text.substring(text.length-4,text.length);
    }
  return text_elem.value
}

var originalFileNames = {
  values: []
}

function unabbrevIfAbbrev(elem,index) {
  if (originalFileNames.values[index][0] == "\n" && abbrevText(elem,elem.value) == elem.value){
    newlineRemovedString = originalFileNames.values[index].slice(1);
    elem.value = newlineRemovedString;
    originalFileNames.values[index] = newlineRemovedString;
  }

}

