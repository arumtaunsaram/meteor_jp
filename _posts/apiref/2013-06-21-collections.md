---
layout: docs
title: "Meteor Kaiso - APIリファレンス: コレクション API"
category: apiref
ref-official: 
  - title: Documentation
    title-jp: ドキュメント
    url: htt://docs.meteor.com/#collections
---

## コレクション API

Meteor はデータをコレクションに保存します。はじめに `new Meteor.Collection` を使いコレクションを宣言しましょう。

*   [Meteor.Collection](#meteor_collection)
    *   [collection.find](#meteor_collection_find)
    *   collection.findOne
    *   collection.insert
    *   collection.update
    *   collection.remove
    *   [collection.allow](#meteor_collection_allow)
    *   collection.deny
*   [Meteor.Collection.Cursor](#meteor_collection_cursor)
    *   cursor.forEach
    *   cursor.map
    *   cursor.fetch
    *   cursor.count
    *   cursor.rewind
    *   cursor.observe
    *   cursor.observeChanges
*   Meteor.Collection.ObjectID

*   [選択条件の指定](#meteor_collection_cursor_selectors)
*   [変更内容の指定](#meteor_collection_cursor_modifiers)
*   [ソート条件の指定](#meteor_collection_cursor_sort_specifiers)
*   [フィールドの指定](#meteor_collection_cursor_field_specifiers)


<dl>
  <dt>原文: <a href="http://docs.meteor.com/#collections">http://docs.meteor.com/#collections</a><dt>
  <dd>
  <ul>
    <li>[訳文の最終更新 2013/06/22 - 最新バージョンが0.6.4 の時点での内容]</li>
  </ul>
  </dd>
</dl>
---
<a name="meteor_collection"></a>
## new Meteor.Collection(name, [options])
__どこでも__

コレクションのコンストラクタ

### 引数

* **name** 文字列型

    コレクションの名前。もし null であれば管理されない (同期されない) ローカルのコレクションが作成されます。

### Options

* **connection** オブジェクト

    このコレクションを管理する Meteor の接続オブジェクト。もし null であればデフォルトの `Meteor` となります。name が null の管理されないコレクションは接続オブジェクトを指定することはできません。

* **idGeneration** 文字列型

    このコレクションで新しく作成されるドキュメントの `_id` の体系。下記の値が指定可能です。

    * **'STRING'**: ランダムな文字列
    * **'MONGO'**: ランダムな `Meteor.Collection.ObjectID` の値

    デフォルトの id 生成は'STRING'で行われます。

* **transform** 関数

    任意の変換を行う関数。ドキュメントは `fetch` あるいは `findOne` から返却される前に、そして `observe`、 `allow` そして `deny` のコールバックに渡される前にこの関数へと渡されます。

このAPIを呼び出すのは、昔からの ORM (オブジェクトリレーションマッパ) を中心としたフレームワークにてモデルを宣言することとよく似ています。ユーザ、投稿、得点、TODOリストなどアプリケーションに関わる情報を保存するために使われてきたコレクション (レコード群を保管する空間、あるいは"ドキュメント") をセットアップします。それぞれのドキュメントは EJSON オブジェクトです。オブジェクトはコレクションの中で一意の `_id` プロパティを含みます。`_id` はドキュメントが作成されると Meteor が設定します。

~~~ javascript
// クライアントとサーバで標準的なコードで、実況的なデータが管理された mongo のコレクションを宣言します。
Chatrooms = new Meteor.Collection("chatrooms");
Messages = new Meteor.Collection("messages");
~~~

この API はドキュメントをコレクションに追加する `insert` メソッド、プロパティを更新する `update` メソッド、削除するための `remove` メソッド、そして任意の条件に合致するドキュメントを検索する `find` メソッドをもつオブジェクトを返却します。これらのメソッドは Mongo データベース API と互換性のある動きをします。クライアントとサーバにて同じデータベース API が機能します (下記をご確認ください)。

~~~ javascript
// ユーザのメッセージを返却します
var myMessages = Messages.find({userId: Session.get('myUserId')}).fetch();

// 新しいメッセージを作成します
Messages.insert({text: "Hello, world!"});

// ユーザの最初のメッセージに important フラグを立てます
Messages.update(myMessages[0]._id, {$set: {important: true}});
~~~

コレクション作成時に `name` を指定した場合、サーバに保存され全てのユーザが参照可能な永続的なコレクションを宣言したことになります。クライアントのコードとサーバのコードはいずれも同じ API を通して同じコレクションにアクセスすることができます。

`name` を指定した場合、具体的には下記のことが起こります。

*   サーバではその名前のコレクションがバックエンドの Mongo サーバで作成されます。このコレクションのメソッドをサーバで呼んだ際には (それらがアクセスコントロールルールに合致しているかを確認した後) 通常の Mongo のオペレーションに変換されます。

*   クライアントでは Minimongo のインスタンスが作成されます。Minimongo は基本的にインメモリの非永続的な素の JavaScript による Mongo の実装です。Minimongo のインスタンスはクライアントが扱うデータベースの一部を保存するローカルのキャッシュです。`find` を実行した場合クエリはローカルのキャッシュに対してかけられ、サーバと通信することはありません。

*   クライアントでデータベースに向けたコマンド (`insert`、`update` あるいは `remove`) を放った場合、コマンドはすぐにクライアントで実行され、同時にサーバに発行され実行されます。livedata パッケージがこれを担っています。

`name` に null を渡した場合、ローカルコレクションを作成することになります。どことも同期がされていない、Mongo スタイルの `find`、`insert`、`update` そして`remove` オプションを提供するローカルのメモ (scratchpad) が作成されます。 (クライアントでもサーバーでも、このメモは Minimongo を使い実装されています。)

デフォルト設定では、Meteor はアプリケーションのコレクションの中のドキュメントを全ての接続したクライアントに publish します。この動作は autopublish パッケージを削除すると停止できます。

~~~ bash
$ meteor remove autopublish
~~~

かわりにコレクションのどの部分がどのユーザに publish されるべきか、`Meteor.publish` を使い指定してください。

~~~ javascript
// Posts というコレクションを作成しドキュメントを入れます。
// ドキュメントはコレクションのローカルコピーよりすぐに参照可能となります。
// 数秒の遅延のあと、サーバサイドのデータベースに書き込まれ、その後の
// 数秒の遅延のあとこのドキュメントを含む検索条件のクエリをもつ
// すべてのクライアントと同期されます。
Posts = new Meteor.Collection("posts");
Posts.insert({title: "Hello world", body: "First post"});

// 変更はすぐに参照が可能で、サーバからのレスポンスを待つ必要はありません。
assert(Posts.find().count() === 1);

// 仮のローカルコレクションを作成します。ほかのコレクションとまったく
// 同じように機能しますが、変更はサーバに送信されず、subscribe を使っても
// いかなるデータを受信することはありません。
Scratchpad = new Meteor.Collection;
for (var i = 0; i < 10; i++)
  Scratchpad.insert({number: i * 2});
assert(Scratchpad.find({number: {$lt: 9}}).count() === 5);

~~~

`transform` オプションを `Collection` あるいはその取得メソッドに指定した場合、ドキュメントは返却されるかコールバックに渡される前に `transform` 関数を通されます。これによってメソッドを追加したり、そうでなければデータベースでのコンテンツの表現を修正することができます。`transform` を特定の `find`、`findOne`、`allow` あるいは `deny` の呼び出しに指定することもできます。

~~~ javascript
// コンストラクタでドキュメントを設定する Animal クラス
Animal = function (doc) {
  _.extend(this, doc);
};
_.extend(Animal.prototype, {
  makeNoise: function () {
    console.log(this.sound);
  }
});

// Animal をドキュメントとして使用するコレクションを宣言します
Animals = new Meteor.Collection("Animals", {
  transform: function (doc) { return new Animal(doc); }
});

// Animal のインスタンスを作成し makeNoise メソッドを呼び出します。
Animals.insert({name: "ワシ", sound: "キッキッキッキッ"});
Animals.findOne({name: "ワシ"}).makeNoise(); // "キッキッキッキッ" を出力します
~~~

`transform` 関数は反応可能であるようには呼び出されません。もしオブジェクトの属性に直接的に変更を加えたいのであれば、その値を呼びだされた時に算出する関数で行なってください。

**(訳注: Minimongo と Mongo の互換性について、いくつかの制約が発表されています。詳しくは公式ドキュメントをご参照下さい。**

<!---
註はユーザの最初の利用に影響するものではないという判断の下、翻訳保留
In this release, Minimongo has some limitations:

    $pull in modifiers can only accept certain kinds of selectors.
    $ to denote the matched array position is not supported in modifier.
    findAndModify, upsert, aggregate functions, and map/reduce aren't supported.

All of these will be addressed in a future release. For full Minimongo release notes, see packages/minimongo/NOTES in the repository.

Minimongo doesn't currently have indexes. It's rare for this to be an issue, since it's unusual for a client to have enough data that an index is worthwhile.

-->

---
<a name="meteor_collection_find"></a>
### _collection_.find(selector, [options])
__どこでも__

条件に合致するドキュメントをコレクションより探し出します。

#### 引数

*   **selector** Mongo セレクタ、あるいは文字列型

    検索クエリ

#### Options

*   **sort** ソート条件指定子

    ソート順序 (デフォルト設定: 自然順序)

*   **skip** 数値

    結果の先頭からスキップする数値

*   **limit** 数値

    返却する結果の最大数

*   **fields** フィールド指定子

    (サーバサイドのみ) 返却する、あるいは除外するフィールドを辞書形式で指定。

*   **reactive** 真偽値

    (クライアントサイドのみ) デフォルト設定: 真。反応不可能とするためには偽を指定して下さい。

*   **transform** 関数

    カーソラの `transform` を `Collection` に対する指定内容を上書きし指定します。transform を無効化する場合には null を渡して下さい。

`find` はカーソラを返却します。カーソラはすぐにデータベースにアクセスするわけでも、ドキュメントを返すわけでもありません。カーソラは合致するすべてのドキュメントを返却する `fetch`、合致するすべてのドキュメントをスキャンしていく `map` と `forEach`、合致するドキュメントに変更があった時に実行するコールバックを登録する `observe` と `observeChanges` を提供します。

**コレクションのカーソラはスナップショットではありません。`Collection.find` の実行とカーソラの結果取得の間、あるいはカーソラから結果を取得中にデータベースに変更があった場合、それらの変更は取得した結果に現れるかもしれませんし、現れないかもしれません。**

カーソラは反応可能なデータソースです。最初に反応可能な算出 (テンプレートや autorun) のなかで `fetch`、`map` あるいは `forEach` でカーソラのドキュメントを取得した場合、Meteor は内在するデータを依存関係として登録します。カーソラに含まれるドキュメントに変更があった場合、再算出が実行されます。`{reactive: false}` を `find` の option に指定するとこの動きを止められます。

---
<a name="meteor_collection_allow"></a>
### _collection_.allow(options)
__サーバサイド__

定義した制約にしたがい、クライアントサイドのコードより対象のコレクションへ直接書き込むことを許可します。

#### Options

*   **insert, update, remove** 関数

    編集の内容を確認し、許可すべきであれば true を返す関数群

*   **fetch** 文字列の配列

    オプションで処理の高速化を促します。`update` と `remove` にて確認のためにデータベースより取得するフィールドを制限します。

*   **transform** 関数

    `Collection` に対する `transform` 指定内容を上書きし指定します。transform を無効化する場合には null を渡して下さい。

クライアントにてコレクションに対し、 `insert`、`update` あるいは `remove` を呼んだ際、更新が許されるべきかどうかを判断するため、サーバにてコレクションの `allow` と `deny` コールバックが呼び出されます。少なくとも1つの `allow` コールバックが更新を許可し、`deny` コールバック群が更新を拒絶しなければ、更新が行われます。

これらのチェックはクライアントが直接データベースに書き込みを行おうとした時 (イベントハンドラの中での `update` の実行など) のみに実行されます。サーバサイドのコードは信頼されているため、 `allow` と `deny` 制約の対象となりません。このルールは `Meteor.call` で呼び出されるメソッドにも適用され、 `allow` や `deny` を使うのではなくて自身でチェックを実施して下さい。

`allow` は好きな回数だけ呼び出す事ができ、それぞれの呼び出しで任意の `insert`、`update` そして `remove` 関数の組み合わせを利用することができます。関数は操作が許可されるべきと判断した場合には `true` を返して下さい。そうでなければ `false` を返すか何も返さないでください (undefined)。この場合 Meteor はほかの `allow` ルールの検索を探し続けます。

下記のコールバックが利用可能です。

*   **insert(userId, doc)**

    **userId** で示されるユーザがドキュメント **doc** をコレクションを挿入しようとしています。許可されるべきであれば `true` を返して下さい。

*   **update(userId, doc, fieldNames, modifier)**

    *   **userId** で示されるユーザがドキュメント **doc** を更新しようとしています。( **doc** の内容は現在の版のデータベースのドキュメントで、行おうとしている更新は含みません。) 更新を許可する場合は `true` を返して下さい。

    *   **fieldNames** はクライアントが変更を行おうとしている **doc** のトップレベルのフィールドです、たとえば `['name', 'score']`。

    *   **modifier** はクライアントが実行しようとしている生の Mongo 変更内容指定子です。たとえば `{$set: {'name.first': "Alice"}, $inc: {score: 1}}`。`$set` や `$push` の様な Mongo の変更内容指定子のみサポートしています。$より始まる変更内容の指定ではなく、ユーザがドキュメント全体の置き換えを試みた場合、そのリクエストは allow`` 関数をチェックすることなく拒絶されます。

*   **remove(userId, doc)**

    **userId** で示されるユーザがデータベースより **doc** を削除しようとしています。許可する場合は `true` を返して下さい。

`update` か `remove` を呼んだ際 Meteor はデフォルト設定でデータベースより `doc` にあたるドキュメントを丸ごと取得します。もし取得したいドキュメントが非常に大きい場合、関数で扱うフィールドのみ取得したいと思うかもしれません。`fetch` に取得するフィールド名の配列を渡すとこれが可能です。

例:

~~~ javascript
// ユーザが所有するドキュメントのみ修正が可能なコレクションを作成します。
// 所有者情報はそれぞれのドキュメントの `owner` フィールドで追跡されます。
// すべてのドキュメントは作成したユーザに所属していなければならない、同時に
// 所有者情報は変更できないという制約があります。ドキュメントの所有者のみが
// ドキュメントの削除を許可され、ドキュメントには意図しない削除を防ぐため
// `locked` 属性を設定することができます。

Posts = new Meteor.Collection("posts");

Posts.allow({
  insert: function (userId, doc) {
    // ユーザはログインしていなければならなく、ドキュメントはユーザによって
    // 所有されなければなりません。
    return (userId && doc.owner === userId);
  },
  update: function (userId, doc, fields, modifier) {
    // 所有しているドキュメントのみ変更が許されます
    return doc.owner === userId;
  },
  remove: function (userId, doc) {
    // 所有しているドキュメントのみ削除が許されます
    return doc.owner === userId;
  },
  fetch: ['owner']
});

Posts.deny({
  update: function (userId, docs, fields, modifier) {
    // 所有者情報は変更できません
    return _.contains(fields, 'owner');
  },
  remove: function (userId, doc) {
    // `locked` フラグが立てられたドキュメントは削除できません
    return doc.locked;
  },
  fetch: ['locked'] // `owner` は取得の必要がありません
});
~~~

`allow` ルールを一度も設定していない場合、すべてのクライアントのコレクションに対する更新は拒絶され、サーバサイドからのみコレクションへの書き込みが可能です。この場合クライアントに許されるそれぞれの書き込みに対してメソッド (訳注: メソッドAPI) を作成する必要があります。クライアントにコレクションに対し`insert`、`update` そして `remove` を直接実行してもらうのではなく、`Meteor.call` を使いそれらのメソッドを呼び出して下さい。

Meteor には特別な "insecure(安全でない)" モードが敏速なプロトタイプ作成のために用意されています。Insecure モードでは `allow` や `deny` のルールがまったく設定されていない場合、すべてのユーザに対しコレクションに対しフルアクセスの権限が与えられます。これは insecure モードでのみ有効です。コレクションのいずれかの位置に対し `allow` か `deny` を設定した場合、あるいは `Posts.allow({})` を実行した場合にはコレクションに対し通常の様にチェックされます。**新たに作成した Meteor プロジェクトはデフォルト設定では insecure モードで起動します。この設定をオフにするには下記のコマンドを実行してください。

~~~ bash
$ meteor remove insecure
~~~

---
<a name="meteor_collection_cursor"></a>
## カーソラ

カーソラは`find` を使い作成できます。カーソラに含まれるドキュメントにアクセスするには、`forEach`、`map` あるいは `fetch` を使ってください。

---
<a name="meteor_collection_cursor_selectors"></a>
## 選択条件指定子

もっとも簡単な形の選択条件指定子は、合致が求められるドキュメントのキー群です。

~~~ javascript
// deleted が false のすべてのドキュメントに合致します
{deleted: false}

// name と congnomen (あだ名) が指定した通りのすべてのドキュメントに合致します
{name: "Rhialto", cognomen: "the Marvelous"}

// すべてのドキュメントに合致します
{}
~~~

<!-- Rhialto the Marvelous は小説の中のヒロイン。
日本で有名な代替候補を探したものの見つからない、またドキュメント原典著者の好みが反映されている事を想定しそのまま。 -->

より複雑なテストを行うこともできます。

~~~ javascript
// age が18よりも大きいドキュメントに合致します
{age: {$gt: 18}}

// tags が "人気" を含む配列の場合にも合致します
{tags: "人気"}

// fruit が3つの候補のいずれかのドキュメントに合致します
{fruit: {$in: ["モモ", "プラム", "洋ナシ"]}}
~~~

すべての選択条件指定子については、Mongo ドキュメント ([英語版](http://www.mongodb.org/display/DOCS/Advanced+Queries)) をご確認ください。

---
<a name="meteor_collection_cursor_modifiers"></a>
## 変更内容指定子

変更内容指定子は「どの様にフィールド群を変更しドキュメントを更新するか」を細かく指定します。いくつかの例です。

~~~ javascript
// ドキュメントの 'admin' プロパティを true に設定します
{$set: {admin: true}}

// 'votes' プロパティに2を追加し、'supporters' 配列の末尾に "Traz" を追加します
{$inc: {votes: 2}, $push: {supporters: "Traz"}}
~~~

変更内容指定子に$よりはじまるオペレータが含まれない場合、かわりにドキュメントそのものとみなし、データベースの内容を置き換えます。
(ドキュメントによる変更の指定は今のところ更新の検証がサポートされていません。)

~~~ javascript
// id が "123" のドキュメントを探し、完全に書き換えます。
Users.update({_id: "123"}, {name: "花子", friends: ["カズ"]});
~~~

すべての変更内容指定子については、Mongo ドキュメント ([英語版](http://www.mongodb.org/display/DOCS/Updating#Updating-ModifierOperations)) をご確認ください。

---
<a name="meteor_collection_cursor_sort_specifiers"></a>
## ソート条件指定子

ソート条件を指定するには、いくつかの文法から選ぶことができます。

~~~ javascript
// 下記はすべて同じ条件です(キー "a" の昇順で並べ、同率については "b" の降順で並べます)

[["a", "asc"], ["b", "desc"]]
["a", ["b", "desc"]]
{a: 1, b: -1}
~~~

最後の例はオブジェクトのキー順序が保存される JavaScript の実装系のみで有効です。多くの場合は有効ですが、確認はあなたの手でおこなってください。

---
<a name="meteor_collection_cursor_field_specifiers"></a>
## フィールド指定子

サーバサイドにおいてはクエリを使い結果に含有させる、あるいは結果から除外する特定のフィールド群を指定することができます。(フィールド指定子は現状クライアントサイドでは無視されます。)

結果のオブジェクトからあるフィールドを除外する場合、フィールド指定子をキーがフィールド名、値が0のオブジェクトを指定して下さい。

~~~ javascript
Users.find({}, {fields: {password: 0, hash: 0}})
~~~

指定したフィールドのみを含むオブジェクトを返却する場合、値に1を指定して下さい。`_id` フィールドもまた結果に含まれます。

~~~ javascript
Users.find({}, {fields: {firstname: 1, lastname: 1}})
~~~

含有と除外を同時に指定することはできません。
