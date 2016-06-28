  function saveFile() {
    getActiveForm().submit();
  }

  function closeFile() {
    formAction = getActiveForm().getAttribute("action");

    id = formAction.substring(formAction.lastIndexOf("/")+1,formAction.length);

    window.location.href = "/note_files/" + id + "/close_file";
  }

  function getActiveForm() {
    var activePaneId = document.getElementsByClassName("tab-pane in active")[0].id;

    var form = document.getElementById(activePaneId).getElementsByTagName("form")[0];

    return form;
  }
