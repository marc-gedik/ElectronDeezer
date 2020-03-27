// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {

  var checkExist = setInterval(function () {
    const login = $("#backstage_navigation_collapse")

    const searchInput = $("#topbar-search")
    const player = $("#page_player")

    const isSmall = () => window.innerWidth < 800;

    if (searchInput.length && player.length) {
      const sidebar = $("#page_sidebar")
      $('<div id="menu"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bars" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-bars fa-w-14"><path fill="currentColor" d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z" class=""></path></svg></div>')
        .prependTo('body')
        .on('click', () => sidebar.toggleClass("show"));

      sidebar.on('click', () => sidebar.toggleClass("show"))

      let x = window.screenLeft;
      let y = window.screenTop;
      $('<div id="collapse"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="expand" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-expand fa-w-14"><path fill="currentColor" d="M0 180V56c0-13.3 10.7-24 24-24h124c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H64v84c0 6.6-5.4 12-12 12H12c-6.6 0-12-5.4-12-12zM288 44v40c0 6.6 5.4 12 12 12h84v84c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12V56c0-13.3-10.7-24-24-24H300c-6.6 0-12 5.4-12 12zm148 276h-40c-6.6 0-12 5.4-12 12v84h-84c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h124c13.3 0 24-10.7 24-24V332c0-6.6-5.4-12-12-12zM160 468v-40c0-6.6-5.4-12-12-12H64v-84c0-6.6-5.4-12-12-12H12c-6.6 0-12 5.4-12 12v124c0 13.3 10.7 24 24 24h124c6.6 0 12-5.4 12-12z" class=""></path></svg></div>')
        .prependTo('body')
        .on('click', e => {
        if (isSmall()) {
          x = window.screenLeft;
          y = window.screenTop;
          window.resizeTo(800, 600)
          window.moveTo(((screen.width - 800) / 2), ((screen.height - 600) / 2));
        } else {
          window.resizeTo(400, 142)
          window.moveTo(x, y);
        }
      });

      clearInterval(checkExist)
    }

    if (login.length && isSmall()) {
      window.resizeTo(800, 600)
      window.moveTo(((screen.width - 800) / 2), ((screen.height - 600) / 2));
    }
  }, 500); // check every 500ms


})