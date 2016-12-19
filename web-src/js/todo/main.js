$(document).ready(function () {
    $('.character-counter').hide();

    var Item = {
        id: String,
        field: String,
        status: Boolean
    };
    var items = [];
    var id = 0;
    var myStorage = localStorage;
    var storageName = 'storage1';
    var inputDo = $('#textDo');
    var buttonAction = $('#action');
    var selectTodo = $('#select-todo');
    var amountDiv = $('#amount-div');
    var dragSrcEl = null;
    selectTodo.hide();
    amountDiv.hide();

    function handleDragStart(e) {
        this.style.opacity = '0.4';

        dragSrcEl = this;

        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
    }

    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }

        if (dragSrcEl != this) {
            dragSrcEl.innerHTML = this.innerHTML;
            this.innerHTML = e.dataTransfer.getData('text/html');
        }

        return false;
    }

    function saveToStorage(items, storageName) {
        myStorage.setItem(storageName, JSON.stringify(items));
    }

    function getFromStorage(storageName) {
        items = JSON.parse(myStorage.getItem(storageName));
        return items ? items : [];
    }

    function createItem(item) {
        selectTodo.find('ul').append($('<li>').addClass('collection-item').attr('id', 'id' + item.id).attr('draggable', true)
            .append($('<input>').attr('type', 'checkbox').attr('id', item.id).attr('checked', item.status))
            .append($('<label>').attr('for', item.id).text(item.field))
            .append($('<button>').attr('type', 'button').addClass('btn-floating btn waves-effect waves-light red delete-button disabled')
                .append($('<i>').addClass('material-icons').text('remove')))
        );

        var li = selectTodo.find('ul>li').last();
        var input = li.find('input');
        var button = li.find('button');
        var label = $("label[for='" + input.attr('id') + "']");
        if (item.status) {
            label.addClass('selected-label');
        }
        input.change(function (e) {
            if (input.prop('checked')) {
                label.addClass('selected-label');
                setStatus(input.attr('id'), true);
            } else {
                label.removeClass('selected-label');
                setStatus(input.attr('id'), false);
            }
        });
        button.click(function (e) {
            remove(input.attr('id'));
            button.parent().remove();
        });
        li.hover(
            function () {
                $(this).find('button').removeClass('disabled');
            },
            function () {
                $(this).find('button').addClass('disabled');
            }
        );
        renderAmount();
    }

    function renderFromStorage(storageName) {
        items = getFromStorage(storageName);
        if (items) {
            items.forEach(function (val) {
                createItem(val);
            });
            renderAmount();
        }
    }

    function renderAmount() {
        var count = countSelected();

        if (count) {
            if (!amountDiv.find('ul>li').length) {
                amountDiv.find('ul').append($('<li>').addClass('collection-item').text('All item(s): ' + items.length + ' Select item(s): ' + count));
            } else {
                amountDiv.find('ul>li').text('All item(s): ' + items.length + ' Select item(s): ' + count);
            }
            selectTodo.is(':hidden') ? amountDiv.hide() : amountDiv.show();
        } else {
            amountDiv.hide();
        }
    }

    function countSelected() {
        var count = 0;
        items.forEach(function (elem) {
            if (elem.status) {
                count++;
            }
        });

        return count;
    }

    function setStatus(id, status) {
        ind = items.findIndex(function (el) {
            return id == el.id;
        });
        var obj = items[ind];
        obj.status = status;
        saveToStorage(items, storageName);
        renderAmount();
    }

    function remove(id) {
        ind = items.findIndex(function (el) {
            return id == el.id;
        });
        items.splice(ind, 1);
        renderAmount();
        saveToStorage(items, storageName);
    }

    inputDo.keyup(function (e) {
        if (e.keyCode == '13') {
            buttonAction.trigger('click');
        }
        inputDo.val() ? buttonAction.removeClass('disabled') : buttonAction.addClass('disabled');
    });

    selectTodo.parent().hover(
        function () {
            selectTodo.fadeIn('slow');
            countSelected() ?  amountDiv.fadeIn('slow') : null;
        },
        function () {
            selectTodo.fadeOut('slow');
            amountDiv.fadeOut('slow');
        }
    );

    buttonAction.click(function () {
        if ((inputDo.val() && inputDo.val().length <= 50)) {
            item = Object.create(Item);
            item.id = Date.now();
            item.field = inputDo.val();
            item.status = false;
            items.push(item);
            inputDo.val(null);
            buttonAction.addClass('disabled');
            saveToStorage(items, storageName);
            createItem(item);
            selectTodo.show();
        }
    });

    renderFromStorage(storageName);

    // var items = $('#select-todo').find('ul>li');
    // [].forEach.call(items, function(item) {
    //     item.addEventListener('dragstart', handleDragStart, false);
    // });
});