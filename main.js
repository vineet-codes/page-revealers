import charming from "charming";
import gsap from "gsap";

import './style.css'

class Revealer {
  constructor(el, options) {
      this.options = {
          angle: 0
      };
      Object.assign(this.options, options);

      this.DOM = {};
      this.DOM.el = el;
      this.DOM.inner = this.DOM.el.firstElementChild;
      
      this.DOM.inner.style.width = `calc(100vw * ${Math.abs(Math.cos(this.options.angle * Math.PI/180))} + 100vh * ${Math.abs(Math.sin(this.options.angle * Math.PI/180))})`;
      this.DOM.inner.style.height = `calc(100vw * ${Math.abs(Math.sin(this.options.angle * Math.PI/180))} + 100vh * ${Math.abs(Math.cos(this.options.angle * Math.PI/180))})`;
      this.DOM.el.style.transform = `rotate3d(0,0,1,${this.options.angle}deg)`;

      this.DOM.reverse = this.DOM.inner.querySelector('.content__reverse');
      if ( this.DOM.reverse ) {
          gsap.set(this.DOM.reverse, {rotation: -1*this.options.angle});
      }
  }
}

 // Content elements
 const content = {
  first: document.querySelector('.content--first'),
  second: document.querySelector('.content--second')
};

// First page's content.
const firstPageContent = {
  img: content.first.querySelector('.intro__img'),
  title: content.first.querySelector('.intro__title'),
  enter: content.first.querySelector('.intro__enter')
};

// Splitting letters for the firstPageContent.title element (just adding a bit more feeling to it)
charming(firstPageContent.title);
firstPageContent.titleLetters = [...firstPageContent.title.querySelectorAll('span')];
firstPageContent.titleLetters.sort(() => Math.round(Math.random())-0.5);
// some random letters
let letters = firstPageContent.titleLetters.filter(_ => Math.random() < .5);
// remaining
let otherletters = firstPageContent.titleLetters.filter(el => letters.indexOf(el) < 0);

// Second page's content.
const secondPageContent = {
  backCtrl: content.second.querySelector('.content__back')
};

// Revealer element
const revealer = new Revealer(content.first, {angle: 35});
// overlays
const overlays = [];
const overlayElems = [...document.querySelectorAll('.overlay')];
const overlaysTotal = overlayElems.length;
overlayElems.forEach((overlay,i) => overlays.push(new Revealer(overlay, {angle: i % 2 === 0 ? -3 : 3})));

var pageToggleTimeline = undefined;

// // Animate things: show revealer animation, animate first page elements out (optional) and animate second page elements in (optional)
const showNextPage = () => {
  // Pointer events related class
  content.first.classList.add('content--hidden');

  const duration = 1;
  pageToggleTimeline = gsap.timeline()
  // Animate first page elements (optional)
    .to(firstPageContent.img, {
      duration: duration,
      ease: "power2.inOut",
      y: -150,
      scaleY: 1.1,
      opacity: 0
      }, 0)
    .to(otherletters,  {
      duration: duration*0.8,
      ease: "power2.inOut",
      y: '-100%',
      scaleX: 0.8,
      scaleY: 1.5,
      opacity: 0,
      stagger: 0.04,
      },  0)
    .to(firstPageContent.enter, {
      duration: duration*0.5,
      ease: "power2.inOut",
      opacity: 0
      }, 0)
    .to(revealer.DOM.inner,  {
      duration: duration,
      ease: "power2.inOut",
      y: '-100%'
      }, 0)
    .to(revealer.DOM.reverse, {
      duration: duration, 
      ease: "power2.inOut",
      y: '100%'
      }, 0);
    
    //  // Animate overlays
     let t = 0;
     for (let i = 0; i <= overlaysTotal-1; ++i) {
        t = 0.2*i+0.2
        pageToggleTimeline
          .to(overlays[overlaysTotal-1-i].DOM.inner, {
              duration: duration,
              ease: "power2.inOut",
              y: '-100%'
          }, t);
        console.log(pageToggleTimeline)
      }
};
firstPageContent.enter.addEventListener('click', showNextPage);

//  // Animate back
const showIntro = () => {
// Pointer events related class
content.first.classList.remove('content--hidden');
pageToggleTimeline.reverse();
};
secondPageContent.backCtrl.addEventListener('click', showIntro);

// Hover animation on the intro "enter" element
let enterHoverAnimationRunning = false;
const onEnterHoverFn = () => {
    if ( enterHoverAnimationRunning ) {
        return false;
    }
    enterHoverAnimationRunning = true;
    
    letters = firstPageContent.titleLetters.filter(_ => Math.random() < .5);
    otherletters = firstPageContent.titleLetters.filter(el => letters.indexOf(el) < 0);

    gsap.timeline({onComplete: () => enterHoverAnimationRunning = false})
      .to(letters, {duration: 0.2, ease: 'power2.in', y: '-100%', opacity: 0, stagger: 0.04}, 0)
      .to(letters, { duration: 0.6, ease: 'power2.out', startAt: {y: '35%'}, y: '0%', opacity: 1, stagger:0.04},  0.2);
};
firstPageContent.enter.addEventListener('mouseenter', onEnterHoverFn);