  var matrix_div_created = false;
  //matrix_loaded set to true in script inside ng-repeat for file in files - need to make sure the div holding the matrix is created

  // function saveFile() {
  //   getActiveForm().submit();
  // }

  function getActiveFileId(){

    formAction = getActiveForm().getAttribute("action");

    return formAction.substring(formAction.lastIndexOf("/")+1,formAction.length);

  }

  // function closeFile() {
  //   formAction = getActiveForm().getAttribute("action");

  //   id = formAction.substring(formAction.lastIndexOf("/")+1,formAction.length);

  //   window.location.href = "/note_files/" + id + "/close_file";
  // }

  function getActiveForm() {
    var activePane = document.getElementsByClassName("tab-pane  active")[0];

    var form = activePane.getElementsByTagName("ng-form")[0];

    return form;
  }