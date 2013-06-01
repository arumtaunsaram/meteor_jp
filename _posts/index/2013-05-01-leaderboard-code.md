---
layout: docs
title: "Meteor Kaiso - サンプルアプリケーション: 順位表"
category: index
ref-official: 
  - title: Example Leaderboard
    title-jp: サンプルアプリケーション - 順位表
    url: http://meteor.com/examples/leaderboard
---
## 直接体験

- (もしまだならば) Meteor のインストール

~~~ bash
$ curl https://install.meteor.com | sh
~~~

- サンプルアプリケーション一式のコピー

~~~ bash
$ meteor create --example leaderboard
~~~

- サンプルアプリケーションの起動

~~~ bash
$ cd leaderboard
$ meteor
~~~

- サンプルアプリケーションへアクセス
ブラウザより <http://localhost:3000/> にアクセス

<p class="lead">
[オフィシャルサイト](http://meteor.com/examples/leaderboard) ではさらにアプリケーション公開用の
デプロイ用の環境が提供されています。
</p>

## ファイル構成

<a name="hierarchy"></a>

~~~ bash
.
├── leaderboard.css
├── leaderboard.html
└── leaderboard.js
~~~

### leaderboard.html

2つの [Handlebars](http://handlebarsjs.com/) テンプレートより構成されています。
[Template オブジェクト]({% post_url 2013-05-01-template-object %})

### leaderboard.js

~~~ javascript
Players = new Meteor.Collection("players");
~~~

プレーヤとその成績が保存された MongoDBの Collection を`Players`変数にキャストします。

~~~ javascript
if (Meteor.isClient) {
  Template.leaderboard.players = function () {
    return Players.find({}, {sort: {score: -1, name: 1}});
  };
~~~

Template の ヘルパー関数(JavaScriptのデータをテンプレートに渡す機能を担います)。データベースにプレーヤを取得するクエリを発行します。

~~~ javascript
  Template.leaderboard.selected_name = function () {
    var player = Players.findOne(Session.get("selected_player"));
    return player && player.name;
  };
~~~

Template の ヘルパー関数。現在選択されているプレーヤの名前を返却します。

~~~ javascript
  Template.player.selected = function () {
    return Session.equals("selected_player", this._id) ? "selected" : '';
  };
~~~

Template の ヘルパー関数。プレーヤが選択されているかどうかを返し、CSSを使いハイライトを行うことに利用されます。

~~~ javascript
  Template.leaderboard.events({
    'click input.inc': function () {
      Players.update(Session.get("selected_player"), {$inc: {score: 5}});
    }
  });
~~~

イベントハンドラ。現在選択されているプレーヤを設定します。

~~~ javascript
  Template.player.events({
    'click': function () {
      Session.set("selected_player", this._id);
    }
  });
~~~

`selected_player` はセション変数で現在選択されているプレーヤの MongoDB のドキュメントidを保存します。
leaderboard.js には3箇所の`selected_player`を読み込む箇所と、1箇所の書き込みを行う場所があります。
`Template.plauer.events` 関数はイベントハンドラです。"give points" ボタンに対応します。

~~~ javascript

}

// サーバ起動時, データベースが空であればプレーヤを作成する
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Players.find().count() === 0) {
      var names = ["Ada Lovelace",
                   "Grace Hopper",
                   "Marie Curie",
                   "Carl Friedrich Gauss",
                   "Nikola Tesla",
                   "Claude Shannon"];
      for (var i = 0; i < names.length; i++)
        Players.insert({name: names[i], score: Math.floor(Math.random()*10)*5});
    }
  });
~~~

データベースにデフォルトデータを挿入します。アプリケーション起動時にデータベースが空であるときに実行されます。

~~~ javascript
}
~~~
