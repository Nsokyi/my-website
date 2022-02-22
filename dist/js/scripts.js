// Hamburger menu
const article = document.querySelector("#overlay");
const hamburger = document.querySelector("#toggle");

hamburger.addEventListener("click", readMore);

function readMore() {
    if (article.className == "overlay open") {
      // Read less
    article.className = "overlay close";
    hamburger. className = ('bttn_container off');
  } else {
    article.className = "overlay open";
    hamburger. className = ('bttn_container active');
  }
}


// JS for Accordion info structure in the Services section 
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




// Add Slider to the Blog section 
 
console.clear();


// Main Slider Animation
function initSliders() {
  gsap.set(".blog__inner", { autoAlpha: 1 });
  gsap.set(".blog__slide", { opacity: 0, display: "flex" });

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

    tlIn.fromTo(element, { xPercent: 101, autoAlpha: 0, opacity: 0 }, { xPercent: 0, autoAlpha: 1, opacity: 1, ease: Expo.easeInOut }, "<");

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
  

  // Previous Arrow
  const arrowPrevious = document.querySelector(".prevBttn");
  arrowPrevious.addEventListener("click", (e) => {
    e.preventDefault();

    !isTweening() && transition("previous", currentStep);
  });
}

// Window onLoad
window.addEventListener("load", () => {
  initSliders();
});
