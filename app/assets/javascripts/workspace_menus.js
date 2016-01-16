  function saveFile() {
    getActiveForm().submit();
  }

  function closeFile() {
    formAction = getActiveForm().getAttribute("action");

    id = formAction.substring(formAction.lastIndexOf("/")+1,formAction.length);

    window.location.href = "/note_files/" + id + "/close_file";
  }

 

  function getActiveForm() {
    var activePaneUrl = document.getElementsByClassName("active")[0].getElementsByTagName("a")[0].href;

    var activePaneId = activePaneUrl.substring(activePaneUrl.indexOf("#")+1,activePaneUrl.length);

    var form = document.getElementById(activePaneId).getElementsByTagName("form")[0];

    return form;
  }
