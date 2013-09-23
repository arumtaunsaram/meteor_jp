---
layout: docs
title: "Meteor Kaiso - アプリケーション作成ベーシックガイド: チャットアプリ"
category: index
---
- [訳文の最終更新 2013/09/25 (JST) - 最新バージョンが0.6.5.1 の時点での内容]</li>
最新バージョンにて動かない場合は [issue]({{ site.github }}) としてご報告をお願いします

Meteor を使ったアプリケーションの一連の作成手順を紹介します。なお、これは Meteor Kaiso 独自コンテンツであり、 必ずしも Meteor 開発チーム推奨の作成方法ではないことをご承知置きください。入門だけではなく、Meteor アプリを作成する際の簡単なクイックリファレンスとしても利用して頂ければ幸いです。


前回作成したチャットアプリには insecure と呼ばれるパッケージが含まれており、サーバに保存されたデータは誰でも編集をおこなえる状態で稼働します。社内のイントラネットでの公開であれば問題ないかもしれませんが、インターネットで公開するには危険を孕んでいます。今回はこの insecure パッケージをプロジェクトより取り除く方法、そして取り除く際に注意すべき点を紹介していきます。

また後半では一部のデータについてははリアルタイムな更新を避ける必要がある場合のために、 autopublish 機能を無効とした場合リアルタイムな更新が必要な必要な箇所においてどの様にリアルタイム性を復元するかを紹介していきます。

__ご注意: Meteor のユーザ管理機能を利用し場合、autopublish パッケージがプロジェクトに含まれているとサーバに保存された全てのユーザのユーザ名等の情報がクライアントに送信されます。詳しくは [こちら]({{ site.url }}/apiref/accounts.html#users) をご確認ください。__


## insecure パッケージのアンインストール

ターミナルあるいはコマンドプロンプトを開き、プロジェクトの一番浅い階層のフォルダまで cd コマンドを使い移動した後、下記のコマンドを実行すると insecure パッケージが削除されます。

~~~
$ meteor remove insecure
~~~

`$ meteor list --using` コマンドの実行結果より insecure が消えていればアンインストールは完了です。詳しくは [コマンドラインリファレンス]({{ site.url }}/apiref/commandline.html) をご確認ください。

### insecure パッケージアンインストール後の挙動

前回作成したチャットアプリにて、起動直後クライアントサイド (ブラウザ) からメッセージの Read (読み込み)はできるものの、クライアントサイドからの Create (作成) 、Update (更新)、Remove (削除) が行えなくなっていることにお気付きでしょうか。 insecure パッケージが存在しない場合、コレクションに対して allow ルールが設定されていない挙動は一切拒絶されるようになります。


### コレクションに対する allow ルールの設定

早速コレクションに対し allow ルールを設定します。[collection.allow 関数]({{ site.url }}/collections.html#Meteor_collection_allow) はサーバサイドでのみ実行可能です。今回は触りの紹介であるためすべてのリクエストを許可していますが、もし条件つきの許可としたい場合は、クライアントに送信されることがない server/ ディレクトリに条件を記述した JavaScript を保存することを強くおすすめします。

[simple-chat.js]

~~~ javascript
if (Meteor.isServer) {

  Messages.allow({
    insert: function (userId, doc) {
      return true;
    },
    update: function (userId, doc) {
      return true;
    },
    remove: function (userId, doc) {
      return true;
    }
  });

  Meteor.startup(function () {

    //ドキュメントが 0件の時に仮のドキュメントを挿入するロジックが存在するかもしれません - 変更が無いため省略

  });
}
~~~

このようにして、コレクションに対するアクセスをコントロールすることができます。


## autopublish パッケージのアンインストール

リアルタイムの更新を開発者の裁量でコントロールするため、 autopublish パッケージをプロジェクトより取り除いてみます。

~~~
$ meteor remove autopublish
~~~

この状態で meteor コマンドを使いサーバを起動しても、クライアントサイド (ブラウザ) からアクセスした時にメッセージが確認できないことにお気付きになられるかと思います。メッセージの更新を autopublish パッケージなしでリアルタイム性を復元していきます。

### autopublish パッケージに頼らずリアルタイム更新を設定する

autopublish パッケージなしの状態でのリアルタイムな更新の設定は難しい作業ではありません。サーバサイドにて新しく publish を作成し、それをクライアントサイドにて subscribe することで今までのプログラムを変更せずに再びリアルタイムな更新を得ることができます。

まず、サーバサイドにて publish を作成します。

[easy-chat.js]

~~~ javascript
if (Meteor.isServer) {

  // Messages コレクションに対する allow 設定があるかもしれません - 変更がないため省略

  Meteor.publish('messages', function () {
    return Messages.find({}, {sort: {cdate: -1}, limit: 30});
  });

  // startup の設定があるかもしれません - 変更がないため省略

}
~~~

[Meteor.publish 関数]({{ site.url }}/apiref/publish-subscribe.html#meteor_publish) を使い messages publish を作成します。第二引数のコールバック関数では戻り値としてコレクションのカーソラ (参考: [collection.find 関数]({{ site.url }}/apiref/collections.html#Meteor_collection_find) ) を返却しています。ドキュメントが多くなってきた場合、サーバサイドで limit を設定することで通信量を抑えることができます。

次にクライアントにて subscribe を設定します。1行のみの追加です。

[easy-chat.js]

~~~ javascript
if (Meteor.isClient) {

  Meteor.subscribe('messages'); // 追加

  Template.history.messages = function () {
    return Messages.find({}, {sort: {cdate: -1}, limit: 30});
  };

  // テンプレート定義が続きます - 変更が無いため省略
}
~~~

[Meteor.subscribe 関数]({{ site.url }}/apiref/publish-subscribe.html#meteor_subscribe) を使い messages publish をサブスクライブします。サブスクライブが開始されると、ブラウザのローカルデータベース (minimongo) に対象のコレクションのコピーが作成され、そのコピーはサーバに変更があると同期されます。
クライアント側でのコレクションはローカルデータベースを参照します。[反応可能な算出]({{ site.url }}/concept.html#reactivity) (上記の例ではテンプレート) の中でコレクションを参照した場合、コレクションが変更されると自動的に再算出が行われます。
