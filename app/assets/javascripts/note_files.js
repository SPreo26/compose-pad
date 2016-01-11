$(document).ready( function(){

  // function setup() {
  //   angular.element(document.getElementById('angular-div')).scope().setup;
  // }
  
  
  // originalFileNames.values[$index]=noteFile.name;
  // abbrevIfTextOverflow('file_text'+ $index, $index);

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
    newlineRemovedString = originalFileNames.values[index].slice(1);
    if (originalFileNames.values[index][0] == "\n" && abbrevTest(newlineRemovedString) == elem.value)
    {
      newlineRemovedString = originalFileNames.values[index].slice(1);

      elem.value = newlineRemovedString;
      originalFileNames.values[index] = newlineRemovedString;
    } 
  }

  function abbrevTest(text){
    if (text.length<8) {
        return text.substring(0,text.length) + "..";
    }else{
      return text.substring(0,4) + ".." + text.substring(text.length-4,text.length);
    }
  }

  function updateOriginalFileName(elem, index){
    originalFileNames.values[index] = elem.value;
  }


});


  function addTopOrBottomClassToNewspaperFile(id,parentId,fileNum,numFiles){
    var file_line = document.getElementById(id);
    var parent = file_line.parentElement;
    var parentPaddingTop = parseFloat(getComputedStyle(parent).paddingTop);
    var elemTop = $("\#"+id).position().top;

    if ( elemTop == parentPaddingTop){
      file_line.className += " file-top";
    }

    var elementHeight = $("\#"+id).height()
    var elementBottom = parentPaddingTop + elemTop + elementHeight;
    var parentPaddingBottom = parseFloat(getComputedStyle(parent).paddingBottom);
    var parentBottom =  $("\#"+parentId).height() + parentPaddingBottom + parentPaddingTop;

    if (parentBottom - elementBottom < elementHeight || fileNum == numFiles) {
      file_line.className += " file-bottom";
    }
  }

  // function(){
  //   var widthOneItem = 50;
  //   $(".arrow-left").click(function(){
  //       $(".offer-pg-cont").animate({scrollLeft: "-="+widthOneItem});
  //   });
  //   $(".arrow-right").click(function(){
  //       $(".offer-pg-cont").animate({scrollLeft: "+="+widthOneItem});
  //   });        
  // }
