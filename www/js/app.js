// This is a JavaScript file
let format = 'json';

// Page init event
document.addEventListener('init', function(event) {
  var page = event.target;
  if (page.matches('#map-page')) {
    // 地図画面です
    var pos;
    var marker = [];
    pos = new google.maps.LatLng(34.077823, 134.560235);
    let mapDiv = $(page).find("#map")[0];
    let map = new google.maps.Map(mapDiv, {
      zoom: 16,
      center: { lat: 34.077823, lng: 134.560235 }
    });
    
    $.ajax({
      type: 'GET',
      url: './kankou.json',
      dataType: 'json',
      success: function(json){
        var len = json.length;
        //console.log(json[0]["名称"]);
         for(var i=0; i < len; i++){
           pos = new google.maps.LatLng(json[i]["緯度"], json[i]["経度"]);
           
             marker[i] = new google.maps.Marker({
               position: pos,
               map: map,
               icon: new google.maps.MarkerImage(
                './heart.png',//マーカー画像URL
                new google.maps.Size(30, 26),//マーカー画像のサイズ
                new google.maps.Point(0, 0),//マーカー画像表示の起点（変更しない）
                new google.maps.Point(20, 20)//マーカー位置の調整
                ),
            });
            markerEvent(i,json[i]["名称"]);
            
         }
      //console.log(json[i]["名称"]);
      },
      //エラー処理
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        alert(textStatus);
      }
    });
    function markerEvent(i,name) {
      marker[i].addListener('click', function() { // マーカーをクリックしたとき
      $('#navigator')[0].pushPage('insta.html', {
          data: {
            name: name,
            lat: marker[i].position.lat(),
            lng: marker[i].position.lng()
          }
        });
    });   
    }

  }else if(page.matches('#insta-page')){

    document.getElementById("name").innerHTML = page.data.name;
    //console.log(page.data.lat);
    // InstagramのクライアントIDと書き換えてください
    let client_id = 'b0d395771ba44f7ebe049e3dfa1537e2';
    let redirect_uri = 'https://www.facebook.com/profile.php?id=100009379232617';

    let authUrl = `https://www.instagram.com/oauth/authorize/?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=token&scope=public_content`;
    //let photoUrl = 'https://api.instagram.com/v1/users/self/media/recent/';
    //let photoUrl = 'https://api.instagram.com/v1/media/search?lat=34.077823&lng=134.560235';
    let photoUrl = `https://api.instagram.com/v1/media/search?lat=${page.data.lat}&lng=${page.data.lng}&&distance=200`;
    ons.ready(function() {
      console.log("Onsen UI is ready!");
      
      
        let authWindow_loadStartHandler = function(e) {
          // Instagramからaccess_tokenが送られれば成功
          if (m = e.url.match(/#access_token=(.*?)$/)) {
            //console.log(m);
            authWindow.close();
            getPhoto(m[1]);
          }
        };
        let authWindow = window.open(authUrl, '_blank', 'location=no');
        authWindow.addEventListener('loadstart', authWindow_loadStartHandler);
        
      
      
      let getPhoto = (authKey) => {
        $.ajax({
          url: photoUrl,
          type: 'get',
          dataType: 'json',
          data: {
            access_token: authKey
          }
        })
        .then((results) => {
          let html = [];
          for (let i = 0; i < results.data.length; i++) {
            // 標準画質のURLを使います
            let photo = results.data[i].images.standard_resolution.url;
            //let photo = results.data[i].images.low_resolution.url;
            var like = results.data[i].likes.count; //リンクを取得
            html.push(`<ons-card><img src="${photo}" style="width: 100%;" />
            <img src="./heart2.png" />${JSON.stringify(like)}件</ons-card>`);
            //console.log(JSON.stringify(like));
          }
          $('#photos').html(html.join(''));
        },
        err => {
          console.log(JSON.stringify(err));
        })
      }
    });
  }

});