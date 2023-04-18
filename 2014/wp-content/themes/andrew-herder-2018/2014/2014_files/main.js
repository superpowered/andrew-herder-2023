$(document).ready(function()
{
    var header = $('#header');
    var colWidth;
    var screenWidth =  head.screen.innerWidth;
    var screenHeight = head.screen.innerHeight;


    //Scroll Magic Stuff
    var scrollController;
    scrollController = new ScrollMagic();
    var imacTween = TweenMax.staggerFromTo(".imac",2,{bottom: -1500}, {bottom:20}, 0.05);

    var sceneImac = new ScrollScene({triggerElement: "#imac-trigger", duration: 450, triggerHook: "1"})
        .setTween(imacTween)
        .addTo(scrollController)
        .duration(450);
    new ScrollScene({triggerElement: "#skill-trigger1", reverse: true, triggerHook: "1"})
        .setClassToggle(".skill-div.major","minimized")
        .addTo(scrollController);
    new ScrollScene({triggerElement: "#skill-trigger2", reverse: true, triggerHook: "1"})
        .setClassToggle(".skill-div.minor","minimized")
        .addTo(scrollController);

    var sceneNav1 = new ScrollScene({triggerElement: "#about", duration: 450})
        .setClassToggle("#about-nav","active")
        .addTo(scrollController);
    var sceneNav2 = new ScrollScene({triggerElement: "#skills", duration: 450})
        .setClassToggle("#skill-nav","active")
        .addTo(scrollController)
    var sceneNav3 = new ScrollScene({triggerElement: "#my-work", duration: 450})
        .setClassToggle("#work-nav","active")
        .addTo(scrollController);
    var sceneNav4 = new ScrollScene({triggerElement: "#contact", duration: 450})
        .setClassToggle("#contact-nav","active")
        .addTo(scrollController);

    var tween1 = TweenMax.staggerFromTo("#work-col1 img", 2, {left: -1500}, {left: 0}, 0.05);
    var tween2 = TweenMax.staggerFromTo("#work-col2 img", 2, {left: 1500}, {left: 0}, 0.05);
    var tween3 = TweenMax.staggerFromTo("#work-col3 img", 2, {left: 1500}, {left: 0}, 0.05);
    var tween4 = TweenMax.staggerFromTo("#work-col4 img", 2, {left: -1500}, {left: 0}, 0.05);

    var sceneWork = new ScrollScene({triggerElement: "#work-col1", offset: 0, duration: 250, triggerHook: "1", reverse: true})
        .setTween(tween1)
        .addTo(scrollController)
        .duration(250);
    var sceneWork2 = new ScrollScene({triggerElement: "#work-col1", offset: 0, duration: 250, triggerHook: "1", reverse: true})
        .setTween(tween2)
        .addTo(scrollController)
        .duration(250);
    var sceneWork3 = new ScrollScene({triggerElement: "#work-col1", offset: 0, duration: 250, triggerHook: "1", reverse: true})
        .setTween(tween3)
        .addTo(scrollController)
        .duration(250);
    var sceneWork4 = new ScrollScene({triggerElement: "#work-col1", offset: 0, duration: 250, triggerHook: "1", reverse: true})
        .setTween(tween4)
        .addTo(scrollController)
        .duration(250);

    $( window ).resize(function()
    {
        colWidth = $('.work-col').width();
        $('.work-col').css({'height':colWidth+'px'});
    });
    //Stops page from jumping down on refresh
    $(document).scrollTop(0);
    $(window).on('beforeunload', function()
    {
        $(window).scrollTop(0);
    });
    if(screenHeight >= 525)
    {
        //Header Screen Match
        header.css('height', screenHeight);
        $('#text1').css('left', screenWidth+40+'px');
        $('#text2').css('right', screenWidth+40+'px');
        $('#text3').css('left', screenWidth+40+'px');
        //Header Animation
        setTimeout(function ()
        {
            $('#text1').css('left', '35px')
        }, 100);
        setTimeout(function ()
        {
            $('#text2').css('right', '35px')
        }, 900);
        setTimeout(function ()
        {
            $('#text3').css('left', '95px')
        }, 1700);
        setTimeout(hideTop, 3100);
    }
    else
    {
        unhide();
    }
    function hideTop(transforms)
    {

        header.css("-webkit-transition", "height .5s ease-in-out");
        header.css("-moz-transition", "height .5s ease-in-out");
        header.css("-o-transition", "height .5s ease-in-out");
        header.css("transition", "height .5s ease-in-out");
        unhide();

    }
    function unhide()
    {
        header.css("height", "200px");
        $('.hide-on-down').fadeOut();
        $('.hide-start').removeClass('hide-start');

        colWidth = $('.work-col').width();
        $('.work-col').css({'height':colWidth+'px'});

        sceneNav1.duration($('#about').height());
        sceneNav2.duration($('#skills').height());
        sceneNav3.duration($('#my-work').height());
        sceneNav4.duration($('#contact').height());

        sceneWork.duration($('#my-work').height()/2);
        sceneWork2.duration($('#my-work').height()/2);
        sceneWork3.duration($('#my-work').height()/2);
        sceneWork4.duration($('#my-work').height()/2);
    }

    //Sticky NavBar
	$(window).scroll(function()
	{
		var stuck = false;
		var window_top = $(window).scrollTop();
		var div_top = $('#nav-anchor').offset().top;
		if (window_top > div_top && !stuck)
		{
			stuck = true;
			$('.nav-bar').addClass('stick');
			$('#header').addClass('stick');
		}
		else  if (window_top < div_top-100 && !stuck)
		{
			stuck = false;
			$('.nav-bar').removeClass('stick');
			$('#header').removeClass('stick');
		}
	});

    //Scroll Binders
    //ScrollMagicPlugin. Needs Testing.
	/*
     scrollController.scrollTo(function (newpos)
     {
     TweenMax.to(window, 0.7, {scrollTo: {y: newpos-100}});
     });
	$(document).on("click", "a[href^=#]", function (e)
	{
		var id = $(this).attr("href");
		if ($(id).length > 0) 
		{
			e.preventDefault();
			// trigger scroll
			scrollController.scrollTo(id);
		}
	});*/
    //ScrollTo Plugin. (no jitter, but has the weird lock problem)
    $(".nav-bar a").click(function(evn)
    {
        if($(this).attr('id') != 'resume-nav')
        {
            evn.preventDefault();
            $('html,body').scrollTo(this.hash, this.hash, {offset: {top: -100}});
        }
    });

    var imgsrc = $('#work-image').attr('src');
    $(".work-block").click(function(evn)
    {
        var x = $(this).attr('id');
        //console.log($(this).attr('id'));
        //.substr($(evn).attr('id').length-1)
        $('#work-header').html(workInfo[x].name);
        $('#work-description').html(workInfo[x].description);
        $('#work-contribution').html("<strong>My contribution: </strong>"+workInfo[x].contribution);
        $('#work-design').html("<strong>Design: </strong>"+workInfo[x].design);
        $('#work-property').html("<strong>Property of: </strong>"+workInfo[x].property);
        $('#work-site').attr('href',workInfo[x].site);
        $('#work-year').html("<strong>Year: </strong>"+workInfo[x].year);
        $('#work-image').attr('src', imgsrc+workInfo[x].img);
        $('body').css('overflow', 'hidden');
        $('.show-work-div').removeClass('hidden');
    });
    $(".work-close").click(function(evn)
    {
        $('body').css('overflow', 'initial');
        $('.show-work-div').addClass('hidden');
    });

    var axl =
    {
        name:"Axolotl Interactive",
        description: "During my time at Axolotl Interactive, I had the pleasure of coding the entire website from scratch. Axolotl Interactive is a small multimedia startup company.",
        contribution:"HTML, CSS, JavaScript, JQuery",
        design: "<a target='_blank' href='http://megclementz.com/'>Meg Clementz</a>",
        property: "Axolotl Interactive",
        site: "http://axolotlinteractive.com/",
        year: "2015",
        img: "/img/imac-axl.png"
    };
    var stackShark =
    {
        name:"Stack Shark",
        description: "Stack Shark is a website used to track errors and bugs in an application. The user can log in, and view all the errors that have happened in their application and follow the stack to find the problem and alleviate it.",
        contribution:"HTML, CSS, JavaScript, JQuery",
        design: "<a target='_blank' href='http://megclementz.com/'>Meg Clementz</a>",
        property: "Axolotl Interactive",
        site: "http://stackshark.com/",
        year: "2014",
        img: "/img/imac-shark.png"
    };
    var mss =
    {
        name:"My Stat Suite",
        description: "My Stat Suite is a series of applications for tracking various things, currently there is a Water Watcher and Cigarette tracker, with a Coffee Counter in the works.",
        contribution:"HTML, CSS, JavaScript, JQuery",
        design: "<a target='_blank' href='http://megclementz.com/'>Meg Clementz</a>",
        property: "Axolotl Interactive",
        site: "http://mystatsuite.com/",
        year: "2015",
        img: "/img/imac-mss.png"
    };
    var smallShops =
    {
        name:"Small Shops United",
        description: "Small Shops is a rewards program for small businesses in the local milwaukee area. This project was handed off to me and along with the folks at Axolotl Interactive got it up and running to it's current state.",
        contribution:"HTML, CSS, JavaScript, JQuery",
        design: "<a target='_blank' href='http://wearepolymathic.com/'>Polymathic LLC</a>",
        property: "Small Shops United LLC",
        site: "http://smallshopsunited.com/",
        year: "2014",
        img: "/img/imac-smallshops.png"
    };
    var workInfo = [axl,stackShark,mss,smallShops];

});
