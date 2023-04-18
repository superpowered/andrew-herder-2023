(function ($) {$( document ).ready(function()
{
    console.log(' Hello, My Treacherous Friends.');

    /************************************************
     *
     * Global Variables
     *
     ************************************************/

    //Main DOM refs.
    var $html = $('html');
    var $body = $('body');
    var $window = $(window);

    //Canvas / Particle
    var $canvas = $('.canvas-bg');
    var canvasWidth = $canvas.innerWidth();
    var canvasHeight = $canvas.innerHeight();
    var centerX = canvasWidth/2;
    var centerY = canvasHeight/2;
    var particleTemplate = $('.particle-template').html();
    var $particles;
    var particleArray = [];
    var particleCount = 100;
    var particleSpacing = 1;
    var particleColors =
    [
        '#ffffff',
        '#00ff0f',
        '#ff5e46',
        '#58fffa',
        '#f7ff80',
        '#d18cff'
    ];
    var particleAnimations = [false, false, false, false];

    //Mouse pos
    var mouseX = 0;
    var mouseY = 0;

    var canClick = true;
    var scrollTop = 0;

    //Sections
    var activeSection = false;
    var sections = [];

    //Graph specific
    var graphAnim = false;
    var graphActive = false;
    var graphAnimation = false;
    var graphTimeouts = [];
    var $skillsGraph = $('.skills-graph');
    var points_to = $skillsGraph.data('points-to');
    var points_from = $skillsGraph.data('points-from');

    //Project Specific
    var $project_image = $('.project-preview-image-wrapper');
    var $projectPreviewImage = $('.project-preview-image');
    var $projectLinks = $('.project-link');

    /************************************************
     *
     * Utility
     *
     ************************************************/

    // Utility Functions
    function randomIntFromRange(min,max)
    {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function randomColor(colors)
    {
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function debounce(func, wait, immediate)
    {
        var timeout;
        return function()
        {
            var context = this, args = arguments;
            var later = function()
            {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    function throttle(func, limit)
    {
        var lastFunc;
        var lastRan;
        return function()
        {
            const context = this;
            const args = arguments;
            if (!lastRan)
            {
                func.apply(context, args);
                lastRan = Date.now()
            }
            else
            {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function()
                {
                    if ((Date.now() - lastRan) >= limit)
                    {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }

    function updateMousePos(e)
    {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }

    function setCookie(cname, cvalue, exdays)
    {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";path=/;" + expires;
    }

    function getCookie(cname)
    {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i <ca.length; i++)
        {
            var c = ca[i];
            while (c.charAt(0) == ' ')
            {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0)
            {
                return c.substring(name.length,c.length);
            }
        }
        return "";
    }

    function bodyScrollLock()
    {
        $body.css('top', -(document.documentElement.scrollTop) + 'px');

        if ($(document).height() > $(window).height())
        {
            scrollTop = ($html.scrollTop()) ? $html.scrollTop() : $body.scrollTop();
            $body.css('top',-scrollTop);
        }
        else
        {
            scrollTop = 0;
        }
    }
    function bodyScrollUnlock()
    {
        window.scrollTo(0, scrollTop);
    }

    /************************************************
     *
     * Navigation Functions
     *
     ************************************************/

    function initNavigation()
    {
        $('.particle-control-toggle').click(function ()
        {
            $('.particle-control').toggleClass('active');
        });

        $('.particle-control li').click(function ()
        {
            var count = $(this).data('count');
            if((count || count === 0) && count != particleCount)
            {
                canClick = false;
                $html.addClass('loader-active');

                $('.particle-control li').removeClass('selected');
                $(this).addClass('selected');
                $('.particle-control').removeClass('active');

                setTimeout(function ()
                {
                    particleCount = count;
                    setCookie('p_count',particleCount,20*365);

                    destroyScene();

                    initScene();

                    removeLoader();

                    canClick = true;

                }, 500);
            }
        });

        $('.particle-control li[data-count="'+particleCount+'"]').addClass('selected');

        $('.hamburger').click(function ()
        {
            $('.hamburger-nav').toggleClass('active');
        });
    }

    /************************************************
     *
     * App Init / Destroy
     *
     ************************************************/

    function start()
    {
        //Less particles on smaller screens
        if(canvasWidth < 600)
            particleCount = 50;

        //check cookies
        var cookieCount = getCookie('p_count');
        if(cookieCount)
            particleCount = cookieCount;

        initNavigation();

        //fire up scene
        initScene();

        window.onload = removeLoader;
    }

    function destroyScene()
    {
        destroyIntroSection();
        destroyProjectSection();
        destroyGraphSection();
        destroyContactSection();

        clearParticleAnimations();

        $particles.remove();
        $window.off( "scroll");
        activeSection = false;
    }

    function initScene()
    {
        particleArray = [];
        particleAnimations = [false, false, false, false];
        canvasWidth = $canvas.innerWidth();
        canvasHeight = $canvas.innerHeight();
        centerX = canvasWidth/2;
        centerY = canvasHeight/2;

        for(var x = 0; x < particleCount; x++)
        {
            makeParticle(x);
        }
        $particles = $('.particle');

        findSectionHeights();

        $window.on( "scroll", checkScrollSection);

        initIntroSection();

        addFancyLabel( $('.form-field input'));
        addFancyLabel( $('.form-field textarea'));
        addFancyLabel( $('.form-field select'));
    }

    function removeLoader()
    {
        setTimeout(function()
        {
            $html.removeClass('loader-active');
        },1500);
    }

    var resizeInit = debounce(function()
    {
        //don't run on ios scroll height change
        if (canvasWidth + 30 > $canvas.innerWidth() &&
            canvasWidth - 30 < $canvas.innerWidth())
            return;

            destroyScene();
            initScene();
            removeLoader();

    }, 250);

    window.addEventListener('resize', resizeInit);

    /************************************************
     *
     * Particle Functions
     *
     ************************************************/

    function makeRandomParticlePosition()
    {
        var xPos = randomIntFromRange(0,canvasWidth);
        var yPos = randomIntFromRange(0,canvasHeight);
        return {x: xPos, y: yPos}
    }

    function checkParticlePosition(position1, position2)
    {
        //check x
        if(position1.x <= position2.x && position1.x >= position2.x - particleSpacing)
            return false;
        else if(position1.x >= position2.x && position1.x <= position2.x + particleSpacing)
            return false;

        //check y
        if(position1.y <= position2.y && position1.y >= position2.y - particleSpacing)
            return false;
        else if(position1.y >= position2.y && position1.y <= position2.y + particleSpacing)
            return false;

        return true;
    }

    function makeParticle(particleNumber)
    {
        var thisParticle = {};
        var validPosition = false;
        var position = false;
        var timesRun = 0;

        while(!validPosition)
        {
            position = makeRandomParticlePosition();

            validPosition = true;

            //check against array
            for(var x = 0; x < particleArray.length; x++)
            {
                var particleCheck = particleArray[x];
                var positionCheck = checkParticlePosition(position,particleCheck.position);
                if(!positionCheck)
                {
                    validPosition = positionCheck;
                    break;
                }
            }
            timesRun++;

            if(timesRun > 50000)
                return;
        }

        //particle grouping
        var particleClass = '';
        for(var y = 0; y < particleAnimations.length; y++)
        {
            if(particleNumber >= particleCount/particleAnimations.length*y)
            {
                particleClass = 'particle-'+y;
            }
        }

        var $thisParticle = $(particleTemplate).appendTo($canvas);
        var $thisParticleMain = $thisParticle.children('.particle-main');

        $thisParticle.addClass(particleClass);

        thisParticle.position = position;
        thisParticle.color = randomColor(particleColors);
        thisParticle.element = $thisParticle[0];

        $thisParticle.css({top: thisParticle.position.y, left: thisParticle.position.x});
        $thisParticleMain.css({'background-color': thisParticle.color});

        particleArray.push(thisParticle);
    }

    function resetParticlePositions()
    {
        for(var x = 0; x < particleArray.length; x++)
        {
            anime(
            {
                targets: particleArray[x].element,
                top: particleArray[x].position.y,
                left: particleArray[x].position.x,
                easing: 'easeOutQuint',
                duration: 1000,
                complete: function ()
                {
                    graphActive = false;
                    graphAnimation = false;
                }
            });
        }
    }

    function clearParticleAnimations()
    {
        for(var p = 0; p < particleAnimations.length; p++)
        {
            if(particleAnimations[p].animation)
                particleAnimations[p].animation.pause();

            anime.remove('.particle-'+p);
        }
    }

    /************************************************
     *
     * Section Functions
     *
     ************************************************/

    /***************
     *
     * Intro
     *
     ***************/

    function initIntroSection()
    {
        for(var x = 0; x < particleAnimations.length; x++)
        {
            if(particleAnimations[x])
                particleAnimations[x].pause();

            anime.remove('.particle-'+x);

            particleAnimations[x] = anime(
            {
                targets: '.particle-'+x,
                translateY: 0,
                opacity: 1,
                duration: 1000,
                delay: 0,
                complete: function ()
                {
                    particleAnimations[x] = anime(
                    {
                        targets: '.particle-'+x,
                        opacity: [1,0],
                        direction: 'alternate',
                        duration: function() { return anime.random(1000, 1500); },
                        delay:  function() { return anime.random((x*1000), (x*1000)+1000); }(x),
                        loop: true,
                        easing: 'easeInCubic'
                    });
                }(x)
            });
        }
    }

    function destroyIntroSection()
    {

    }

    /***************
     *
     * Graph
     *
     ***************/

    function initGraphSection()
    {
        clearParticleAnimations();

        for(var x = 0; x < particleAnimations.length; x++)
        {
            graphDrop(x);
        }

        if(!graphActive && !graphAnimation)
        {
            graphAnimation = true;
            graphAnim = anime(
            {
                targets: '.graph-line',
                points: points_to,
                easing: 'easeOutQuad',
                duration: 1500,
                complete: function ()
                {
                    anime(
                    {
                        targets: '.graph-point',
                        duration: 1000,
                        r: 4,
                        opacity: 1,
                        complete: function ()
                        {
                            graphAnimation = false;
                            graphActive = true;
                        }
                    });
                }
            });
        }

        //todo: graph hover effect
    }

    function destroyGraphSection()
    {
        for(var x = 0; x < graphTimeouts.length; x++)
        {
            clearTimeout(graphTimeouts[x]);
        }

        if(graphActive && !graphAnimation)
        {
            graphAnimation = true;
            anime(
            {
                targets: '.graph-point',
                duration: 100,
                r: 1,
                opacity: 0,
                complete: function ()
                {
                    anime(
                    {
                        targets: '.graph-line',
                        points: points_from,
                        easing: 'easeOutQuad',
                        duration: 100,
                        complete: function ()
                        {
                            graphActive = false;
                            graphAnimation = false;
                        }
                    });
                }
            });
        }
    }

    function graphDrop(x)
    {
        graphTimeouts[x] = setTimeout(function ()
        {
            particleAnimations[x].animation = anime(
            {
                targets: '.particle-'+x,
                translateY: [0,function() { return (anime.random(-100, 100))+'vh'; }],
                direction: 'alternate',
                duration: function() { return anime.random(1000, 1000*particleAnimations.length); },
                loop: true,
                easing: 'easeInOutCubic'
            });
        }, x*1000);
    }

    /***************
     *
     * Project
     *
     ***************/

    function initProjectSection()
    {
        clearParticleAnimations();

        for(var x = 0; x < particleAnimations.length; x++)
        {
            particleAnimations[x] = anime(
            {
                targets: '.particle-'+x,
                translateY: 0,
                opacity: 1,
                duration: 1000,
                delay: 0,
                easing: 'easeOutCubic',
                loop: false,
                complete: function ()
                {
                    if(activeSection === 'project')
                        $canvas.addClass('explode');
                }
            });
        }

        $body.on( "mousemove", updateMousePos);
        $body.on( "mousemove", moveProjectImage);
    }

    var moveProjectImage = throttle(function()
    {
        var moveX = (mouseX - centerX) / 10;
        var moveY = (mouseY - centerY) / 10;
        $project_image.css(
            {
                'transform': 'translate('+moveX+'px,'+moveY+'px)'
            });

    }, 250);

    function destroyProjectSection()
    {
        $canvas.removeClass('explode');
        $body.off('mousemove');
        $('.project-preview-image').removeClass('active');
    }

    $projectLinks.click(function (e)
    {
        e.preventDefault();

        //get data
        var $this = $(this);
        var id = $this.data('id');
        var title = $this.data('title');
        var company = $this.data('company');
        var skills = $this.data('skills');
        var href = $this.attr('href');
        var $image =  $('.project-preview-image[data-id="'+id+'"]');

        //replace in overlay
        $('.project-image-rep').empty().html($image.clone());
        $('.project-title-rep').empty().html(title);
        $('.project-company-rep').empty().html(company);
        $('.project-skills-rep').empty().html(skills);
        $('.project-link-rep').empty().html(href).attr('href',href);

        //load overlay
        bodyScrollLock();
        $projectPreviewImage.removeClass('active');
        $html.addClass('overlay-active');

    });

    $('.overlay-exit').click(function ()
    {
        $html.removeClass('overlay-active');
        bodyScrollUnlock();
    });

    $projectLinks.hover(function ()
    {
        var id = $(this).data('id');
        $projectPreviewImage.removeClass('active');
        $('.project-preview-image[data-id="'+id+'"]').addClass('active');

    }, function () //hover out
    {
        $projectPreviewImage.removeClass('active');
    });

    /***************
     *
     * Contact
     *
     ***************/

    function initContactSection()
    {
        var sectionWidth = canvasWidth / particleArray.length;
        var sectionHeight = canvasHeight / particleArray.length;
        var $formFields = $('.form-field');

        clearParticleAnimations();

        for (var x = 0; x < particleArray.length; x++)
        {
            var flip = sectionWidth * x;
            if (x % 2)
                flip = (particleArray.length - x) * sectionWidth;

            anime(
            {
                targets: particleArray[x].element,
                translateY: 0,
                top: sectionHeight * x,
                left: flip,
                opacity: 1,
                easing: 'easeOutQuint',
                duration: 500,
                complete: function ()
                {
                    $canvas.addClass('stripe');
                }
            });
        }

        $formFields.each(function()
        {
            var color = $(this).data('color');
            $(this).find('.form-input').css({'border-color':color});
        });
    }
    function destroyContactSection()
    {
        $canvas.removeClass('stripe');
        resetParticlePositions();
    }

    function addFancyLabel($selector)
    {
        function gfieldFocus($this)
        {
            $this.parent().addClass('active');
            highlightParticle($this.parent().data('color'));
        }
        function gfieldFocusOut($this)
        {
            if(!$this.val())
            {
                $this.parent().removeClass('active');
            }
            unHighlightParticles();
        }

        function highlightParticle(color)
        {
            for (var x = 0; x < particleArray.length; x++)
            {
                if(particleArray[x].color === color)
                {
                    $(particleArray[x].element).addClass('highlight');
                }
                else {
                    $(particleArray[x].element).removeClass('highlight');
                }
            }
        }
        function unHighlightParticles()
        {
            $particles.removeClass('highlight');
        }
        
        $selector
            .focus(function()
            {
                gfieldFocus($(this));
            })
            .focusout(function()
            {
                gfieldFocusOut($(this));
            })
            .change(function()
            {
                gfieldFocus($(this));
                gfieldFocusOut($(this));
            })
            .each(function()
            {
                gfieldFocus($(this));
                gfieldFocusOut($(this));
            });
    }

    /************************************************
     *
     * Section Scroll Controller
     *
     ************************************************/

    function findSectionHeights()
    {
        $('.full-height-section').each(function(i)
        {
            var $this = $(this);
            var pos = $this.position();
            var section = {};
            section.top = pos.top;
            section.bottom = pos.top + $this.innerHeight();
            section.section = $this.data('section');
            sections[i] = section;
        });
    }

    var checkScrollSection = throttle(function()
    {
        var scrollOffset = canvasHeight/3;
        var scroll = $window.scrollTop() + scrollOffset;
        for(var x = 0; x < sections.length; x++)
        {
           if(scroll >= sections[x].top && scroll < sections[x].bottom)
           {
               switchSection(sections[x].section);
               break;
           }
        }
    }, 250);

    function switchSection(section)
    {
        switch (section)
        {
            case 'intro':
                if(activeSection !== 'intro')
                {
                    activeSection = 'intro';
                    initIntroSection();
                    destroyGraphSection();
                    destroyProjectSection();
                    destroyContactSection();
                }
                break;
            case 'graph':
                if(activeSection !== 'graph')
                {
                    activeSection = 'graph';
                    destroyIntroSection();
                    initGraphSection();
                    destroyProjectSection();
                    destroyContactSection();
                }
                break;
            case 'project':
                if(activeSection !== 'project')
                {
                    activeSection = 'project';
                    destroyIntroSection();
                    destroyGraphSection();
                    initProjectSection();
                    destroyContactSection();
                }
                break;
            case 'contact':
                if(activeSection !== 'contact')
                {
                    activeSection = 'contact';
                    destroyIntroSection();
                    destroyProjectSection();
                    destroyGraphSection();
                    initContactSection();
                }
                break;
        }
    }


    start();
}); //!---- End Document Ready ------------!

}(jQuery));