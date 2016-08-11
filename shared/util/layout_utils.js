const $ = require('jquery');
const Layer = require('react-layer');
const React = require('react');
//function to get scrollbar width
function getScrollbarWidth() {
  const outer = document.createElement("div");
  outer.style.visibility = "hidden";
  outer.style.width = "100px";
  outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

  document.body.appendChild(outer);

  const widthNoScroll = outer.offsetWidth;
  // force scrollbars
  outer.style.overflow = "scroll";

  // add innerdiv
  const inner = document.createElement("div");
  inner.style.width = "100%";
  outer.appendChild(inner);

  const widthWithScroll = inner.offsetWidth;

  // remove divs
  outer.parentNode.removeChild(outer);

  return widthNoScroll - widthWithScroll;
}

//try adding modal stylesheet in head, only in browser
try {
  const scrollbarWidth = getScrollbarWidth();
  window.onpopstate = function(event) {
    if ($('.modal-wrap').length === 0) $('html').removeClass('scroll-hidden');
  }
  $('head').append(`
        <style>
          html.scroll-hidden,html.scroll-hidden body{
              overflow: hidden;
              height:100vh;
          }
          html.scroll-hidden.pad-adjustment body{
              padding-right : ${scrollbarWidth}px;
          }
          html.scroll-hidden.pad-adjustment .fixed-elm{
              padding-right : ${scrollbarWidth}px;
          }
        </style>
    `)
} catch (e) {
  // console.log(e);
}


let scrollTop;
module.exports = {
  hideScrollBars : function(noPadAdjustment){
    scrollTop = $(window).scrollTop();
    $('html').addClass('scroll-hidden ' + (noPadAdjustment ? '' : ' pad-adjustment'));
    $('.body-wrap').css({
      marginTop : -scrollTop+'px'
    });

    // //avoid overscroll
    // $(document).on("touchmove.avoidOverScroll", function(e){ e.preventDefault(); });
    // $('body').on('touchstart.avoidOverScroll','.scrollable',function(e) {
    //   if (e.currentTarget.scrollTop === 0) {
    //     e.currentTarget.scrollTop = 1;
    //   } else if (e.currentTarget.scrollHeight === e.currentTarget.scrollTop + e.currentTarget.offsetHeight) {
    //     e.currentTarget.scrollTop -= 1;
    //   }
    // });
    // //prevents preventDefault from being called on document if it sees a scrollable div
    // $('body').on('touchmove.avoidOverScroll','.scrollable',function(e) {
    //   e.stopPropagation();
    // });
  },
  showScrollBars : function(){
    $('html').removeClass('scroll-hidden');
    $('.body-wrap').css({
      marginTop : ''
    });
    $('html,body').scrollTop(scrollTop);

    // //avoid overscroll
    // $(document).off("touchmove.avoidOverScroll");
    // $('body').off(".avoidOverScroll");
  },
  createLayeredComponent : (render) => {
    return React.createClass({

      propTypes: {
        container: React.PropTypes.any
      },

      componentWillUnmount() {
        this._layer.destroy()
        this._layer = null
      },

      componentDidUpdate() {
        this._renderOverlay();
      },

      componentDidMount() {
        this._renderOverlay();
      },

      _renderOverlay() {
        if (!this._layer) this._layer = new Layer(this.props.container || document.body, () => this._child)

        this._layer.render()
      },

      render() {
        this._child = render(this.props) //create the elements in render(), otherwise Owner can be lost
        return null;
      }
    })
  },
  getScrollbarWidth : function(){
    return scrollbarWidth;
  }
}
