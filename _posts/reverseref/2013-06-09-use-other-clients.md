---
layout: docs
title: "Meteor Kaiso - 逆引きリファレンス: Meteor サーバを他のクライアントより API サーバとして利用する方法"
category: reverseref
---

**(Meteor 公式サイトとその他の記事を参考にした Meteor Kaiso 独自コンテンツです。)**

Meteor サーバをAPIサーバとして利用する方法は Meteor 開発チームより公式なアナウンスされておりませんが、クライアントとサーバとの通信プロトコル (DDP) への言及がいくつかなされております。

* [DDP Specification - meteor/packagtes/livedata/DDP.md GitHub](https://github.com/meteor/meteor/blob/master/packages/livedata/DDP.md)
* [Introducing DDP - The Meteor Blog](http://meteor.com/blog/2012/03/21/introducing-ddp)

また非公式ではありますが、PhoneGap (Apache Cordova) を使い Meteor アプリケーションを Android アプリとして配布することができるフレームワークが GitHub にて公開されています。

* [meteor-phonegap guaka/meteor-phonegap GitHub](https://github.com/guaka/meteor-phonegap)

iOS 向け Objective-C での DDP クライアント実装について

* [DDP library for iOS - Google Groups](https://groups.google.com/forum/#!topic/meteor-core/q8Ylsxe-GZU)
