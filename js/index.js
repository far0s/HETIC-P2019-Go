var pages = $('.pages').children();
pages.each(function(i) {
  var page = $(this);
  if (i % 2 === 0) {
    page.css('z-index', (pages.length - i)); 
  }
});

$(window).load(function() {
  $('.page').click(function() {
    var page = $(this);
    var page_num = pages.index(page) + 1;
    if (page_num % 2 === 0) {
      $('#play').click(function() {
        console.log('play !');
        $('book').addClass('swiped');
      });
      page.removeClass('flipped');
      page.prev().removeClass('flipped');
      console.log('flip back !');
    } else {
      page.addClass('flipped');
      page.next().addClass('flipped');
      console.log('flip !');
    }
  });
  $('.book').addClass('bound');
});