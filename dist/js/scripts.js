/* ## Hamburger Menu
--------------------------------------------- */
const article = document.querySelector("#overlay");
const aside = document.querySelector("#sidebar");
const hamburger = document.querySelector("#toggle");
const navLinks = document.getElementsByClassName("nav__list-item");

Array.from(navLinks).forEach(element => {
  element.addEventListener('click', () => {
    document.getElementById("toggle").click();
  });
});

hamburger.addEventListener("click", readMore)

function readMore() {
    if (article.className == "overlay open") {
      // Read less
    article.className = "overlay close";
    hamburger. className = ('bttn_container off');
    aside. className = ('sidebar down');
  } else {
    article.className = "overlay open";
    hamburger. className = ('bttn_container active');
    aside. className = ('sidebar up');
  }
}






/* ## Add JS for Accordion info structure (Services section)
--------------------------------------------- */
(function(){
	var d = document,
	accordionToggles = d.querySelectorAll('.js-accordionTrigger'),
	setAria,
	setAccordionAria,
	switchAccordion,
  touchSupported = ('ontouchstart' in window),
  pointerSupported = ('pointerdown' in window);
  
  skipClickDelay = function(e){
    e.preventDefault();
    e.target.click();
  }

		setAriaAttr = function(el, ariaType, newProperty){
		el.setAttribute(ariaType, newProperty);
	};
	setAccordionAria = function(el1, el2, expanded){
		switch(expanded) {
      case "true":
      	setAriaAttr(el1, 'aria-expanded', 'true');
      	setAriaAttr(el2, 'aria-hidden', 'false');
      	break;
      case "false":
      	setAriaAttr(el1, 'aria-expanded', 'false');
      	setAriaAttr(el2, 'aria-hidden', 'true');
      	break;
      default:
				break;
		}
	};
//function
switchAccordion = function(e) {
  // console.log("triggered");
	e.preventDefault();
	var thisAnswer = e.target.parentNode.nextElementSibling;
	var thisQuestion = e.target;
	if(thisAnswer.classList.contains('is-collapsed')) {
		setAccordionAria(thisQuestion, thisAnswer, 'true');
	} else {
		setAccordionAria(thisQuestion, thisAnswer, 'false');
	}
  	thisQuestion.classList.toggle('is-collapsed');
  	thisQuestion.classList.toggle('is-expanded');
		thisAnswer.classList.toggle('is-collapsed');
		thisAnswer.classList.toggle('is-expanded');
 	
  	thisAnswer.classList.toggle('animateIn');
	};
	for (var i=0,len=accordionToggles.length; i<len; i++) {
		if(touchSupported) {
      accordionToggles[i].addEventListener('touchstart', skipClickDelay, false);
    }
    if(pointerSupported){
      accordionToggles[i].addEventListener('pointerdown', skipClickDelay, false);
    }
    accordionToggles[i].addEventListener('click', switchAccordion, false);
  }
})();




 
/* ## Add Slider to the Blog section
--------------------------------------------- */

// console.clear();


// Main Slider Animation
function initSliders() {
  gsap.set(".blog__inner", { autoAlpha: 1 });
  gsap.set(".blog__slide", { autoAlpha: 0, display: "flex" });

  let currentStep = 1;
  const totalSlides = document.querySelectorAll(".blog__slide").length;

  createTimelineIn("next", currentStep);

  // Timeline IN Animation
  function createTimelineIn(direction, index) {
    const goPrevious = direction === "previous";

    const element = document.querySelector("div.slide0" + index);
    const projectClasses = element.className.split("  ");
    const projectClass = projectClasses[1];

    const tlIn = gsap.timeline({ id: "tlIn", defaults: { duration: 1.34, ease: "myEaseSmooth" } });

    tlIn.fromTo(element, { xPercent: 101, autoAlpha: 0, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, autoAlpha: 1, ease: Expo.easeInOut }, "<");

    return tlIn;
  }

  //Timeline OUT Animation
  function createTimelineOut(direction, index) {
    const goPrevious = direction === "previous";
    const element = document.querySelector("div.slide0" + index);

    const tlOut = gsap.timeline({ id: "tlOut", defaults: { duration: 0.55, ease: "myEaseSmooth" } });

    tlOut.to(element, { xPercent: -101}, "<");

    return tlOut;
  }

  // Get goTo index
  function getGoToIndex(direction, index) {
    let goToIndex = index;

    if (direction === "next") {
      goToIndex = index < totalSlides ? index + 1 : 1;
    } else {
      goToIndex = index > 1 ? index - 1 : totalSlides;
    }

    return goToIndex;
  }

  // Update Current Step
  function updateCurrentStep(goToIndex) {
    currentStep = goToIndex;
  }

  //Master Timeline
  function transition(direction, index) {
    const goToIndex = getGoToIndex(direction, index);

    const tlTransition = gsap.timeline({
      onStart: () => {
        //console.log({ index }, { goToIndex });
        updateCurrentStep(goToIndex);
      },
    });

    const tlOut = createTimelineOut(direction, index);
    const tlIn = createTimelineIn(direction, goToIndex);

    tlTransition.add(tlOut);
    tlTransition.add(tlIn, "<");

    return tlTransition;
  }

  // Is Tweening
  function isTweening() {
    return gsap.isTweening(".blog__slide");
  }

  // Next Arrow
  const arrowNext = document.querySelector(".nextBttn");
  arrowNext.addEventListener("click", (e) => {
    e.preventDefault();

    !isTweening() && transition("next", currentStep);
  });
}

// Window onLoad
window.addEventListener("load", () => {
  initSliders();
});

// END BLOG CODE




// /* ## Anime
// --------------------------------------------- */


/* Start Portfolio Anime
// -------------------------- */
gsap.registerPlugin(ScrollTrigger);

// Portfolio Item One
gsap.set(".portfolio--01", { yPercent: 15, autoAlpha: 0 });
gsap.set(".number--01", { yPercent: -6});
gsap.set(".img--01", { yPercent: -15});
gsap.set(".meta--01", { yPercent: -60});

gsap.to(".portfolio--01", {
  yPercent: -5,
  autoAlpha: 1,
  ease: "none",
  scrollTrigger: {
    trigger: ".portfolio--01",
    start: "22% 85%",
    end: "0 55%",
    scrub: 1
  }, 
});

gsap.to(".number--01", {
  yPercent: 5,
  ease: "none",
  scrollTrigger: {
    trigger: ".portfolio--01",
    scrub: 1,
    // markers: true
  }, 
});

gsap.to(".img--01", {
  yPercent: 20,
  ease: "none",
  scrollTrigger: {
    trigger: ".portfolio--01",
    scrub: 1
  }, 
});

gsap.to(".meta--01", {
  yPercent: -10,
  ease: "none",
  scrollTrigger: {
    trigger: ".portfolio--01",
    scrub: 1
  }, 
});
// End Portfolio Item One


// Start Portfolio Item Two
gsap.set(".portfolio--02", { yPercent: 15, autoAlpha: 0 });
gsap.set(".number--02", { yPercent: -6});
gsap.set(".img--02", { yPercent: -15});
gsap.set(".meta--02", { yPercent: -60});

gsap.to(".portfolio--02", {
  yPercent: -5,
  autoAlpha: 1,
  ease: "none",
  scrollTrigger: {
    trigger: ".portfolio--02",
       start: "22% 85%",
    end: "0 55%",
    scrub: 1
  }, 
});

gsap.to(".number--02", {
  yPercent: 5,
  ease: "none",
  scrollTrigger: {
    trigger: ".portfolio--02",
    scrub: 1,
  }, 
});

gsap.to(".img--02", {
  yPercent: 20,
  ease: "none",
  scrollTrigger: {
    trigger: ".portfolio--02",
    scrub: 1
  }, 
});

gsap.to(".meta--02", {
  yPercent: -10,
  ease: "none",
  scrollTrigger: {
    trigger: ".portfolio--02",
    scrub: 1
  }, 
});
// End Portfolio Item Two

// Start Portfolio Item Three
gsap.set(".portfolio--03", { yPercent: 15, autoAlpha: 0 });
gsap.set(".number--03", { yPercent: -6});
gsap.set(".img--03", { yPercent: -15});
gsap.set(".meta--03", { yPercent: -60});

gsap.to(".portfolio--03", {
  yPercent: -5,
  autoAlpha: 1,
  ease: "none",
  scrollTrigger: {
    trigger: ".portfolio--03",
       start: "22% 85%",
    end: "0 55%",
    scrub: 1
  }, 
});

gsap.to(".number--03", {
  yPercent: 5,
  ease: "none",
  scrollTrigger: {
    trigger: ".portfolio--03",
    scrub: 1,
  }, 
});

gsap.to(".img--03", {
  yPercent: 20,
  ease: "none",
  scrollTrigger: {
    trigger: ".portfolio--03",
    scrub: 1
  }, 
});

gsap.to(".meta--03", {
  yPercent: -10,
  ease: "none",
  scrollTrigger: {
    trigger: ".portfolio--03",
    scrub: 1
  }, 
});
// End Portfolio Item Three

// Start Portfolio Item Four
gsap.set(".portfolio--04", { yPercent: 15, autoAlpha: 0 });
gsap.set(".number--04", { yPercent: -6});
gsap.set(".img--04", { yPercent: -15});
gsap.set(".meta--04", { yPercent: -60});

gsap.to(".portfolio--04", {
  yPercent: -5,
  autoAlpha: 1,
  ease: "none",
  scrollTrigger: {
    trigger: ".portfolio--04",
       start: "22% 85%",
    end: "0 55%",
    scrub: 1
  }, 
});

gsap.to(".number--04", {
  yPercent: 5,
  ease: "none",
  scrollTrigger: {
    trigger: ".portfolio--04",
    scrub: 1,
  }, 
});

gsap.to(".img--04", {
  yPercent: 20,
  ease: "none",
  scrollTrigger: {
    trigger: ".portfolio--04",
    scrub: 1
  }, 
});

gsap.to(".meta--04", {
  yPercent: -10,
  ease: "none",
  scrollTrigger: {
    trigger: ".portfolio--04",
    scrub: 1
  }, 
});
// End Portfolio Item Four

// Start Portfolio Item Five
gsap.set(".portfolio--05", { yPercent: 15, autoAlpha: 0 });
gsap.set(".number--05", { yPercent: -6});
gsap.set(".img--05", { yPercent: -15});
gsap.set(".meta--05", { yPercent: -60});

gsap.to(".portfolio--05", {
  yPercent: -5,
  autoAlpha: 1,
  ease: "none",
  scrollTrigger: {
    trigger: ".portfolio--05",
       start: "22% 85%",
    end: "0 55%",
    scrub: 1
  }, 
});

gsap.to(".number--05", {
  yPercent: 5,
  ease: "none",
  scrollTrigger: {
    trigger: ".portfolio--05",
    scrub: 1,
  }, 
});

gsap.to(".img--05", {
  yPercent: 20,
  ease: "none",
  scrollTrigger: {
    trigger: ".portfolio--05",
    scrub: 1
  }, 
});

gsap.to(".meta--05", {
  yPercent: -10,
  ease: "none",
  scrollTrigger: {
    trigger: ".portfolio--05",
    scrub: 1
  }, 
});
// End Portfolio Item Five

// Start Portfolio Item Six
gsap.set(".portfolio--06", { yPercent: 15, autoAlpha: 0 });
gsap.set(".number--06", { yPercent: -6});
gsap.set(".img--06", { yPercent: -15});
gsap.set(".meta--06", { yPercent: -60});

gsap.to(".portfolio--06", {
  yPercent: -5,
  autoAlpha: 1,
  ease: "none",
  scrollTrigger: {
    trigger: ".portfolio--06",
       start: "22% 85%",
    end: "0 55%",
    scrub: 1
  }, 
});

gsap.to(".number--06", {
  yPercent: 5,
  ease: "none",
  scrollTrigger: {
    trigger: ".portfolio--06",
    scrub: 1,
  }, 
});

gsap.to(".img--06", {
  yPercent: 20,
  ease: "none",
  scrollTrigger: {
    trigger: ".portfolio--06",
    scrub: 1
  }, 
});

gsap.to(".meta--06", {
  yPercent: -10,
  ease: "none",
  scrollTrigger: {
    trigger: ".portfolio--06",
    scrub: 1
  }, 
});
// End Portfolio Item Six



/* ## Pin the Light block
--------------------------------------------- */

ScrollTrigger.create({
  trigger: ".light",
  start: "-300px top",
  toggleClass: {
    targets: '.light',
    className: 'highlight-wrap'
  },
  scrub: true,
  pin: ".bg--lines",
  pinSpacing: false,
  // markers: true
});

// LOGO
ScrollTrigger.create({
  trigger: ".light",
  start: "-40px top",
  toggleClass: {
    targets: '.logo',
    className: 'logo--highlight'
  },
  pinSpacing: false,
  scrub: true
});

// Hamburger Menu
ScrollTrigger.create({
  trigger: ".light",
  start: "-65px top",
  toggleClass: {
    targets: '.burger',
    className: 'burger--highlight'
  },
  pinSpacing: false,
  scrub: true
});

// Menu Overlay
ScrollTrigger.create({
  trigger: ".light",
  start: "-65px top",
  toggleClass: {
    targets: '.nav',
    className: 'nav--highlight'
  },
  pinSpacing: false,
  scrub: true
});

// Add class to Highlight Social Icons
ScrollTrigger.create({
  trigger: ".light",
  start: "-300px top",
  toggleClass: {
    targets: '.sidebar__icons',
    className: 'icons--highlight'
  },
  scrub: true
});

// Add class to Highlight Logo
ScrollTrigger.create({
  trigger: ".light",
  start: "-300px top",
  toggleClass: {
    targets: '.logo__toplink',
    className: 'logo--highlight'
  },
  scrub: true
});

// Add class to Overlay
ScrollTrigger.create({
  trigger: ".light",
  start: "-300px top",
  toggleClass: {
    targets: '.overlay--info',
    className: 'overlay--highlight'
  },
  scrub: true
});


// Get in touch Button Fade In
gsap.to(".anime-btn", {
  scrollTrigger: {
    trigger: "#intro",
    start: "top 10%",
    end: "bottom -300%",
    ease:Power1. easeInOut
  },
 autoAlpha: 1
});



// About section text

var actionAboot = gsap.to('.anime-2', { 'clip-path': 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)', stagger: 0.5, delay: 0.25, autoAlpha: 1, y: 0, duration: 2.2, ease: "power4.inOut" , paused:true });

ScrollTrigger.create({
  trigger: ".about",
  start: "-20% top",
  onEnter: () => actionAboot.play(),
  onLeaveBack: () => actionAboot.reverse(),
        markers: {
        startColor: "white",
        endColor: "yellow",
        fontSize: "18px",
        indent: 10
      }
});



/* ## Hide Secondary menu on scroll
--------------------------------------------- */

var actionNav = gsap.fromTo('.menu--item', { autoAlpha: 1, x:'+=0' }, { x:'+=360', stagger:0.1, autoAlpha: 0, duration:0.4, ease:'back.in(1.7)', paused:true });

ScrollTrigger.create({
  trigger: ".header",
  start: "6px top",
  onEnter: () => actionNav.play(),
  onLeaveBack: () => actionNav.reverse(),
});



/* ## Show Hamburger menu on scroll - only over 1024px
--------------------------------------------- */
ScrollTrigger.matchMedia({

  "(min-width: 1024px)": function() {
    var actionBurger = gsap.fromTo('.bttn_container', { autoAlpha:0, x:'-=10' }, { x:'+=10', duration:0.1, autoAlpha:1, ease:'back.in(1.7)', paused:true });
 
    ScrollTrigger.create({
        trigger: ".header",
        start: "6px top",
        onEnter: () => actionBurger.play(),
        onLeaveBack: () => actionBurger.reverse(),
      });
    }
 
  });



/* ## Big scroll to btn
--------------------------------------------- */
const btt = document.querySelector(".arrow-down");

btt.addEventListener("click", () => gsap.to(window, {scrollTo:"#portfolio",}));
gsap.to(btt, {  ease:Power1. easeInOut }
);




/* ## Start animation for the header intro.
--------------------------------------------- */

// Main Heading - Noah Breen Animation in 


gsap.fromTo('h1 .block-01',{ "--scaleX": 1, "--tx": "150vw" }, { "--scaleX": 0, "--tx": 0, stagger: 1, duration: 3, ease: "bounce.out"});
gsap.to('h1 .block-02',{ autoAlpha: 1, duration: 2.5, delay: 1, ease: "power1.out" }, "<");


gsap.fromTo('h1 .block-03',{ "--scaleX": 1, "--tx": "-150vw" }, { "--scaleX": 0, "--tx": 0, stagger: 1, duration: 3, delay: 0.25, ease: "bounce.out"});
gsap.fromTo('h1 .block-04', { autoAlpha: 0 }, { autoAlpha: 1, duration: 2.5, delay: 1, ease: "power1.out" }, "<");

gsap.fromTo('.ball', { autoAlpha: 0  }, { autoAlpha: 1, duration: 4, delay: 2, ease: "power1.out"});

// // Header Tag-Line & Intro Text
gsap.to('.header__tag-line', { 'clip-path': 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)', delay: 1, autoAlpha: 1, y: 0, duration: 2.2, ease: "power4.inOut" });
gsap.to('.anime-1', { 'clip-path': 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)', stagger: 0.5, delay: 1, autoAlpha: 1, y: 0, duration: 2.2, ease: "power4.inOut" });




// All H2 Headings

gsap.config({
  nullTargetWarn: false,
});
let targets = gsap.utils.toArray("article");

targets.forEach((target) => {
  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: target,
      start: "0% 55%",
      // markers: {
      //   startColor: "white",
      //   endColor: "yellow",
      //   fontSize: "18px",
      //   indent: 10
      // }
    },
    defaults: { ease: "none" },
  });
  
  tl.fromTo(
    target.querySelector(".block-05"),
    { "--scaleX": 1, "--tx": "-150vw" },
    { "--scaleX": 0, "--tx": 0, duration: 3, ease: "bounce.out"}
  )

  tl.fromTo(
    target.querySelector(".alpha-block-05"),
    { "--scaleX": 1, "--tx": "-150vw" },
    { "--scaleX": 0, "--tx": 0, duration: 3, ease: "bounce.out"}, "<=-0.15"
  )
  
    tl.fromTo(
    target.querySelector(".block-06"),
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 2.5, delay: 1, ease: "power1.out" }, "<"
  )

  // Small Headings
  tl.fromTo(
    target.querySelector(".small-fade"),
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 1.9, delay: 1, ease: "power1.out" }, "<"
  )
 
});


