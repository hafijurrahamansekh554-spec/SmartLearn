/* =====================================================
   SMARTLEARN - GLOBAL SCRIPT
   ===================================================== */


/* =========================
   CURRENT USER
   ========================= */

function getCurrentUser(){

    try{

        return JSON.parse(
            localStorage.getItem(
                "currentUser"
            )
        );

    }catch{

        return null;

    }

}


function isLoggedIn(){

    return !!getCurrentUser();

}


/* =========================
   USER NAME
   ========================= */

function getUserName(){

    const user =
        getCurrentUser();

    return (
        user?.name ||
        "Student"
    );

}


/* =========================
   USER EMAIL
   ========================= */

function getUserEmail(){

    const user =
        getCurrentUser();

    return (
        user?.email ||
        ""
    );

}


/* =========================
   LOGOUT
   ========================= */

function logout(){

    localStorage.removeItem(
        "currentUser"
    );

    window.location.href =
        "login.html";

}


/* =========================
   PROTECT PAGE
   ========================= */

function protectPage(){

    const protectedPages = [

        "dashboard.html",
        "profile.html",
        "lesson.html",
        "quiz.html",
        "certificate.html",
        "achievements.html",
        "leaderboard.html",
        "ai-tutor.html",
        "recommendations.html"

    ];


    const page =
        window.location.pathname
        .split("/")
        .pop();


    if(
        protectedPages.includes(page) &&
        !isLoggedIn()
    ){

        window.location.href =
            "login.html";

    }

}


/* =========================
   AUTH BUTTONS
   ========================= */

function updateAuthButtons(){

    const user =
        getCurrentUser();


    document
        .querySelectorAll(
            "[data-user-name]"
        )
        .forEach(
            element => {

                element.textContent =
                    user?.name ||
                    "Student";

            }
        );


    document
        .querySelectorAll(
            "[data-user-email]"
        )
        .forEach(
            element => {

                element.textContent =
                    user?.email ||
                    "";

            }
        );


    document
        .querySelectorAll(
            "[data-user-avatar]"
        )
        .forEach(
            element => {

                element.textContent =
                    (
                        user?.name ||
                        "S"
                    )
                    .charAt(0)
                    .toUpperCase();

            }
        );


    document
        .querySelectorAll(
            "[data-login]"
        )
        .forEach(
            element => {

                element.style.display =
                    user
                        ? "none"
                        : "";

            }
        );


    document
        .querySelectorAll(
            "[data-logout]"
        )
        .forEach(
            element => {

                element.style.display =
                    user
                        ? ""
                        : "none";

            }
        );

}


/* =========================
   SCROLL REVEAL
   ========================= */

function initScrollReveal(){

    const elements =
        document.querySelectorAll(
            ".reveal, .reveal-left, .reveal-right"
        );


    if(!elements.length){

        return;

    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if(
                            entry.isIntersecting
                        ){

                            entry.target
                                .classList
                                .add("active");

                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold:.12
            }
        );


    elements.forEach(
        element => {

            observer.observe(
                element
            );

        }
    );

}


/* =========================
   COUNTER ANIMATION
   ========================= */

function initCounters(){

    const counters =
        document.querySelectorAll(
            "[data-counter]"
        );


    counters.forEach(
        counter => {

            const target =
                Number(
                    counter.dataset.counter
                );


            if(
                isNaN(target)
            ){

                return;

            }


            let current = 0;

            const duration = 1200;

            const start =
                performance.now();


            function update(time){

                const progress =
                    Math.min(
                        (
                            time -
                            start
                        ) /
                        duration,
                        1
                    );


                current =
                    Math.floor(
                        target *
                        progress
                    );


                counter.textContent =
                    current;


                if(
                    progress < 1
                ){

                    requestAnimationFrame(
                        update
                    );

                }else{

                    counter.textContent =
                        target;

                }

            }


            requestAnimationFrame(
                update
            );

        }
    );

}


/* =========================
   TYPING ANIMATION
   ========================= */

function initTyping(){

    const elements =
        document.querySelectorAll(
            "[data-typing]"
        );


    elements.forEach(
        element => {

            const text =
                element.dataset.typing;


            if(!text){

                return;

            }


            let index = 0;


            element.textContent = "";


            const cursor =
                document.createElement(
                    "span"
                );


            cursor.className =
                "typing-cursor";


            element.appendChild(
                cursor
            );


            function type(){

                if(
                    index <
                    text.length
                ){

                    cursor.before(
                        text.charAt(
                            index
                        )
                    );

                    index++;

                    setTimeout(
                        type,
                        65
                    );

                }

            }


            type();

        }
    );

}


/* =========================
   PAGE LOADER
   ========================= */

function initPageLoader(){

    let loader =
        document.getElementById(
            "pageLoader"
        );


    if(!loader){

        loader =
            document.createElement(
                "div"
            );


        loader.id =
            "pageLoader";


        loader.innerHTML = `

            <div class="loader-content">

                <div class="loader-logo">
                    SmartLearn
                </div>

                <div class="loader-spinner">
                </div>

            </div>

        `;


        document.body.prepend(
            loader
        );

    }


    window.addEventListener(
        "load",
        () => {

            setTimeout(
                () => {

                    loader.classList.add(
                        "hide"
                    );

                },
                350
            );

        }
    );

}


/* =========================
   ACTIVE NAV
   ========================= */

function initActiveNav(){

    const page =
        window.location.pathname
        .split("/")
        .pop();


    document
        .querySelectorAll(
            "nav a"
        )
        .forEach(
            link => {

                const href =
                    link.getAttribute(
                        "href"
                    );


                if(
                    href === page
                ){

                    link.classList.add(
                        "active-nav"
                    );

                }

            }
        );

}


/* =========================
   SMOOTH SCROLL
   ========================= */

function initSmoothScroll(){

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    function(event){

                        const target =
                            document.querySelector(
                                this.getAttribute(
                                    "href"
                                )
                            );


                        if(target){

                            event.preventDefault();


                            target.scrollIntoView({
                                behavior:"smooth",
                                block:"start"
                            });

                        }

                    }
                );

            }
        );

}


/* =========================
   TOAST
   ========================= */

function showToast(
    message
){

    const old =
        document.querySelector(
            ".smart-toast"
        );


    if(old){

        old.remove();

    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        "smart-toast";


    toast.textContent =
        message;


    document.body.appendChild(
        toast
    );


    setTimeout(
        () => {

            toast.style.opacity =
                "0";


            toast.style.transform =
                "translateY(20px)";


            setTimeout(
                () => {

                    toast.remove();

                },
                300
            );

        },
        2500
    );

}


/* =========================
   INITIALIZE
   ========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        protectPage();

        updateAuthButtons();

        initScrollReveal();

        initCounters();

        initTyping();

        initPageLoader();

        initActiveNav();

        initSmoothScroll();

    }
);