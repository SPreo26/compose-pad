  function saveFile() {
    getActiveForm().submit();
  }

  function closeFile() {
    formAction = getActiveForm().getAttribute("action");

    id = formAction.substring(formAction.lastIndexOf("/")+1,formAction.length);

    window.location.href = "/note_files/" + id + "/close_file";
  }

  function getActiveForm() {
    var activePane = document.getElementsByClassName("tab-pane  active")[0];

    var form = activePane.getElementsByTagName("ng-form")[0];
    
    return form;
  }
