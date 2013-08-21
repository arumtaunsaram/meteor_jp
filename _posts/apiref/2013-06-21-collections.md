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

*   [Meteor.Collection](#Meteor_Collection)
    *   [collection.find](#Meteor_collection_find)
    *   [collection.findOne](#Meteor_collection_findOne)
    *   [collection.insert](#Meteor_collection_insert)
    *   [collection.update](#Meteor_collection_update)
    *   [collection.remove](#Meteor_collection_remove)
    *   [collection.allow](#Meteor_collection_allow)
    *   [collection.deny](#Meteor_collection_deny)
*   [Meteor.Collection.Cursor](#Meteor_Collection_cursor)
    *   [cursor.forEach](#Meteor_Collection_cursor_forEach)
    *   [cursor.map](#Meteor_Collection_cursor_map)
    *   [cursor.fetch](#Meteor_Collection_cursor_fetch)
    *   [cursor.count](#Meteor_Collection_cursor_cout)
    *   [cursor.rewind](#Meteor_Collection_cursor_rewind)
    *   [cursor.observe](#Meteor_Collection_cursor_observe)
    *   [cursor.observeChanges](#Meteor_Collection_cursor_observeChanges)
*   Meteor.Collection.ObjectID

*   [選択条件の指定](#Meteor_Collection_selectors)
*   [変更内容の指定](#Meteor_Collection_modifiers)
*   [ソート条件の指定](#Meteor_Collection_sort_specifiers)
*   [フィールドの指定](#Meteor_Collection_field_specifiers)


<dl>
  <dt>原文: <a href="http://docs.meteor.com/#collections">http://docs.meteor.com/#collections</a><dt>
  <dd>
  <ul>
    <li>[訳文の最終更新 2013/08/21 (JST) - 最新バージョンが0.6.5 の時点での内容]</li>
  </ul>
  </dd>
</dl>
---
<a name="Meteor_Collection"></a>
## new Meteor.Collection(name, [options])
__どこでも__

コレクションのコンストラクタ

### 引数

* **name** 文字列型

    コレクションの名前。もし null であれば管理されない (同期されない) ローカルのコレクションが作成されます。

### Options

* **connection** オブジェクト

    このコレクションを管理する Meteor の接続オブジェクト。指定されていない場合デフォルトの接続を使用します。name が null の管理されないコレクションは接続オブジェクトを指定することはできません。

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

デフォルト設定では、Meteor はアプリケーションのコレクションの中のドキュメントを、接続されたすべてのクライアントに publish します。この動作は autopublish パッケージを削除すると停止できます。

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
<a name="Meteor_collection_find"></a>
### _collection_.find(selector, [options])
__どこでも__

条件に合致するドキュメントをコレクションより探し出します。

#### 引数

*   **selector** [選択条件指定子](#Meteor_Collection_selectors)

    検索クエリ

#### Options

*   **sort** [ソート条件指定子](#Meteor_Collection_sort_specifiers)

    ソート順序 (デフォルト設定: 自然順序)

*   **skip** 数値

    結果の先頭からスキップする数値

*   **limit** 数値

    返却する結果の最大数

*   **fields** [フィールド指定子](#Meteor_Collection_field_specifiers)

    (サーバサイドのみ) 返却する、あるいは除外するフィールドを辞書形式で指定。

*   **reactive** 真偽値

    (クライアントサイドのみ) デフォルト設定: 真。反応不可能とするためには偽を指定して下さい。

*   **transform** 関数

    `Collection` に対する `transform` 指定内容を差し替えます。transform を無効化する場合には null を渡して下さい。

`find` はカーソラを返却します。カーソラはすぐにデータベースにアクセスするわけでも、ドキュメントを返すわけでもありません。カーソラは合致するすべてのドキュメントを返却する `fetch`、合致するすべてのドキュメントをスキャンしていく `map` と `forEach`、合致するドキュメントに変更があった時に実行するコールバックを登録する `observe` と `observeChanges` を提供します。

**コレクションのカーソラはスナップショットではありません。`Collection.find` の実行とカーソラの結果取得の間、あるいはカーソラから結果を取得中にデータベースに変更があった場合、それらの変更は取得した結果に現れるかもしれませんし、現れないかもしれません。**

カーソラは反応可能なデータソースです。最初に反応可能な算出 (テンプレートや autorun) のなかで `fetch`、`map` あるいは `forEach` でカーソラのドキュメントを取得した場合、Meteor は内在するデータを依存関係として登録します。カーソラに含まれるドキュメントに変更があった場合、再算出が実行されます。`{reactive: false}` を `find` の option に指定するとこの動きを止められます。

---
<a name="Meteor_collection_findOne"></a>
### _collection_.findOne(selector, [options])
__どこでも__

ソート条件とスキップ条件を使いソートされた結果より、条件に合致する最初のドキュメントを探し出します。

#### 引数

*   **selector** [選択条件指定子](#Meteor_Collection_selectors)

    検索クエリ

#### Options

*   **sort** [ソート条件指定子](#Meteor_Collection_sort_specifiers)

    ソート順序 (デフォルト設定: 自然順序)

*   **skip** 数値

    結果の先頭からスキップする数値

*   **fields** [フィールド指定子](#Meteor_Collection_field_specifiers)

    (サーバサイドのみ) 返却する、あるいは除外するフィールドを辞書形式で指定。

*   **reactive** 真偽値

    (クライアントサイドのみ) デフォルト設定: 真。反応不可能とするためには偽を指定して下さい。

*   **transform** 関数

    `Collection` に対する `transform` 指定内容を差し替えます。transform を無効化する場合には null を渡して下さい。

`options.limit = 1` の状態で `find(selector, options).fetch()[1]` に等しいです。

---
<a name="Meteor_collection_insert"></a>
### _collection_.insert(doc, [callback])
__どこでも__

ドキュメントをコレクションに挿入します。ドキュメントに一意の _id を返却します。

#### 引数

*   **doc** オブジェクト型

    挿入するドキュメント。オブジェクトが _id を持たない場合 Meteor が生成します。

*   **callback** 関数

    省略可能。もし指定された場合、第1引数はエラーオブジェクトが、もしエラーが発生していなければ _id が第2引数として渡されます。

ドキュメントをコレクションに追加します。ドキュメントは単なるオブジェクトで、フィールドには EJSON と互換性のあるデータ (配列、オブジェクト、数値、文字列、`null`、真そして偽) のいかなる組み合わせも含めることができます。

`insert` は渡されたオブジェクトに対し一意の ID を生成し、データベースに挿入してそのIDを返却します。もし `insert` が信頼されていないクライアントのコードより呼び出された場合、`allow` 並びに `deny` のルールの結合が許容された場合のみ許可されます。

サーバサイドにてコールバックを指定しない場合は `insert` はデータベースへの書き込みが確認されるまでコードの制御フローはブロックされます。もし何らかの理由でうまく行かなかった場合は例外を投げます。コールバックを指定しない場合でも `insert` は ID を返却します。挿入が完了もしくは失敗した時にコールバックはエラーと結果を示す引数と共に呼び出されます。エラーの場合は `result` は undefined となります。挿入が無事完了した場合、`error` は undefined で `result` は新しいドキュメントの ID となります。

クライアントでは、`insert` はフローを決してブロックしません。コールバックを指定せずサーバサイドで挿入が失敗した場合、Meteor は コンソールに警告を残します。コールバックを指定した場合、Meteor はそのコールバック関数を `error` 並びに `result` 引数と共に呼び出します。エラーの場合は `result` は undefined となります。挿入が成功した場合は `error`が undefined で `result` は挿入が成功したドキュメントの ID になります。

例:

~~~ javascript
var groceriesId = Lists.insert({name: "スーパーの品物"});
Items.insert({list: groceriesId, name: "三つ葉"});
Items.insert({list: groceriesId, name: "柿"});

~~~


---
<a name="Meteor_collection_update"></a>
### _collection_.update(selector, modifier, [options], [callback])
__どこでも__

コレクションの中の1つかそれ以上のドキュメントを修正します。

#### 引数

*   **selector** [選択条件指定子](#Meteor_Collection_selectors)あるいはオブジェクトのID

    どのドキュメントを修正するかを指定します。

*   **modifier** [変更内容指定子](#Meteor_Collection_modifier)

    どの様にドキュメントを修正するかを指定します。

*   **callback** 関数

    省略可能。指定した場合にはエラーオブジェクトを引数として呼び出されます。

#### Options

*   **multi** 真偽値

    合致するドキュメントすべてを修正する場合、真としてください。合致するドキュメント1つのみを修正する場合偽としてください (デフォルト設定です) 。

**selector** に合致するドキュメントを **modifier** に沿い修正します ( [変更内容指定子 - modifier のドキュメント](#Meteor_Collection_modifiers) をご参照ください)。

`modifier` の挙動は、呼び出し元が信頼されているコードかそうでないかによって異なります。信頼されているコードにはサーバサイドと Method API を使い記述されたコードが含まれます。信頼されていないコードはクライアントサイドのコードそしてブラウザの JavaScript コンソールの様なものが含まれます。

*   信頼されたコードは **multi** に真を設定することで一度に複数のドキュメントを修正することができ、また任意の [選択条件指定子](#Meteor_Collection_selectors) を使い修正するドキュメントを指定することができます。`allow` や `deny` を使い設定されたすべてのアクセス制御ルールをすっ飛ばします。

*   信頼されていないコードは `_id` にて指定された1つのドキュメントしか一度に修正することができません。更新は対応する `allow` 並んで `deny` ルールが確認された後にのみ許容されます。

サーバにおいては、コールバックを指定しなかった場合は `update` がデータベースへの書き込みを確認するか、書き込みが失敗し例外を投げるまで次のコードには進みません。もしコールバックを律儀に指定した場合、`update` はすぐに制御フローを解放し次のコードへ進みます。更新が完了すると指定されたコールバックは、失敗した場合1つのエラー引数とともに、あるいは成功した場合は引数なしで呼び出されます。

クライアントサイドでは、`update` は制御のブロックは決してしません。コールバックを指定せずにサーバで更新が失敗した場合、Meteor は警告をコンソールに残します。コールバックを指定した場合、Meteor はエラーがあった場合にはそれを引数として、成功した場合には引数なしでコールバックを呼び出します。

クライアントサイドの例:

~~~ javascript
// 管理者向け画面の givePoints ボタンが押下された際、現在のプレーヤに
// 5ポイント授けます。新しいスコアは即座にすべてのクライアントに
// 伝えられます。
Template.adminDashboard.events({
  'click .givePoints': function () {
    Players.update(Session.get("現在のプレーヤ"), {$inc: {score: 5}});
  }
});
~~~

サーバサイドの例:

~~~ javascript
// 10以上のスコアを持つそれぞれのユーザに「勝者」のバッジを授けます。
// ユーザがログインしていて、バッジリストが閲覧可能であれば自動的に
// 各自のスクリーンは更新されます。
Meteor.methods({
  declareWinners: function () {
    Players.update({score: {$gt: 10}},
                   {$addToSet: {badges: "勝者"}},
                   {multi: true});
  }
});
~~~

**Mongo の upsert 機能は実装されていません。**

---
<a name="Meteor_collection_remove"></a>
### _collection_.remove(selector, [callback])
__どこでも__

コレクションのドキュメントを削除します。

#### 引数

*   **selector** [選択条件指定子](#Meteor_Collection_selectors)あるいはオブジェクトのID

    どのドキュメントを削除するかを指定します。

*   **callback** 関数

    省略可能。指定した場合にはエラーオブジェクトを引数として呼び出されます。

**selector** に合致するドキュメントすべてを探し出し、コレクションから削除します。

`remove` の挙動は呼び出し元が信頼されているコードかそうでないかによって異なります。信頼されているコードにはサーバサイドと Method API を使い記述されたコードが含まれます。信頼されていないコードはクライアントサイドのコードそしてブラウザの JavaScript コンソールの様なものが含まれます。

*   信頼されたコードは任意の [選択条件指定子](#Meteor_Collection_selectors) を使い削除するドキュメントを探し出し、与えられた選択条件指定子に合致する複数のドキュメントを一度に削除することができます。`allow` や `deny` を使い設定されたすべてのアクセス制御ルールをすっ飛ばします。安全性を確保するため、 **selector** が省略 (あるいは `undefined` が指定された) 場合、いずれのドキュメントも削除されません。本当にコレクションの中のすべてのドキュメントを削除したい場合には、 **selector** に `{}` を指定して下さい。

*   信頼されていないコードは `_id` にて指定された1つのドキュメントしか一度に修正することができません。更新は対応する `allow` 並んで `deny` ルールが確認された後にのみ許容されます。

サーバにおいては、コールバックを指定しなかった場合は `remove` がデータベースの更新を確認するか、更新が失敗し例外を投げるまで次のコードには進みません。もしコールバックを律儀に指定した場合、`remove` はすぐに制御フローを解放し次のコードへ進みます。削除が完了すると指定されたコールバックは、失敗した場合1つのエラー引数とともに、あるいは成功した場合は引数なしで呼び出されます。

クライアントサイドでは、`remove` は制御のブロックは決してしません。コールバックを指定せずにサーバで更新が失敗した場合、Meteor は警告をコンソールに残します。コールバックを指定した場合、Meteor はエラーがあった場合にはそれを引数として、成功した場合には引数なしでコールバックを呼び出します。

クライアントサイドの例:

~~~ javascript
// チャットメッセージの remove ボタンがクリックされた場合、その
// メッセージを削除します。
Template.chat.events({
  'click .remove': function () {
    Messages.remove(this._id);
  }
});
~~~

サーバサイドの例:

~~~ javascript
// サーバが起動した際にログを削除し、karma が2未満のユーザを削除します。
Meteor.startup(function () {
  if (Meteor.isServer) {
    Logs.remove({});
    Players.remove({karma: {$lt: -2}});
  }
});
~~~

---
<a name="Meteor_collection_allow"></a>
### _collection_.allow(options)
__サーバサイド__

定義した制約にしたがい、クライアントサイドのコードより対象のコレクションへ直接書き込むことを許可します。

#### options

*   **insert, update, remove** 関数

    編集の内容を確認し、許可すべきであれば true を返す関数群

*   **fetch** 文字列の配列

    オプションで処理の高速化を促します。`update` と `remove` にて確認のためにデータベースより取得するフィールドを制限します。

*   **transform** 関数

    `Collection` に対する `transform` 指定内容を差し替えます。transform を無効化する場合には null を渡して下さい。

クライアントにてコレクションに対し、 `insert`、`update` あるいは `remove` を呼んだ際、更新が許されるべきかどうかを判断するため、サーバにてコレクションの `allow` と `deny` コールバックが呼び出されます。少なくとも1つの `allow` コールバックが更新を許可し、`deny` コールバック群が更新を拒絶しなければ、更新が行われます。

これらのチェックはクライアントが直接データベースに書き込みを行おうとした時 (イベントハンドラの中での `update` の実行など) のみに実行されます。サーバサイドのコードは信頼されているため、 `allow` と `deny` 制約の対象となりません。このルールは `Meteor.call` で呼び出されるメソッドにも適用されるため、`Meteor.call` を使う場合は `allow` や `deny` を使うのではなくて開発者自身で確認のロジックを実装して下さい。

`allow` は好きな回数だけ呼び出す事ができ、それぞれの呼び出しで任意の `insert`、`update` そして `remove` 関数の組み合わせを利用することができます。関数は操作が許可されるべきと判断した場合には `true` を返して下さい。そうでなければ `false` を返すか何も返さないでください (undefined)。この場合 Meteor はほかの `allow` ルールを探し続けます。

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

Meteor には特別な "insecure(安全でない)" モードが敏速なプロトタイプ作成のために用意されています。Insecure モードでは `allow` や `deny` のルールがまったく設定されていない場合、すべてのユーザに対しコレクションに対しフルアクセスの権限が与えられます。これは insecure モードでのみ有効です。コレクションのいずれかの位置に対し `allow` か `deny` を設定した場合、あるいは `Posts.allow({})` を実行した場合にはコレクションに対し通常の様にチェックされます。 **作成されたばかりの Meteor プロジェクトはデフォルト設定では insecure モードで起動します。** この設定をオフにするには下記のコマンドを実行してください。

~~~ bash
$ meteor remove insecure
~~~

---
<a name="Meteor_collection_deny"></a>
### _collection_.deny(options)
__サーバサイド__

`allow` ルールを上書きします。

#### 引数

*   **insert, update, remove** 関数 

    データベースにリクエストされた更新を観察する関数群で、もし拒絶されるべきならば `allow` ルールが異なる回答をする場合でも、かまわず真を返して下さい。 

*   **fetch** 文字列型が格納された配列

    省略可能なパフォーマンス強化。`update` と `remove` の関数呼び出しの際に、検証のためにデータベースより取得するフィールドを限定します。

*   **transform** 関数

    `Collection` に対する `transform` 指定内容を差し替えます。transform を無効化する場合には null を渡して下さい。

`allow` の様に機能しますが、`allow` ルールが許容を判断した場合であっても、特定の更新を確実に拒絶することができます。

クライアントがコレクションに対し更新を試みた場合、Meteor サーバはまず `deny` ルールをチェックします。いずれのルールも真を返さない場合は `allow` ルールを確認します。Meteor は `deny` ルール群が一切真を返さなく、少なくとも1つの `allow` ルールが `true` を返却した場合に更新を許可します。

---
<a name="Meteor_Collection_cursor"></a>
## カーソラ

カーソラは`find` を使い作成できます。カーソラに含まれるドキュメントにアクセスするには、`forEach`、`map` あるいは `fetch` を使ってください。

---
<a name="Meteor_Collection_cursor_forEach"></a>
### _collection_.forEach(callback)
__どこでも__

連続的にそして同期的に、合致するドキュメントそれぞれにつき一回 `callback` を実行します。

#### 引数

*   **callback** 関数

    呼び出す関数。

反応可能な算出の中で呼び出された場合、合致するドキュメント群を依存関係として登録します。

例:

~~~ javascript
// 上位5位のスコアにつく記事 (posts) のタイトルを出力します
var topPosts = Posts.find({}, {sort: {score: -1}, limit: 5});
var count = 0;
topPosts.forEach(function (post) {
  console.log("記事のタイトル " + count + ": " + post.title);
  count += 1;
});
~~~

---
<a name="Meteor_Collection_cursor_map"></a>
### _collection_.forEach(callback)
__どこでも__

すべての合致するドキュメントに対しコールバック関数をマップし、配列を返却します。

#### 引数

*   **callback** 関数

    呼び出す関数。

反応可能な算出の中で呼び出された場合、合致するドキュメント群を依存関係として登録します。

サーバサイドでは `callback` の動き次第では、先行して実行された `callback` を実行している間に別の `callback` 呼び出しが走る場合があります。厳密な連続性が必要な場合、かわりに `forEach` を使ってください。

---
<a name="Meteor_Collection_cursor_fetch"></a>
### _collection_.fetch()
__どこでも__

すべての合致するドキュメントを配列として返却します。

反応可能な算出の中で呼び出された場合、`fetch` は合致するドキュメントを依存関係として登録します。

---
<a name="Meteor_Collection_cursor_count"></a>
### _collection_.count()
__どこでも__

クエリに合致するドキュメントの合計を数値で返却します。

~~~ javascript
// ある条件に合致する記事の合計を数値で返却します。データベースが変更
// されると更新される形に、自動的に変換されます。
var frag = Meteor.render(function () {
  var highScoring = Posts.find({score: {$gt: 10}});
  return "<p>スコアが11以上の記事が" + highScoring.count() + "件存在します。" ;
});
document.body.appendChild(frag);
~~~

ほかの関数とは異なり、`count` は合致するドキュメントを合計した数値のみ依存関係として登録します。(結果セットに含まれるドキュメントの変更や順序の変更では再計算は行われません。)

---
<a name="Meteor_Collection_cursor_rewind"></a>
### _collection_.rewind()
__どこでも__

クエリカーソラをリセットします。

`forEach`、`map` あるいは `fetch` メソッドはカーソラに対し1度しか呼び出すことができません。カーソラの中のデータに1回以上アクセスするためには、 `rewind` を使いカーソラをリセットしてください。

---
<a name="Meteor_Collection_cursor_observe"></a>
### _collection_.observe(callbacks)
__どこでも__

クエリを監視します。結果のセットが変更された場合、コールバックがそれを受け取ります。


#### 引数

*   **callbacks** オブジェクト

    結果のセットが変更された場合にそれが届けられる関数群

クエリの結果が更新された時にコールバックを実行する実況的なクエリを作成します。もし古いコンテンツも対象であれば、それらを含めて全体のコンテンツがコールバック群に届けられます。変更が加わったフィールドのみ受け取りたいのであれば `observeChanges` をご確認ください。

`callbacks` はプロパティに下記の関数を持つことができます。

*   **added(document)** あるいは **addedAt(document, atIndex, before)**

    新しいドキュメント **document** が結果のセットに入りました。新しいドキュメントは **atIndex** に出現しました。 **before** は直後のドキュメントの `_id` です。 **before** は新しく挿入されたドキュメントがクエリ結果の末尾であれば `null` になります。

*   **changed(newDocument, oldDocument)** あるいは **changedAt(newDocument, oldDocument, atIndex)**

    ドキュメントのコンテンツは以前は **oldDocument** で現在は **newDocument** です。変更が加えられたドキュメントの位置は **atIndex** です。

*   **removed(oldDocument)** あるいは **removedAt(oldDocument, atIndex)**

    ドキュメント **oldDocument** はもう結果セットに存在しません。 **atIndex** の位置に存在しました。

*   **movedTo(document, fromIndex, toIndex, before)**

    ドキュメントの結果セットの中での位置が **fromIndex** より **toIndex** ( **before** の直前 ) に変更されました。現在の内容は **document** です。

結果セットの中の順序を気にしないのであれば `added`、`changed` そして `removed` を使って下さい。`addedAt`、`changedAt` そして `removedAt` より効率的です。

`observe` が値を返す前に、`added` (あるいは`addedAt`) がクエリの初回結果を届けるために0回かそれ以上呼ばれます。

`observe` は `stop` メソッドを提供する実況的なクエリハンドルを返却します。コールバック関数群の呼び出しを停止しクエリを取り壊す際には `stop` を引数なしで実行して下さい。これを呼ばないとクエリは永久に監視を続けます。`Deps.autorun` の中の算出にて `observe` が呼び出された場合、算出が再実行あるいは停止された場合に自動的に `observe` は停止します。(カーソラが `reactive` オプションを `false` として作成された場合、初回の結果のみ伝達され、それ以上コールバックは呼び出されません。この場合ハンドラオブジェクトの `stop` を呼ぶ必要はありません。)

---
<a name="Meteor_Collection_cursor_observeChanges"></a>
### _collection_.observeChanges(callbacks)
__どこでも__

クエリを監視します。結果のセットが変更された場合、コールバックがそれを受け取ります。ドキュメントの新旧差分のみがコールバックに渡されます。

#### 引数

*   **callbacks** オブジェクト

    結果のセットが変更された場合にそれが届けられる関数群

クエリの結果が更新された時にコールバックを実行する実況的なクエリを作成します。`observe` と異なり、`observeChanges` は変更があったドキュメントの内容全体結果ではなく結果セットの新旧の差分のみを提供します。

`callbacks` はプロパティに下記の関数を持つことができます。

*   **added(id, fields)** あるいは **addedAt(id, fields, before)**

    新しいドキュメントが結果のセットに入りました。ドキュメントはID **id** とフィールド **field** が指定されています。 **field** には `_id` を除く全てのフィールドが含まれています。 **before** は直後のドキュメントの `_id` です。 **before** は新しく挿入されたドキュメントがクエリ結果の末尾であれば `null` になります。

*   **changed(id, fields)**

    **id** で一意に定まるドキュメントが変更されました。 **fields** には変更されたフィールドとその新しい値が含まれています。フィールドがドキュメントから削除された場合 **field** の値が `undefined` として表現されます。

*   **movedBefore(id, before)**

    **id** で一意に定まるドキュメントの結果セットの中での位置が変更され、現在は **before** で一意に定まるドキュメントの直前に現れています。

*   **removed(id)**

    **id** で一意に定まるドキュメントが結果セットより取り除かれました。

`observeChanges` はもし `addedBefore` あるいは `movedBefore` を使わないのであれば、明らかにより効率的です。

`observeChanges` が値を返す前に、`added` (あるいは`addedBefore`) がクエリの初回結果を届けるために0回かそれ以上呼ばれます。

`observeChanges` は `stop` メソッドを提供する実況的なクエリハンドルを返却します。コールバック関数群の呼び出しを停止しクエリを取り壊す際には `stop` を引数なしで実行して下さい。これを呼ばないとクエリは永久に監視を続けます。`Deps.autorun` の中の算出にて `observe` が呼び出された場合、算出が再実行あるいは停止され場合に自動的に `observe` は停止します。(カーソラが `reactive` オプションを `false` として作成された場合、初回の結果のみ伝達され、それ以上コールバックは呼び出されません。この場合ハンドラオブジェクトの `stop` を呼ぶ必要はありません。)

*   `observe` とは異なり、`observeChanges` は絶対位置の情報 (`atIndex`、`before`は絶対位置ではありません) を提供しません。これは効率のためです。

例:

~~~ javascript
// 接続し (onlineNow) ている管理者 (admin) の人数を追い続けます
var count = 0;
var query = Users.find({admin: true, onlineNow: true});
var handle = query.observeChanges({
  added: function (id, user) {
    count++;
    console.log(user.name + "で" + count + "人目の管理者です。");
  },
  removed: function () {
    count--;
    console.log("一人切断しました。現在の管理者の人数は減って" + count + "人になりました。");
  }
});

// 5秒後、人数の追跡を停止します。
setTimeout(function () {handle.stop();}, 5000);
~~~

---
<a name="Meteor_Collection_selectors"></a>
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
<a name="Meteor_Collection_modifiers"></a>
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
<a name="Meteor_Collection_sort_specifiers"></a>
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
<a name="Meteor_Collection_field_specifiers"></a>
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
