---
layout: docs
title: "Meteor Kaiso - APIリファレンス: Publish, subscribe API"
category: apiref
ref-official: 
  - title: Documentation
    title-jp: ドキュメント
    url: htt://docs.meteor.com/#publishandsubscribe
---

## Publish, subscribe API

このAPIはサーバがどのようにレコード群を publish するか、そしてクライアントが subscribe をするかを制御します。

*   [Meteor.publish](#meteor_publish)
    *   [this.userId](#meteor_publish_this_userId)
    *   [this.added](#meteor_publish_this_added)
    *   [this.changed](#meteor_publish_this_changed)
    *   [this.removed](#meteor_publish_this_removed)
    *   [this.ready](#meteor_publish_this_ready)
    *   [this.onStop](#meteor_publish_this_onStop)
    *   [this.error](#meteor_publish_this_error)
    *   [this.stop](#meteor_publish_this_stop)
    *   [this.connection](#meteor_publish_this_connection)
*   [Meteor.subscribe](#meteor_subscribe)

<dl>
  <dt>原文: <a href="http://docs.meteor.com/#publishandsubscribe">http://docs.meteor.com/#publishandsubscribe</a><dt>
  <dd>
  <ul>
    <li>[訳文の最終更新 2013/12/23 (JST) - 最新バージョンが0.7.0.1 の時点での内容]</li>
  </ul>
  </dd>
</dl>
---
<a name="meteor_publish"></a>
## Meteor.publish(name, func)
__サーバサイド__

レコード群を publish します。

### 引数

* **name** 文字列型

    割り当てるデータに対する名前。`null`の場合、データは名前を持たずレコード群は全てのクライアントに対して送信されます。

* **func** 関数

    クライアントが subscribe を行うごとにサーバで実行される関数。関数の中では `this` は publish を扱うオブジェクトを指します(後述)。もしクライアントが subscribe に引数を与えた場合はこの関数はその引数と共に実行されます。

レコードをクライアントに publish するには、サーバサイドにて上記2つの引数とともに `Meteor.publish` を呼び出してください。引数にはデータに対する名前、Meteor がクライアントからその名前で subscribe を呼び出すときに実行する publish 用の関数を指定してください。

publish 用の関数は `Collection.Cursor` を返却することができ、その場合、 Meteor はそのカーソラが指すドキュメントをサブスクライブを行うクライアントに publish します。`Collection.Cursor` の配列を返却することもでき、その場合 Meteor は全てのカーソラを publish します。

**複数のカーソラを配列で返す場合、現在は全てのカーソラは異なるコレクション由来のものである必要があります。将来のリリースではこの制約は解消させる予定です**

~~~ javascript
// サーバサイド: rooms のコレクションを secretInfo をのぞき publish します。
Meteor.publish("rooms", function () {
  return Rooms.find({}, {fields: {secretInfo: 0}});
});

// ログインユーザがアドミンユーザであればチャットルームの秘匿情報を publish します。
// もしクライアントが rooms と adminSecretInfo の両方を subscribe しているのであれば
// レコード群は Rooms コレクションの同一のドキュメントとして1つにまとめられます。
Meteor.publish("adminSecretInfo", function () {
  return Rooms.find({admin: this.userId}, {fields: {secretInfo: 1}});
});

// 依存するドキュメントを publish し結合を模倣します。
Meteor.publish("roomAndMessages", function (roomId) {
  check(roomId, String);
  return [
    Rooms.find({_id: roomId}, {fields: {secretInfo: 0}}),
    Messages.find({roomId: roomId})
  ];
});

~~~

他にも、publish 関数は (publish されたレコードセットに対しての追加に設定された) added 、(既にレコードセットに publish されたドキュメントに対する変更やフィールドの削除に設定された) changed 、そして (publish されたレコードセットからのドキュメントの削除に設定された) remove 関数の呼び出しにより設定された publish されたレコードを直接操作することができます。

例:

~~~ javascript
// サーバサイド: コレクションの現在のメッセージ数を publish する
Meteor.publish("部屋のメッセージ数", function (roomId) {

  // 訳注: this の機能を関数内に入れ子構造に宣言された関数においても
  // 利用するため、Meteor.publish 関数の第二引数を明示的に指定できるよう、
  // self に名前を複製しています。
  var self = this;
  check(roomId, String);
  var count = 0;
  var initializing = true;
  var handle = Messages.find({roomId: roomId}).observeChanges({
    added: function (id) {
      count++;
      if (!initializing)
        self.changed("メッセージ数", roomId, {count: count});
    },
    removed: function (id) {
      count--;
      self.changed("メッセージ数", roomId, {count: count});
    }
    // 移動(moved)と変更(changed) については無視します
  });

  // 上記の監視 (observeChanges) は下記の added が実行された後にのみ機能します。
  // 初回値を設定し、subscribe の準備が整った事を通知します。
  initializing = false;
  self.added("メッセージ数", roomId, {count: count});
  self.ready();

  // クライアントが subscribe を止めた時に監視 (observeChanges) を止めます。
  self.onStop(function () {
    handle.stop();
  });
});

// クライアントサイド: count オブジェクトを保持するためのコレクションを宣言します。
Counts = new Meteor.Collection("メッセージ数");

// クライアントサイド: 現在の部屋の人数を subscribe します
Deps.autorun(function () {
  Meteor.subscribe("部屋のメッセージ数", Session.get("roomId"));
});

// クライアントサイド: 新しいコレクションを利用します
console.log("現在のチャットルームには" +
            Counts.findOne(Session.get("roomId")).count +
            "通のメッセージがあります、");
~~~

<!-- unclear comment
  // Stopping a subscription automatically takes
  // care of sending the client any removed messages.
  // subscribe を止めると自動的にクライアントに削除メッセージを
  // 送信します。TODO

-->

**Meteor は autopublish パッケージを含むプロジェクトで Meteor.publish を呼び出すと警告メッセージを送信します。publish 関数はその場合でも動きはします。**


---
<a name="meteor_publish_this_userId"></a>
### _this_.userId
__サーバサイド__

publish 関数の中で呼び出して下さい。ログインしているユーザの id、もしログインしていなければ null を返却します。

定数ではありますが、ログインしているユーザが変更されれば publish 関数は新しい値を返却します。

---
<a name="meteor_publish_this_added"></a>
### _this_.added(collection, id, fields)
__サーバサイド__

publish 関数の中で呼び出して下さい。subscribe に対しレコード群にドキュメントが追加されたことを通知します。

### 引数

* **collection** 文字列型

    新しいドキュメントを含むコレクション名。

* **id** 文字列型

    新しいドキュメントの ID。

* **fields** オブジェクト

    新しいドキュメントの中のフィールド群。`_id` は無視されます。

---
<a name="meteor_publish_this_changed"></a>
### _this_.changed(collection, id, fields)
__サーバサイド__

publish 関数の中で呼び出して下さい。subscribe に対しレコード群の中のドキュメントに変更があったことを伝えます。

### 引数

* **collection** 文字列型

    変更があったドキュメントを含むコレクション名。

* **id** 文字列型

    変更があったドキュメントのID。

* **fields** オブジェクト

    変更があったドキュメントのフィールド群と新しい値。`fields` に指定がないフィールドは変更されずに残ります。もし `fields` にフィールド名が含まれ値に undefined が指定された場合、フィールドはドキュメントより削除されます。`_id` は無視されます。

---
<a name="meteor_publish_this_removed"></a>
### _this_.removed(collection, id)
__サーバサイド__

publish 関数の中で呼び出して下さい。subscribe に対しレコード群の中のドキュメントが削除されたことを伝えます。

### 引数

* **collection** 文字列型

    ドキュメントが削除されたコレクション名。

* **id** 文字列型

    削除されたドキュメントのID。

---
<a name="meteor_publish_this_ready"></a>
### _this_.ready()
__サーバサイド__

publish 関数の中で呼び出して下さい。subscribe に対し初回レコード群の完全なスナップショットが送信されたことを伝えます。クライアントの `Meteor.subscribe` に `onReady` コールバックが指定されていれば、これを発火します。

---
<a name="meteor_publish_this_onStop"></a>
### _this_.onStop(func)
__サーバサイド__

publish 関数の中で呼び出して下さい。subscribe が停止された時に実行するコールバック関数を登録します。

### 引数

* **func** 関数

    コールバック関数


observe か observeChanges を publish 関数の中で呼び出した場合、ここで監視を停止させます。

---
<a name="meteor_publish_this_error"></a>
### _this_.error(error)
__サーバサイド__

publish 関数の中で呼び出して下さい。クライアントの subscribe を停止し、クライアントサイドにて `Meteor.subscribe` に渡された `onError` コールバックがあれば発火します。`error` が `Meteor.Error` 型でなければサニタイズされます。

---
<a name="meteor_publish_this_stop"></a>
### _this_.stop()
__サーバサイド__

publish 関数の中で呼び出して下さい。クライアントの subscribe を停止します。クライアントサイドの `onError` コールバックは実行されません。

---
<a name="meteor_publish_this_connection"></a>
### _this_.connection
__サーバサイド__

publish 関数の中で呼び出してください。この subscribe を行っている接続をさします。

---
<a name="meteor_subscribe"></a>
### Meteor.subscribe(name [, arg1, arg2, ... ] [, callbacks])
__クライアントサイド__

レコード群を subscribe します。`stop()` と `ready()` メソッドを提供するハンドラを返却します。

### 引数

* **name** 文字列型

    subscribe 名。サーバの publish() の呼び出しの名前に合致させます。

* **arg1, arg2, ...** 型の指定はありません

    サーバの publish 関数に渡される省略可能の引数。

* **callbacks** 関数あるいはオブジェクト

    省略可能。`onError` と `onReady` のコールバックを含むと良いでしょう。オブジェクトの代わりに関数を指定した場合、`onReady` のコールバックとして扱われます。


レコード群を subscribe した場合、サーバに対し、レコードをクライアントに送信するように伝えることになります。クライアントはそれらのレコードを、 publish ハンドラの `added`、`changed` そして `removed` コールバックの `collection` 引数として指定した名前と同じ名前のローカルの Minimongo collections に保存します。Meteor は クライアントで `Meteor.Collection` がコレクション名を指定して呼び出されるまで、変更をたくわえます。

~~~ javascript
// 格納するクライアントのコレクションを宣言する前に subscribe することも
// できます (データも受信するでしょう)。"allplayers" は サーバの
// "players" コレクションを publish すると仮定します。
Meteor.subscribe("allplayers");
...
// クライアントは送られてくる player レコードをここまでたくわえています。
...
Players = new Meteor.Collection("players");
~~~

現在行なっている subscribe が対象のレコード群を含んでいれば、クライアントからそのドキュメントを参照することができます。

サーバにて subscribe の準備が整ったとされると `onReady` コールバックが引数なしで呼ばれます。`onError` コールバックは subscribe が失敗した時かサーバによって終了された場合に `Meteor.Error` とともに呼ばれます。

`Meteor.subscribe` は subscribe を操作できるよう、次のメソッドを提供するオブジェクトを返却します。

* **stop()**

    subscribe をキャンセルします。一般的にサーバがクライアントにキャッシュより subscribe のデータを削除させることになります。

* **ready()**

    サーバにて subscribe の準備が整ったとされると真を返します。反応可能なデータソースです。

反応可能な算出の中で `Meteor.subscribe` を呼んだ場合、たとえば `Deps.autorun` の中では算出が無効化 (invalidate) か停止された時に subscribe も自動的にキャンセルされます。`autorun` の中で開始された subscribe に対して `stop` を呼ぶ必要はありません。
一方で、次の関数の実行の時点で同一のレコードセット (同じ名前と引数で) を subscribe した場合、Meteor は無駄な subscribe の停止/開始を器用にスキップします。たとえば:

~~~ javascript
Deps.autorun(function () {
  Meteor.subscribe("chat", {room: Session.get("current-room")});
  Meteor.subscribe("privateMessages");
});
~~~

現在のチャットルームのメッセージとプライベートメッセージを購読するとします。`Session.set("current-room", "new-room")` を使いチャットルームを変更した場合、Meteor は 新しいチャットルームのメッセージの subscribe を開始し、元々いたチャットルームのメッセージの subscribe を停止しますが、プライベートメッセージの subscribe は継続されます。

もし1つ以上の subscribe がコレクション名、ドキュメントID、フィールド名全て同じで競合する値を送信した場合、クライアントは任意に選ばれた publish された値があてられます。

