---
layout: docs
title: "Meteor Kaiso - アプリケーション作成ベーシックガイド: チャットアプリ"
category: index
---
- [訳文の最終更新 2013/09/25 (JST) - 最新バージョンが0.6.5.1 の時点での内容]</li>
最新バージョンにて動かない場合は [issue]({{ site.github }}) としてご報告をお願いします。

Meteor を使ったアプリケーションの一連の作成手順を紹介します。なお、これは Meteor Kaiso 独自コンテンツであり、 必ずしも Meteor 開発チーム推奨の作成方法ではないことをご承知置きください。入門だけではなく、Meteor アプリを作成する際の簡単なクイックリファレンスとしても利用して頂ければ幸いです。


今回は Meteor の subscribe API を使い、CRUD にあたるドキュメント (RDBのレコードに近似) の作成、読み込み、修正、削除が可能なチャットアプリを作成します。なお、ユーザ管理機能については次回以降紹介とし、今回はひとまずそれぞれのメッセージの投稿者であるかどうかを問わず、修正、削除が可能なアプリを作りります。

(APIドキュメント内に登場するチャットルーム等を備えたチャットとは別のアプリケーションです。2つのアプリケーションの間に全く関係性はありません。)

## Meteor のインストール

Meteor を体験するのが初めての場合、まずターミナルを開き下記のコマンドを使い Meteor のインストールしてください。


~~~ bash
$ curl https://install.meteor.com | sh
~~~


なお、Windows 環境の場合はインストーラを下記サイトよりダウンロードし、お使いの環境にインストールしてください。

Meteor on Windows!  
[http://win.meteor.com](http://win.meteor.com)

## アプリケーションのひな形の作成

ターミナル (あるいはコマンドプロンプト) を開き、cd コマンドを使いアプリケーションプロジェクトを作成したいディレクトリに移動し、下記のコマンドを実行してください。

~~~ bash
$ meteor create simple-chat
~~~

## [Read (読み込み) ] HTMLテンプレートの用意

メッセージの表示を行う history テンプレートを準備します。あらかじめ作成された hello テンプレートを simple-chat.html より削除し、削除した箇所に次のテンプレートを定義します。

[simple-chat.html]

~~~ html
<template name="history">
<ul>
{{'{{#each messages'}}}}
  <li>[{{'{{user_name'}}}}]: {{'{{message'}}}} ({{'{{cdate'}}}})</li>
{{'{{/each'}}}}
</ul>
</template>
~~~

{{'{{each'}}}} 制御文に囲まれた行は、メッセージの数にしたがい増減して表示されます。

また、&lt;body&gt;タグの中に上記 history テンプレートが組み込まれるように、&lt;body&gt; タグ内のテンプレート呼び出し先を修正します(以下)。

[simple-chat.html]

~~~ html
<body>
  {{'{{> history'}}}}
</body>
~~~

## [Read (読み込み) ] JavaScript によるドキュメントの操作

Meteor アプリケーション内で扱うコレクションを simple-chat.js に定義します。他のコードから参照する際に Meteor コレクションとして初期化されていると簡単です。今回は JavaScript ファイルの最初の行にてコレクションを定義します。

[simple-chat.js]

~~~ javascript
Messages = new Meteor.Collection('messages');
~~~

クライアント・サーバサイド双方から使用するので、Meteor.isClient を条件とする if 文や、 Meteor.isServer を条件とする if 文から外れた場所に定義する必要があります。

つづいて、テンプレートに Messages コレクションをサブスクライブする挙動を定義します。

[simple-chat.js]

~~~ javascript
if (Meteor.isClient) {
  Template.history.messages = function () {
    return Messages.find({}, {sort: {cdate: -1}, limit: 30});
  }
}
~~~

(あらかじめ作成されていた Meteor.isClient を条件とする if 文の中身は削除します。)

以上で Read (読み込み) 処理は完成しました。しかしメッセージが1件もない状態では動作確認ができません。そこで仮のメッセージを挿入するロジックを追加します。

[simple-chat.js]

~~~ javascript
if (Meteor.isServer) {
  Meteor.startup(
    if(Messages.find().count() === 0) {
      // Messages コレクションの内容が0件だった場合、Messages コレクションにドキュメントを追加します。
      Messages.insert(
        {user_name: 'TT_kawa', message: 'こんにちは。', cdate: new Date()}
      );
    }
  );
}
~~~

meteor コマンドを停止している場合は再び起動し、ブラウザを開きます。

~~~ bash
$ meteor 
~~~

<img src="{{ site.url }}/img/index/2013-09-21-basic-chat-app-vol1_step1.png" style="width: 100%; max-width: 776px; style: block;" alt="R (読み込み) 実装後ブラウザレンダリング結果" />


## [Create (作成) ] 投稿フォームの作成

クライアントサイドよりユーザがメッセージを追加できるよう、メッセージ投稿用のフォームを含むテンプレートを新しく HTML ファイルの中に作成します。

[simple-chat.html]

~~~ html
<body>
  {{'{{> send'}}}}
  {{'{{> history'}}}}
</body>

<template name="send">
  お名前: <input type="text" id="user_name" />
  コメント: <input type="text" id="message" />
  <input type="button" id="send" value="投稿" />
</template>

<!-- 以下 history テンプレートが続きますが変更がないため省略します -->
~~~

Meteor のテンプレートの機能を使い簡単にクリック時の動作が定義できるよう、&lt;input&gt; タグに id を割り当てています。

この id を使い、フォームの挙動を定義していきます。

[simpla-chat.js]

~~~ javascript
// Meteor.isClient を条件とする if 文の中に下記を追加します
  Template.send.events({
    'click #send': function (evt, tmpl) {
       Messages.insert({
         user_name: tmpl.find('#user_name').value,
         message: tmpl.find('#message').value,
         cdate: new Date()
       });
    }
  });
~~~

[Template.myTemplate.events 関数]({{ site.url }}/apiref/templates.html#Template_myTemplate_events) に [イベントマップ]({{ site.url }}/apiref/templates.html#Template_Event_Maps)を指定し、#send id が指定された要素がクリックされた場合に Message コレクションに新たなドキュメントが挿入されるように設定します。

<img src="{{ site.url }}/img/index/2013-09-21-basic-chat-app-vol1_step2.png" style="width: 100%; max-width: 776px; style: block;" alt="C (作成) 実装後ブラウザレンダリング結果" />

以上で Create (作成) の機能作成は完了です。


- お気付きかもしれませんが、この時点では誰でもコレクションに新しくドキュメントを追加できます。ためしにブラウザコンソールから Messages.insert コマンドを叩いてみてください。これは Meteor プロジェクトを作成した際に自動的に設定される insecure パッケージの機能です。公開するに当たっては insecure パッケージを取り除く必要がありますが、この方法は次回紹介します。
- また、コレクションにドキュメントが追加されると、自動的にすべての接続されたクライアントに反映されます。これは autopublish パッケージの機能です。時にはリアルタイムに更新する必要がない場合もあるでしょう。その場合の制御の方法についても次回紹介します。


## [Update (更新)] メッセージの修正機能の作成

CRUD の U にあたる更新機能の簡単なものを実装していきます。まず、修正が必要な場合にユーザがクリックする「修正」ボタンを各メッセージの横に設置します。ふたたび HTML ファイルの中の history テンプレートを編集します。

[simple-chat.html]

~~~ html
<!-- Create (作成) 機能にて作成した send テンプレートに続く形で以下の内容となります。-->
<template name="history">
{{'{{#each messages'}}}}
  <li>[{{'{{user_name'}}}}]: {{'{{message'}}}} ({{'{{cdate'}}}}) <input type="button" class="modify" value="修正" /></li>
{{'{{/each'}}}}
</template>
~~~

class に modify を指定したボタンをメッセージの右隣に設置しています。つづいて JavaScript を使いボタンの挙動を定義します。

[simple-chat.js]

~~~ javascript
// Meteor.isClient を条件とする if 文の中に下記を追加します
  Template.history.events({
    'click .modify': function () {
        var newmessage = window.prompt('メッセージの修正', this.message);

        if (newmessage !== null) {
            Messages.update({_id: this._id},
                {$set: {message: newmessage}}
            );
        }
    }
  });
~~~

modify クラスが設定された要素をクリックした場合の挙動を、前回と同じく [Template.myTemplate.events 関数]({{ site.url }}/apiref/templates.html#Template_myTemplate_events) に [イベントマップ]({{ site.url }}/apiref/templates.html#Template_Event_Maps) を指定し設定します。ブラウザ組み込みの [window.prompt 関数](https://developer.mozilla.org/ja/docs/Web/API/window.prompt) の力を借り、ユーザに編集を促します。this はイベントが発生した要素を構成するデータを指すため、this.message を指定すると、ブラウザが表示するプロンプトに既存のメッセージを受け渡されます。ユーザが OK ボタンをクリックした場合には、[コレクション API]({{ site.url }}/apiref/collections.html) の [update 関数]({{ site.url }}/apiref/collections.html#Meteor_collection_update) を使いドキュメントを更新します。

<img src="{{ site.url }}/img/index/2013-09-21-basic-chat-app-vol1_step3.png" style="width: 100%; max-width: 776px; style: block;" alt="U (更新) 実装後ブラウザレンダリング結果" />

## [Delete (削除)] メッセージの削除機能の作成

ここまでの流れで、一通りのタグ設置、挙動定義の流れで Meteor アプリケーションの機能が次々と作成可能な事がお分かり頂けたかと存じます。最後に CRUD の D であるドキュメントの削除機能を実装していきます。

[simple-chat.html]

~~~ html
<!-- Create (作成) 機能にて作成した send テンプレートに続く形で以下の内容となります。-->
<template name="history">
{{'{{#each messages'}}}}
  <li>[{{'{{user_name'}}}}]: {{'{{message'}}}} ({{'{{cdate'}}}}) 
    <input type="button" class="modify" value="修正" />
    <input type="button" class="delete" value="削除" />
  </li>
{{'{{/each'}}}}
</template>
~~~

HTML の テンプレートにてメッセージのさらに右隣に削除ボタンを新設します。クラス名には delete を指定します。

[simple-chat.js]

~~~ javascript
// history テンプレートに対する events 関数の引数となるイベントマップ(オブジェクト) 
// キー 'click .modify' に続く形で以下の内容となります。'click .modify' の値の最後にコンマ(,)
// を追加する事をお忘れなく(以下1行)。
    },
    'click .delete': function () {
      if (window.confirm('メッセージ ' + this.message + ' を削除します。よろしいですか?')) {
        Messages.remove({_id: this._id});
      }
    }
~~~
ブラウザ組み込みの [window.confirm 関数](https://developer.mozilla.org/ja/docs/Web/API/window.confirm) の力を借り、ユーザに内容の確認を促します。ユーザが削除を承認した場合は [コレクション API]({{ site.url }}/apiref/collections.html) の [remove 関数]({{ site.url }}/apiref/collections.html#Meteor_collection_remove) を使いドキュメントを削除します。

<img src="{{ site.url }}/img/index/2013-09-21-basic-chat-app-vol1_step4.png" style="width: 100%; max-width: 776px; style: block;" alt="D (削除) 実装後ブラウザレンダリング結果" />

以上、100 行もコードを編集せずに基本的なチャットアプリが完成しました。それもリアルタイムに更新されます。クライアントもサーバサイドもこれで完了です。おつかれさまでした。

アプリケーションをインターネット上で公開することを予定している場合、引き続き次のガイドをご確認ください。

- [insecure パッケージと autopublish パッケージ - チャットアプリその2]({{ site.url }}/index/basic-chat-app-vol2.html)
