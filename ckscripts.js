function printDiv() {
  var divContents = document.getElementById("my_workout").innerHTML;
  var a = window.open('', '', '')
  a.document.write('<html><head><link href="ckstyle.css" rel="stylesheet"></head>');
  a.document.write('<body><h1><br>');
  a.document.write(divContents);
  a.document.write('</body></html>');
  a.document.close();
} // function printDiv()

function addRound() {
  var x = document.getElementById("moves_target");
  var buttonz = x.getElementsByTagName("BUTTON");

  // Don't allow empty rows to be added
  if (buttonz.length == 0 || window.currCoreMove == null) {
    alert('Please select at least one kickboxing move and one core move.');
    return false;
  }

  // Assemble punch/kick moves
  var round_value = ""
  for (i = 0; i < buttonz.length; i++) {
    var btnval = buttonz[i].value
    if (round_value.length > 0) {
      round_value += "-" + btnval;
    }
    else {
      round_value += btnval;
    }
  }

  var tableRef = document.getElementById("moves_table").getElementsByTagName('tbody')[0];

  // Insert a row in the table at the last row
  var newRow   = tableRef.insertRow();
  newRow.className = "tr"

  // Insert a cell in the row at index 0
  var newCell  = newRow.insertCell(0);
  newCell.className = "td"

  // Append a text node to the cell
  var newText  = document.createTextNode(round_value);
  newCell.appendChild(newText);

  // Insert a new cell in the row for core move at index 1
  var newCoreCell = newRow.insertCell(1);
  newCoreCell.className = "td"

  // Append a text node to the cell
  var newCoreText = document.createTextNode(window.currCoreMove);
  newCoreCell.appendChild(newCoreText);

  // Append a delete button for the row
  var newDelete = newRow.insertCell(2);
  newDelete.innerHTML = '<button value="x" onclick="deleteRow(this)">x</button>';

  // Add user-defined workout name as table label
  var ck_name = document.getElementById("workout_name").value;
  var ck_label = document.createTextNode(ck_name);
  table_cap = document.getElementById("moves_table").createCaption();
  table_cap.textContent = ck_label.nodeValue;
  

  // Clear div for next round construction
  clearBox('moves_target');
} // function addRound()

function clearCore() {
  currCoreSelected = document.getElementById(window.currCoreId)
  if (window.currCoreMove != null) {
    currCoreSelected.classList.remove('switch-bg');
    event.preventDefault();
  }
} // function clearCore()

function clearBox(elementID)
{
    document.getElementById(elementID).innerHTML = "";
    clearCore();
    window.currCoreMove = null;
    // Get the element with id="defaultOpen" and click on it
    document.getElementById("defaultOpen").click();
} // function clearBox()

function deleteRow(r) {
  var i = r.parentNode.parentNode.rowIndex;
  document.getElementById("moves_table").deleteRow(i);
} // function deleteRow()

function getCore(coreMove) {
  window.currCoreMove = coreMove.value;
  window.currCoreId = coreMove.id;
} // function getCore()j

function openCore(evt, coreName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(coreName).style.display = "block";
  evt.currentTarget.className += " active";
} // function openCore()

interact('.draggable')
  .draggable({
    // enable inertial throwing
    inertia: true,
    // enable autoScroll
    autoScroll: true,
    // call this function on every dragmove event
    onmove: dragMoveListener,
  }).on('move', function (event) {
      var interaction = event.interaction;
      if (interaction.pointerIsDown && !interaction.interacting() && event.currentTarget.getAttribute('clonable') != 'false') {
        var original = event.currentTarget;
        var clone = event.currentTarget.cloneNode(true);
        var x = clone.offsetLeft;
        var y = clone.offsetTop;
        clone.setAttribute('clonable','false');
        clone.style.position = "absolute";
        clone.style.left = original.offsetLeft+"px";
        clone.style.top = original.offsetTop+"px";
        original.parentElement.appendChild(clone);
        interaction.start({ name: 'drag' },event.interactable,clone);
      }
  });

  function dragMoveListener (event) {
    event.preventDefault();
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  } // function dragMoveListener()

  // enable draggables to be dropped into this
  interact('.dropzone').dropzone({
    // Require a 50% element overlap for a drop to be possible
    overlap: 0.50,

    // listen for drop related events:
    ondropactivate: function (event) {
      // add active dropzone feedback
      event.target.classList.add('drop-active');
    },
    ondragenter: function (event) {
      var draggableElement = event.relatedTarget,
          dropzoneElement = event.target;

      // feedback the possibility of a drop
      dropzoneElement.classList.add('drop-target');

      // vsx add
      draggableElement.classList.add('can-drop');
    },
    ondragleave: function (event) {
      // remove the drop feedback style
      event.target.classList.remove('drop-target');
      event.relatedTarget.classList.remove('can-drop');
      event.target.removeChild(event.relatedTarget);
    },
    ondrop: function (event) {
      event.target.appendChild(event.relatedTarget);
    },
    ondropdeactivate: function (event) {
      // remove active dropzone feedback
      event.target.classList.remove('drop-active');
      event.target.classList.remove('drop-target');
    }
  })

  interact('.tap-target')
    .on('tap', function (event) {
      clearCore();
      event.target.classList.toggle('switch-bg')
      event.preventDefault();
    });