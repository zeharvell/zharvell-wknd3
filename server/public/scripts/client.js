//console.log('working');
$(document).ready(onReady);

function onReady() {
  $('#js-add').on('click', handleClickSave);
  $('#js-toDoListBody').on('click', '.js-btn-delete', handleDelete);
  $('#js-toDoListBody').on('click', '.js-btn-update', handleUpdate);
  getListData();
}

function handleUpdate() {
  console.log('UPDATE');

  const $btn = $(this);
  const currentStatus = $btn.data('status');
  const btnText = $btn.text();
  const $tdStatus = $btn.parent().parent().children('.js-status');

  const id = $btn.data('id');
  console.log('id', id);
  updateStatus(currentStatus, id);
}

function handleClickSave() {
  let list0bject = {
    title: $('.js-input-title').val(),
    status: $('.js-input-status').val(),
  };

  postListData(list0bject);
}

function handleDelete() {
  const listId = $(this).data('id');
  console.log('DELETE:', listId);
  deleteList(listId);
}

function getListData() {
  $.ajax({
    type: 'GET',
    url: '/todolist',
  }).then(function (response) {
    console.log('GET', response);

    render(response);
  });
}

function postListData(payload0bject) {
  $.ajax({
    type: 'POST',
    url: '/todolist',
    data: payload0bject,
  })
    .then(function (response) {
      clearForm();

      getListData();
    })
    .catch(function (err) {
      console.log(err);
    });
}

function deleteList(listId) {
  $.ajax({
    method: 'DELETE',
    url: `/todolist/${listId}`,
  })
    .then((deleteMessage) => {
      getListData();
    })
    .catch((err) => {
      console.log(err);
      alert('no tiene');
    });
}

function updateStatus(newStatus, id) {
  console.log(newStatus);
  if (newStatus === false) {
    newStatus = true;
  } else if (newStatus === true) {
    newStatus = false;
  }
  $.ajax({
    method: 'PUT',
    url: `/todolist/status/${id}`,
    data: { status: newStatus },
  })
    .then((putMessage) => {
      getListData();
    })
    .catch((err) => {
      console.log(err);
      alert('Did Not Update');
    });
}

function clearForm() {
  $('.js-input-title').val('');
  $('.js-input-status').val('');
}

function render(dataLibrary) {
  const $toDoListBody = $('#js-toDoListBody');

  $toDoListBody.empty();
  for (let i = 0; i < dataLibrary.length; i++) {
    const listData = dataLibrary[i];
    let colorIndicator = '';
    if (listData.status === true) {
      colorIndicator = 'yesno';
    }
    $toDoListBody.append(`
       <tr class="${colorIndicator}">
        <td>${listData.title}</td>
        <td class="js-rank">${listData.status}</td>
        <td>
        <button class="js-btn-delete" data-id="${listData.id}">Delete</button>
        <button class="js-btn-update" data-status="${listData.status}" data-id="${listData.id}">Complete</button>
        </td>
        </tr>        
        `);
  }
}
