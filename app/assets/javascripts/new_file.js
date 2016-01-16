function createFile() {
    var form = document.getElementById("file-create-form");
      form.submit();
  }

  function eraseText() {
    document.getElementById("file-create-form").getElementsByTagName("textarea")[0].innerHTML="";
  }