
//function for Get last news from saites
function getRSS(newsLinks) {
    let feedUrl = newsLinks;
    let infoArr=[];
    $.each(feedUrl, function(ind, val){
        $.get('proxy.php?url=' + val, function(data) {
            $(data).find('item').each(function() {
                let title = $(this).find('title').text();
                let url = $(this).find('link').text();
                let description = $(this).find('description').text();
                let pubDate = $(this).find('pubDate').text();
                let newsImg = "../img/fast-news.jpg";
              
 
                if ($(this).find("[nodeName=media:content]").attr("url")) {
                    newsImg = $(this).find("[nodeName=media:content]").attr("url");
                }
                if ($(this).find("[nodeName=media:thumbnail]").attr("url")) {
                    newsImg = $(this).find("[nodeName=media:thumbnail]").attr("url");
                }

                let logo = "../img/ucf-bbc-logo.png";
                if (url.search("cnn.com")>0){
                    logo = "../img/logo_cnn.png";
                }
                if (url.search("abcnews")>0){
                    logo = "../img/abc_logo.png";
                }
                if (url.search("sky")>0){
                    logo = "../img/sky-news-logo.png";
                }

                let newsItem ={
                    pubDate:pubDate,
                    title : title,
                    url   : url,
                    description:description,
                    newsImg:newsImg,
                    logo:logo
                }
                infoArr.push(newsItem);
            });
        });
    });
    
    
    // function for Sort Array with news by date
    function sortByDate(itemA, itemB){
        return Date.parse(itemB.pubDate) - Date.parse(itemA.pubDate);
    };

    setTimeout(function(){ infoArr.sort(sortByDate); }, 1000);
    
    return infoArr;

};

// function for generating html
function drawHtml(array, newsQtt) {
    $("#curNews").empty();
    let counter =0;
    let html ="";

    html = '<div class="row">';
    
    for (let i = 0; i < array.length; i++) {
        
        if(counter % 4 == 0){
            html += '</div><div class="row">';
        }

        html += '<div class="col-md-3 col-sm-6 newsItem">';
        html += '<div class="line"></div>';
        html += '<div class="line-vertical"></div>';
        html += '<h2><a href="'+ array[i].url +'" target="_blank">'+ array[i].title +'</a></h2>';
        html += '<em class="date">' + array[i].pubDate + '</em>';
        html += '<div class="clearfix">' ;
        html += '<img class="news-img" src="'+ array[i].newsImg +'" alt="" />';
        html += '<div class="discription">' + array[i].description + '</div></div>';
        html += '<div class="logo-block">';
        html += '<a rel="nofollow" href="'+ array[i].url +'" target="_blank" class="fb_share_link"><img src="../img/facebook.svg" alt=""></a>';
        html += '<a rel="nofollow" href="'+ array[i].url +'" target="_blank" class="tw_share_link"><img src="../img/twitter.svg" alt=""></a>';
        html += '<img class="news-logo clearfix" src="'+ array[i].logo +'" alt="" />';
        html += '</div>';
        html += '</div>';
            
        counter++;
    }

    html += '</div>';
    
    $("#curNews").append($(html));

    //newsItem appears in 2 sec  
    $("div.newsItem").each(function() {
        $(this).animate({opacity: 1}, 2000);
    });
    
    //Cut of long texts and add of "..."
    $(".discription").each(function(){
        let str = $(this).text();
        let lastSpace;
        
        $(this).text(str.substr(0,200));
        lastSpace = $(this).text().lastIndexOf(" ");
        $(this).text(str.substr(0,lastSpace)+"...");
        
    });
    
    //Social Buttons 
    //Facebook Share Button
    $("a.fb_share_link").click(function(){
        u=$(this).attr("href");
        t=document.title;
        window.open('http://www.facebook.com/sharer.php?u='+encodeURIComponent(u)+
            '&t='+encodeURIComponent(t),'sharer','toolbar=0,status=0,width=626,height=436');
        return false;
    });

    //Twitter Share Button
    $("a.tw_share_link").click(function(){
        u=$(this).attr("href");
        t=document.title;
        window.open('https://twitter.com/share?url='+encodeURIComponent(u)+
            '&t='+encodeURIComponent(t),'sharer','toolbar=0,status=0,width=626,height=436');
        return false;
    })

    setTimeout(function(){
    // Equalizeing Heights of news items
        let maxHeight = 0;
        $("div.newsItem").each(function(){
           if ($(this).height() > maxHeight) 
            { maxHeight = $(this).height(); }
        });

        $("div.newsItem").animate({height: maxHeight}, 800)
    }, 500);
    
    //Borders animation
    $("div.newsItem")
      .mouseenter(function() {
        $(this).find("div.line").animate({ width:"110%" }, 1000);
        $(this).find("div.line-vertical").animate({ height:"100%" }, 1000);
      })
      .mouseleave(function() {
        $(this).find("div.line").animate({ width:"0" }, 800);
        $(this).find("div.line-vertical").animate({ height:"0" }, 800);
    });

};

    // end of html generetion

$(document).ready(function() {

    
    let worldLinks=["http://feeds.bbci.co.uk/news/world/rss.xml",
                    "http://feeds.skynews.com/feeds/rss/world.xml",
                    "http://rss.cnn.com/rss/edition_world.rss"
                    ];
                    
    let businessLinks=["http://feeds.bbci.co.uk/news/business/rss.xml",
                       "http://feeds.skynews.com/feeds/rss/business.xml",
                       "http://rss.cnn.com/rss/money_news_international.rss"
                    ];

    let politicsLinks=["http://feeds.bbci.co.uk/news/politics/rss.xml",
                       "http://feeds.skynews.com/feeds/rss/politics.xml",
                       "http://rss.cnn.com/rss/cnn_allpolitics.rss"
                    ];

    let techLinks=["http://feeds.bbci.co.uk/news/technology/rss.xml",
                   "http://feeds.skynews.com/feeds/rss/technology.xml",
                   "http://rss.cnn.com/rss/edition_technology.rss"
                    ];

    let currentNews = getRSS(worldLinks);

    setTimeout(function(){
        drawHtml(currentNews);
    }, 2000);


// scripts for recieve news by click in menu
    $("li a").click(function(){
        let newsTem = $(this).parent().attr('id');
        let newsLink;

        if(newsTem == "tech"){
            newsLink = techLinks;
        }
        if(newsTem == "politics"){
            newsLink = politicsLinks;
        }
        if(newsTem == "business"){
            newsLink = businessLinks;
        }
        if(newsTem == "world"){
            newsLink = worldLinks;
        }

        let currentNews = getRSS(newsLink);
        
        $("li").removeClass("active");
        $(this).parent().addClass("active");

        setTimeout(function(){
            drawHtml(currentNews);
        }, 3000);
    });
//-------------------------
    $("#textSlide p").fadeOut();
    $("#textSlide p.visible").fadeIn();
    setInterval(function(){
        console.log($("#textSlide p.visible").next("p"));
        if( $("#textSlide p").is(".visible")){
            $("#textSlide p.visible").fadeOut().removeClass("visible").next("p").addClass("visible").fadeIn(800);
        } else{
            $("#textSlide p").removeClass("visible");
            $("#textSlide p:first").addClass("visible").fadeIn(800);

        }
        
    }, 2000);
    
    //Menu in small sized window
    $("#categories").click(function(){
         if( $(".link").css("display")==="none"){
             $(".link").fadeIn();
         } 
         else {
             $(".link").fadeOut();
         }
    });
    //Closing the opened menu after click
    $(".link a").click(function(){
        if ($( document ).width()<992){
            $(".link").fadeOut();
        }
    }); 
    //Change of menu type when window is resized
    $( window ).resize(function() {
      if ($( document ).width()<992) {
         $(".link").fadeOut();
      } else{
        $(".link").fadeIn();
      }
      
    });

    //menu appearence after scrolling the main page
    $(document).scroll(function() {
        var y = $(window).scrollTop();
        if (y > $(window).height()-20) {
            $('#menu').fadeIn();
            } else {
            $('#menu').fadeOut();
            }
    });

    //smooth page scrolling
    $(function() {
      $('a').click(function() {
        var href = $(this).attr("href");
        $('html, body').animate({
          scrollTop: $(href).offset().top
        }, 800);
        return false;
      });
    });

});

