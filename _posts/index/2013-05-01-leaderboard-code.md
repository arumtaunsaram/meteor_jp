---
layout: docs
title: "Meteor Kaiso - サンプルアプリケーション: 順位表"
category: index
ref-official: 
  - title: Example Leaderboard
    title-jp: サンプルアプリケーション - 順位表
    url: http://meteor.com/examples/leaderboard
---
<dl>
  <dt>原文: <a href="http://meteor.com/examples/leaderboard">http://meteor.com/examples/leaderboard</a><dt>
  <dd>
  <ul>
    <li>[訳文の最終確認 2013/10/14 (JST) - 最新バージョンが0.6.6.1 の時点での内容]</li>
    <li>[訳文の最終更新 2013/06/12 - 最新バージョンが0.6.4 の時点での内容]</li>
  </ul>
  </dd>
</dl>
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

<div class="note">
<a href="http://meteor.com/examples/leaderboard">オフィシャルサイト</a>ではさらにアプリケーションの公開が可能なデプロイ用の環境が提供されています。
</div>

## ファイル構成

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
`Template.player.events` 関数はイベントハンドラです。"give points" ボタンに対応します。

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

Meteor はイベントを待ち構えるすべてのコールバックを結びあげ、テンプレートに利用しているデータにわずかな変更があれば DOM のアップデートを行い、DDP プロトコルを使いサーバに接続してデータベースでの変更を subscribe します。

## 編集してみる

順位表のコピーを編集する準備はできましたか? まず、meteor を開発モードで起動しましょう。プロジェクトディレクトリ (`meteor create`により作成されたディレクトリ) に移動し、下記を実行して下さい。

~~~ bash
$ meteor
~~~

ブラウザより `localhost:3000` にアクセスすると、ローカル環境にて稼働しているアプリケーションが確認できます。稼働中のアプリケーションは構成されるファイルを編集し保存すると毎回自動的に更新されます。

取り組むにあたり、たとえば下記のようなアイデアがあります。

* 得点によるソートと名前によるソートを切り替えるボタンをつくる。ヒント: 現在のソート順序の種類を保存するには、セション変数を利用します。
* 全員の得点をランダムな数値にするボタンをつくる。 (すでにこれを行うコードがサーバの起動コードにあります。このコードを取り出しクライアントとサーバ双方で動かすように移植することはできるでしょうか?)
* メンバを追加および削除する方法の提供。

<a name="reverse_index-leaderboard_insert-arbitrary-records"></a>

## DB に直接レコードを追加し、クライアントの挙動を確認する方法

mongoDB にデータを挿入すると、接続しているクライアント(ブラウザ)に自動的に更新情報が送信され、最新の情報へと更新されます。

_(これより公式ドキュメントを参考にした Meteor Kaiso 独自コンテンツとなります。)_

(もしまだならば) カレントディレクトリをleaderboardディレクトリに移動します。mongoDB 対話モードを起動します(`meteor mongo`コマンドはカレントディレクトリをプロジェクトディレクトリに移した後、`meteor&`コマンドを使いサーバを起動したあと実行可能です)。

~~~ bash
$ cd leaderboard
$ meteor mongo
connecting to: 127.0.0.1:3002/meteor
Welcome to the MongoDB shell.
For interactive help, type "help".
For more comprehensive documentation, see
	http://docs.mongodb.org/
Questions? Try the support group
	http://groups.google.com/group/mongodb-user
> 
~~~

現在挿入されているレコードを確認します。

~~~ javascript
> db.players.find();
{ "name" : "Ada Lovelace", "score" : 35, "_id" : "m9dFt5KyYC8LGMGJ7" }
{ "name" : "Grace Hopper", "score" : 40, "_id" : "FYm5XSuB9j2DNrips" }
{ "name" : "Marie Curie", "score" : 45, "_id" : "YGJv4LNXpWLvtSb9W" }
{ "name" : "Carl Friedrich Gauss", "score" : 35, "_id" : "9oFouGLTErYBmWMSJ" }
{ "name" : "Nikola Tesla", "score" : 5, "_id" : "Yt2qMPaDD2PvdNBrg" }
{ "name" : "Claude Shannon", "score" : 30, "_id" : "7iagPY6585Stj84dt" }
~~~

レコードを新たに挿入します。

~~~ javascript
> db.players.insert({name:"Yukihiro Matz Matusmoto", score: 40, _id: "za1q2sw3xed4089ol"})
~~~

`_id`に指定するidの値は未指定でもクライアントに表示されますが、未指定の場合`_id`の値がオブジェクト型となり、クライアントからの操作では予期していない形となり、操作に不具合を与えるため、他のレコードと同様に適当な17文字から成るidを手動で指定しています。

しばらくすると、127.0.0.1:3000 に接続しているブラウザ上に、mongoDB 対話モードより挿入した"Yukihiro Matz Matsumoto"のデータが(再更新の必要なくして)確認できます。
