App = {
  web3Provider: null,
  contracts: {},
  
  initDatepicker: function () {
    var today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    $('#startDate').datepicker({
        uiLibrary: 'bootstrap4',
        iconsLibrary: 'fontawesome',
        minDate: today,
        maxDate: function () {
            return $('#endDate').val();
        }
    });
    $('#endDate').datepicker({
        uiLibrary: 'bootstrap4',
        iconsLibrary: 'fontawesome',
        minDate: function () {
            return $('#startDate').val();
        }
    });
  },

  init: function() {
    // 初始化时间选择器
    App.initDatepicker();

    // Load hotel.
    $.getJSON('../hotel.json', function(data) {
      let hotel = data[0];
 

      // 设置酒店名字和信息
      $('#hotel_name').text(hotel.name);
      $('#hotel_location').text(hotel.location);
      $('#hotel_img').attr("src","../images/hotel.jpg");

      $('.alert').alert();
      $('#startDate').click(function ( ) {
        $('.alert').alert('close');
      })

      // 设置酒店房间
      let roomType = hotel.roomType;
      let rooms = $('tbody');
     
      for (let i = 0; i < roomType.length; i++) {
        let oneType = $('<tr></tr>');
        rooms.append(oneType)
        let roomTypeImg = $('<td></td>').append($('<img/>'));
        roomTypeImg.find('img').attr('src', roomType[i].imageUrl).attr("class", "img-thumbnail");
        oneType.append(roomTypeImg)
        let roomTypeName = $('<td></td>').text(roomType[i].type);
        oneType.append(roomTypeName);
        let roomTypePrice = $('<td></td>').text("¥" + roomType[i].price);
        oneType.append(roomTypePrice);
        let roomTypeBtn = $('<td></td>');
        roomTypeBtn.append($('<button>').text("预定").attr("class", "btn btn-success").attr("id", "order-btn"));
        oneType.append(roomTypeBtn);
        rooms.append(oneType);
      }
    });

    return App.initWeb3();
  },

  initWeb3: function() {
    /*
     * Replace me...
     */

    return App.initContract();
  },

  initContract: function() {
    /*
     * Replace me...
     */

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function(adopters, account) {
    /*
     * Replace me...
     */
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    /*
     * Replace me...
     */
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
