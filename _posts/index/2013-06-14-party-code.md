---
layout: docs
title: "Meteor Kaiso - サンプルアプリケーション: イベント告知"
category: index
ref-official: 
  - title: Example All Tomorrow's Parties
    title-jp: サンプルアプリケーション - イベント告知
    url: http://meteor.com/examples/party
---
<dl>
  <dt>原文: <a href="http://meteor.com/examples/parties">http://meteor.com/examples/parties</a><dt>
  <dd>
  <ul>
    <li>[訳文の最終更新 2013/06/14 - 最新バージョンが0.6.4 の時点での内容]</li>
  </ul>
  </dd>
</dl>
## 直接体験

約3分でイベント告知のコピーをインターネット上に開設し、友達に使ってもらうことができます (訳注: オフィシャルサイトの公開用環境を利用した場合) 。プログラミングの知識は必要ありません!

- (もしまだならば) Meteor のインストール。ターミナル上で下記を実行して下さい。

~~~ bash
$ curl https://install.meteor.com | sh
~~~

- サンプルアプリケーション一式のコピー

~~~ bash
$ meteor create --example parties
~~~

- クラウドで動かしてみましょう

    訳注: &quot;サブドメイン&quot;には公式サイト (<http://meteor.com/examples/parties>) の I'll call it... のテキスト入力欄にて指定された名前をご利用下さい。

~~~ bash
$ cd parties
$ meteor deploy "サブドメイン".meteor.com
~~~

ではブラウザの新しいタブで

&quot;サブドメイン&quot;.meteor.com

を開いてみましょう。あなたがこのサイトの管理人です!

(APIリファレンスを充実させるとともにコード解説をここに書く予定)
