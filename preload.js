const { size } = require("./shared")

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {

  const isSmall = () => window.innerWidth < size.expanded.width;

  function expand() {
    const {width, height} = size.expanded
    window.resizeTo(width, height)
    window.moveTo(((screen.width - width) / 2), ((screen.height - height) / 2));
  }

  function createMenuToggle() {
    const sidebar = document.getElementsByClassName("css-efpag6")[0];
    var menu = document.createElement('div')
    menu.innerHTML = '<div id="menu"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bars" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-bars fa-w-14"><path fill="currentColor" d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z" class=""></path></svg></div>'
    document.body.prepend(menu);
    menu.addEventListener('click', () => sidebar.classList.toggle("show"));
    sidebar.addEventListener('click', () => sidebar.classList.toggle("show"));
  }

  function createExpandToggle() {
      let x = window.screenLeft;
      let y = window.screenTop;
      const collapse = document.createElement('div')
      collapse.innerHTML = '<div id="collapse"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="expand" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-expand fa-w-14"><path fill="currentColor" d="M0 180V56c0-13.3 10.7-24 24-24h124c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H64v84c0 6.6-5.4 12-12 12H12c-6.6 0-12-5.4-12-12zM288 44v40c0 6.6 5.4 12 12 12h84v84c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12V56c0-13.3-10.7-24-24-24H300c-6.6 0-12 5.4-12 12zm148 276h-40c-6.6 0-12 5.4-12 12v84h-84c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h124c13.3 0 24-10.7 24-24V332c0-6.6-5.4-12-12-12zM160 468v-40c0-6.6-5.4-12-12-12H64v-84c0-6.6-5.4-12-12-12H12c-6.6 0-12 5.4-12 12v124c0 13.3 10.7 24 24 24h124c6.6 0 12-5.4 12-12z" class=""></path></svg></div>'
      document.body.prepend(collapse)
      collapse.addEventListener('click', e => {
        if (isSmall()) {
          x = window.screenLeft;
          y = window.screenTop;
          expand()
        } else {
          window.resizeTo(size.collapsed.width, size.collapsed.height)
          window.moveTo(x, y);
        }
      });
  }

  var checkExist = setInterval(function () {
    const unlogged = document.getElementById("unlogged-body")

    if (!unlogged) {
      document.addEventListener("wheel", event => event.stopImmediatePropagation(), true);
      createMenuToggle();
      createExpandToggle()
      clearInterval(checkExist)
    } else if(isSmall) {
      expand()
    }
  }, 500); // check every 500ms
})