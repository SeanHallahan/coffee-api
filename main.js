
$(function() {
    //DOM Variables
    var $orders = $('#orders');
    var $name = $('#name');
    var $drink = $('#drink');
    var $snack = $('#snack');
    var $special = $('#special');

    //Orders Template (Mustache.js)
    var orderTemplate = $('#order-template').html();

    // Adds and displays orders
    function addOrder(order) {
        $orders.append(Mustache.render(orderTemplate, order));
    }

    // Ajax GET request to show orders
    $.ajax({
      type: 'GET',
      url: 'https://sean-h-coffee-api-project.herokuapp.com/orders',
      success: function(orders) {
          $.each(orders, function (i, order) {
                addOrder(order);
          });
      },
        error: function() {
          alert('error loading orders');
        }
    });
    // END Ajax GET request

    //Ajax POST request from Add Button
    $('#add-order').on('click', function() {
        // Info sent from data line in POST request
        var order = {
            name: $name.val(),
            drink: $drink.val(),
            snack: $snack.val(),
            special: $special.val()
        };
        $.ajax({
            type: 'POST',
            url: 'https://sean-h-coffee-api-project.herokuapp.com/orders',
            data: order,
            success: function(newOrder) {
                // Display the order
                addOrder(newOrder);
            },
            error: function() {
                alert('error saving order');
            }
        });
    });
    //Remove Orders with remove button
    $orders.delegate('.remove', 'click', function() {

        var $li = $(this).closest('li');

        // To be able to use this inside success function
        var self = this;

        $.ajax({
            type: 'DELETE',
            url : 'https://sean-h-coffee-api-project.herokuapp.com/orders/' + $(this).attr('data-id'),
            success : function (){
                $(self);
                $li.fadeOut(300, function() {
                    $(this).remove();
                });
            }
        });
    });
    // Edit Orders
    $orders.delegate('.editOrder', 'click', function () {
        // Find the closest list item
        var $li = $(this).closest('li');

        // Set the value of the input box to the value of the item displayed
        $li.find('input.name').val($li.find('span.name').html());
        $li.find('input.drink').val($li.find('span.drink').html());
        $li.find('input.snack').val($li.find('span.snack').html());
        $li.find('input.special').val($li.find('span.special').html());

        // Add the edit class so it appears
        $li.addClass('edit');
    });
    // Cancel Edit Orders
    $orders.delegate('.cancelEdit', 'click', function () {
        // Remove the edit class to return to order listing
         $(this).closest('li').removeClass('edit');
    });
    // Save Order Edits Using PUT Request
    $orders.delegate('.saveEdit', 'click', function () {
        // Find the closest list item
        var $li = $(this).closest('li');

        // Orders object
        var order = {
            name : $li.find('input.name').val(),
            drink : $li.find('input.drink').val(),
            snack : $li.find('input.snack').val(),
            special : $li.find('input.special').val()
        };
        $.ajax({
            type: 'PUT',
            url: 'https://sean-h-coffee-api-project.herokuapp.com/orders/' + $li.attr('data-id'),
            data: order,
            success: function(newOrder) {
                //Update the span so the order displays the edits
                $li.find('span.name').html(order.name);
                $li.find('span.drink').html(order.drink);
                $li.find('span.snack').html(order.snack);
                $li.find('span.special').html(order.special);
                $li.removeClass('edit');
            },
            error: function() {
                alert('error updating order');
            }
        });
    });
});